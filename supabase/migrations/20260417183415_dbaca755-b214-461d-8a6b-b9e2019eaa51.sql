-- Enums
CREATE TYPE public.user_plan AS ENUM ('free', 'solo', 'team');
CREATE TYPE public.site_status AS ENUM ('building', 'live', 'paused');
CREATE TYPE public.message_role AS ENUM ('user', 'assistant');
CREATE TYPE public.activity_status AS ENUM ('completed', 'pending', 'flagged');
CREATE TYPE public.credit_txn_type AS ENUM ('daily_reset', 'monthly_reset', 'spend', 'purchase');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  plan public.user_plan NOT NULL DEFAULT 'free',
  credits_daily INTEGER NOT NULL DEFAULT 10,
  credits_monthly INTEGER NOT NULL DEFAULT 100,
  credits_daily_reset TIMESTAMPTZ NOT NULL DEFAULT now(),
  credits_monthly_reset TIMESTAMPTZ NOT NULL DEFAULT now(),
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Sites
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  business_type TEXT,
  site_url TEXT,
  status public.site_status NOT NULL DEFAULT 'building',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sites all" ON public.sites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
  role public.message_role NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own conv all" ON public.conversations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_conv_user_created ON public.conversations(user_id, created_at);

-- Activity Log
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  description TEXT,
  status public.activity_status NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own activity all" ON public.activity_log FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_activity_user_created ON public.activity_log(user_id, created_at DESC);

-- Credit Transactions
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type public.credit_txn_type NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own credit all" ON public.credit_transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_sites_updated BEFORE UPDATE ON public.sites
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Apply credit resets and atomically spend a credit. Returns updated profile.
CREATE OR REPLACE FUNCTION public.spend_credit(p_user_id UUID)
RETURNS TABLE(credits_daily INTEGER, credits_monthly INTEGER, allowed BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  p public.profiles%ROWTYPE;
BEGIN
  SELECT * INTO p FROM public.profiles WHERE user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0, 0, false; RETURN;
  END IF;

  -- Daily reset
  IF p.credits_daily_reset < date_trunc('day', now()) THEN
    p.credits_daily := 10;
    p.credits_daily_reset := now();
    INSERT INTO public.credit_transactions(user_id, amount, type, description)
    VALUES (p_user_id, 10, 'daily_reset', 'Daily credits reset');
  END IF;

  -- Monthly reset
  IF p.credits_monthly_reset < date_trunc('month', now()) THEN
    p.credits_monthly := 100;
    p.credits_monthly_reset := now();
    INSERT INTO public.credit_transactions(user_id, amount, type, description)
    VALUES (p_user_id, 100, 'monthly_reset', 'Monthly credits reset');
  END IF;

  IF p.credits_daily <= 0 OR p.credits_monthly <= 0 THEN
    UPDATE public.profiles SET
      credits_daily = p.credits_daily,
      credits_monthly = p.credits_monthly,
      credits_daily_reset = p.credits_daily_reset,
      credits_monthly_reset = p.credits_monthly_reset
    WHERE user_id = p_user_id;
    RETURN QUERY SELECT p.credits_daily, p.credits_monthly, false; RETURN;
  END IF;

  p.credits_daily := p.credits_daily - 1;
  p.credits_monthly := p.credits_monthly - 1;

  UPDATE public.profiles SET
    credits_daily = p.credits_daily,
    credits_monthly = p.credits_monthly,
    credits_daily_reset = p.credits_daily_reset,
    credits_monthly_reset = p.credits_monthly_reset
  WHERE user_id = p_user_id;

  INSERT INTO public.credit_transactions(user_id, amount, type, description)
  VALUES (p_user_id, -1, 'spend', 'Marie message');

  RETURN QUERY SELECT p.credits_daily, p.credits_monthly, true;
END; $$;
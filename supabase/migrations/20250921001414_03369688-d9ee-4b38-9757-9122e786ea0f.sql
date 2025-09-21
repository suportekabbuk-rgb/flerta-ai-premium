-- FlertaAI Database Schema - Privacy-First Dating Assistant
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- User profiles with personalization settings
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  locale TEXT DEFAULT 'pt-BR',
  tone JSONB DEFAULT '{}'::jsonb,  -- tone preferences, slang filters
  blocked_topics TEXT[] DEFAULT '{}',
  tz TEXT DEFAULT 'America/Sao_Paulo',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- File uploads (screenshots, bio, audio)
CREATE TABLE public.uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('screenshot', 'bio', 'audio')),
  storage_path TEXT,
  mime TEXT,
  size_bytes INTEGER CHECK (size_bytes <= 8 * 1024 * 1024), -- 8MB limit
  redacted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Conversation parsing results
CREATE TABLE public.chat_parses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID REFERENCES uploads(id) ON DELETE CASCADE,
  raw_text TEXT,
  turns JSONB, -- [{speaker:'me|other', text:'...', timestamp:'...'}]
  speaker_confidence NUMERIC CHECK (speaker_confidence BETWEEN 0 AND 1),
  needs_confirmation BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI-generated suggestions
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parse_id UUID REFERENCES chat_parses(id) ON DELETE CASCADE,
  style JSONB, -- tone/length/language preferences
  suggestion TEXT NOT NULL,
  tts_path TEXT, -- audio file path for TTS
  accepted BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Conversation outcome tracking for success analysis
CREATE TABLE public.conversation_outcomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_id UUID REFERENCES suggestions(id) ON DELETE CASCADE,
  outcome TEXT CHECK (outcome IN ('match', 'date', 'ghosted', 'ongoing')),
  feedback_score INTEGER CHECK (feedback_score BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Voice note transcriptions
CREATE TABLE public.voice_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upload_id UUID REFERENCES uploads(id) ON DELETE CASCADE,
  transcript TEXT,
  lang TEXT DEFAULT 'pt-BR',
  duration_sec INTEGER CHECK (duration_sec >= 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Anti-catfish image verification
CREATE TABLE public.image_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upload_id UUID REFERENCES uploads(id) ON DELETE CASCADE,
  phash TEXT, -- perceptual hash for duplicate detection
  matches JSONB, -- external service results
  risk_score NUMERIC CHECK (risk_score BETWEEN 0 AND 1),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- A/B testing framework
CREATE TABLE public.ab_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  variant TEXT NOT NULL,
  metric TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Billing plans
CREATE TABLE public.billing_plans (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  period TEXT CHECK (period IN ('free', 'monthly', 'yearly', 'lifetime')),
  price_cents INTEGER CHECK (price_cents >= 0),
  is_lifetime BOOLEAN DEFAULT false
);

-- User subscriptions
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code TEXT REFERENCES billing_plans(code),
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'paused')) DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT now(),
  renews_at TIMESTAMPTZ
);

-- Privacy and audit logs (LGPD compliance)
CREATE TABLE public.privacy_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'EXPORT', 'DELETE', 'LOGIN', 'IAP_VERIFY'
  entity TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_uploads_user_created ON public.uploads(user_id, created_at DESC);
CREATE INDEX idx_chat_parses_upload_id ON public.chat_parses(upload_id);
CREATE INDEX idx_chat_parses_turns_gin ON public.chat_parses USING GIN(turns);
CREATE INDEX idx_suggestions_user_created ON public.suggestions(user_id, created_at DESC);
CREATE INDEX idx_suggestions_style_gin ON public.suggestions USING GIN(style);
CREATE INDEX idx_voice_notes_user_created ON public.voice_notes(user_id, created_at DESC);
CREATE INDEX idx_image_checks_user_created ON public.image_checks(user_id, created_at DESC);
CREATE INDEX idx_subscriptions_user_status ON public.subscriptions(user_id, status);
CREATE INDEX idx_privacy_logs_user_created ON public.privacy_logs(user_id, created_at DESC);
CREATE INDEX idx_ab_tests_name_variant ON public.ab_tests(name, variant);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_parses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user-owned data
CREATE POLICY "Users can manage their own profile" ON public.profiles
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own uploads" ON public.uploads
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view chat parses from their uploads" ON public.chat_parses
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.uploads WHERE uploads.id = chat_parses.upload_id AND uploads.user_id = auth.uid()
));

CREATE POLICY "Users can manage their own suggestions" ON public.suggestions
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage outcomes for their suggestions" ON public.conversation_outcomes
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.suggestions WHERE suggestions.id = conversation_outcomes.suggestion_id AND suggestions.user_id = auth.uid()
));

CREATE POLICY "Users can manage their own voice notes" ON public.voice_notes
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own image checks" ON public.image_checks
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own subscriptions" ON public.subscriptions
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own privacy logs" ON public.privacy_logs
FOR ALL USING (auth.uid() = user_id);

-- Public read policies for reference data
CREATE POLICY "AB tests are publicly readable" ON public.ab_tests
FOR SELECT USING (true);

CREATE POLICY "Billing plans are publicly readable" ON public.billing_plans
FOR SELECT USING (true);

-- Insert default billing plans
INSERT INTO public.billing_plans (code, name, period, price_cents, is_lifetime) VALUES
('free', 'Gratuito', 'free', 0, false),
('monthly', 'Mensal', 'monthly', 1990, false), -- R$ 19.90
('yearly', 'Anual', 'yearly', 19900, false),   -- R$ 199.00
('lifetime', 'Vitalício', 'lifetime', 39900, true); -- R$ 399.00

-- Trigger to update updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, locale, tz)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'locale', 'pt-BR'),
    COALESCE(NEW.raw_user_meta_data->>'tz', 'America/Sao_Paulo')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- LGPD Compliance: Data purge function
CREATE OR REPLACE FUNCTION public.rpc_purge_my_data()
RETURNS JSONB AS $$
DECLARE
  user_uuid UUID := auth.uid();
  affected_records JSONB := '{}'::jsonb;
BEGIN
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Log the deletion request
  INSERT INTO public.privacy_logs (user_id, action, entity)
  VALUES (user_uuid, 'DELETE_ALL', 'complete_account');

  -- Delete user data in dependency order
  DELETE FROM public.conversation_outcomes WHERE suggestion_id IN (
    SELECT id FROM public.suggestions WHERE user_id = user_uuid
  );
  DELETE FROM public.suggestions WHERE user_id = user_uuid;
  DELETE FROM public.chat_parses WHERE upload_id IN (
    SELECT id FROM public.uploads WHERE user_id = user_uuid
  );
  DELETE FROM public.voice_notes WHERE user_id = user_uuid;
  DELETE FROM public.image_checks WHERE user_id = user_uuid;
  DELETE FROM public.uploads WHERE user_id = user_uuid;
  DELETE FROM public.subscriptions WHERE user_id = user_uuid;
  DELETE FROM public.privacy_logs WHERE user_id = user_uuid;
  DELETE FROM public.profiles WHERE user_id = user_uuid;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Todos os seus dados foram removidos permanentemente',
    'timestamp', now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
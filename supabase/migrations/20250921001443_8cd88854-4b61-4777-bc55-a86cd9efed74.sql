-- Fix security warnings by setting search_path for functions

-- Update the updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the new user handler function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, locale, tz)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'locale', 'pt-BR'),
    COALESCE(NEW.raw_user_meta_data->>'tz', 'America/Sao_Paulo')
  );
  RETURN NEW;
END;
$$;

-- Update the data purge function
CREATE OR REPLACE FUNCTION public.rpc_purge_my_data()
RETURNS JSONB 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;
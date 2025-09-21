-- Create storage buckets for FlertaAI
INSERT INTO storage.buckets (id, name, public) VALUES
  ('screens', 'screens', false),    -- Original screenshots
  ('redacted', 'redacted', false),  -- Blurred/redacted images
  ('audio', 'audio', false);        -- Voice notes and TTS files

-- Create storage policies for private user access
-- Screens bucket policies
CREATE POLICY "Users can upload screens" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'screens' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own screens" ON storage.objects
FOR SELECT USING (bucket_id = 'screens' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own screens" ON storage.objects
FOR UPDATE USING (bucket_id = 'screens' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own screens" ON storage.objects
FOR DELETE USING (bucket_id = 'screens' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Redacted bucket policies  
CREATE POLICY "Users can upload redacted images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'redacted' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own redacted images" ON storage.objects
FOR SELECT USING (bucket_id = 'redacted' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own redacted images" ON storage.objects
FOR UPDATE USING (bucket_id = 'redacted' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own redacted images" ON storage.objects
FOR DELETE USING (bucket_id = 'redacted' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Audio bucket policies
CREATE POLICY "Users can upload audio" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own audio" ON storage.objects
FOR SELECT USING (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own audio" ON storage.objects
FOR UPDATE USING (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own audio" ON storage.objects
FOR DELETE USING (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);
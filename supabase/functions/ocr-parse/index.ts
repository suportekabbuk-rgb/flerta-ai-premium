import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { fileId, text, userId } = await req.json();
    const requestId = crypto.randomUUID();

    console.log(`[${requestId}] OCR Parse request - fileId: ${fileId}, textLength: ${text?.length || 0}`);

    if (!userId) {
      throw new Error('User not authenticated');
    }

    let processedText = '';
    let uploadRecord = null;

    if (fileId) {
      // Get upload record
      const { data: upload, error: uploadError } = await supabase
        .from('uploads')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', userId)
        .single();

      if (uploadError || !upload) {
        throw new Error('Upload not found or unauthorized');
      }

      uploadRecord = upload;

      // For now, we'll implement OCR as text normalization
      // In production, this would use Tesseract.js or cloud OCR service
      processedText = upload.storage_path ? 
        `Texto extraído da imagem: ${upload.storage_path}` : 
        text || '';
    } else {
      // Direct text input
      processedText = text || '';
    }

    // Sanitize and validate text
    if (!processedText || processedText.length < 10) {
      throw new Error('Texto muito curto para análise');
    }

    if (processedText.length > 10000) {
      processedText = processedText.substring(0, 10000);
    }

    // Simple conversation parsing
    const lines = processedText.split('\n').filter(line => line.trim());
    const turns = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        // Simple speaker detection based on patterns
        const isMe = line.includes('Você:') || line.includes('Eu:') || 
                     (i === lines.length - 1 && !line.includes(':'));
        
        const cleanText = line.replace(/^(Você:|Eu:|[^:]+:)\s*/, '');
        
        turns.push({
          speaker: isMe ? 'me' : 'other',
          text: cleanText,
          timestamp: new Date().toISOString(),
          originalLine: line
        });
      }
    }

    // Calculate speaker confidence based on parsing clarity
    const speakerConfidence = calculateSpeakerConfidence(turns);
    const needsConfirmation = speakerConfidence < 0.8;

    // Save parse result
    const { data: parseResult, error: parseError } = await supabase
      .from('chat_parses')
      .insert({
        upload_id: fileId,
        raw_text: processedText,
        turns: turns,
        speaker_confidence: speakerConfidence,
        needs_confirmation: needsConfirmation
      })
      .select()
      .single();

    if (parseError) {
      console.error(`[${requestId}] Parse save error:`, parseError);
      throw new Error('Failed to save parse result');
    }

    console.log(`[${requestId}] Parse completed - confidence: ${speakerConfidence}, needs confirmation: ${needsConfirmation}`);

    return new Response(
      JSON.stringify({
        success: true,
        parseId: parseResult.id,
        turns: turns,
        speakerConfidence: speakerConfidence,
        needsConfirmation: needsConfirmation,
        requestId: requestId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('OCR Parse error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function calculateSpeakerConfidence(turns: any[]): number {
  if (!turns.length) return 0;

  let confidence = 0.5; // Base confidence
  
  // Higher confidence if we have clear speaker indicators
  const hasExplicitSpeakers = turns.some(turn => 
    turn.originalLine.includes(':') || 
    turn.originalLine.includes('Você') || 
    turn.originalLine.includes('Eu')
  );
  
  if (hasExplicitSpeakers) confidence += 0.3;
  
  // Higher confidence with alternating speakers
  let alternatingPattern = 0;
  for (let i = 1; i < turns.length; i++) {
    if (turns[i].speaker !== turns[i-1].speaker) {
      alternatingPattern++;
    }
  }
  
  const alternatingRatio = alternatingPattern / Math.max(1, turns.length - 1);
  confidence += alternatingRatio * 0.2;
  
  return Math.min(1, confidence);
}
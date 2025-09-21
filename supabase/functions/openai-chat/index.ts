import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { messages, model = 'gpt-4o-mini', maxTokens = 500 } = await req.json();
    const requestId = crypto.randomUUID();

    console.log(`[${requestId}] OpenAI request - model: ${model}, messages: ${messages?.length || 0}`);

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    // Add Brazilian cultural context to system message
    const systemMessage = {
      role: 'system',
      content: `Você é o FlertaAI, um assistente brasileiro especializado em conversas de namoro. 
      
      CONTEXTO CULTURAL BRASILEIRO:
      - Use gírias brasileiras naturais: massa, show, bacana, legal, top, demais
      - Evite clichês óbvios: "oi sumida", "bom dia princesa" 
      - Considere horários brasileiros para timing de mensagens
      - Seja autêntico, não robótico
      - Mantenha o tom jovem e descontraído
      
      REGRAS DE RESPOSTA:
      - Máximo ${maxTokens} tokens
      - Sempre em português brasileiro
      - Seja específico e personalizado
      - Evite respostas genéricas
      - Considere o contexto da conversa
      
      PRIVACIDADE:
      - NUNCA invente informações pessoais
      - NUNCA mencione dados específicos dos usuários
      - Mantenha as sugestões gerais mas personalizadas no tom`
    };

    const apiMessages = [systemMessage, ...messages];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        max_tokens: maxTokens,
        temperature: 0.8, // More creative responses
        presence_penalty: 0.3, // Avoid repetitive responses
        frequency_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[${requestId}] OpenAI API error:`, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('No response from OpenAI');
    }

    const generatedText = data.choices[0].message.content;
    
    console.log(`[${requestId}] OpenAI response generated - length: ${generatedText?.length || 0}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        text: generatedText,
        model: model,
        usage: data.usage,
        requestId: requestId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('OpenAI chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
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

    const { parseId, style, coachMode = false, userId } = await req.json();
    const requestId = crypto.randomUUID();

    console.log(`[${requestId}] Suggest replies request - parseId: ${parseId}, coachMode: ${coachMode}`);

    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Get the parsed conversation
    const { data: parseData, error: parseError } = await supabase
      .from('chat_parses')
      .select(`
        *,
        uploads!inner(user_id)
      `)
      .eq('id', parseId)
      .eq('uploads.user_id', userId)
      .single();

    if (parseError || !parseData) {
      throw new Error('Parse not found or unauthorized');
    }

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const turns = parseData.turns as any[];
    if (!turns || turns.length === 0) {
      throw new Error('No conversation turns found');
    }

    // Extract the last message from the other person
    const lastOtherMessage = turns
      .filter(turn => turn.speaker === 'other')
      .pop();

    if (!lastOtherMessage) {
      throw new Error('No message from other person found');
    }

    // Generate suggestions based on Brazilian context and style preferences
    const suggestions = await generateSuggestions(
      lastOtherMessage.text,
      turns,
      style || {},
      profile?.tone || {},
      profile?.tz || 'America/Sao_Paulo',
      coachMode
    );

    // Save suggestions to database
    const suggestionRecords = await Promise.all(
      suggestions.map(async (suggestion) => {
        const { data, error } = await supabase
          .from('suggestions')
          .insert({
            user_id: userId,
            parse_id: parseId,
            style: style,
            suggestion: suggestion.text,
            accepted: null
          })
          .select()
          .single();

        if (error) {
          console.error(`[${requestId}] Error saving suggestion:`, error);
          return null;
        }

        return {
          id: data.id,
          text: suggestion.text,
          explanation: suggestion.explanation,
          confidence: suggestion.confidence,
          timing: suggestion.timing
        };
      })
    );

    const validSuggestions = suggestionRecords.filter(s => s !== null);

    console.log(`[${requestId}] Generated ${validSuggestions.length} suggestions`);

    return new Response(
      JSON.stringify({
        success: true,
        suggestions: validSuggestions,
        lastMessage: lastOtherMessage.text,
        requestId: requestId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Suggest replies error:', error);
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

async function generateSuggestions(
  lastMessage: string,
  conversationHistory: any[],
  style: any,
  userTone: any,
  timezone: string,
  coachMode: boolean
) {
  const currentHour = new Date().getHours();
  const isWorkingHours = currentHour >= 9 && currentHour <= 18;
  const isLateNight = currentHour >= 23 || currentHour <= 6;

  // Analyze message sentiment and context
  const messageContext = analyzeMessage(lastMessage);
  
  // Brazilian cultural context
  const brazilianGirias = ['massa', 'show', 'bacana', 'legal', 'top', 'demais'];
  const avoidCliches = ['oi sumida', 'bom dia princesa', 'oi linda'];

  const suggestions = [];

  // Generate different styles of responses
  const responseStyles = [
    { name: 'casual', tone: 'descontraído' },
    { name: 'flirty', tone: 'envolvente' },
    { name: 'funny', tone: 'divertido' },
    { name: 'thoughtful', tone: 'reflexivo' },
    { name: 'engaging', tone: 'questionador' }
  ];

  for (const responseStyle of responseStyles.slice(0, 5)) {
    let suggestion = '';
    let explanation = '';

    if (messageContext.isQuestion) {
      suggestion = generateQuestionResponse(lastMessage, responseStyle.tone, messageContext);
    } else if (messageContext.isCompliment) {
      suggestion = generateComplimentResponse(lastMessage, responseStyle.tone);
    } else if (messageContext.isEmoji) {
      suggestion = generateEmojiResponse(lastMessage, responseStyle.tone);
    } else {
      suggestion = generateGeneralResponse(lastMessage, responseStyle.tone, messageContext);
    }

    // Add Brazilian touch
    if (Math.random() > 0.7) {
      const gria = brazilianGirias[Math.floor(Math.random() * brazilianGirias.length)];
      suggestion = suggestion.replace(/legal|bacana|bom/, gria);
    }

    // Coach mode explanation
    if (coachMode) {
      explanation = generateCoachExplanation(suggestion, responseStyle.tone, messageContext);
    }

    suggestions.push({
      text: suggestion,
      explanation: explanation,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      timing: isLateNight ? 'Talvez seja melhor responder de manhã' : 
              !isWorkingHours ? 'Bom horário para responder' : 'OK para responder agora'
    });
  }

  return suggestions;
}

function analyzeMessage(message: string) {
  return {
    isQuestion: message.includes('?') || message.toLowerCase().includes('como') || 
                message.toLowerCase().includes('quando') || message.toLowerCase().includes('onde'),
    isCompliment: message.toLowerCase().includes('bonit') || message.toLowerCase().includes('lind') ||
                  message.toLowerCase().includes('gat') || message.toLowerCase().includes('charm'),
    isEmoji: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(message),
    sentiment: message.toLowerCase().includes('triste') || message.toLowerCase().includes('chate') ? 'negative' :
               message.toLowerCase().includes('feliz') || message.toLowerCase().includes('legal') ? 'positive' : 'neutral',
    length: message.length
  };
}

function generateQuestionResponse(message: string, tone: string, context: any): string {
  const responses = {
    casual: [
      'Boa pergunta! 🤔',
      'Deixa eu pensar...',
      'Interessante você perguntar isso',
    ],
    flirty: [
      'Adorei a curiosidade 😏',
      'Você quer mesmo saber? 😉',
      'Que pergunta mais fofa',
    ],
    funny: [
      'Haha, direto ao ponto né!',
      'Você não perde tempo mesmo 😄',
      'Essa eu não esperava!',
    ]
  };

  const baseResponses = responses[tone] || responses.casual;
  return baseResponses[Math.floor(Math.random() * baseResponses.length)];
}

function generateComplimentResponse(message: string, tone: string): string {
  const responses = {
    casual: [
      'Que fofo, obrigada! 😊',
      'Ai que legal, valeu!',
      'Nossa, muito gentil!',
    ],
    flirty: [
      'Você que é um charme 😘',
      'Para de me deixar sem graça 😏',
      'Assim você me conquista fácil',
    ],
    funny: [
      'Para, para que eu fico envergonhada 😄',
      'Você tem bom gosto mesmo!',
      'Eita, alguém tá inspirado hoje!',
    ]
  };

  const baseResponses = responses[tone] || responses.casual;
  return baseResponses[Math.floor(Math.random() * baseResponses.length)];
}

function generateEmojiResponse(message: string, tone: string): string {
  const responses = [
    '😊 Também estou assim!',
    'Adorei esse emoji 😄',
    'Feeling the same! ✨',
    'Exatamente meu mood agora',
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateGeneralResponse(message: string, tone: string, context: any): string {
  const responses = {
    casual: [
      'Entendi! E você, como está?',
      'Bacana! Conta mais',
      'Interessante... e aí?',
      'Legal! Como foi seu dia?',
    ],
    flirty: [
      'Hmm, me conta mais sobre isso 😏',
      'Adorei saber... e agora?',
      'Que interessante você 😉',
      'Fico curiosa para saber mais',
    ],
    funny: [
      'Haha, você é demais!',
      'Que história! 😄',
      'Nossa, não acredito!',
      'Você sempre me surpreende',
    ]
  };

  const baseResponses = responses[tone] || responses.casual;
  return baseResponses[Math.floor(Math.random() * baseResponses.length)];
}

function generateCoachExplanation(suggestion: string, tone: string, context: any): string {
  return `💡 Esta resposta usa um tom ${tone}, ${
    context.isQuestion ? 'demonstra interesse genuíno' :
    context.isCompliment ? 'retribui o carinho de forma equilibrada' :
    'mantém a conversa fluindo naturalmente'
  }. ${
    suggestion.includes('?') ? 'A pergunta incentiva a pessoa a continuar falando.' :
    suggestion.includes('😊') || suggestion.includes('😄') ? 'O emoji transmite leveza e bom humor.' :
    'A resposta é direta mas acolhedora.'
  }`;
}
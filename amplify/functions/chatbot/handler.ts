import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const BEDROCK_REGION = process.env.BEDROCK_REGION || 'us-east-1';
const MODEL_ID =
  process.env.BEDROCK_MODEL_ID ||
  'anthropic.claude-3-haiku-20240307-v1:0';

const client = new BedrockRuntimeClient({ region: BEDROCK_REGION });

const SYSTEM_PROMPT = `You are Nazar AI, a friendly and knowledgeable diabetes health advisor designed for Indian patients. You are part of a mobile health app built for the AWS AI for Bharat Hackathon.

Your expertise:
- Blood glucose management (fasting, post-meal, HbA1c interpretation)
- Indian diet guidance (mention specific Indian foods, recipes, GI values, costs in INR)
- Exercise recommendations suitable for Indian lifestyles
- Diabetic retinopathy awareness and screening guidance
- Medication awareness (metformin, insulin, etc.) — never prescribe, only educate

Rules:
- Be concise and practical (mobile app, not a textbook)
- Use bullet points and bold text for readability
- Include India-specific context (Indian foods, festivals, costs in INR, government schemes like Ayushman Bharat)
- Always end with a gentle reminder: "Please consult your doctor for personalized medical advice."
- If asked in Hindi or Kannada, respond in that language
- Never diagnose conditions or prescribe medications
- For emergencies (glucose <50 or >400, chest pain, vision loss), advise calling 108 or visiting nearest hospital immediately`;

function getLanguageInstruction(lang: string): string {
  switch (lang) {
    case 'hi':
      return 'Respond in Hindi (हिन्दी). Use Devanagari script.';
    case 'kn':
      return 'Respond in Kannada (ಕನ್ನಡ). Use Kannada script.';
    default:
      return 'Respond in English.';
  }
}

interface FunctionUrlEvent {
  requestContext?: unknown;
  body?: string;
  headers?: Record<string, string>;
  isBase64Encoded?: boolean;
  rawPath?: string;
  httpMethod?: string;
  requestMethod?: string;
}

interface ChatRequest {
  message: string;
  lang?: string;
}

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export const handler = async (event: FunctionUrlEvent) => {
  // Handle CORS preflight
  const method =
    event.httpMethod ||
    event.requestMethod ||
    (event.requestContext as Record<string, Record<string, string>>)?.http
      ?.method;

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }

  try {
    // Parse request body
    let body: string | undefined = event.body;
    if (event.isBase64Encoded && body) {
      body = Buffer.from(body, 'base64').toString('utf-8');
    }

    if (!body) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const request: ChatRequest = JSON.parse(body);
    const { message, lang = 'en' } = request;

    if (!message || !message.trim()) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Build prompt with language instruction
    const systemPrompt = `${SYSTEM_PROMPT}\n\n${getLanguageInstruction(lang)}`;

    // Call Bedrock Claude 3 Haiku
    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1024,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
      }),
    });

    const bedrockResponse = await client.send(command);
    const responseBody = JSON.parse(
      new TextDecoder().decode(bedrockResponse.body)
    );

    const aiResponse =
      responseBody.content?.[0]?.text || 'I could not generate a response.';

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ response: aiResponse }),
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Bedrock invocation error:', error);

    // Check for specific Bedrock errors
    const errorName = error.name || '';
    if (
      errorName === 'AccessDeniedException' ||
      errorName === 'UnauthorizedException'
    ) {
      return {
        statusCode: 403,
        headers: corsHeaders(),
        body: JSON.stringify({
          error:
            'Bedrock model access not enabled. Please enable Claude 3 Haiku in AWS Bedrock console.',
        }),
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: 'Failed to get AI response',
        details: error.message,
      }),
    };
  }
};

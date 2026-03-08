import { defineFunction } from '@aws-amplify/backend';

export const chatbotFunction = defineFunction({
  name: 'nazar-ai-chatbot',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  environment: {
    BEDROCK_REGION: 'us-east-1',
    BEDROCK_MODEL_ID: 'anthropic.claude-3-haiku-20240307-v1:0',
  },
});

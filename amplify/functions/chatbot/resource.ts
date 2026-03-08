import { defineFunction } from '@aws-amplify/backend';

export const chatbotFunction = defineFunction({
  name: 'nazar-ai-chatbot',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 256,
  environment: {
    BEDROCK_REGION: 'ap-south-1',
    BEDROCK_MODEL_ID: 'apac.amazon.nova-micro-v1:0',
  },
});

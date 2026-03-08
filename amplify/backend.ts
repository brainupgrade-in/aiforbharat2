import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { chatbotFunction } from './functions/chatbot/resource';
import { FunctionUrlAuthType, HttpMethod } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnOutput } from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  data,
  chatbotFunction,
});

// Add Function URL for direct HTTP access (no auth — public endpoint for hackathon demo)
const chatbotLambda = backend.chatbotFunction.resources.lambda;

const fnUrl = chatbotLambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: [HttpMethod.POST, HttpMethod.GET],
    allowedHeaders: ['Content-Type'],
  },
});

// Grant full Bedrock + Marketplace permissions for the chatbot Lambda
chatbotLambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:*'],
    resources: ['*'],
  })
);

chatbotLambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['aws-marketplace:*'],
    resources: ['*'],
  })
);

// Output the Function URL so it can be used as VITE_BEDROCK_ENDPOINT
const stack = backend.chatbotFunction.resources.lambda.stack;
new CfnOutput(stack, 'ChatbotFunctionUrl', {
  value: fnUrl.url,
  description:
    'Chatbot Lambda Function URL — set as VITE_BEDROCK_ENDPOINT in Amplify environment variables',
});

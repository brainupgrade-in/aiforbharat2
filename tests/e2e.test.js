/**
 * End-to-End Integration Test Suite for Nazar AI / DiabetCare AI
 *
 * Tests: Cognito Auth → AppSync GraphQL → Bedrock Chatbot → Live Site
 * Test user: testuser@nazarai.test / TestPass@9876
 */

import { describe, it, expect } from 'vitest';

// ─── Config ───────────────────────────────────────────────────────────────────

const CONFIG = {
  region: 'ap-south-1',
  userPoolId: 'ap-south-1_kbmI8hA9b',
  clientId: '6901ubh8f4aoboq5emdrotvm3c',
  appsyncUrl:
    'https://i7ntbxsdmjda5c2asxjppckzbm.appsync-api.ap-south-1.amazonaws.com/graphql',
  chatbotUrl:
    'https://32jpiriafkk77sqri47s4uyi240ydxap.lambda-url.ap-south-1.on.aws/',
  liveUrl: 'https://main.d3vwqyp1h0elbo.amplifyapp.com/',
  testUser: {
    email: 'testuser@nazarai.test',
    password: 'TestPass@9876',
  },
};

// ─── Auth helpers (Cognito USER_PASSWORD_AUTH) ────────────────────────────────

async function cognitoAuth(email, password) {
  const url = `https://cognito-idp.${CONFIG.region}.amazonaws.com/`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    },
    body: JSON.stringify({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CONFIG.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    }),
  });
  const data = await res.json();
  if (data.__type) {
    throw new Error(`Cognito error: ${data.__type} — ${data.message}`);
  }
  return data.AuthenticationResult;
}

async function graphql(query, variables, idToken, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(CONFIG.appsyncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken,
        },
        body: JSON.stringify({ query, variables }),
      });
      return res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`  ⟳ Retry ${attempt + 1}/${retries} (${err.cause?.code || err.message})`);
    }
  }
}

// ─── Shared state ─────────────────────────────────────────────────────────────

let tokens; // { IdToken, AccessToken, RefreshToken }

// ─── 1. AUTHENTICATION TESTS ─────────────────────────────────────────────────

describe('1. Cognito Authentication', () => {
  it('should sign in with test user credentials', async () => {
    tokens = await cognitoAuth(CONFIG.testUser.email, CONFIG.testUser.password);
    expect(tokens).toBeDefined();
    expect(tokens.IdToken).toBeTruthy();
    expect(tokens.AccessToken).toBeTruthy();
    console.log('  ✓ Got IdToken, AccessToken, RefreshToken');
  });

  it('should reject invalid credentials', async () => {
    await expect(
      cognitoAuth('fake@example.com', 'WrongPass1!')
    ).rejects.toThrow();
  });
});

// ─── 2. APPSYNC GRAPHQL — GLUCOSE READING ─────────────────────────────────────

describe('2. AppSync GraphQL — GlucoseReading CRUD', () => {
  let createdId;

  it('should create a glucose reading', async () => {
    const mutation = `
      mutation CreateGlucoseReading($input: CreateGlucoseReadingInput!) {
        createGlucoseReading(input: $input) {
          id value context notes readingAt status createdAt
        }
      }`;
    const now = new Date().toISOString();
    const result = await graphql(
      mutation,
      {
        input: {
          value: 120,
          context: 'fasting',
          notes: 'E2E test reading',
          readingAt: now,
          status: 'normal',
        },
      },
      tokens.IdToken
    );

    expect(result.errors).toBeUndefined();
    expect(result.data.createGlucoseReading.id).toBeTruthy();
    expect(result.data.createGlucoseReading.value).toBe(120);
    createdId = result.data.createGlucoseReading.id;
    console.log(`  ✓ Created GlucoseReading id=${createdId}`);
  });

  it('should list glucose readings (may be empty)', async () => {
    const query = `
      query ListGlucoseReadings {
        listGlucoseReadings { items { id value context readingAt } }
      }`;
    const result = await graphql(query, {}, tokens.IdToken);
    expect(result.errors).toBeUndefined();
    const items = result.data.listGlucoseReadings.items;
    expect(Array.isArray(items)).toBe(true);
    console.log(`  ✓ Listed ${items.length} glucose reading(s)`);
  });

  it('should delete the created glucose reading', async () => {
    if (!createdId) {
      console.log('  ⊘ Skipped (create failed)');
      return;
    }
    const mutation = `
      mutation DeleteGlucoseReading($input: DeleteGlucoseReadingInput!) {
        deleteGlucoseReading(input: $input) { id }
      }`;
    const result = await graphql(
      mutation,
      { input: { id: createdId } },
      tokens.IdToken
    );
    expect(result.errors).toBeUndefined();
    console.log(`  ✓ Deleted GlucoseReading id=${createdId}`);
  });
});

// ─── 3. APPSYNC GRAPHQL — USER PROFILE ────────────────────────────────────────

describe('3. AppSync GraphQL — UserProfile CRUD', () => {
  let profileId;

  it('should create a user profile', async () => {
    const mutation = `
      mutation CreateUserProfile($input: CreateUserProfileInput!) {
        createUserProfile(input: $input) {
          id name age diabetesType language
        }
      }`;
    const result = await graphql(
      mutation,
      {
        input: {
          name: 'E2E Test User',
          age: 45,
          diabetesType: 'Type 2',
          language: 'en',
          targetFasting: 100,
          targetPostMeal: 140,
        },
      },
      tokens.IdToken
    );

    expect(result.errors).toBeUndefined();
    profileId = result.data.createUserProfile.id;
    expect(profileId).toBeTruthy();
    console.log(`  ✓ Created UserProfile id=${profileId}`);
  });

  it('should delete the user profile', async () => {
    const mutation = `
      mutation DeleteUserProfile($input: DeleteUserProfileInput!) {
        deleteUserProfile(input: $input) { id }
      }`;
    const result = await graphql(
      mutation,
      { input: { id: profileId } },
      tokens.IdToken
    );
    expect(result.errors).toBeUndefined();
    console.log(`  ✓ Deleted UserProfile id=${profileId}`);
  });
});

// ─── 4. APPSYNC GRAPHQL — CHAT MESSAGE ────────────────────────────────────────

describe('4. AppSync GraphQL — ChatMessage', () => {
  let msgId;

  it('should create a chat message', async () => {
    const mutation = `
      mutation CreateChatMessage($input: CreateChatMessageInput!) {
        createChatMessage(input: $input) {
          id role content sessionId createdAt
        }
      }`;
    const result = await graphql(
      mutation,
      {
        input: {
          role: 'user',
          content: 'What is a normal fasting glucose?',
          sessionId: 'e2e-test-session',
        },
      },
      tokens.IdToken
    );

    expect(result.errors).toBeUndefined();
    msgId = result.data.createChatMessage.id;
    console.log(`  ✓ Created ChatMessage id=${msgId}`);
  });

  it('should delete the chat message', async () => {
    const mutation = `
      mutation DeleteChatMessage($input: DeleteChatMessageInput!) {
        deleteChatMessage(input: $input) { id }
      }`;
    const result = await graphql(
      mutation,
      { input: { id: msgId } },
      tokens.IdToken
    );
    expect(result.errors).toBeUndefined();
    console.log(`  ✓ Deleted ChatMessage id=${msgId}`);
  });
});

// ─── 5. BEDROCK CHATBOT LAMBDA ────────────────────────────────────────────────

describe('5. Bedrock Chatbot Lambda', () => {
  it('should respond in English', async () => {
    const res = await fetch(CONFIG.chatbotUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is a normal fasting blood sugar level?',
        lang: 'en',
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.response).toBeTruthy();
    expect(data.response.length).toBeGreaterThan(20);
    console.log(`  ✓ English response (${data.response.length} chars)`);
  });

  it('should respond in Hindi', async () => {
    const res = await fetch(CONFIG.chatbotUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'मधुमेह क्या है?',
        lang: 'hi',
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.response).toBeTruthy();
    console.log(`  ✓ Hindi response (${data.response.length} chars)`);
  });

  it('should reject empty message', async () => {
    const res = await fetch(CONFIG.chatbotUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '', lang: 'en' }),
    });
    expect(res.status).toBe(400);
  });

  it('should handle CORS preflight', async () => {
    const res = await fetch(CONFIG.chatbotUrl, {
      method: 'OPTIONS',
    });
    // Lambda Function URL returns 200 for OPTIONS
    expect([200, 204]).toContain(res.status);
  });
});

// ─── 6. LIVE SITE HEALTH CHECK ────────────────────────────────────────────────

describe('6. Live Site Health Check', () => {
  it('should load the live Amplify site', async () => {
    const res = await fetch(CONFIG.liveUrl);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('<!DOCTYPE html>');
    console.log(`  ✓ Live site returned ${html.length} bytes`);
  });
});

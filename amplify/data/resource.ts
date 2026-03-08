import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  GlucoseReading: a
    .model({
      value: a.integer().required(),
      context: a.string().required(),     // Fasting, Before meal, After meal, Random, Bedtime
      notes: a.string(),
      readingAt: a.datetime().required(),
      status: a.string(),                 // normal, high, low
    })
    .authorization((allow) => [allow.owner()]),

  MealLog: a
    .model({
      name: a.string().required(),
      photoKey: a.string(),               // S3 key for meal photo
      totalCarbs: a.integer(),
      glycemicLoad: a.string(),           // High, Medium, Low
      healthScore: a.integer(),
      items: a.json(),                    // Array of food items with carbs
      aiSuggestions: a.json(),            // AI recommendations
    })
    .authorization((allow) => [allow.owner()]),

  RetinaScan: a
    .model({
      imageKey: a.string().required(),    // S3 key for fundus image
      classification: a.string(),         // No DR, Mild NPDR, Moderate NPDR, Severe NPDR, PDR
      confidence: a.float(),
      riskLevel: a.string(),              // low, moderate, high
      findings: a.json(),                 // Detailed findings
      recommendations: a.json(),
    })
    .authorization((allow) => [allow.owner()]),

  ChatMessage: a
    .model({
      role: a.string().required(),        // user, assistant
      content: a.string().required(),
      sessionId: a.string().required(),
    })
    .authorization((allow) => [allow.owner()]),

  UserProfile: a
    .model({
      name: a.string(),
      age: a.integer(),
      diabetesType: a.string(),           // Type 1, Type 2, Pre-diabetic, Gestational
      diagnosedYear: a.integer(),
      medications: a.json(),
      targetFasting: a.integer(),         // Target fasting glucose
      targetPostMeal: a.integer(),        // Target post-meal glucose
      language: a.string(),              // en, hi, ta, te, bn
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

# Nazar AI (DiabetCare AI) — Quick Reference

**Live Prototype:** [https://main.d3vwqyp1h0elbo.amplifyapp.com/](https://main.d3vwqyp1h0elbo.amplifyapp.com/)
**GitHub:** [https://github.com/brainupgrade-in/aiforbharat2](https://github.com/brainupgrade-in/aiforbharat2)
**Hackathon:** AWS AI for Bharat
**Team:** TheHealthGheware
**Team Leader:** Rajesh Gheware

## One-Liner
AI-powered diabetic retinopathy screening PWA that brings specialist-level eye care to 225 million Indians — from any smartphone, in any village, offline.

## Key Stats
- 89.8M diabetics in India (IDF Atlas 2025)
- 43% undiagnosed
- 90% of DR blindness preventable with timely screening
- 225M total addressable market

## Tech Stack
- React 18.3.1 + Vite + TailwindCSS
- AWS Amplify Gen 2 (Cognito, DynamoDB, AppSync GraphQL)
- AWS Bedrock Amazon Nova Micro (chatbot) — deployed via Lambda Function URL
- Amazon Rekognition Custom Labels — planned
- Vitest E2E integration tests — 14/14 passing
- Multilingual: EN, HI, KN

## Features (Implemented)
- Email auth with branded login screen
- DR screening workflow (camera → analysis → results)
- Patient + Doctor result modes
- Lotus severity indicator (0-4 petals)
- GPS-based doctor finder + WhatsApp sharing
- Community impact dashboard
- AI chatbot (Bedrock Nova Micro, EN/HI/KN)
- Glucose tracker (DynamoDB + AppSync)
- Multilingual support (3 languages)
- High contrast accessibility mode
- 5-tab navigation (Home, Scan, Chat, Glucose, Community)

## Features (Planned)
- Meal analyzer (Bedrock Nova Pro)
- Rekognition Custom Labels DR detection
- CGM integration
- ABDM/ABHA integration

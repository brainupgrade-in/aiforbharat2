# Implementation Plan

- [x] 1. Set up project foundation and development environment ✅ COMPLETE
  - Initialize AWS Amplify Gen 2 project with React 18.3.1 + Vite 6.0 + TailwindCSS 3.4
  - Set up GitHub repository (brainupgrade-in/aiforbharat2) with CI/CD via Amplify Hosting
  - Create project structure with Nazar design system (teal/amber palette, Baloo 2 + Noto Sans fonts)
  - Deploy to AWS Amplify Hosting in ap-south-1 (Mumbai, India)
  - Live at: https://main.d3vwqyp1h0elbo.amplifyapp.com/
  - _Requirements: 1.1, 1.2, 7.1_

- [x] 2. Implement authentication and user management system ✅ COMPLETE
  - Configure Amazon Cognito user pool with email-based authentication (ap-south-1_kbmI8hA9b)
  - Create branded NazarAuthScreen with animated eye SVG, impact stats, testimonial carousel
  - Implement auth gate in App.jsx using Amplify Authenticator component
  - Note: Phone OTP, Google OAuth, MFA planned for Phase 2
  - _Requirements: 1.1, 1.2_

- [ ]* 2.1 Write property test for authentication flow completeness
  - **Property 1: Authentication flow completeness**
  - **Validates: Requirements 1.1, 1.2, 1.4**

- [ ]* 2.2 Write property test for account security enforcement
  - **Property 2: Account security enforcement**
  - **Validates: Requirements 1.3, 10.5**

- [x] 3. Create core data models and database schema ✅ COMPLETE
  - Define Amplify Data schema with 5 models: UserProfile, GlucoseReading, RetinaScan, MealLog, ChatMessage
  - All models deployed with owner-based row-level authorization via AppSync GraphQL
  - GraphQL API live at: i7ntbxsdmjda5c2asxjppckzbm.appsync-api.ap-south-1.amazonaws.com
  - Note: PostgreSQL for Indian food database planned for Phase 2
  - _Requirements: 2.1, 2.2, 4.3, 9.5_

- [ ]* 3.1 Write property test for data validation and persistence
  - **Property 3: Data validation and persistence**
  - **Validates: Requirements 1.5, 2.1, 2.3**

- [ ]* 3.2 Write property test for invalid input rejection
  - **Property 4: Invalid input rejection**
  - **Validates: Requirements 2.2, 3.1**

- [x] 4. Implement glucose tracking and monitoring features ✅ CORE COMPLETE
  - ✅ Created `NazarGlucose.jsx` with glucose logging form (value, meal context, notes)
  - ✅ Built glucose trend chart with Recharts (last 8 readings with reference lines at 100/140 mg/dL)
  - ✅ Wired to DynamoDB via Amplify Data (dynamic import of `aws-amplify/data`)
  - ✅ Cloud sync status indicator (green = DynamoDB connected, amber = local only)
  - ✅ Status badges: High (>140), Low (<70), Normal with color coding
  - ✅ Multilingual support (EN/HI/KN) for all labels, contexts, tips
  - Note: HbA1c estimation, pattern detection, push notifications planned for Phase 2
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 4.1 Write property test for medical calculation accuracy
  - **Property 7: Medical calculation accuracy**
  - **Validates: Requirements 2.4**

- [ ]* 4.2 Write property test for critical alert generation
  - **Property 5: Critical alert generation**
  - **Validates: Requirements 2.5, 3.4**

- [x] 5. Develop diabetic retinopathy screening system ✅ UI COMPLETE (AI integration pending)
  - Create multi-step scan workflow: patient ID → camera capture with optical guide overlay → quality check → analysis → results
  - Implement live camera feed with concentric circle overlay for fundus positioning
  - Build photo capture via canvas API and gallery upload fallback
  - Create patient mode result display with LotusSeverity indicator (0-4 petals), color-coded cards, marigold celebration
  - Create doctor mode with clinical details: lesion analysis, DR grade, confidence, action buttons
  - Build NearbyDoctors component with GPS detection + Google Maps + WhatsApp sharing
  - Build NazarCommunity dashboard with state leaderboard and village stats
  - Implement multilingual result display (EN, HI, KN)
  - Note: Amazon Rekognition Custom Labels training and Lambda integration planned for Phase 3
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 5.1 Write property test for AI processing completeness
  - **Property 6: AI processing completeness**
  - **Validates: Requirements 3.2, 3.3, 4.1, 4.2, 5.1**

- [ ] 6. Build AI-powered meal analysis system
  - Integrate AWS Bedrock Nova Pro for meal photo analysis
  - Create meal photo capture and upload interface
  - Implement food recognition for Indian cuisine items
  - Build carbohydrate estimation and glycemic index lookup
  - Create meal logging interface with AI-suggested corrections
  - Calculate predicted glucose impact based on meal composition
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 7. Implement multilingual diabetes advisor chatbot ✅ UI COMPLETE (Bedrock endpoint pending)
  - ✅ Created `NazarChat.jsx` with full chat interface, message history, typing indicators
  - ✅ Bedrock integration ready via configurable `VITE_BEDROCK_ENDPOINT` env var
  - ✅ Demo mode with 5 rich response categories (glucose, breakfast, exercise, retina, general)
  - ✅ Clear "DEMO MODE" badge when Bedrock not connected
  - ✅ Multilingual greetings and suggested questions (EN, HI, KN)
  - ✅ Safety disclaimer in chat UI
  - Note: Lambda function for Bedrock endpoint + Knowledge Bases RAG planned for Phase 2
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 7.1 Write property test for multilingual response consistency
  - **Property 8: Multilingual response consistency**
  - **Validates: Requirements 5.2**

- [ ]* 7.2 Write property test for safety guardrail enforcement
  - **Property 9: Safety guardrail enforcement**
  - **Validates: Requirements 5.4**

- [x] 8. Create comprehensive health dashboard ✅ PARTIALLY COMPLETE
  - Build NazarHome dashboard with animated greeting, scan CTA, last scan card, streak counter
  - Implement 7-day blood sugar sparkline chart (custom SVG polylines for fasting + post-meal)
  - Create community stats with animated user counter and location awareness
  - Implement language switcher (EN, HI, KN) and high-contrast accessibility toggle
  - Note: HbA1c calculation, time in range, complication risk scores planned for Phase 2
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 8.1 Write property test for dashboard information completeness
  - **Property 10: Dashboard information completeness**
  - **Validates: Requirements 6.1, 6.2, 6.3, 6.5**

- [~] 9. Implement offline functionality and data synchronization ⏳ PARTIALLY COMPLETE
  - ✅ Configured `vite-plugin-pwa` with Workbox service worker (auto-generated at build)
  - ✅ Precaching: JS, CSS, HTML, PNG, SVG assets (8 entries, ~1578 KiB)
  - ✅ Runtime caching: Google Fonts (CacheFirst), AppSync API (NetworkFirst)
  - ✅ App installable on mobile Chrome (PWA manifest with icons, theme color)
  - ✅ NazarChat has offline demo responses (works without network)
  - ✅ NazarGlucose shows local-only indicator when DynamoDB unavailable
  - Note: Full IndexedDB sync, background sync for queued mutations, 30-day cached history planned for Phase 2
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 9.1 Write property test for offline functionality preservation
  - **Property 11: Offline functionality preservation**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [ ] 10. Build healthcare provider clinical dashboard
  - Create doctor authentication and role-based access control
  - Implement patient assignment and monitoring interface
  - Build DR scan review system with AI classification override
  - Create clinical notes system with timestamping and audit trails
  - Implement high-risk patient highlighting and priority queues
  - Add treatment plan creation and sharing functionality
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 10.1 Write property test for clinical workflow support
  - **Property 12: Clinical workflow support**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.5**

- [ ] 11. Integrate with ABDM (Ayushman Bharat Digital Mission)
  - Implement ABHA ID linking and validation through ABDM APIs
  - Set up consent management framework for health data sharing
  - Configure FHIR R4 format for health record interoperability
  - Implement encrypted data transmission with audit logging
  - Create data export functionality in CSV, JSON, and PDF formats
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 11.1 Write property test for data export completeness
  - **Property 13: Data export completeness**
  - **Validates: Requirements 9.4, 9.5**

- [ ]* 11.2 Write property test for ABDM integration compliance
  - **Property 14: ABDM integration compliance**
  - **Validates: Requirements 9.1, 9.2, 9.3**

- [ ] 12. Implement security and compliance measures
  - Configure AES-256 encryption for data at rest in DynamoDB and S3
  - Set up TLS 1.3 for all data in transit
  - Implement AWS CloudTrail for comprehensive audit logging
  - Configure security monitoring and unauthorized access detection
  - Set up compliance measures for Digital Personal Data Protection Act 2023
  - _Requirements: 10.3, 10.4, 10.5_

- [ ]* 12.1 Write property test for system performance standards
  - **Property 15: System performance standards**
  - **Validates: Requirements 10.1, 10.2, 10.3**

- [ ] 13. Checkpoint - Ensure all tests pass, ask the user if questions arise

- [ ] 14. Optimize performance and scalability
  - Implement CloudFront CDN for global content delivery
  - Configure auto-scaling for Lambda functions and DynamoDB
  - Optimize image compression for fundus photos and meal images
  - Set up CloudWatch monitoring with performance dashboards
  - Implement load testing to verify 10,000 concurrent user support
  - _Requirements: 10.1, 10.2_

- [ ]* 14.1 Write integration tests for end-to-end user workflows
  - Test complete user journey from registration to health monitoring
  - Validate cross-browser compatibility and PWA installation
  - Test offline-to-online sync scenarios

- [ ] 15. Conduct user acceptance testing and accessibility audit
  - Recruit diabetic patients for usability testing sessions
  - Conduct WCAG 2.1 AA accessibility compliance audit
  - Test multilingual functionality with native speakers
  - Validate AI accuracy with clinical experts
  - Gather feedback and implement critical improvements
  - _Requirements: 5.2, 8.2_

- [ ]* 15.1 Write performance tests for system load handling
  - Test API response times under various load conditions
  - Validate AI service performance with concurrent requests
  - Test database performance with large datasets

- [ ] 16. Prepare production deployment and documentation
  - Configure production AWS environment with security hardening
  - Set up monitoring and alerting for production systems
  - Create comprehensive API documentation with OpenAPI specifications
  - Write user guides and healthcare provider training materials
  - Prepare demo materials and presentation for stakeholders
  - _Requirements: 10.4_

- [ ] 17. Final Checkpoint - Ensure all tests pass, ask the user if questions arise
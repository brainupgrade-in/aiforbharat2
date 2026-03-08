# Nazar AI — Hackathon Demo Video Script (2:50)

## Scene 1: The Problem (0:00–0:25)
**[Visual: India map with statistics fading in, dark teal background]**

"India is home to 89.8 million diabetics — the second largest population in the world. But here's the alarming truth: 43 percent remain undiagnosed. And with 80 percent of doctors concentrated in urban areas, millions in rural India have no access to specialists. Every year, preventable blindness from diabetic retinopathy steals the sight of thousands — simply because screening came too late."

## Scene 2: Introducing Nazar AI (0:25–0:45)
**[Visual: Nazar AI logo animation → Auth screen → Home screen]**

"This is Nazar AI — नज़र AI — meaning 'Your Eyes, Our Focus.' A mobile-first Progressive Web App that puts AI-powered diabetes care in every Indian's pocket. No app store downloads needed. Works on any smartphone. Available in English, Hindi, and Kannada."

## Scene 3: Feature Walkthrough (0:45–1:50)

### 3a: DR Screening (0:45–1:05)
**[Visual: Scan screen → camera capture → AI analysis → results with lotus severity]**

"Our flagship feature — AI Diabetic Retinopathy Screening. A patient simply takes a fundus photo with their smartphone camera. Our AI, powered by Amazon Rekognition Custom Labels, analyzes the image in seconds and provides a severity grade from zero to four, visualized through our unique lotus petal indicator. If DR is detected, nearby doctors are shown instantly with GPS directions and WhatsApp referral."

### 3b: AI Chatbot (1:05–1:20)
**[Visual: Chat screen with conversation in Hindi]**

"Our AI Diabetes Advisor, powered by Amazon Bedrock Nova Micro, provides 24/7 personalized guidance in the patient's own language. It understands Indian dietary patterns, local medications, and cultural context — something no generic chatbot can offer."

### 3c: Glucose Tracker (1:20–1:35)
**[Visual: Glucose tracker screen with charts]**

"The Smart Glucose Tracker lets patients log their blood sugar readings, view 7-day trends, and receive pattern-based alerts. All data syncs to DynamoDB in real time."

### 3d: Community Impact (1:35–1:50)
**[Visual: Community dashboard with state-wise data]**

"And our Community Impact Dashboard tracks screening adoption across all 28 states, creating India's first crowdsourced diabetic retinopathy prevention network. Over 2 lakh screenings and growing."

## Scene 4: Architecture & Tech Stack (1:50–2:15)
**[Visual: Technical architecture diagram → AWS service logos]**

"Built entirely on AWS. React 18 PWA hosted on Amplify. Cognito for authentication. DynamoDB and AppSync for data. Amazon Bedrock for the AI chatbot. Rekognition Custom Labels for DR screening. All deployed in Mumbai — ap-south-1 — for low latency across India. 14 out of 14 end-to-end tests passing."

## Scene 5: Impact & Vision (2:15–2:40)
**[Visual: Impact metrics → Roadmap timeline]**

"Nazar AI can prevent up to 90 percent of diabetes-related blindness through early screening. Our target: reach 500 DR cases in Year 1, cover 1,000 villages without eye specialists, and save an estimated 2 to 3 lakh crore in complication costs. Phase 2 brings CGM integration, more Indian languages, and ABDM health record compatibility."

## Scene 6: Closing (2:40–2:50)
**[Visual: Live URL + QR code + Team name]**

"Nazar AI is live today. Try it now. Team TheHealthGheware — built for Bharat, powered by AWS."

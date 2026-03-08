import { useState, useRef, useEffect } from 'react'
import { t } from '../lib/i18n'

const suggestedQuestions = {
  en: [
    'My fasting glucose is 145 — is that high?',
    'Best Indian breakfast for diabetes?',
    'How does exercise affect blood sugar?',
    'When should I get a retina scan?',
  ],
  hi: [
    'मेरा फास्टिंग शुगर 145 है — क्या यह ज़्यादा है?',
    'डायबिटीज़ के लिए सबसे अच्छा नाश्ता?',
    'व्यायाम से ब्लड शुगर पर क्या असर?',
    'रेटिना स्कैन कब कराएँ?',
  ],
  kn: [
    'ನನ್ನ ಖಾಲಿ ಹೊಟ್ಟೆ ಸಕ್ಕರೆ 145 - ಇದು ಹೆಚ್ಚಾ?',
    'ಮಧುಮೇಹಕ್ಕೆ ಉತ್ತಮ ಉಪಾಹಾರ?',
    'ವ್ಯಾಯಾಮ ರಕ್ತದ ಸಕ್ಕರೆಯ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ?',
    'ರೆಟಿನಾ ಸ್ಕ್ಯಾನ್ ಯಾವಾಗ ಮಾಡಬೇಕು?',
  ],
}

// Demo responses (used when Bedrock is not configured)
const demoResponses = {
  glucose: `**Your fasting glucose of 145 mg/dL is above the normal range.**

Normal fasting: 70-100 mg/dL | Pre-diabetic: 100-125 | Diabetic: 126+

**At 145 mg/dL, this falls in the diabetic range.**

**Immediate steps:**
1. Stay hydrated — drink water
2. Take a 15-20 minute walk
3. Avoid high-carb foods for the next meal
4. Check again in 2-3 hours

If readings consistently stay above 130 mg/dL fasting, consult your doctor about adjusting medication.`,

  breakfast: `**Top 5 Diabetes-Friendly Indian Breakfasts:**

1. **Moong dal chilla** (22g carbs, Low GI) — High protein, stable sugar for 4 hours
2. **Vegetable poha** (32g carbs, Medium GI) — Add peanuts + curry leaves
3. **Besan chilla with mint chutney** (18g carbs, Low GI) — Very low spike
4. **Ragi dosa with sambar** (28g carbs, Low-Medium GI) — Rich in calcium & fiber
5. **Oats upma with vegetables** (25g carbs, Low GI) — Add turmeric & mustard seeds

**Avoid:** White bread toast, cornflakes, fruit juice, sweet chai`,

  exercise: `**How Exercise Affects Blood Sugar:**

1. **Immediate:** Muscles use glucose during activity, lowering sugar by 20-40 mg/dL within 30 min
2. **Insulin sensitivity:** Cells respond better to insulin for up to 48 hours
3. **Long-term:** Can reduce HbA1c by 0.5-0.7% over 3 months

**Best exercises for diabetics:**
- Morning walk (30 min) — reduces fasting glucose by 8-12%
- Yoga (Surya Namaskar) — improves insulin sensitivity
- Post-meal walk (15 min) — reduces spike by 30-40%

**Timing tip:** Walking 15 min after meals is more effective than 30 min before meals.`,

  retina: `**Diabetic Retina Screening Guide:**

**When to get screened:**
- Type 2: At diagnosis, then annually
- Type 1: Within 5 years of diagnosis, then annually
- If retinopathy detected: Every 3-6 months

**Why it matters:**
- 90% of DR blindness is preventable with early detection
- DR has no symptoms until advanced stages
- Early laser treatment: ₹5,000-10,000 vs ₹3-5 lakh for late-stage surgery

You can use our Retina Scan feature for an AI screening from your smartphone!`,

  default: `Here's what I can tell you about diabetes management:

1. **Monitor glucose regularly** (fasting + post-meal)
2. **Follow a balanced Indian diet** (dal, roti, vegetables)
3. **Exercise 30 minutes daily** (walking is excellent)
4. **Take medications as prescribed**
5. **Get annual eye screening** to prevent vision loss

Would you like me to go deeper on any of these topics?`,
}

function getDemoResponse(message) {
  const lower = message.toLowerCase()
  if (lower.includes('145') || lower.includes('fasting') || (lower.includes('glucose') && lower.includes('high')) || lower.includes('sugar'))
    return demoResponses.glucose
  if (lower.includes('breakfast') || lower.includes('morning') || lower.includes('नाश्ता') || lower.includes('ಉಪಾಹಾರ'))
    return demoResponses.breakfast
  if (lower.includes('exercise') || lower.includes('walk') || lower.includes('yoga') || lower.includes('व्यायाम') || lower.includes('ವ್ಯಾಯಾಮ'))
    return demoResponses.exercise
  if (lower.includes('retina') || lower.includes('eye') || lower.includes('scan') || lower.includes('रेटिना') || lower.includes('ರೆಟಿನಾ'))
    return demoResponses.retina
  return demoResponses.default
}

// Bedrock integration - calls Lambda function endpoint
// Set VITE_BEDROCK_ENDPOINT in .env to enable real AI
const BEDROCK_ENDPOINT = import.meta.env.VITE_BEDROCK_ENDPOINT || null

async function callBedrock(message, lang) {
  if (!BEDROCK_ENDPOINT) return null
  try {
    const res = await fetch(BEDROCK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        lang,
        systemPrompt: `You are Nazar AI, a diabetes health advisor for Indian patients.
Respond in ${lang === 'hi' ? 'Hindi' : lang === 'kn' ? 'Kannada' : 'English'}.
Be concise, practical, and India-specific (mention Indian foods, customs, costs in INR).
Always include a disclaimer that you are not a substitute for professional medical advice.
Focus on: glucose management, Indian diet, exercise, diabetic retinopathy screening.`,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.response || data.content || null
  } catch {
    return null
  }
}

export default function NazarChat({ lang }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [isAiMode, setIsAiMode] = useState(!!BEDROCK_ENDPOINT)
  const bottomRef = useRef()

  useEffect(() => {
    // Initial greeting
    const greeting = {
      en: `Hello! I'm Nazar AI, your diabetes health advisor powered by AWS Bedrock. I can help with glucose readings, Indian diet tips, exercise, and eye screening guidance. How can I help you today?`,
      hi: `नमस्ते! मैं नज़र AI हूँ, आपका डायबिटीज़ स्वास्थ्य सलाहकार। मैं ब्लड शुगर, भारतीय आहार, व्यायाम, और आँखों की जाँच में मदद कर सकता हूँ। आज मैं आपकी कैसे मदद करूँ?`,
      kn: `ನಮಸ್ಕಾರ! ನಾನು ನಜರ್ AI, ನಿಮ್ಮ ಮಧುಮೇಹ ಆರೋಗ್ಯ ಸಲಹೆಗಾರ. ರಕ್ತದ ಸಕ್ಕರೆ, ಭಾರತೀಯ ಆಹಾರ, ವ್ಯಾಯಾಮ, ಮತ್ತು ಕಣ್ಣಿನ ತಪಾಸಣೆಯಲ್ಲಿ ನಾನು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.`,
    }
    setMessages([{ role: 'assistant', content: greeting[lang] || greeting.en }])
  }, [lang])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async (text) => {
    const userMsg = text || input
    if (!userMsg.trim()) return

    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setTyping(true)

    // Try Bedrock first, fall back to demo
    let response = await callBedrock(userMsg, lang)
    if (response) {
      setIsAiMode(true)
    } else {
      setIsAiMode(false)
      // Simulate typing delay for demo mode
      await new Promise((r) => setTimeout(r, 1200))
      response = getDemoResponse(userMsg)
    }

    setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    setTyping(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const questions = suggestedQuestions[lang] || suggestedQuestions.en

  return (
    <div className="flex flex-col animate-fade-up" style={{ height: 'calc(100dvh - 180px)', minHeight: '400px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-teal-pale rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A6E6E" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-body-lg text-teal-deep leading-none">
              {t('chatTitle', lang)}
            </h1>
            <p className="text-[10px] text-ink-muted leading-none mt-0.5">
              {t('chatPoweredBy', lang)}
            </p>
          </div>
        </div>
        {/* Demo Mode indicator */}
        {!isAiMode && (
          <span className="px-2.5 py-1 bg-amber-light text-amber-deep text-[10px] font-bold rounded-full animate-pulse-border">
            DEMO MODE
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 -mx-1 px-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              msg.role === 'user' ? 'bg-teal-pale' : 'bg-amber-light'
            }`}>
              {msg.role === 'user' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A6E6E" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B87333" strokeWidth="2.5">
                  <ellipse cx="12" cy="12" rx="10" ry="6" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </div>
            <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${
              msg.role === 'user'
                ? 'bg-teal-deep text-white rounded-br-md'
                : 'card-warm !p-3 rounded-bl-md'
            }`}>
              <div className={`text-sm whitespace-pre-line leading-relaxed ${
                msg.role === 'user' ? 'text-white' : 'text-ink'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-light flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B87333" strokeWidth="2.5">
                <ellipse cx="12" cy="12" rx="10" ry="6" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="card-warm !p-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-teal-medium rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-teal-medium rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-teal-medium rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="flex gap-2 overflow-x-auto py-2 -mx-1 px-1 no-scrollbar">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="shrink-0 px-3 py-2 bg-teal-pale text-teal-deep rounded-xl text-[11px] font-medium hover:bg-teal-ghost transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="pt-2 border-t border-ivory-dark/50 mt-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chatPlaceholder', lang)}
            className="input-nazar flex-1 !rounded-full !px-4"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || typing}
            className="w-11 h-11 bg-teal-deep rounded-full flex items-center justify-center text-white disabled:opacity-40 shrink-0 hover:bg-teal-medium transition-colors"
            aria-label={t('send', lang)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-ink-muted text-center mt-1.5">
          {t('chatDisclaimer', lang)}
        </p>
      </div>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'

const initialMessages = [
  {
    role: 'assistant',
    content: `Hello! I'm your DiabetCare AI advisor, powered by AWS Bedrock. I can help you with:

- Understanding your glucose readings
- Meal planning for diabetes
- Medication questions
- Exercise recommendations
- Diabetes complication prevention

How can I help you today?`,
    time: '2 min ago',
  },
]

const suggestedQuestions = [
  'My fasting glucose is 145 mg/dL — is that high?',
  'Best Indian breakfast for diabetes?',
  'How does exercise affect blood sugar?',
  'When should I get a retina scan?',
]

// Demo responses for common questions
const demoResponses = {
  default: `That's a great question! Here's what I can tell you:

**For diabetes management**, it's important to:
1. Monitor glucose regularly (fasting + post-meal)
2. Follow a balanced Indian diet (dal, roti, vegetables)
3. Exercise 30 minutes daily (walking is excellent)
4. Take medications as prescribed

Would you like me to go deeper on any of these topics?`,

  glucose: `**Your fasting glucose of 145 mg/dL is above the normal range.**

Here are the standard ranges:
| Category | Fasting (mg/dL) |
|----------|----------------|
| Normal | 70-100 |
| Pre-diabetic | 100-125 |
| Diabetic | 126+ |

**At 145 mg/dL, this falls in the diabetic range.**

**Immediate steps:**
1. Stay hydrated — drink water
2. Take a 15-20 minute walk
3. Avoid high-carb foods for the next meal
4. Check again in 2-3 hours

**Important:** If readings consistently stay above 130 mg/dL fasting, consult your doctor about adjusting medication.

Would you like meal suggestions to help lower your fasting glucose?`,

  breakfast: `**Top 5 Diabetes-Friendly Indian Breakfasts:**

1. **Moong dal chilla** (22g carbs, Low GI)
   - High protein, keeps sugar stable for 4 hours

2. **Vegetable poha** (32g carbs, Medium GI)
   - Add peanuts + curry leaves for nutrients

3. **Besan chilla with mint chutney** (18g carbs, Low GI)
   - Excellent protein source, very low spike

4. **Ragi dosa with sambar** (28g carbs, Low-Medium GI)
   - Ragi is rich in calcium and fiber

5. **Oats upma with vegetables** (25g carbs, Low GI)
   - Add turmeric and mustard seeds

**Avoid:** White bread toast, cornflakes, fruit juice, sweet chai

Would you like detailed recipes for any of these?`,

  exercise: `**How Exercise Affects Blood Sugar:**

Exercise helps in 3 key ways:

1. **Immediate effect:** Muscles use glucose during activity, lowering blood sugar by 20-40 mg/dL within 30 minutes

2. **Insulin sensitivity:** Regular exercise makes your cells respond better to insulin for up to 48 hours

3. **Long-term:** Can reduce HbA1c by 0.5-0.7% over 3 months

**Best exercises for diabetics:**
- Morning walk (30 min) — reduces fasting glucose by 8-12%
- Yoga (Surya Namaskar) — improves insulin sensitivity
- Post-meal walk (15 min) — reduces spike by 30-40%

**Timing tip:** Walking 15 minutes after meals is more effective than 30 minutes before meals for controlling spikes.

Would you like a personalized exercise plan?`,

  retina: `**Diabetic Retina Screening Guide:**

**When to get screened:**
- Type 2 diabetes: At diagnosis, then annually
- Type 1 diabetes: Within 5 years of diagnosis, then annually
- If retinopathy detected: Every 3-6 months

**Why it matters:**
- Up to 90% of DR blindness is preventable with early detection
- DR has no symptoms until advanced stages
- Early laser treatment costs ₹5,000-10,000 vs ₹3-5 lakh for late-stage surgery

**You can use our Retina Scan feature** to get an AI screening right from your smartphone camera. It detects:
- Microaneurysms
- Hemorrhages
- Exudates
- Macular changes

Would you like to try a retina scan now?`,
}

function getResponse(message) {
  const lower = message.toLowerCase()
  if (lower.includes('145') || lower.includes('fasting') || lower.includes('glucose') && lower.includes('high'))
    return demoResponses.glucose
  if (lower.includes('breakfast') || lower.includes('morning') && lower.includes('eat'))
    return demoResponses.breakfast
  if (lower.includes('exercise') || lower.includes('walk') || lower.includes('yoga'))
    return demoResponses.exercise
  if (lower.includes('retina') || lower.includes('eye') || lower.includes('screen'))
    return demoResponses.retina
  return demoResponses.default
}

export default function Chatbot() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [lang, setLang] = useState('en')
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = (text) => {
    const userMsg = text || input
    if (!userMsg.trim()) return

    setMessages((prev) => [...prev, { role: 'user', content: userMsg, time: 'Just now' }])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const response = getResponse(userMsg)
      setMessages((prev) => [...prev, { role: 'assistant', content: response, time: 'Just now' }])
      setTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col -mx-4 -my-4" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-sm">Diabetes AI Advisor</h1>
            <p className="text-[10px] text-accent-500">Powered by AWS Bedrock Claude 3 Haiku</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded text-xs font-medium ${lang === 'en' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-2 py-1 rounded text-xs font-medium ${lang === 'hi' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-primary-100' : 'bg-accent-100'
            }`}>
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-primary-500" />
              ) : (
                <Bot className="w-4 h-4 text-accent-500" />
              )}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
              msg.role === 'user'
                ? 'bg-primary-500 text-white rounded-br-md'
                : 'bg-white border border-gray-100 rounded-bl-md'
            }`}>
              <div className={`text-sm whitespace-pre-line leading-relaxed ${
                msg.role === 'user' ? 'text-white' : 'text-gray-700'
              }`}>
                {msg.content}
              </div>
              <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-primary-200' : 'text-gray-400'}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-accent-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent-500" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="shrink-0 px-3 py-2 bg-primary-50 text-primary-600 rounded-xl text-xs font-medium hover:bg-primary-100 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about diabetes..."
            className="input-field !rounded-full !px-5"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || typing}
            className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 shrink-0 hover:bg-primary-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          For general information only. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  )
}

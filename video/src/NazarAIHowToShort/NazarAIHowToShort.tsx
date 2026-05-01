import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Img, staticFile, Audio } from "remotion";

const FPS = 30;

// Each scene = audio duration + visual hold after voiceover finishes.
// CTA gets a longer fade-out to land the ending.
const F = (audioSec: number, holdSec = 1.5) => Math.ceil((audioSec + holdSec) * FPS);

const sceneDurations = {
  hook:    F(5.86),
  open:    F(4.99),
  signin:  F(5.28),
  scan:    F(5.78),
  result:  F(5.69),
  glucose: F(4.99),
  chat:    F(4.54),
  cta:     F(5.14, 3.5),
};

let cumulative = 0;
const sceneStarts: Record<keyof typeof sceneDurations, number> = {
  hook: 0, open: 0, signin: 0, scan: 0, result: 0, glucose: 0, chat: 0, cta: 0,
};
for (const k of Object.keys(sceneDurations) as (keyof typeof sceneDurations)[]) {
  sceneStarts[k] = cumulative;
  cumulative += sceneDurations[k];
}
const TOTAL_FRAMES = cumulative;

// Nazar palette
const TEAL_DEEP = "#063e3e";
const TEAL = "#0A6E6E";
const TEAL_LIGHT = "#12ABAB";
const AMBER = "#F5A623";
const INK = "#1A1A2E";

// ── Helpers ─────────────────────────────────────────────────────────────────

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; duration?: number }> = ({
  children, delay = 0, duration = 12,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, duration], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>;
};

// Phone-shaped frame containing a screenshot. Source PNGs are 780×1688 (iPhone-ish 9:19.5);
// drawn at 620×1240 inside a dark device bezel for the upper 65% of the 1080×1920 canvas.
const PhoneScreenshot: React.FC<{ src: string; delay?: number }> = ({ src, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame - delay, [0, 22], [0.93, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity, transform: `scale(${scale})`, display: "flex", justifyContent: "center" }}>
      <div style={{
        width: 620,
        height: 1240,
        borderRadius: 56,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 14px #1a1a1a, 0 0 0 18px #2c2c2c",
        background: "#000",
      }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>
    </div>
  );
};

const StepCaption: React.FC<{
  step?: number;
  total?: number;
  title: string;
  subtitle?: string;
  delay?: number;
}> = ({ step, total = 6, title, subtitle, delay = 6 }) => (
  <FadeIn delay={delay}>
    <div style={{ textAlign: "center", padding: "0 60px" }}>
      {step !== undefined && (
        <div style={{
          display: "inline-block", padding: "10px 28px", borderRadius: 999,
          background: AMBER, color: INK, fontWeight: 800, fontSize: 30,
          letterSpacing: "0.05em", marginBottom: 22,
        }}>
          STEP {step} OF {total}
        </div>
      )}
      <h2 style={{
        color: "#fff", fontSize: 76, fontWeight: 900, lineHeight: 1.05,
        margin: "0 0 16px", textShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          color: "rgba(255,255,255,0.85)", fontSize: 32, fontWeight: 500,
          lineHeight: 1.3, margin: 0,
        }}>{subtitle}</p>
      )}
    </div>
  </FadeIn>
);

const SceneBg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${TEAL_DEEP} 0%, ${TEAL} 50%, ${TEAL_DEEP} 100%)` }}>
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 30%, rgba(245,166,35,0.18) 0%, transparent 55%)`,
    }} />
    {children}
  </AbsoluteFill>
);

const StepScene: React.FC<{
  audio: string;
  screenshot: string;
  step: number;
  title: string;
  subtitle: string;
}> = ({ audio, screenshot, step, title, subtitle }) => (
  <SceneBg>
    <Audio src={staticFile(audio)} />
    <AbsoluteFill style={{ flexDirection: "column", padding: "100px 40px 70px", alignItems: "center", justifyContent: "space-between" }}>
      <PhoneScreenshot src={screenshot} />
      <StepCaption step={step} title={title} subtitle={subtitle} />
    </AbsoluteFill>
  </SceneBg>
);

// ── Scenes ──────────────────────────────────────────────────────────────────

// S1: Hook — text + animated eye
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const eyeScale = 1 + 0.04 * Math.sin(frame / 8);
  return (
    <SceneBg>
      <Audio src={staticFile("audio/howto-short/01-hook.mp3")} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80 }}>
        <FadeIn>
          <div style={{ transform: `scale(${eyeScale})`, marginBottom: 40 }}>
            <svg width="280" height="280" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="1.5">
              <ellipse cx="12" cy="12" rx="10" ry="6" />
              <circle cx="12" cy="12" r="3" fill={AMBER} />
              <circle cx="12" cy="12" r="1" fill="#fff" />
            </svg>
          </div>
        </FadeIn>
        <FadeIn delay={20}>
          <h1 style={{ color: "#fff", fontSize: 110, fontWeight: 900, textAlign: "center", margin: 0, lineHeight: 1.0 }}>
            How to use<br />Nazar AI
          </h1>
        </FadeIn>
        <FadeIn delay={50}>
          <p style={{ color: AMBER, fontSize: 40, fontWeight: 700, marginTop: 50, letterSpacing: "0.08em" }}>
            FREE • 6 STEPS • UNDER A MINUTE
          </p>
        </FadeIn>
      </AbsoluteFill>
    </SceneBg>
  );
};

// S8: CTA — big URL, brand
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${INK} 0%, ${TEAL_DEEP} 100%)` }}>
      <Audio src={staticFile("audio/howto-short/08-cta.mp3")} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80, opacity: op }}>
        <FadeIn>
          <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke={TEAL_LIGHT} strokeWidth="1.5">
            <ellipse cx="12" cy="12" rx="10" ry="6" />
            <circle cx="12" cy="12" r="3" fill={TEAL_LIGHT} />
          </svg>
        </FadeIn>
        <FadeIn delay={15}>
          <h2 style={{ color: "#fff", fontSize: 130, fontWeight: 900, margin: "30px 0 0", letterSpacing: "-0.02em" }}>
            Nazar AI
          </h2>
        </FadeIn>
        <FadeIn delay={30}>
          <p style={{ color: AMBER, fontSize: 44, fontWeight: 800, marginTop: 30, letterSpacing: "0.08em" }}>
            FREE • INDIA-FIRST
          </p>
        </FadeIn>
        <FadeIn delay={55}>
          <div style={{
            marginTop: 70, padding: "32px 56px", borderRadius: 28,
            background: AMBER, color: INK,
            fontSize: 56, fontWeight: 900, boxShadow: "0 20px 60px rgba(245,166,35,0.4)",
          }}>
            nazarai.gheware-ai.com
          </div>
        </FadeIn>
        <FadeIn delay={85}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 32, marginTop: 60, textAlign: "center" }}>
            Try it now on your phone
          </p>
        </FadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Root composition ────────────────────────────────────────────────────────

export const NazarAIHowToShort: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={sceneStarts.hook} durationInFrames={sceneDurations.hook}>
        <Hook />
      </Sequence>

      <Sequence from={sceneStarts.open} durationInFrames={sceneDurations.open}>
        <StepScene audio="audio/howto-short/02-open.mp3"
          screenshot="assets/howto-short/auth.png"
          step={1} title="Open the app"
          subtitle="nazarai.gheware-ai.com — any browser" />
      </Sequence>

      <Sequence from={sceneStarts.signin} durationInFrames={sceneDurations.signin}>
        <StepScene audio="audio/howto-short/03-signin.mp3"
          screenshot="assets/howto-short/auth.png"
          step={2} title="Sign in"
          subtitle="Email → 6-digit code → name + diabetes type" />
      </Sequence>

      <Sequence from={sceneStarts.scan} durationInFrames={sceneDurations.scan}>
        <StepScene audio="audio/howto-short/04-scan.mp3"
          screenshot="assets/howto-short/scan.png"
          step={3} title="Scan"
          subtitle="Take a fundus photo. AI grades it in seconds." />
      </Sequence>

      <Sequence from={sceneStarts.result} durationInFrames={sceneDurations.result}>
        <StepScene audio="audio/howto-short/05-result.mp3"
          screenshot="assets/howto-short/result.png"
          step={4} title="See your result"
          subtitle="Plain language + recommendations + follow-up" />
      </Sequence>

      <Sequence from={sceneStarts.glucose} durationInFrames={sceneDurations.glucose}>
        <StepScene audio="audio/howto-short/06-glucose.mp3"
          screenshot="assets/howto-short/glucose.png"
          step={5} title="Track glucose"
          subtitle="Log, edit, delete. See trends. Cloud-synced." />
      </Sequence>

      <Sequence from={sceneStarts.chat} durationInFrames={sceneDurations.chat}>
        <StepScene audio="audio/howto-short/07-chat.mp3"
          screenshot="assets/howto-short/chat.png"
          step={6} title="Ask the chatbot"
          subtitle="English / Hindi / Kannada. India-aware." />
      </Sequence>

      <Sequence from={sceneStarts.cta} durationInFrames={sceneDurations.cta}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};

export const HOWTO_SHORT_TOTAL_FRAMES = TOTAL_FRAMES;

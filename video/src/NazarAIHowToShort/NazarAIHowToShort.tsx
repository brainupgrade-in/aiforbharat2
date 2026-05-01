import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Img, staticFile, Audio } from "remotion";

const FPS = 30;

// Audio durations (measured from the rendered MP3s in public/audio/howto-short/).
// Pad each by 0.4s so the next scene's voiceover doesn't bump into the previous.
const S = (sec: number) => Math.ceil((sec + 0.4) * FPS);

const sceneDurations = {
  hook:   S(6.96),   // 01-hook.mp3
  open:   S(7.34),   // 02-open.mp3
  signin: S(6.82),   // 03-signin.mp3
  scan:   S(7.92),   // 04-scan.mp3
  track:  S(7.78),   // 05-track.mp3
  cta:    S(5.62 + 0.6),   // 06-cta.mp3 + extra hold-frame fade-out
};

let cumulative = 0;
const sceneStarts: Record<keyof typeof sceneDurations, number> = {
  hook: 0, open: 0, signin: 0, scan: 0, track: 0, cta: 0,
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
const IVORY = "#FAF7F2";
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

// Phone-shaped frame containing a screenshot. Designed for the vertical Short:
// occupies the upper ~65% of the 1920-tall canvas, leaves room for caption below.
const PhoneScreenshot: React.FC<{ src: string; delay?: number; scale?: number }> = ({ src, delay = 0, scale: targetScale = 1 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame - delay, [0, 22], [0.92, targetScale], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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

// Step badge ("Step 1 of 4") + caption block, anchored to the lower portion of the frame.
const StepCaption: React.FC<{ stepNum: number; title: string; subtitle?: string; accent?: string; delay?: number }> = ({
  stepNum, title, subtitle, accent = AMBER, delay = 6,
}) => {
  return (
    <FadeIn delay={delay}>
      <div style={{ textAlign: "center", padding: "0 60px" }}>
        <div style={{
          display: "inline-block", padding: "10px 28px", borderRadius: 999,
          background: accent, color: INK, fontWeight: 800, fontSize: 32,
          letterSpacing: "0.05em", marginBottom: 24,
        }}>
          STEP {stepNum} OF 4
        </div>
        <h2 style={{
          color: "#fff", fontSize: 84, fontWeight: 900, lineHeight: 1.05,
          margin: "0 0 18px", textShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}>{title}</h2>
        {subtitle && (
          <p style={{
            color: "rgba(255,255,255,0.85)", fontSize: 36, fontWeight: 500,
            lineHeight: 1.3, margin: 0,
          }}>{subtitle}</p>
        )}
      </div>
    </FadeIn>
  );
};

// ── Scenes ──────────────────────────────────────────────────────────────────

const SceneBg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${TEAL_DEEP} 0%, ${TEAL} 50%, ${TEAL_DEEP} 100%)` }}>
    {/* subtle radial glow behind the phone */}
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 35%, rgba(245,166,35,0.18) 0%, transparent 55%)`,
    }} />
    {children}
  </AbsoluteFill>
);

// S1: Hook — text only, animated eye SVG
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
          <p style={{ color: AMBER, fontSize: 44, fontWeight: 700, marginTop: 50, letterSpacing: "0.08em" }}>
            FREE • 30-SECOND SCAN
          </p>
        </FadeIn>
        <FadeIn delay={80}>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 36, marginTop: 30, textAlign: "center", maxWidth: 800 }}>
            AI screening for diabetic retinopathy
          </p>
        </FadeIn>
      </AbsoluteFill>
    </SceneBg>
  );
};

const StepScene: React.FC<{
  audio: string; screenshot: string; stepNum: number; title: string; subtitle?: string;
}> = ({ audio, screenshot, stepNum, title, subtitle }) => (
  <SceneBg>
    <Audio src={staticFile(audio)} />
    <AbsoluteFill style={{ flexDirection: "column", padding: "100px 40px 80px", alignItems: "center", justifyContent: "space-between" }}>
      <PhoneScreenshot src={screenshot} />
      <StepCaption stepNum={stepNum} title={title} subtitle={subtitle} />
    </AbsoluteFill>
  </SceneBg>
);

// S5: Track + chat — show two phones side by side at slightly smaller scale
const TrackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <SceneBg>
      <Audio src={staticFile("audio/howto-short/05-track.mp3")} />
      <AbsoluteFill style={{ flexDirection: "column", padding: "80px 0 60px", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ opacity: op, display: "flex", gap: 30, justifyContent: "center", alignItems: "center" }}>
          <div style={{
            width: 460, height: 920, borderRadius: 42, overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.55)", border: "10px solid #1a1a1a",
            transform: "rotate(-6deg) translateX(20px)", background: "#000",
          }}>
            <Img src={staticFile("assets/05-glucose.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </div>
          <div style={{
            width: 460, height: 920, borderRadius: 42, overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.55)", border: "10px solid #1a1a1a",
            transform: "rotate(6deg) translateX(-20px)", background: "#000",
          }}>
            <Img src={staticFile("assets/04-chat.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </div>
        </div>
        <FadeIn delay={20}>
          <div style={{ textAlign: "center", padding: "0 60px" }}>
            <div style={{
              display: "inline-block", padding: "10px 28px", borderRadius: 999,
              background: AMBER, color: INK, fontWeight: 800, fontSize: 32,
              letterSpacing: "0.05em", marginBottom: 24,
            }}>STEP 4 OF 4</div>
            <h2 style={{ color: "#fff", fontSize: 76, fontWeight: 900, lineHeight: 1.05, margin: "0 0 18px" }}>
              Track + Ask
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 34, lineHeight: 1.3, margin: 0 }}>
              Glucose log + AI advisor<br />in English / Hindi / Kannada
            </p>
          </div>
        </FadeIn>
      </AbsoluteFill>
    </SceneBg>
  );
};

// S6: CTA — big URL, brand
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${INK} 0%, ${TEAL_DEEP} 100%)` }}>
      <Audio src={staticFile("audio/howto-short/06-cta.mp3")} />
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
            fontSize: 60, fontWeight: 900, boxShadow: "0 20px 60px rgba(245,166,35,0.4)",
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
        <StepScene
          audio="audio/howto-short/02-open.mp3"
          screenshot="assets/01-auth-screen.png"
          stepNum={1}
          title="Open the app"
          subtitle="nazarai.gheware-ai.com — any browser"
        />
      </Sequence>
      <Sequence from={sceneStarts.signin} durationInFrames={sceneDurations.signin}>
        <StepScene
          audio="audio/howto-short/03-signin.mp3"
          screenshot="assets/01-auth-screen.png"
          stepNum={2}
          title="Sign in"
          subtitle="Email → 6-digit code → name + diabetes type"
        />
      </Sequence>
      <Sequence from={sceneStarts.scan} durationInFrames={sceneDurations.scan}>
        <StepScene
          audio="audio/howto-short/04-scan.mp3"
          screenshot="assets/03-scan.png"
          stepNum={3}
          title="Scan"
          subtitle="Take a fundus photo. AI grades in seconds."
        />
      </Sequence>
      <Sequence from={sceneStarts.track} durationInFrames={sceneDurations.track}>
        <TrackScene />
      </Sequence>
      <Sequence from={sceneStarts.cta} durationInFrames={sceneDurations.cta}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};

export const HOWTO_SHORT_TOTAL_FRAMES = TOTAL_FRAMES;

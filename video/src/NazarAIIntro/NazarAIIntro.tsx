import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Img, staticFile, Audio } from "remotion";

const FPS = 30;

// Audio-driven timing (from timing.json + 0.6s gaps between scenes)
// Each scene duration = audio duration + 1s padding for transitions
const sceneDurations = {
    problem:      Math.ceil((21.9 + 1) * FPS),   // ~687
    intro:        Math.ceil((17.8 + 1) * FPS),   // ~564
    drScreening:  Math.ceil((21.2 + 1) * FPS),   // ~666
    chatbot:      Math.ceil((18.6 + 1) * FPS),   // ~588
    glucose:      Math.ceil((11.4 + 1) * FPS),   // ~372
    community:    Math.ceil((13.0 + 1) * FPS),   // ~420
    architecture: Math.ceil((20.6 + 1) * FPS),   // ~648
    impact:       Math.ceil((20.9 + 1) * FPS),   // ~657
    closing:      Math.ceil((7.4 + 2) * FPS),    // ~282 (extra padding for ending)
};

// Calculate cumulative starts
const sceneStarts = {
    problem: 0,
    intro: 0,
    drScreening: 0,
    chatbot: 0,
    glucose: 0,
    community: 0,
    architecture: 0,
    impact: 0,
    closing: 0,
};
let cumulative = 0;
for (const key of Object.keys(sceneDurations) as (keyof typeof sceneDurations)[]) {
    sceneStarts[key] = cumulative;
    cumulative += sceneDurations[key];
}
const TOTAL_FRAMES = cumulative;

// Colors from Nazar AI design system
const TEAL = "#0D9488";
const TEAL_DARK = "#0F766E";
const AMBER = "#F59E0B";
const BG_CREAM = "#FEFCE8";
const BG_DARK = "#134E4A";

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; duration?: number }> = ({
    children, delay = 0, duration = 15
}) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame - delay, [0, duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const y = interpolate(frame - delay, [0, duration], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>;
};

const PhoneFrame: React.FC<{ src: string; delay?: number }> = ({ src, delay = 0 }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const scale = interpolate(frame - delay, [0, 20], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
        <div style={{
            opacity,
            transform: `scale(${scale})`,
            borderRadius: 40,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
            border: "4px solid #333",
            width: 360,
            height: 780,
            background: "#000",
        }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
    );
};

// Scene 1: The Problem
const Scene1Problem: React.FC = () => {
    const stats = [
        { value: "89.8M", label: "Diabetics in India", delay: 15 },
        { value: "43%", label: "Undiagnosed", delay: 30 },
        { value: "80%", label: "Doctors in Urban Areas", delay: 45 },
        { value: "20L+", label: "Healthcare Worker Shortage", delay: 60 },
    ];
    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${BG_DARK} 0%, #1a1a2e 100%)`, padding: 80 }}>
            <Audio src={staticFile("audio/scenes/01-problem.mp3")} />
            <FadeIn>
                <h1 style={{ fontSize: 64, color: "#fff", fontWeight: 800, textAlign: "center", margin: 0 }}>
                    India's Diabetes Crisis
                </h1>
            </FadeIn>
            <div style={{ display: "flex", justifyContent: "center", gap: 60, marginTop: 80 }}>
                {stats.map((s, i) => (
                    <FadeIn key={i} delay={s.delay}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 96, fontWeight: 900, color: AMBER }}>{s.value}</div>
                            <div style={{ fontSize: 28, color: "#ccc", marginTop: 10, maxWidth: 250 }}>{s.label}</div>
                        </div>
                    </FadeIn>
                ))}
            </div>
            <FadeIn delay={90}>
                <p style={{
                    fontSize: 36, color: "#e0e0e0", textAlign: "center", marginTop: 80,
                    lineHeight: 1.6, maxWidth: 1200, marginLeft: "auto", marginRight: "auto"
                }}>
                    Preventable blindness from diabetic retinopathy steals sight
                    <br />because screening comes too late.
                </p>
            </FadeIn>
        </AbsoluteFill>
    );
};

// Scene 2: Introducing Nazar AI
const Scene2Intro: React.FC = () => {
    const frame = useCurrentFrame();
    const logoScale = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
    const logoRotate = interpolate(frame, [0, 30], [180, 0], { extrapolateRight: "clamp" });
    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`, padding: 80 }}>
            <Audio src={staticFile("audio/scenes/02-intro.mp3")} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{
                        fontSize: 140, transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
                        marginBottom: 20
                    }}>
                        👁️
                    </div>
                    <FadeIn delay={20}>
                        <h1 style={{ fontSize: 96, color: "#fff", fontWeight: 900, margin: 0 }}>
                            Nazar AI
                        </h1>
                    </FadeIn>
                    <FadeIn delay={35}>
                        <h2 style={{ fontSize: 48, color: AMBER, fontWeight: 600, margin: "10px 0" }}>
                            नज़र AI — Your Eyes, Our Focus
                        </h2>
                    </FadeIn>
                    <FadeIn delay={50}>
                        <p style={{ fontSize: 32, color: "#e0f2f1", marginTop: 30 }}>
                            Mobile-first PWA • AI-powered • English + Hindi + Kannada
                        </p>
                    </FadeIn>
                </div>
                <FadeIn delay={30}>
                    <PhoneFrame src="assets/01-auth-screen.png" delay={30} />
                </FadeIn>
            </div>
        </AbsoluteFill>
    );
};

// Scene 3a: DR Screening
const Scene3aDRScreening: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: BG_CREAM, padding: 80 }}>
            <Audio src={staticFile("audio/scenes/03-dr-screening.mp3")} />
            <div style={{ display: "flex", alignItems: "center", height: "100%", gap: 80 }}>
                <div style={{ flex: 1 }}>
                    <FadeIn>
                        <div style={{ fontSize: 24, color: TEAL, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
                            Feature 1
                        </div>
                    </FadeIn>
                    <FadeIn delay={10}>
                        <h2 style={{ fontSize: 56, color: BG_DARK, fontWeight: 800, margin: "15px 0" }}>
                            AI Diabetic Retinopathy Screening
                        </h2>
                    </FadeIn>
                    <FadeIn delay={25}>
                        <ul style={{ fontSize: 30, color: "#555", lineHeight: 2, listStyle: "none", padding: 0 }}>
                            <li>📸 Smartphone fundus photo capture</li>
                            <li>🤖 AI analysis via Amazon Rekognition</li>
                            <li>🌸 Lotus petal severity indicator (0-4)</li>
                            <li>📍 GPS-based nearby doctor referral</li>
                            <li>📱 WhatsApp sharing for follow-up</li>
                        </ul>
                    </FadeIn>
                    <FadeIn delay={40}>
                        <div style={{
                            background: TEAL, color: "#fff", padding: "15px 30px",
                            borderRadius: 12, fontSize: 28, display: "inline-block", marginTop: 20
                        }}>
                            92%+ sensitivity • 88%+ specificity
                        </div>
                    </FadeIn>
                </div>
                <PhoneFrame src="assets/03-scan.png" delay={15} />
            </div>
        </AbsoluteFill>
    );
};

// Scene 3b: AI Chatbot
const Scene3bChatbot: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, #1a1a2e 0%, ${BG_DARK} 100%)`, padding: 80 }}>
            <Audio src={staticFile("audio/scenes/04-chatbot.mp3")} />
            <div style={{ display: "flex", alignItems: "center", height: "100%", gap: 80 }}>
                <PhoneFrame src="assets/04-chat.png" delay={10} />
                <div style={{ flex: 1 }}>
                    <FadeIn>
                        <div style={{ fontSize: 24, color: AMBER, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
                            Feature 2
                        </div>
                    </FadeIn>
                    <FadeIn delay={10}>
                        <h2 style={{ fontSize: 56, color: "#fff", fontWeight: 800, margin: "15px 0" }}>
                            AI Diabetes Advisor
                        </h2>
                    </FadeIn>
                    <FadeIn delay={20}>
                        <h3 style={{ fontSize: 32, color: AMBER, margin: "10px 0" }}>
                            Powered by Amazon Bedrock Nova Micro
                        </h3>
                    </FadeIn>
                    <FadeIn delay={30}>
                        <ul style={{ fontSize: 30, color: "#ccc", lineHeight: 2, listStyle: "none", padding: 0 }}>
                            <li>💬 24/7 personalized diabetes guidance</li>
                            <li>🇮🇳 Hindi, English, Kannada support</li>
                            <li>🍛 Indian dietary patterns awareness</li>
                            <li>💊 Local medication knowledge</li>
                            <li>⚡ {"<"}2 second response time</li>
                        </ul>
                    </FadeIn>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// Scene 3c: Glucose Tracker
const Scene3cGlucose: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: BG_CREAM, padding: 80 }}>
            <Audio src={staticFile("audio/scenes/05-glucose.mp3")} />
            <div style={{ display: "flex", alignItems: "center", height: "100%", gap: 80 }}>
                <div style={{ flex: 1 }}>
                    <FadeIn>
                        <div style={{ fontSize: 24, color: TEAL, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
                            Feature 3
                        </div>
                    </FadeIn>
                    <FadeIn delay={10}>
                        <h2 style={{ fontSize: 56, color: BG_DARK, fontWeight: 800, margin: "15px 0" }}>
                            Smart Glucose Tracker
                        </h2>
                    </FadeIn>
                    <FadeIn delay={25}>
                        <ul style={{ fontSize: 30, color: "#555", lineHeight: 2, listStyle: "none", padding: 0 }}>
                            <li>📊 Manual glucose logging</li>
                            <li>📈 7-day trend visualization</li>
                            <li>🔔 Pattern-based alerts</li>
                            <li>☁️ Real-time DynamoDB sync</li>
                        </ul>
                    </FadeIn>
                </div>
                <div style={{ display: "flex", gap: 30 }}>
                    <PhoneFrame src="assets/05-glucose.png" delay={10} />
                    <PhoneFrame src="assets/02-home.png" delay={25} />
                </div>
            </div>
        </AbsoluteFill>
    );
};

// Scene 3d: Community Dashboard
const Scene3dCommunity: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${TEAL_DARK} 0%, #1a1a2e 100%)`, padding: 80 }}>
            <Audio src={staticFile("audio/scenes/06-community.mp3")} />
            <div style={{ display: "flex", alignItems: "center", height: "100%", gap: 80 }}>
                <PhoneFrame src="assets/06-community.png" delay={10} />
                <div style={{ flex: 1 }}>
                    <FadeIn>
                        <div style={{ fontSize: 24, color: AMBER, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
                            Feature 4
                        </div>
                    </FadeIn>
                    <FadeIn delay={10}>
                        <h2 style={{ fontSize: 56, color: "#fff", fontWeight: 800, margin: "15px 0" }}>
                            Community Impact Dashboard
                        </h2>
                    </FadeIn>
                    <FadeIn delay={25}>
                        <ul style={{ fontSize: 30, color: "#ccc", lineHeight: 2, listStyle: "none", padding: 0 }}>
                            <li>🗺️ State-wise screening adoption</li>
                            <li>📊 2,23,030 screenings across 28 states</li>
                            <li>🏆 Success stories from real patients</li>
                            <li>🌾 India's first crowdsourced DR prevention network</li>
                        </ul>
                    </FadeIn>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// Scene 4: Architecture
const Scene4Architecture: React.FC = () => {
    const services = [
        "React 18 + Vite", "AWS Amplify Gen 2", "Amazon Cognito",
        "DynamoDB + AppSync", "Amazon Bedrock", "Rekognition Custom Labels",
        "Lambda", "S3 Storage", "CloudFront CDN"
    ];
    return (
        <AbsoluteFill style={{ background: "#0f172a", padding: 80 }}>
            <Audio src={staticFile("audio/scenes/07-architecture.mp3")} />
            <FadeIn>
                <h2 style={{ fontSize: 56, color: "#fff", fontWeight: 800, textAlign: "center", margin: "0 0 20px" }}>
                    Built on AWS — Deployed in Mumbai (ap-south-1)
                </h2>
            </FadeIn>
            <div style={{ display: "flex", alignItems: "center", height: "75%", gap: 60 }}>
                <FadeIn delay={15}>
                    <div style={{
                        borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                        width: 900, height: 550
                    }}>
                        <Img src={staticFile("assets/technical-architecture.png")}
                            style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff" }} />
                    </div>
                </FadeIn>
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 15 }}>
                        {services.map((s, i) => (
                            <FadeIn key={i} delay={20 + i * 8}>
                                <div style={{
                                    background: "rgba(13,148,136,0.3)", border: `2px solid ${TEAL}`,
                                    borderRadius: 12, padding: "12px 24px", fontSize: 24, color: "#fff",
                                    fontWeight: 600
                                }}>
                                    {s}
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                    <FadeIn delay={100}>
                        <div style={{
                            background: AMBER, color: "#000", padding: "15px 30px",
                            borderRadius: 12, fontSize: 28, fontWeight: 700, marginTop: 30,
                            display: "inline-block"
                        }}>
                            14/14 E2E Tests Passing ✓
                        </div>
                    </FadeIn>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// Scene 5: Impact
const Scene5Impact: React.FC = () => {
    const impacts = [
        { icon: "👁️", value: "90%", label: "DR blindness preventable" },
        { icon: "🏥", value: "500+", label: "DR cases detected Year 1" },
        { icon: "🏘️", value: "1,000+", label: "Villages reached" },
        { icon: "💰", value: "₹2-3L Cr", label: "Complication costs saved" },
        { icon: "🌐", value: "225M", label: "Total addressable market" },
    ];
    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${BG_DARK} 0%, #0f172a 100%)`, padding: 80 }}>
            <Audio src={staticFile("audio/scenes/08-impact.mp3")} />
            <FadeIn>
                <h2 style={{ fontSize: 56, color: "#fff", fontWeight: 800, textAlign: "center", margin: 0 }}>
                    Impact & Vision
                </h2>
            </FadeIn>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 60 }}>
                {impacts.map((item, i) => (
                    <FadeIn key={i} delay={15 + i * 15}>
                        <div style={{
                            background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "40px 35px",
                            textAlign: "center", width: 280, border: "1px solid rgba(255,255,255,0.15)"
                        }}>
                            <div style={{ fontSize: 64 }}>{item.icon}</div>
                            <div style={{ fontSize: 56, fontWeight: 900, color: AMBER, margin: "15px 0" }}>{item.value}</div>
                            <div style={{ fontSize: 24, color: "#ccc" }}>{item.label}</div>
                        </div>
                    </FadeIn>
                ))}
            </div>
            <FadeIn delay={100}>
                <div style={{ textAlign: "center", marginTop: 50 }}>
                    <h3 style={{ fontSize: 36, color: TEAL, fontWeight: 700 }}>
                        Phase 2: CGM Integration • More Languages • ABDM Compatibility
                    </h3>
                </div>
            </FadeIn>
        </AbsoluteFill>
    );
};

// Scene 6: Closing
const Scene6Closing: React.FC = () => {
    const frame = useCurrentFrame();
    const pulse = Math.sin(frame * 0.1) * 5;
    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`, padding: 80 }}>
            <Audio src={staticFile("audio/scenes/09-closing.mp3")} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <FadeIn>
                    <div style={{ fontSize: 100 }}>👁️</div>
                </FadeIn>
                <FadeIn delay={10}>
                    <h1 style={{ fontSize: 96, color: "#fff", fontWeight: 900, margin: "10px 0" }}>Nazar AI</h1>
                </FadeIn>
                <FadeIn delay={20}>
                    <h2 style={{ fontSize: 40, color: AMBER, margin: "10px 0" }}>नज़र AI — Your Eyes, Our Focus</h2>
                </FadeIn>
                <FadeIn delay={35}>
                    <div style={{
                        background: "#fff", color: BG_DARK, padding: "20px 50px",
                        borderRadius: 16, fontSize: 32, fontWeight: 700, marginTop: 30,
                        transform: `scale(${1 + pulse * 0.005})`,
                    }}>
                        🔗 main.d3vwqyp1h0elbo.amplifyapp.com
                    </div>
                </FadeIn>
                <FadeIn delay={50}>
                    <div style={{ marginTop: 40, textAlign: "center" }}>
                        <p style={{ fontSize: 36, color: "#e0f2f1", fontWeight: 600 }}>Team TheHealthGheware</p>
                        <p style={{ fontSize: 28, color: "#b2dfdb" }}>Built for Bharat, Powered by AWS</p>
                    </div>
                </FadeIn>
            </div>
        </AbsoluteFill>
    );
};

// Main composition
export const NazarAIIntro: React.FC = () => {
    return (
        <AbsoluteFill style={{ fontFamily: "'Baloo 2', 'Noto Sans', system-ui, sans-serif" }}>
            <Sequence from={sceneStarts.problem} durationInFrames={sceneDurations.problem}>
                <Scene1Problem />
            </Sequence>
            <Sequence from={sceneStarts.intro} durationInFrames={sceneDurations.intro}>
                <Scene2Intro />
            </Sequence>
            <Sequence from={sceneStarts.drScreening} durationInFrames={sceneDurations.drScreening}>
                <Scene3aDRScreening />
            </Sequence>
            <Sequence from={sceneStarts.chatbot} durationInFrames={sceneDurations.chatbot}>
                <Scene3bChatbot />
            </Sequence>
            <Sequence from={sceneStarts.glucose} durationInFrames={sceneDurations.glucose}>
                <Scene3cGlucose />
            </Sequence>
            <Sequence from={sceneStarts.community} durationInFrames={sceneDurations.community}>
                <Scene3dCommunity />
            </Sequence>
            <Sequence from={sceneStarts.architecture} durationInFrames={sceneDurations.architecture}>
                <Scene4Architecture />
            </Sequence>
            <Sequence from={sceneStarts.impact} durationInFrames={sceneDurations.impact}>
                <Scene5Impact />
            </Sequence>
            <Sequence from={sceneStarts.closing} durationInFrames={sceneDurations.closing}>
                <Scene6Closing />
            </Sequence>
        </AbsoluteFill>
    );
};

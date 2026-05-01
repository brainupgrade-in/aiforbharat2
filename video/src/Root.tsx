import { Composition } from "remotion";
import { NazarAIIntro } from "./NazarAIIntro/NazarAIIntro";
import { NazarAIHowToShort, HOWTO_SHORT_TOTAL_FRAMES } from "./NazarAIHowToShort/NazarAIHowToShort";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="NazarAIIntro"
                component={NazarAIIntro}
                durationInFrames={165 * 30} // ~165 seconds (~2:45) at 30fps
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{}}
            />
            <Composition
                id="NazarAIHowToShort"
                component={NazarAIHowToShort}
                durationInFrames={HOWTO_SHORT_TOTAL_FRAMES}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{}}
            />
        </>
    );
};

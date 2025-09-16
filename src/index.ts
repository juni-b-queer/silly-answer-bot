import {LieDetectorHandler} from "./handler/LieDetectorHandler.ts";
import {
    DebugLog, GoodAndBadBotHandler,
    HandlerAgent,
    JetstreamSubscription,
} from "bsky-event-handlers";
import {MagicEightBallHandler} from "./handler/MagicEightBall.ts";


const lieDetectorHandlerAgent = new HandlerAgent(
    'lie-detector-bot',
    <string>Bun.env.LIE_BOT_BSKY_HANDLE,
    <string>Bun.env.LIE_BOT_BSKY_PASSWORD
);

const magic8BallHandlerAgent = new HandlerAgent(
    'magic-eight-ball-bot',
    <string>Bun.env.MAGIC_BOT_BSKY_HANDLE,
    <string>Bun.env.MAGIC_BOT_BSKY_PASSWORD
);

let jetstreamSubscription: JetstreamSubscription;

let handlers = {
    post: {
        c: [
            new LieDetectorHandler(lieDetectorHandlerAgent),
            GoodAndBadBotHandler.make(lieDetectorHandlerAgent),

            new MagicEightBallHandler(magic8BallHandlerAgent),
            GoodAndBadBotHandler.make(magic8BallHandlerAgent),

        ]
    },
}

async function initialize() {
    await lieDetectorHandlerAgent.authenticate()
    await magic8BallHandlerAgent.authenticate()
    DebugLog.info("INIT", 'Initialized!')

    jetstreamSubscription = new JetstreamSubscription(
        handlers,
        <string>Bun.env.JETSTREAM_URL
    );

}

initialize().then(() => {
    jetstreamSubscription.createSubscription()
});
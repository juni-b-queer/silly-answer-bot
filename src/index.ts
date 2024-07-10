import {LieDetectorHandler} from "./handler/LieDetectorHandler.ts";
import {
    AbstractHandler,
    BadBotHandler, CreateSkeetAction,
    DebugLog,
    GoodBotHandler,
    HandlerAgent,
    IntervalSubscription, IntervalSubscriptionHandlers, IsFourTwentyValidator, IsSpecifiedTimeValidator,
    JetstreamSubscription, LogInputTextAction
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

const isItFourTwentyHandlerAgent = new HandlerAgent(
    'is-it-four-twenty-bot',
    <string>Bun.env.IS_IT_FOUR_TWENTY_BSKY_HANDLE,
    <string>Bun.env.IS_IT_FOUR_TWENTY_BSKY_PASSWORD
);

let jetstreamSubscription: JetstreamSubscription;

let handlers = {
    post: {
        c: [
            new LieDetectorHandler(lieDetectorHandlerAgent),
            new MagicEightBallHandler(magic8BallHandlerAgent),
            GoodBotHandler.make(isItFourTwentyHandlerAgent),
            BadBotHandler.make(isItFourTwentyHandlerAgent)
        ]
    },
}

let intervalSubscription: IntervalSubscription;

const intervalSubscriptionHandlers: IntervalSubscriptionHandlers = [
    {
        intervalSeconds: 60,
        handlers:[
            new AbstractHandler(
                [IsFourTwentyValidator.make()],
                [
                    LogInputTextAction.make("Is 4:20"),
                    CreateSkeetAction.make("It's 4:20 somewhere!")
                ],
                isItFourTwentyHandlerAgent),
            new AbstractHandler(
                [IsSpecifiedTimeValidator.make("04:21", "16:21")],
                [
                    CreateSkeetAction.make("It's no longer 4:20 anywhere :(")
                ],
                isItFourTwentyHandlerAgent)
        ]
    }
]

async function initialize() {
    await lieDetectorHandlerAgent.authenticate()
    await magic8BallHandlerAgent.authenticate()
    await isItFourTwentyHandlerAgent.authenticate()
    DebugLog.info("INIT", 'Initialized!')

    jetstreamSubscription = new JetstreamSubscription(
        handlers,
        <string>Bun.env.JETSTREAM_URL
    );
    intervalSubscription = new IntervalSubscription(
        intervalSubscriptionHandlers
    )
}

initialize().then(() => {
    jetstreamSubscription.createSubscription()
    intervalSubscription.createSubscription()
});
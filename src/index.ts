import {LieDetectorHandler} from "./handler/LieDetectorHandler.ts";
import {
    AbstractHandler,
    BadBotHandler,
    CreateSkeetAction,
    DebugLog,
    GoodBotHandler,
    HandlerAgent,
    IntervalSubscription,
    IntervalSubscriptionHandlers,
    IsFourTwentyValidator,
    IsSpecifiedTimeValidator,
    JetstreamSubscription,
    LogInputTextAction
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
            BadBotHandler.make(isItFourTwentyHandlerAgent),
            // MessageHandler.make(
            //     [
            //         // Command !notify420
            //         InputIsCommandValidator.make("notify420", true)
            //     ],
            //     [
            //         CreateLikeAction.make(
            //             MessageHandler.getUriFromMessage,
            //             MessageHandler.getCidFromMessage
            //         ),
            //         CreateSkeetAction.make(
            //             (handerAgent: HandlerAgent, message: CreateSkeetMessage): string => {
            //                 const messageText = message.record.text;
            //                 // Attempt to parse timezone from message
            //                 let replyTimezone = "America/Chicago"
            //
            //                 const fourtwentyAm = (4*60)+20
            //                 const fourtwentyPm = (16*60)+20
            //
            //                 const allTimezones = moment.tz.names();
            //
            //                 allTimezones.forEach((timezone) => {
            //                     if(messageText?.toLowerCase().includes(timezone.toLowerCase())){
            //                         replyTimezone = timezone;
            //                     }
            //                 });
            //
            //                 //determine if its am or pm and what timezone
            //                 let now = moment.tz(replyTimezone);
            //
            //                 let msm = now.minute()+(60*now.hour())
            //                 while(msm != fourtwentyAm && msm != fourtwentyPm){
            //                     now.add(1, 'minutes')
            //                     msm = now.minute()+(60*now.hour())
            //                 }
            //                 DebugLog.warn('NOTIFY420', `text: ${messageText} -- replied: !remindme ${now.toISOString()}`)
            //                 return `!remindme ${now.toISOString()}`;
            //             },
            //             MessageHandler.generateReplyFromMessage
            //         ),
            //     ],
            //     isItFourTwentyHandlerAgent
            // )
        ]
    },
}

let intervalSubscription: IntervalSubscription;

const intervalSubscriptionHandlers: IntervalSubscriptionHandlers = [
    {
        intervalSeconds: 60,
        handlers: [
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
import {LieDetectorHandler} from "./handler/LieDetectorHandler.ts";
import {
    HandlerController,
    FirehoseSubscription,
    AgentDetails,
    authenticateAgent,
    createAgent,
    debugLog, GoodBotHandler, BadBotHandler
} from "bsky-event-handlers";
import {MagicEightBallHandler} from "./handler/MagicEightBall.ts";

let lieDetectorAgentDetails: AgentDetails = {
    name: "silly-reply-bot",
    did: undefined,
    handle: <string>Bun.env.BOT_BSKY_HANDLE,
    password: <string>Bun.env.BOT_BSKY_PASSWORD,
    sessionData: undefined,
    agent: undefined
}
lieDetectorAgentDetails = createAgent(lieDetectorAgentDetails)

let lieDetectorHandlerController: HandlerController;


async function initialize() {

    lieDetectorAgentDetails = await authenticateAgent(lieDetectorAgentDetails)

    lieDetectorHandlerController = new HandlerController(lieDetectorAgentDetails, [
        LieDetectorHandler,
        MagicEightBallHandler,
        new GoodBotHandler(),
        new BadBotHandler()
        // TestHandler
    ], false)

    debugLog("INIT", 'Initialized!', 'warn')
}

try {
    await initialize();
} catch (e) {
    setTimeout(async function () {
        await initialize()
    }, 30000)
}


const firehoseSubscription = new FirehoseSubscription(
    [lieDetectorHandlerController],
    150
);


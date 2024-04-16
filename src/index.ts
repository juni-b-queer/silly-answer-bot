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

let magic8BallAgentDetails: AgentDetails = {
    name: "8-ball-bot",
    did: undefined,
    handle: <string>Bun.env.MAGIC_BOT_BSKY_HANDLE,
    password: <string>Bun.env.MAGIC_BOT_BSKY_PASSWORD,
    sessionData: undefined,
    agent: undefined
}

let lieDetectorAgentDetails: AgentDetails = {
    name: "lie-detector-bot",
    did: undefined,
    handle: <string>Bun.env.LIE_BOT_BSKY_HANDLE,
    password: <string>Bun.env.LIE_BOT_BSKY_PASSWORD,
    sessionData: undefined,
    agent: undefined
}
magic8BallAgentDetails = createAgent(magic8BallAgentDetails)
lieDetectorAgentDetails = createAgent(lieDetectorAgentDetails)

let lieDetectorHandlerController: HandlerController;
let magic8BallHandlerController: HandlerController;


async function initialize() {

    console.log("Initializing");
    lieDetectorAgentDetails = await authenticateAgent(lieDetectorAgentDetails)
    magic8BallAgentDetails = await authenticateAgent(magic8BallAgentDetails)

    lieDetectorHandlerController = new HandlerController(lieDetectorAgentDetails, [
        LieDetectorHandler,
        new GoodBotHandler(),
        new BadBotHandler()
        // TestHandler
    ], false)

    magic8BallHandlerController = new HandlerController(magic8BallAgentDetails, [
        MagicEightBallHandler,
        new GoodBotHandler(),
        new BadBotHandler()
        // TestHandler
    ], false)


    debugLog("INIT", 'Initialized!', 'warn')
}

try {
    console.log("starting")
    await initialize();
} catch (e) {
    setTimeout(async function () {
        await initialize()
    }, 30000)
}


const firehoseSubscription = new FirehoseSubscription(
    [lieDetectorHandlerController, magic8BallHandlerController],
    300
);


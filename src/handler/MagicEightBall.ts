import {
    InputIsCommandValidator,
    ReplyToSkeetWithGeneratedTextAction,
    LogInputTextAction,
    CreateSkeetHandler,
    HandlerAgent,
    CreateSkeetMessage
} from "bsky-event-handlers";

const COMMAND = <string>Bun.env.MAGIC_BOT_COMMAND ?? "magic8ball"


export class MagicEightBallHandler extends CreateSkeetHandler{
    constructor(
        public handlerAgent: HandlerAgent,
    ) {
        super(
            [new InputIsCommandValidator(COMMAND, false)],
            [
                new ReplyToSkeetWithGeneratedTextAction(responseGenerator),
                new LogInputTextAction("magic 8 ball")
            ],
            handlerAgent,
        );
    }

    async handle(message: CreateSkeetMessage): Promise<void> {
        return super.handle(message);
    }
}

const RESPONSES = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes - definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];

export function responseGenerator(message: CreateSkeetMessage, handlerAgent: HandlerAgent): string {
    let responseIndex = Math.floor(Math.random() * RESPONSES.length);
    let response = RESPONSES[responseIndex];
    console.log(response)
    return response;
}
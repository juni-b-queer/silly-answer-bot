import {
    InputIsCommandValidator,
    ReplyToSkeetWithGeneratedTextAction,
    LogInputTextAction,
    CreateSkeetHandler,
    HandlerAgent,
    CreateSkeetMessage
} from "bsky-event-handlers";

const COMMAND = <string>Bun.env.LIE_DETECTOR_COMMAND ?? "liedetector"


export class LieDetectorHandler extends CreateSkeetHandler{
    constructor(
        public handlerAgent: HandlerAgent,
    ) {
        super(
            [new InputIsCommandValidator(COMMAND, false)],
            [
                new ReplyToSkeetWithGeneratedTextAction(responseGenerator),
                new LogInputTextAction("lie detector")
            ],
            handlerAgent,
        );
    }

    async handle(message: CreateSkeetMessage): Promise<void> {
        return super.handle(message);
    }
}

const TRUE_RESPONSES = [
    "The skeet holds true.",
    "The skeet is accurate.",
    "The skeet is factual.",
    "The skeet is genuine.",
    "The skeet is authentic.",
    "The skeet is verifiable.",
    "The skeet is correct.",
    "The skeet is valid.",
    "The skeet is reliable.",
    "The skeet is substantiated.",
    "The skeet is confirmed.",
    "The skeet is legitimate.",
    "The skeet is truthful.",
    "The skeet is dependable.",
    "The skeet is unquestionably true.",
    'The skeet holds truth.',
    'The skeet is accurate.',
    'The skeet is factual.',
    'The skeet is verifiable.',
    'The skeet is authentic.',
    'The skeet is reliable.',
    'The skeet is legitimate.',
    'The skeet is trustworthy.',
    'The skeet is valid.',
    'The skeet is substantiated.',
    'The skeet is corroborated.',
    'The skeet is supported by evidence.',
    'The skeet is confirmed.',
    'The skeet is undeniable.',
    'The skeet is unquestionable.',
    'The skeet is accurate to the facts.',
    'The skeet is truthful.',
    'The skeet is substantiated by evidence.',
    'The skeet is founded on truth.',
    'The skeet is grounded in reality.',
    'The skeet is based on verifiable information.',
    'The skeet is backed by credible sources.',
    'The skeet is authenticated.',
    'The skeet is confirmed to be true.',
    'The skeet is attested.',
    'The skeet is validated.',
    'The skeet is endorsed as true.',
    'The skeet is supported by data.',
    'The skeet is verified as correct.',
    'The skeet is affirmed to be accurate.'
]

const FALSE_RESPONSES = [
    "The skeet is untrue.",
    "The skeet is inaccurate.",
    "The skeet is misleading.",
    "The skeet is fabricated.",
    "The skeet is deceptive.",
    "The skeet is not genuine.",
    "The skeet is incorrect.",
    "The skeet is flawed.",
    "The skeet is unreliable.",
    "The skeet is unsubstantiated.",
    "The skeet is baseless.",
    "The skeet is a falsehood.",
    "The skeet is deceptive.",
    "The skeet is discredited.",
    "The skeet is unequivocally false.",
    "This skeet is built on misconceptions.",
    "The assertions made in this skeet are unfounded.",
    "The content of this skeet is deceptive and misleading.",
    "The skeet presents a distorted version of reality.",
    "This skeet is riddled with inaccuracies.",
    "The information provided here is false and misleading.",
    "The claims made in this skeet are without merit.",
    "The skeet is spreading misinformation.",
    "The content of this skeet is not credible.",
    "The skeet is filled with falsehoods.",
    "The information shared in this skeet is erroneous.",
    "This skeet lacks factual basis.",
    "The assertions in this skeet are not supported by evidence.",
    "This skeet is disseminating disinformation.",
    "The skeet is misleading its readership.",
    "The skeet contains misinformation.",
    "This skeet is inaccurate.",
    "The information shared is not true.",
    "The skeet disseminates falsehoods.",
    "There are inaccuracies in this skeet.",
    "This skeet is spreading fake news.",
    "The content of this skeet is deceptive.",
    "The skeet is based on false premises.",
    "The information provided is misleading.",
    "This skeet contains fabrications.",
    "The claims in this skeet are unsubstantiated.",
    "This skeet is not based on facts.",
    "The skeet is misleading its audience.",
    "The information shared in this skeet is untrue.",
    "The skeet lacks credibility."
]

export function responseGenerator(message: CreateSkeetMessage, handlerAgent: HandlerAgent): string {
    let response = ""
    let randomNumber = Math.floor(Math.random() * 2) + 1;


    if(randomNumber === 1){
        let responseIndex = Math.floor(Math.random() * TRUE_RESPONSES.length);
        response = TRUE_RESPONSES[responseIndex];
    }else{
        let responseIndex = Math.floor(Math.random() * FALSE_RESPONSES.length);
        response = FALSE_RESPONSES[responseIndex];
    }
    console.log(response)
    return response;
}
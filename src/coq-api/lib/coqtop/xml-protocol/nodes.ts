import {
    CoqValue,
    FeedbackContent,
    Location,
    LtacProfResults,
    LtacProfTactic,
    Message,
    MessageLevel,
    Pair,
    StateId,
    Subgoal,
    Union,
    UnionL,
    ValueReturn
} from "../coq-proto";
import {AnnotatedText} from "../../protocol";

export interface StateIdNode {
    $name: "state_id"
    $: { val: number },
    $children: {}[],
}

export interface EditIdNode {
    $name: "edit_id"
    $: { val: number }
    $children: {}[],
}

export interface IntNode {
    $name: "int",
    $: {},
    // $text: string
    $children: { [0]: string } & {}[],
}

export interface BoolNode {
    $name: "bool",
    $: { val: boolean | "true" | "false" }
    $children: {}[],
}

export interface StringNode {
    $name: "string",
    $: {},
    // $text: string
    $children: { [0]: string } & {}[],
}

export interface UnitNode {
    $name: "unit",
    $: {},
    $children: {}[],
}

export interface PairNode {
    $name: "pair",
    $: {},
    $children: { [0]: CoqValue, [1]: CoqValue } & void[]
}

export interface ListNode {
    $name: "list",
    $: {},
    $children: CoqValue[]
}

export interface UnionNode {
    $name: "union",
    $: { val: 'in_l' | 'in_r' },
    $children: CoqValue[],
}

export interface OptionSomeNode {
    $name: "option",
    $: { val: 'some' },
    $children: { [0]: CoqValue } & {}[],
}

export interface OptionNoneNode {
    $name: "option",
    $: { val: 'none' },
    $children: {}[],
}

export type OptionNode = OptionSomeNode | OptionNoneNode;


export interface OptionValueIntNode {
    $name: 'option_value',
    $: { val: 'intvalue' },
    option: number | null,
    $children: { [0]: number | null } & {}[],
}

export interface OptionValueStringOptNode {
    $name: 'option_value',
    $: { val: 'stringoptvalue' },
    option: string | null,
    $children: { [0]: string | null } & {}[],
}

export interface OptionValueBoolNode {
    $name: 'option_value',
    $: { val: 'boolvalue' },
    bool: boolean,
    $children: { [0]: boolean } & {}[],
}

export interface OptionValueStringNode {
    $name: 'option_value',
    $: { val: 'stringvalue' },
    $children: { [0]: string } & {}[],
}

export type OptionValueNode =
    OptionValueIntNode
    | OptionValueStringOptNode
    | OptionValueBoolNode
    | OptionValueStringNode;

export interface FeedbackNode {
    $name: 'feedback',
    $: { object: "state" | "edit", route: string },
    $children: { [0]: StateId, [1]: FeedbackContent } & {}[]
}

export interface WorkerStatusNode {
    $name: 'feedback_content',
    $kind: "workerstatus", // set for type narrowing
    $: { val: "workerstatus" },
    $children: { [0]: Pair<string, string> } & {}[],
}

export interface FileDependencyNode {
    $name: 'feedback_content',
    $kind: "filedependency", // set for type narrowing
    $: { val: "filedependency" },
    $children: { [0]: string | null, [1]: string } & {}[],
}

export interface FileLoadedNode {
    $name: 'feedback_content',
    $kind: "fileloaded", // set for type narrowing
    $: { val: "fileloaded" },
    $children: { [0]: string, [1]: string } & {}[],
}

export interface GlobReferenceNode {
    $name: 'feedback_content',
    $kind: "globref", // set for type narrowing
    $: { val: "globref" },
    $children: { [0]: Location, [1]: string, [2]: string, [3]: string, [4]: string } & {}[],
}

export interface GlobDefinitionNode {
    $name: 'feedback_content',
    $kind: "globdef", // set for type narrowing
    $: { val: "globdef" },
    $children: { [0]: Location, [1]: string, [2]: string, [3]: string } & {}[],
}

export interface MessageFeedbackNode {
    $name: 'feedback_content',
    $kind: "message", // set for type narrowing
    $: { val: "message" },
    $children: { [0]: Message } & {}[],
}

export interface SentenceStatusAddedAxiomNode {
    $name: 'feedback_content',
    $kind: "addedaxiom", // set for type narrowing
    $: { val: "addedaxiom" },
    $children: {}[],
}

export interface ErrorMessageNode {
    $name: 'feedback_content',
    $kind: "errormsg", // set for type narrowing
    $: { val: "errormsg" },
    $children: { [0]: Location, [1]: string } & {}[],
}

export interface SentenceStatusProcessedNode {
    $name: 'feedback_content',
    $kind: "processed", // set for type narrowing
    $: { val: "processed" },
    $children: {}[],
}

export interface SentenceStatusIncompleteNode {
    $name: 'feedback_content',
    $kind: "incomplete", // set for type narrowing
    $: { val: "incomplete" },
    $children: {}[],
}

export interface SentenceStatusCompleteNode {
    $name: 'feedback_content',
    $kind: "complete", // set for type narrowing
    $: { val: "complete" },
    $children: {}[],
}

export interface SentenceStatusInProgressNode {
    $name: 'feedback_content',
    $kind: "inprogress", // set for type narrowing
    $: { val: "inprogress" },
    $children: { [0]: number } & {}[],
}

export interface SentenceStatusProcessingInNode {
    $name: 'feedback_content',
    $kind: "processingin", // set for type narrowing
    $: { val: "processingin" },
    $children: { [0]: string } & {}[],
}

export interface CustomFeeedbackNode {
    $name: 'feedback_content',
    $kind: "custom", // set for type narrowing
    $: { val: "custom" },
    $children: { [0]: Location | null, [1]: string, [2]: any } & {}[],
}

export interface LtacProfFeeedbackNode {
    $name: 'feedback_content',
    $kind: "custom", // set for type narrowing
    $: { val: "custom" },
    $children: { [0]: Location | null, [1]: "ltacprof", [2]: LtacProfResults } & {}[],
}

export type FeedbackContentNode =
    WorkerStatusNode
    | FileDependencyNode
    | FileLoadedNode
    |
    GlobReferenceNode
    | GlobDefinitionNode
    | MessageFeedbackNode
    | ErrorMessageNode
    |
    SentenceStatusAddedAxiomNode
    | SentenceStatusProcessedNode
    | SentenceStatusIncompleteNode
    | SentenceStatusCompleteNode
    | SentenceStatusInProgressNode
    | SentenceStatusProcessingInNode
    |
    CustomFeeedbackNode
    | LtacProfFeeedbackNode;

export interface LtacProfTacticNode {
    $name: 'ltacprof_tactic',
    $: { name: string, total: string, self: string, num_calls: string, max_total: string }
    $children: LtacProfTactic[],
}

export interface LtacProfResultsNode {
    $name: 'ltacprof',
    $: { total_time: string }
    $children: LtacProfTactic[],
}

export interface OptionStateNode {
    $name: 'option_state',
    $: {},
    $children: { [0]: boolean, [1]: boolean, [2]: string, [3]: number | string | boolean } & {}[],
}

export interface GoalNode {
    $name: 'goal',
    $: {},
    $children: { [0]: number, [1]: AnnotatedText[], [2]: AnnotatedText | null } & {}[]
}

export interface GoalsNode {
    $name: 'goals',
    $: {},
    $children: { [0]: Subgoal[] | null, [1]: Pair<Subgoal[], Subgoal[]>[], [2]: Subgoal[] | null, [3]: Subgoal[] | null } & {}[]
}

export interface LocationNode {
    $name: 'loc',
    $: { start: string, stop: string },
    $children: {}[],
}

export interface MessageLevelNode {
    $name: 'message_level',
    $: { val: string }
    $children: {}[],
}

export interface MessageNode {
    $name: 'message',
    $children: { [0]: MessageLevel, [1]: AnnotatedText } & {}[]
    message_level: MessageLevel,
}

export interface EvarNode {
    $name: 'evar',
    $: {},
    $children: { [0]: string } & {}[],
}

export interface StatusNode {
    $name: 'status',
    $: {},
    $children: { [0]: string[], [1]: string | null, [2]: string[], [3]: number } & {}[],
}

export interface CoqObjectNode<T> {
    $name: 'coq_object',
    $: {},
    $children: { [0]: string[], [1]: string[], [2]: T } & {}[],
}

export interface CoqInfoNode {
    $name: 'coq_info',
    $: {},
    $children: { [0]: string, [1]: string, [2]: string, [3]: string } & {}[]
}

export type TypedNode =
/** Raw nodes */
    StateIdNode | EditIdNode | IntNode | StringNode | UnitNode | BoolNode |
    PairNode | ListNode | UnionNode |
    OptionNode | OptionValueNode | OptionStateNode |
    GoalNode | GoalsNode |
    LocationNode | MessageLevelNode | MessageNode |
    LtacProfTacticNode | LtacProfResultsNode |
    FeedbackNode | FeedbackContentNode |
    StatusNode |
    ValueNode;

export interface FailValueNode {
    $name: 'value',
    $: { val: 'fail', loc_s?: string, loc_e?: string },
    $children: { [0]: StateId, [1]: AnnotatedText } & {}[],
}


export function optionIsSome(opt: OptionNode): opt is OptionSomeNode {
    return opt.$.val === 'some';
}

export function optValIsInt(opt: OptionValueNode): opt is OptionValueIntNode {
    return opt.$.val === 'intvalue';
}

export function optValIsStringOpt(opt: OptionValueNode): opt is OptionValueStringOptNode {
    return opt.$.val === 'stringoptvalue';
}

export function optValIsBool(opt: OptionValueNode): opt is OptionValueBoolNode {
    return opt.$.val === 'boolvalue';
}

export function optValIsString(opt: OptionValueNode): opt is OptionValueStringNode {
    return opt.$.val === 'stringvalue';
}

export function isInl<X, Y>(value: Union<X, Y>): value is UnionL<X> {
    return value.tag === 'inl';
}

export interface GoodValueNode {
    $name: 'value',
    $: { val: 'good' },
    $children: { [0]: ValueReturn } & {}[],
}

export type ValueNode = FailValueNode | GoodValueNode;

export function isFailValue(value: ValueNode): value is FailValueNode {
    return value.$.val === 'fail';
}

export function isGoodValue(value: ValueNode): value is GoodValueNode {
    return value.$.val === 'good';
}

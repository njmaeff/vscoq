import * as coqProto from "../coq-proto";
import {AnnotatedText} from "../../protocol";
import * as Nodes from "./nodes";

export interface MessageNode {
    $name: 'message',
    $: {},
    $children: { [0]: coqProto.MessageLevel, [1]: coqProto.Location, [2]: AnnotatedText } & {}[]
    message_level: coqProto.MessageLevel,
}

export interface MessageFeedbackNode {
    $name: 'feedback_content',
    $kind: "message", // set for type narrowing
    $: { val: "message" },
    $children: { [0]: coqProto.MessageLevel, [1]: coqProto.Location, [2]: AnnotatedText } & {}[],
}


export interface LtacProfTacticNode {
    $name: 'ltacprof_tactic',
    $: { name: string, total: string, local: string, ncalls: string, max_total: string }
    $children: coqProto.LtacProfTactic[],
}

export type FeedbackContentNode =
/* 8.6 */
    MessageFeedbackNode
    |
    /* Base */
    Nodes.WorkerStatusNode
    | Nodes.FileDependencyNode
    | Nodes.FileLoadedNode
    |
    Nodes.GlobReferenceNode
    | Nodes.GlobDefinitionNode
    |
    Nodes.SentenceStatusProcessedNode
    | Nodes.SentenceStatusIncompleteNode
    | Nodes.SentenceStatusCompleteNode
    | Nodes.SentenceStatusProcessingInNode
    |
    Nodes.CustomFeeedbackNode
    | Nodes.LtacProfFeeedbackNode;


export type TypedNode =
/** 8.6 */
    MessageNode |
    LtacProfTacticNode |
    /** Base */
    Nodes.StateIdNode | Nodes.EditIdNode | Nodes.IntNode | Nodes.StringNode | Nodes.UnitNode | Nodes.BoolNode |
    Nodes.PairNode | Nodes.ListNode | Nodes.UnionNode |
    Nodes.OptionNode | Nodes.OptionValueNode | Nodes.OptionStateNode |
    Nodes.GoalNode | Nodes.GoalsNode |
    Nodes.LocationNode | Nodes.MessageLevelNode |
    Nodes.LtacProfResultsNode |
    Nodes.FeedbackNode | Nodes.FeedbackContentNode |
    Nodes.ValueNode;



import { RequestType, NotificationType } from 'vscode-jsonrpc';
import * as vscode from 'vscode-languageserver-types';
import { RouteId } from './coqtop/coq-proto';

export interface DocumentFilter {
  language?: string,
  pattern?: string,
  scheme?: string,
}
export type DocumentSelector = string | DocumentFilter | (string | DocumentFilter)[];

/** The substitution settings for a language (or group of languages) */
export interface LanguageEntry {
  /** language(s) to apply these substitutions on */
  language:  DocumentSelector;
  /** substitution rules */
  substitutions: Substitution[];
}

export interface PrettifySymbolsModeSettings {
  substitutions: LanguageEntry[],
}

// The settings interface describe the server relevant settings part
export interface Settings {
  coqtop: CoqTopSettings,
  coq: CoqSettings,
  prettifySymbolsMode?: PrettifySymbolsModeSettings,
}


export interface CoqTopSettings {
  /** Path to coqc and coqtop binaries. @default `""` */
  binPath: string;
  /** A list of arguments to send to coqtop. @default `[]` */
  args: string[];
  /** When should an instance of coqtop be started for a Coq script */
  startOn: "open-script" | "interaction",
}

export interface AutoFormattingSettings {
  enable: boolean, // mast switch
  indentAfterBullet: "none" | "indent" | "align",
  indentAfterOpenProof: boolean,
  unindentOnCloseProof: boolean,
}

export interface CoqSettings {
  /** Load settings from _CoqProject (if found at the root of the Code project). @default `true` */
  loadCoqProject: boolean,
  /** Move the editor's cursor position as Coq interactively steps forward/backward a command. @default `true` */
  moveCursorToFocus : boolean,
  /** Interpret to end of sentence */
  interpretToEndOfSentence: boolean,
  /** Auto-reveal proof-state at cursor */
  autoRevealProofStateAtCursor: boolean,
  /** Reveal the preceding or subsequent proof state w.r.t. a position */
  revealProofStateAtCursorDirection: "preceding" | "subsequent"
  /** Command to view a uri in an external browser */
  externalViewUrlCommand: string,
  /** How to host external proof-views */
  externalViewScheme: "file" | "http",
  format: AutoFormattingSettings,
  /** When to createa proof view for a script: when the script is opened, on first interaction, or else manually */
  showProofViewOn: "open-script" | "first-interaction" | "manual",
  /** Misc. diagnostic options */
  diagnostics?: {
    /** After each document edit, check for inconsistencies between the STM, sentences, and document. */
    checkTextSynchronization?: boolean,
    /** After each command, check sentence-states for inconsistencies */
    checkSentenceStateConsistency?: boolean,
  }
}

export interface FailValue {
  message: AnnotatedText;
  range?: vscode.Range;
  sentence: vscode.Range;
}

export enum SetDisplayOption {
  On, Off, Toggle
}
export enum DisplayOption {
  ImplicitArguments,
  Coercions,
  RawMatchingExpressions,
  Notations,
  AllBasicLowLevelContents,
  ExistentialVariableInstances,
  UniverseLevels,
  AllLowLevelContents,
}

export interface CoqTopParams {
  uri: string;
}

export interface Substitution {
	ugly: string;        // regular expression describing the text to replace
	pretty: string;      // plain-text symbol to show instead
	pre?: string;        // regular expression guard on text before "ugly"
	post?: string;       // regular expression guard on text after "ugly"
	style?: any;         // stylings to apply to the "pretty" text, if specified, or else the ugly text
}

export type TextDifference = "added"|"removed";

export interface TextAnnotation {
  /** the relationship this text has to the text of another state */
  diff?: TextDifference,
  /** what to display instead of this text */
  substitution?: string,
  /** the underlying text, possibly with more annotations */
  text: string
}

export interface ScopedText {
  /** A scope identifier */
  scope: string,
  /** Extra stuff */
  attributes?: any,
  /** the underlying text, possibly with more annotations */
  text: AnnotatedText,
}

export type AnnotatedText = string | TextAnnotation | ScopedText | (string | TextAnnotation | ScopedText)[];

export enum HypothesisDifference { None, Changed, New, MovedUp, MovedDown }
export interface Hypothesis {
  identifier: string;
  relation: string;
  expression: AnnotatedText;
  diff: HypothesisDifference;
}
export interface Goal {
  id: number;
  hypotheses: Hypothesis[];
  goal: AnnotatedText;
}
export interface UnfocusedGoalStack {
  // subgoals that appear before the focus
  before: Goal[];
  // reference to the more-focused background goals
  next?: UnfocusedGoalStack
  // subgoals that appear after the focus
  after: Goal[];
}
export interface ProofView {
  goals: Goal[];
  backgroundGoals?: UnfocusedGoalStack,
  shelvedGoals: Goal[],
  abandonedGoals: Goal[],
  focus: vscode.Position,
}

export interface CommandInterrupted {
  range: vscode.Range
}

export type FocusPosition = {focus: vscode.Position}
export type NotRunningTag = {type: 'not-running'}
export type NoProofTag = {type: 'no-proof'}
export type FailureTag = {type: 'failure'}
export type ProofViewTag = {type: 'proof-view'}
export type InterruptedTag = {type: 'interrupted'}
export type BusyTag = {type: 'busy'}
export type NotRunningResult = NotRunningTag & {reason: "not-started"|"spawn-failed", coqtop?: string}
export type BusyResult = BusyTag
export type NoProofResult = NoProofTag
export type FailureResult = FailValue & FailureTag
export type ProofViewResult = ProofView & ProofViewTag
export type InterruptedResult = CommandInterrupted & InterruptedTag
export type CommandResult =
  NotRunningResult |
  (BusyResult & FocusPosition) |
  (FailureResult & FocusPosition) |
  (ProofViewResult & FocusPosition) |
  (InterruptedResult & FocusPosition) |
  (NoProofResult & FocusPosition);



export interface CoqTopInterpretToPointParams extends CoqTopParams {
  location: number|vscode.Position,
  synchronous?: boolean,
}

export interface InterpretToEndParams extends CoqTopParams {
  synchronous?: boolean,
}

export interface LtacProfTactic {
  name: string,
  statistics: {total: number; local: number; num_calls: number; max_total: number},
  tactics: LtacProfTactic[]
}
export interface LtacProfResults {
  total_time: number,
  tactics: LtacProfTactic[]
}


export const InterruptCoqRequest = {
  type: new RequestType<CoqTopParams, void, void, void>('coqtop/interrupt')
}
export const QuitCoqRequest = {
  type: new RequestType<CoqTopParams, void, void, void>('coqtop/quitCoq')
}
export const ResetCoqRequest = {
  type: new RequestType<CoqTopParams, void, void, void>('coqtop/resetCoq')
}
export const StepForwardRequest = {
  type: new RequestType<CoqTopParams, CommandResult, void, void>('coqtop/stepForward')
}
export const StepBackwardRequest = {
  type: new RequestType<CoqTopParams, CommandResult, void, void>('coqtop/stepBackward')
}
export const InterpretToPointRequest = {
  type: new RequestType<CoqTopInterpretToPointParams, CommandResult, void, void>('coqtop/interpretToPoint')
}
export const InterpretToEndRequest = {
  type: new RequestType<InterpretToEndParams, CommandResult, void, void>('coqtop/interpretToEnd')
}
export const GoalRequest = {
  type: new RequestType<CoqTopParams, CommandResult, void, void>('coqtop/goal')
}
export interface CachedGoalParams extends CoqTopParams {
  position: vscode.Position,
  direction: "preceding"|"subsequent",
}
export const CachedGoalRequest = {
  type: new RequestType<CachedGoalParams, CommandResult, void, void>('coqtop/cachedGoal')
}
export const FinishComputationsRequest = {
  type: new RequestType<CoqTopParams, void, void, void>('coqtop/finishComputations')
}
export const QueryRequest = {
  type: new RequestType<CoqTopQueryParams, void, void, void>('coqtop/query')
}
export type QueryFunction = "locate"|"check"|"print"|"search"|"about"|"searchAbout";
export interface CoqTopQueryParams extends CoqTopParams {
  queryFunction: QueryFunction;
  query: string;
  routeId: RouteId;
}
export interface CoqTopResizeWindowParams extends CoqTopParams {
  columns: number;
}
export const ResizeWindowRequest = {
  type: new RequestType<CoqTopResizeWindowParams, void, void, void>('coqtop/resizeWindow')
}

export interface CoqTopSetDisplayOptionsParams extends CoqTopParams {
  options: {item: DisplayOption, value: SetDisplayOption}[]
}
export const SetDisplayOptionsRequest = {
  type: new RequestType<CoqTopSetDisplayOptionsParams, void, void, void>('coqtop/setDisplayOptions')
}

export interface CoqTopLtacProfResultsParams extends CoqTopParams {
  offset?: number;
}
export const LtacProfResultsRequest = {
  type: new RequestType<CoqTopLtacProfResultsParams, void, void, void>('coqtop/ltacProfResults')
}

export const GetSentencePrefixTextRequest = {
  type: new RequestType<DocumentPositionParams, string, void, void>('coqtop/getSentencePrefixText')
}

export enum HighlightType {
  StateError=0, Parsing=1, Processing=2, Incomplete=3, Processed=4, Axiom=5
}

// export interface Highlight {
//   style: HighlightType;
//   range: vscode.Range;
// }

export interface NotificationParams {
  uri: string;
}

export interface Highlights {
  ranges: [vscode.Range[],vscode.Range[],vscode.Range[],vscode.Range[],vscode.Range[],vscode.Range[]];
}

export type NotifyHighlightParams = NotificationParams & Highlights;

export const UpdateHighlightsNotification = {
  type: new NotificationType<NotifyHighlightParams,void>('coqtop/updateHighlights')
}

export interface NotifyMessageParams extends NotificationParams {
  level: string;
  message: AnnotatedText;
  routeId: RouteId;
}
export const CoqMessageNotification = {
  type: new NotificationType<NotifyMessageParams,void>('coqtop/message')
}

export const CoqResetNotification = {
  type: new NotificationType<NotificationParams,void>('coqtop/wasReset')
}

export const CoqtopStartNotification = {
  type: new NotificationType<NotificationParams,void>('coqtop/coqtopStarted')
}

export enum CoqtopStopReason { UserRequest, Anomaly, InternalError }
export interface NotifyCoqtopStopParams extends NotificationParams {
  reason: CoqtopStopReason;
  message?: string;
}
export const CoqtopStopNotification = {
  type: new NotificationType<NotifyCoqtopStopParams,void>('coqtop/coqtopStopped')
}

export interface DocumentPositionParams extends NotificationParams {
  position: vscode.Position;
}

export const CoqStmFocusNotification = {
  type: new NotificationType<DocumentPositionParams,void>('coqtop/stmFocus')
}


export enum ComputingStatus {Finished, Computing, Interrupted}

export interface NotifyLtacProfResultsParams extends NotificationParams {
  results: LtacProfResults
}
export const CoqLtacProfResultsNotification = {
  type: new NotificationType<NotifyLtacProfResultsParams,void>('coqtop/ltacProfResults')
}

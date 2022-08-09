import type { ReactorState } from '../store/reactor';
import type { ProceedingsState } from '../store/proceedings';
import type { Proceeding } from './proceedings';
import type { GeneratorState } from '../store/generator';
import type { IdDataElement } from '../types/request.d';
import type { ReactorModuleId } from '../Components/Reactor/modules';

export type CallbackState = {
    reactorState: ReactorState;
    proceedingsState: ProceedingsState;
    reference: string;
    proceeding: Proceeding;
    generatorState: Pick<GeneratorState, 'setCustomLetterProperty' | 'request' | 'renderLetter'>;
};
export type StateCallback<ReturnType> = (state: CallbackState) => ReturnType;
type Condition = boolean | StateCallback<boolean>;
type Text = string | StateCallback<string>;

export interface ReactorModuleData {
    includeIssue: boolean;
    resolved?: boolean;
    fromAdmonition?: boolean;
    issue: {
        variables: Record<string, string>;
        flags: Record<string, boolean>;
    };
    additionalData: IdDataElement[];
}

// This is filled by the individual modules using declaration merging.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ReactorModuleDataMapping {}

export type ReactorModuleWithDataId = keyof ReactorModuleDataMapping;
export type ReactorRegularModuleWithDataId = Exclude<ReactorModuleWithDataId, 'base' | 'custom-text'>;

export type ReactorOption = {
    text: Text;
    targetStepId: string | StateCallback<string>;
    onChoose?: StateCallback<void>;
    hideIf?: Condition;
    disableIf?: Condition;
};

type MinimalStep = { id: string; onEnter?: StateCallback<void> };
type StepWithBody = MinimalStep & { body: Text };
type OptionStep = StepWithBody & {
    type: 'options';
    options: ReactorOption[];
    optionFilter?: (option: ReactorOption & { moduleId: ReactorModuleId }, state: CallbackState) => boolean;
};
type TextareaStep<ModuleIdT extends string> = StepWithBody & {
    type: 'textarea';
    variableName: keyof ReactorModuleDataMapping[ModuleIdT]['issue']['variables'];
    nextStepId: string;
    rows?: number;
};
type InputStep<ModuleIdT extends string> = StepWithBody & {
    type: 'input';
    variableName: keyof ReactorModuleDataMapping[ModuleIdT]['issue']['variables'];
    nextStepId: string;
};
type DynamicInputStep = StepWithBody & { type: 'dynamic-inputs'; storeIn: 'module' | 'id_data'; nextStepId: string };
type SvaFinderStep = StepWithBody & { type: 'sva-finder'; nextStepId: string };
type ConditionStep = MinimalStep & { type: 'condition'; condition: Condition; trueStepId: string; falseStepId: string };
type RedirectStep = MinimalStep & { type: 'redirect'; redirectUrl: Text };
type LetterStep = StepWithBody & { type: 'letter' };
export type ReactorStep<ModuleIdT extends string> =
    | OptionStep
    | TextareaStep<ModuleIdT>
    | InputStep<ModuleIdT>
    | DynamicInputStep
    | SvaFinderStep
    | ConditionStep
    | RedirectStep
    | LetterStep;

export type ReactorHook = {
    stepId: string;
    position: 'before' | 'after';
    options: ReactorOption[];
};

export type ReactorModule<
    ModuleDataT extends ReactorModuleData | undefined = undefined,
    ModuleIdT extends string = string
> = {
    id: ModuleIdT;
    /** The first step must be called `start` for the complaint generator to work. */
    steps: ReactorStep<ModuleIdT>[];
    hooks?: ReactorHook[];
} & (
    | {
          defaultModuleData: ModuleDataT;
          offerToIncludeInComplaintIf:
              | boolean
              | ((state: { moduleData: ReactorModuleDataMapping[ModuleIdT] }) => boolean);
      }
    | {
          defaultModuleData: undefined;
          offerToIncludeInComplaintIf: false;
      }
);

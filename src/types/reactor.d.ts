import type { ComponentChild } from 'preact';
import { ReactorState } from '../store/reactor';
import { IdDataElement } from '../types/request.d';

type StateCallback<ReturnType> = (state: ReactorState) => ReturnType;
type Text = string | StateCallback<ComponentChild>;

export interface ReactorModuleData {
    includeIssue: boolean;
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

export type ReactorOption = {
    text: ComponentChild;
    targetStepId: string;
    onChoose?: StateCallback<void>;
    hideIf?: boolean | StateCallback<boolean>;
};

type StepWithBody = { id: string; body: Text };
type OptionStep = StepWithBody & { type: 'options'; options: ReactorOption[] };
type TextareaStep<ModuleIdT extends string> = StepWithBody & {
    type: 'textarea';
    variableName: keyof ReactorModuleDataMapping[ModuleIdT]['issue']['variables'];
    nextStepId: string;
    rows?: number;
};
export type ReactorStep<ModuleIdT extends string> = OptionStep | TextareaStep<ModuleIdT>;

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
    steps: ReactorStep<ModuleIdT>[];
    hooks?: ReactorHook[];

    defaultModuleData?: ModuleDataT;
};

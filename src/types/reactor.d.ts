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

export type ReactorModuleId = keyof ReactorModuleDataMapping;

export type ReactorOption = {
    text: ComponentChild;
    targetStepId: string;
    onChoose?: StateCallback<void>;
    hideIf?: boolean | StateCallback<boolean>;
};

export type ReactorStep = {
    id: string;
    body: Text;
    options: ReactorOption[];
};

export type ReactorHook = {
    stepId: string;
    position: 'before' | 'after';
    options: ReactorOption[];
};

export type ReactorModule<ModuleDataT extends ReactorModuleData | undefined = undefined> = {
    id: string;
    steps: ReactorStep[];
    hooks?: ReactorHook[];

    defaultModuleData?: ModuleDataT;
};

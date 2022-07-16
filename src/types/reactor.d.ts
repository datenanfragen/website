import type { ComponentChild } from 'preact';

export type ReactorOption = {
    targetStepId: string;
    text: ComponentChild;
};

export type ReactorStep = {
    id: string;
    // TODO: Do we want to enforce the `<module>::<id>` pattern by exporting a { moduleId: string, flows: Flow[] } and
    // automatically prepending module ID to the flow IDs?
    body: ComponentChild;
    options: ReactorOption[];
};

export type ReactorHook = {
    stepId: string;
    position: 'before' | 'after';
    options: ReactorOption[];
};

export type ReactorModule = {
    steps: ReactorStep[];
    hooks?: ReactorHook[];
};

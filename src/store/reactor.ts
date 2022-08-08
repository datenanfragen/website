import create, { UseBoundStore, StoreApi } from 'zustand';
import { produce } from 'immer';
import { reactorModules, ReactorModuleId } from '../Components/Reactor/modules/index';
import { objFilter } from '../Utility/common';
import type { StoreSlice } from '../types/utility';
import type {
    ReactorModuleData,
    ReactorModuleDataMapping,
    ReactorModuleWithDataId,
    ReactorRegularModuleWithDataId,
} from '../types/reactor.d';
import type { IdDataElement } from '../types/request.d';

// TODO: If we persist this, we need to do it per request reference.

type Type = 'response' | 'admonition' | 'complaint';
type ModuleData = Record<ReactorModuleWithDataId, ReactorModuleData> &
    Record<Exclude<ReactorModuleId, ReactorModuleWithDataId>, undefined>;
export type ReactorState = {
    type: Type;
    moduleData: ModuleData;
    currentIssueForComplaintIndex?: number;

    activeModules: (
        ignoreModulesWithAdditionalDataOnly?: boolean
    ) => Record<ReactorModuleWithDataId, ReactorModuleData>;
    currentIssueForComplaint: () => ReactorRegularModuleWithDataId | undefined;

    setType: (type: Type) => void;
    overrideModuleData: (newModuleData: ModuleData) => void;
    setCurrentIssueIndexForComplaint: (issue: number | undefined) => void;

    setIncludeIssue: (module: ReactorModuleWithDataId, includeIssue: boolean) => void;
    setResolved: (module: ReactorModuleWithDataId, resolved: boolean) => void;
    setIssueVariable: <ModuleIdT extends ReactorModuleWithDataId>(
        module: ModuleIdT,
        variable: keyof ReactorModuleDataMapping[ModuleIdT]['issue']['variables'],
        value: string
    ) => void;
    setIssueFlag: <ModuleIdT extends ReactorModuleWithDataId>(
        flag: ModuleIdT,
        variable: keyof ReactorModuleDataMapping[ModuleIdT]['issue']['flags'],
        value: boolean
    ) => void;

    addAdditionalDataField: (module: ReactorModuleWithDataId, data: IdDataElement) => void;
    removeAdditionalDataField: (module: ReactorModuleWithDataId, index: number) => void;
    setAdditionalDataField: (module: ReactorModuleWithDataId, index: number, data: IdDataElement) => void;
};

const reactorStoreSlice: StoreSlice<ReactorState> = (set, get) => ({
    type: 'admonition',
    moduleData: reactorModules.reduce<ReactorState['moduleData']>(
        (acc, m) => ({ ...acc, [m.id]: m.defaultModuleData }),
        {} as ReactorState['moduleData']
    ),

    setType: (type) => set({ type }),
    overrideModuleData: (moduleData) => set({ moduleData }),
    setCurrentIssueIndexForComplaint: (index) => set({ currentIssueForComplaintIndex: index }),

    setIncludeIssue: (module, includeIssue) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module]) state.moduleData[module]!.includeIssue = includeIssue;
            })
        ),
    setResolved: (module, resolved) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module]) state.moduleData[module]!.resolved = resolved;
            })
        ),
    setIssueVariable: (module, variable, value) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module]) state.moduleData[module]!.issue.variables[variable as string] = value;
            })
        ),
    setIssueFlag: (module, flag, value) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module]) state.moduleData[module]!.issue.flags[flag as string] = value;
            })
        ),

    addAdditionalDataField: (module, data) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module]) state.moduleData[module]!.additionalData.push(data);
            })
        ),
    removeAdditionalDataField: (module, index) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module]) state.moduleData[module]!.additionalData.splice(index, 1);
            })
        ),
    setAdditionalDataField: (module, index, data) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module]) state.moduleData[module]!.additionalData[index] = data;
            })
        ),

    activeModules: (ignoreModulesWithAdditionalDataOnly) =>
        objFilter(
            get().moduleData,
            ([, data]) =>
                data?.includeIssue || (!ignoreModulesWithAdditionalDataOnly && (data?.additionalData.length || -1) > 0)
        ) as Record<ReactorModuleWithDataId, ReactorModuleData>,
    currentIssueForComplaint: () => {
        const issues = Object.keys(
            objFilter(get().moduleData, ([, m]) => m?.fromAdmonition === true)
        ) as ReactorRegularModuleWithDataId[];
        return issues[get().currentIssueForComplaintIndex ?? -1];
    },
});

const { devtools } =
    process.env.NODE_ENV === 'development' ? require('zustand/middleware') : { devtools: (d: unknown) => d };
// TODO: Annoyingly, this creates a new instance in the Redux devtools. Don't know why.
export const useReactorStore: UseBoundStore<ReactorState, StoreApi<ReactorState>> = process.env.NODE_ENV ===
'development'
    ? create(devtools(reactorStoreSlice))
    : create(reactorStoreSlice);

import create, { UseBoundStore, StoreApi } from 'zustand';
import { produce } from 'immer';
import { reactorModules, ReactorModuleId } from '../Components/Reactor/modules/index';
import { objFilter } from '../Utility/common';
import type { StoreSlice } from '../types/utility';
import type { ReactorModuleData, ReactorModuleDataMapping, ReactorModuleWithDataId } from '../types/reactor.d';
import type { IdDataElement } from '../types/request.d';

export type ReactorState = {
    moduleData: Record<ReactorModuleWithDataId, ReactorModuleData> &
        Record<Exclude<ReactorModuleId, ReactorModuleWithDataId>, undefined>;

    activeModules: () => Record<ReactorModuleWithDataId, ReactorModuleData>;

    setIncludeIssue: (module: ReactorModuleWithDataId, includeIssue: boolean) => void;
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
    moduleData: reactorModules.reduce<ReactorState['moduleData']>(
        (acc, m) => ({ ...acc, [m.id]: m.defaultModuleData }),
        {} as ReactorState['moduleData']
    ),

    setIncludeIssue: (module, includeIssue) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module]) state.moduleData[module]!.includeIssue = includeIssue;
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

    addAdditionalDataField: (module: ReactorModuleWithDataId, data: IdDataElement) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module]) state.moduleData[module]!.additionalData.push(data);
            })
        ),
    removeAdditionalDataField: (module: ReactorModuleWithDataId, index: number) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module]) state.moduleData[module]!.additionalData.splice(index, 1);
            })
        ),
    setAdditionalDataField: (module: ReactorModuleWithDataId, index: number, data: IdDataElement) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module]) state.moduleData[module]!.additionalData[index] = data;
            })
        ),

    activeModules: () =>
        objFilter(
            get().moduleData,
            ([, data]) => data?.includeIssue || (data?.additionalData.length || -1) > 0
        ) as Record<ReactorModuleWithDataId, ReactorModuleData>,
});

const { devtools } =
    process.env.NODE_ENV === 'development' ? require('zustand/middleware') : { devtools: (d: unknown) => d };
// TODO: Annoyingly, this creates a new instance in the Redux devtools. Don't know why.
export const useReactorStore: UseBoundStore<ReactorState, StoreApi<ReactorState>> = process.env.NODE_ENV ===
'development'
    ? create(devtools(reactorStoreSlice))
    : create(reactorStoreSlice);

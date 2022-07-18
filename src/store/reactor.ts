import create from 'zustand';
import { produce } from 'immer';
import { reactorModules } from '../Components/Reactor/modules/index';
import { objFilter } from '../Utility/common';
import type { StoreSlice } from '../types/utility';
import { ReactorModuleData, ReactorModuleDataMapping, ReactorModuleId } from '../types/reactor.d';
import { IdDataElement } from '../types/request.d';

export type ReactorState = {
    moduleData: Record<ReactorModuleId, ReactorModuleData | undefined>;

    setIncludeIssue: (module: ReactorModuleId, includeIssue: boolean) => void;
    setIssueVariable: <ModuleIdT extends ReactorModuleId>(
        module: ModuleIdT,
        variable: keyof ReactorModuleDataMapping[ModuleIdT]['issue']['variables'],
        value: string
    ) => void;
    setIssueFlag: <ModuleIdT extends ReactorModuleId>(
        flag: ModuleIdT,
        variable: keyof ReactorModuleDataMapping[ModuleIdT]['issue']['flags'],
        value: boolean
    ) => void;

    addAdditionalData: (module: ReactorModuleId, data: IdDataElement[]) => void;

    activeModules: () => Record<ReactorModuleId, ReactorModuleData>;
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

    addAdditionalData: (module, data) =>
        set(
            produce((state: ReactorState) => {
                if (state.moduleData[module])
                    state.moduleData[module]!.additionalData = state.moduleData[module]!.additionalData.concat(data);
            })
        ),

    activeModules: () =>
        objFilter(
            get().moduleData,
            ([, data]) => data?.includeIssue || (data?.additionalData.length || -1) > 0
        ) as Record<ReactorModuleId, ReactorModuleData>,
});

const { devtools } =
    process.env.NODE_ENV === 'development' ? require('zustand/middleware') : { devtools: (d: unknown) => d };
// TODO: Annoyingly, this creates a new instance in the Redux devtools. Don't know why.
export const useReactorStore =
    process.env.NODE_ENV === 'development' ? create(devtools(reactorStoreSlice)) : create(reactorStoreSlice);

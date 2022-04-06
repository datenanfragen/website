import create from 'zustand';
import { RequestState, createRequestStore } from './request';
import type { Request } from '../types/request';
import createContext from 'zustand/context';

type GeneratorState = RequestState<Request>;

export const { Provider: RequestGeneratorProvider, useStore: useGeneratorStore } = createContext<GeneratorState>();

export const createGeneratorStore = () =>
    create<GeneratorState>((set, get) => ({
        ...createRequestStore(set, get),
    }));

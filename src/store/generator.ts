import create from 'zustand';
import { RequestState, createRequestStore } from './request';
import type { Request } from '../types/request';

type GeneratorState = RequestState<Request>;

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
    ...createRequestStore(set, get),
}));

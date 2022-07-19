import { module as baseModule } from './base';
import { module as additionalIdModule } from './additional-id';

export const reactorModules = [baseModule, additionalIdModule] as const;
export type ReactorModuleId = typeof reactorModules[number]['id'];

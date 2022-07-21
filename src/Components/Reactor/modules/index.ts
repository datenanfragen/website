import { module as baseModule } from './base';
import { module as additionalIdModule } from './additional-id';
import { module as idCopyModule } from './id-copy';

export const reactorModules = [baseModule, additionalIdModule, idCopyModule] as const;
export type ReactorModuleId = typeof reactorModules[number]['id'];

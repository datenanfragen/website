import { module as baseModule } from './base';
import { module as additionalIdModule } from './additional-id';
import { module as idCopyModule } from './id-copy';
import { module as customTextModule } from './custom-text';

export const reactorModules = [baseModule, additionalIdModule, idCopyModule, customTextModule] as const;
export type ReactorModuleId = typeof reactorModules[number]['id'];

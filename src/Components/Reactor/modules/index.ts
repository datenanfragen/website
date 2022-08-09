import { module as baseModule } from './base';
import { module as additionalIdModule } from './additional-id';
import { module as idCopyModule } from './id-copy';
import { module as customTextModule } from './custom-text';
import { module as wrongMediumModule } from './wrong-medium';

export const reactorModules = [
    baseModule,
    additionalIdModule,
    idCopyModule,
    wrongMediumModule,

    customTextModule,
] as const;
export type ReactorModuleId = typeof reactorModules[number]['id'];

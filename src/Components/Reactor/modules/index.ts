import { module as baseModule } from './base';
import { module as additionalIdModule } from './additional-id';
import { module as idCopyModule } from './id-copy';
import { module as signatureModule } from './signature';
import { module as wrongMediumModule } from './wrong-medium';
import { module as customTextModule } from './custom-text';

export const reactorModules = [
    baseModule,
    additionalIdModule,
    idCopyModule,
    signatureModule,
    wrongMediumModule,

    customTextModule,
] as const;
export type ReactorModuleId = typeof reactorModules[number]['id'];

import { Template } from 'letter-generator';
import { RequestLetter } from '../DataType/RequestLetter';
import { ReactorState } from '../store/reactor';
import { templates } from '../Components/Reactor/templates';
import type { SetOptional } from 'type-fest';
import type { ReactorModule, ReactorModuleData } from '../types/reactor.d';
import type { ReactorModuleId } from '../Components/Reactor/modules';

export const createReactorModule = <ModuleDataT extends ReactorModuleData | undefined, ModuleIdT extends string>(
    id: ModuleIdT,
    module: SetOptional<ReactorModule<ModuleDataT, ModuleIdT>, 'id'>
): ReactorModule<ModuleDataT, ModuleIdT> => {
    module.id = id;
    module.steps = module.steps.map((s) => ({ ...s, id: `${id}::${s.id}` }));
    return module as ReactorModule<ModuleDataT, ModuleIdT>;
};

const TODO = false;
export const generateLetter = (store: ReactorState, language: keyof typeof templates, reference: string) => {
    // TODO: Support complaints, not just responses.
    const type = 'response';

    const issues = Object.entries(store.moduleData)
        .filter(([, moduleData]) => moduleData?.includeIssue)
        .map(([moduleId, moduleData]) => ({ moduleId: moduleId as ReactorModuleId, ...moduleData!.issue }));
    const additionalData = Object.values(store.moduleData)
        .filter((moduleData) => (moduleData?.additionalData.length || -1) > 0)
        .flatMap((moduleData) => moduleData!.additionalData);

    const baseVariables = {
        request_date: 'TODO',
        request_article: 'TODO',
        response_date: 'TODO',
        ...(issues.length > 0 && {
            issue_list: issues
                .map(
                    (i, idx) =>
                        // TODO: This looks silly for multi-line issue descriptions.
                        `${idx + 1}. ${new Template(
                            templates[language][`${i.moduleId}::${type}`],
                            i.flags,
                            i.variables
                        ).getText()}`
                )
                .join('\n'),
        }),
        ...(additionalData.length > 0 && { additional_data_list: RequestLetter.formatData(additionalData).formatted }),
    };
    const baseFlags = {
        controller_responded: TODO,
    };

    const content = new Template(templates[language][`base::${type}`], baseFlags, baseVariables).getText();

    return new RequestLetter(
        {
            information_block: 'TODO',
            subject: 'TODO',
            recipient_address: ['TODO'],
            sender_address: 'TODO',
            signature: { type: 'text', name: 'TODO' },
            content,
        },
        language,
        reference
    );
};

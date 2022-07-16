import { Template } from 'letter-generator';
import { RequestLetter } from '../DataType/RequestLetter';
import { ReactorState } from '../store/reactor';
import { templates } from '../Components/Reactor/templates';
import type { SetOptional } from 'type-fest';
import type { ReactorModule, ReactorModuleData, ReactorModuleId } from '../types/reactor.d';

export const createReactorModule = <ModuleDataT extends ReactorModuleData | undefined>(
    id: string,
    module: SetOptional<ReactorModule<ModuleDataT>, 'id'>
): ReactorModule<ModuleDataT> => {
    module.id = id;
    module.steps = module.steps.map((s) => ({ ...s, id: `${id}::${s.id}` }));
    return module as ReactorModule<ModuleDataT>;
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
        additional_data_list: RequestLetter.formatData(additionalData).formatted,
    };
    const baseFlags = {
        controller_responded: TODO,
        has_issues: issues.length > 0,
        has_additional_data: additionalData.length > 0,
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

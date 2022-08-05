import { Template } from 'letter-generator';
import { RequestLetter } from '../DataType/RequestLetter';
import { getGeneratedMessage } from '../store/proceedings';
import { templates } from '../Components/Reactor/templates';
import type { SetOptional } from 'type-fest';
import type { ReactorModule, ReactorModuleData, CallbackState } from '../types/reactor.d';
import type { ReactorModuleId } from '../Components/Reactor/modules';
import { REQUEST_ARTICLES } from './requests';
import { ErrorException } from './errors';

export const createReactorModule = <ModuleDataT extends ReactorModuleData | undefined, ModuleIdT extends string>(
    id: ModuleIdT,
    module: SetOptional<ReactorModule<ModuleDataT, ModuleIdT>, 'id'>
): ReactorModule<ModuleDataT, ModuleIdT> => {
    module.id = id;
    module.steps = module.steps.map((s) => ({ ...s, id: `${id}::${s.id}` }));
    return module as ReactorModule<ModuleDataT, ModuleIdT>;
};

const dateFormat: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
export const generateLetterContent = ({ reactorState, proceeding, generatorState }: CallbackState) => {
    const type = reactorState.type;
    // TODO: Remove the cast once we have fallbacks.
    const language = generatorState.request.language as 'en' | 'de';

    if (type === 'response') return reactorState.moduleData['custom-text'].issue.variables.text;

    const issues = Object.entries(reactorState.moduleData)
        .filter(([moduleId, moduleData]) => moduleData?.includeIssue === true && moduleId !== 'custom-text')
        .map(([moduleId, moduleData]) => ({
            moduleId: moduleId as Exclude<ReactorModuleId, 'custom-text'>,
            ...moduleData!.issue,
        }));
    const additionalData = Object.values(reactorState.moduleData)
        .filter((moduleData) => (moduleData?.additionalData.length || -1) > 0)
        .flatMap((moduleData) => moduleData!.additionalData);

    const originalRequest = getGeneratedMessage(proceeding, 'request');
    if (!originalRequest) throw new ErrorException('Proceeding without original request.', { proceeding });

    // TODO: How do we exclude authority messages here?
    const companyMessages = Object.values(proceeding.messages)
        .filter((m) => !m.sentByMe)
        .sort((a, b) => b.date.getTime() - a.date.getTime());

    const baseVariables = {
        request_article: REQUEST_ARTICLES[originalRequest.type as 'access'],
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
        ...reactorState.moduleData.base.issue.variables,

        // Admonitions
        request_date: originalRequest?.date.toLocaleDateString(language, dateFormat),
        ...(companyMessages.length > 0 && {
            response_date: companyMessages[companyMessages.length - 1].date.toLocaleDateString(language, dateFormat),
        }),
        ...(additionalData.length > 0 && {
            additional_data_list: RequestLetter.formatData(additionalData).formatted,
        }),

        // Complaints
        request_recipient_address:
            originalRequest.correspondent_address +
            (originalRequest.correspondent_email ? `\n\n${originalRequest.correspondent_email}` : ''),
        correspondence_list: Object.values(proceeding.messages)
            .map(
                (m) =>
                    `* ${m.date.toLocaleDateString(language, dateFormat)}: ${m.transport_medium} by ${
                        m.sentByMe ? 'me' : 'the controller'
                    }${m.subject ? ` (subject: “${m.subject}”)` : ''}`
            )
            .join('\n'),
        contact_details: RequestLetter.formatData(generatorState.request.id_data).formatted,
    };
    const baseFlags = {
        controller_responded: companyMessages.length > 0,
        ...reactorState.moduleData.base.issue.flags,
    };

    return new Template(templates[language][`base::${type}`], baseFlags, baseVariables).getText();
};

import type { Request, RequestType } from '../types/request';
import type { Content, GetMessageResult, Message, MessageId, Proceeding, ProceedingStatus } from '../types/proceedings';
import create, { GetState, SetState, StoreApi, Mutate } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { Privacy, PRIVACY_ACTIONS } from '../Utility/Privacy';
import type { SetOptional } from 'type-fest';
import type { ReactorState } from './reactor';
import { ErrorException } from '../Utility/errors';
import { UserRequest } from '../DataType/UserRequests';
import { PrivacyAsyncStorage } from '../Utility/PrivacyAsyncStorage';
import { isUserRequest, REQUEST_TYPES } from '../Utility/requests';
import { t_r } from '../Utility/i18n';
import type { ComponentChildren } from 'preact';

export interface ProceedingsState {
    proceedings: Record<string, Proceeding>;
    addProceeding: (proceeding: Proceeding) => void;
    addRequest: (request: Request, content?: Content, extra?: Record<string, string>) => void;
    addMessage: (message: SetOptional<Message, 'id'>) => void;
    removeMessage: (id: MessageId) => void;
    addAttachment: (id: MessageId, file: unknown) => void;
    setProceedingStatus: (reference: string, status: ProceedingStatus) => void;
    reactivateProceeding: (reference: string) => void;
    setReactorData: (id: MessageId, reactorData: ReactorState['moduleData']) => void;
    removeProceeding: (reference: string) => void;
    clearProceedings: () => void;
    mapEmailToProceeding: (email: GetMessageResult) => string | undefined;
    updateStatuses: () => void;
    _hasHydrated: boolean;
    _migratedLegacyRequests: boolean;
    migrationDone: () => void;
    drink: () => void;
}

/** This is necessary because zustand/persist doesn't export `StorageValue` properly */
type ProceedingsStorageValue = { state: Partial<ProceedingsState>; version?: number };

const id_regex = /^(\d{4,}-[\dA-Za-z]{7,})-(\d+)$/;

const proceedingsStorage = new PrivacyAsyncStorage(() => Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS), {
    name: 'Datenanfragen.de',
    storeName: 'proceedings',
});

const proceedingsStore = persist<ProceedingsState>(
    (set, get) => ({
        proceedings: {},
        drink: () => set({ _hasHydrated: true }),
        addProceeding: (proceeding) =>
            Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS) &&
            set(
                produce((state: ProceedingsState) => {
                    state.proceedings[proceeding.reference] = proceeding;
                })
            ),
        addRequest: (request, content, extra) =>
            get().addProceeding(
                proceedingFromRequest(
                    request,
                    request.type !== 'custom' ? t_r(`letter-subject-${request.type}`, request.language) : undefined,
                    content,
                    extra
                )
            ),
        addMessage: (message) =>
            set(
                produce((state: ProceedingsState) => {
                    if (!state.proceedings[message.reference])
                        throw new ErrorException(
                            'Adding the message failed: No proceeding exists for the given reference.',
                            message
                        );
                    const existing_ids = Object.keys(state.proceedings[message.reference].messages);
                    const message_id_number =
                        existing_ids.length > 0
                            ? Number.parseInt(existing_ids[existing_ids.length - 1].match(id_regex)?.[2] || '1', 10) + 1
                            : 0;
                    const message_id_string = `${message.reference}-${`${message_id_number}`.padStart(2, '0')}`;
                    message.id = message_id_string;
                    state.proceedings[message.reference].messages[message_id_string] = message as Message;
                    state.proceedings[message.reference].status = shouldHaveStatus(
                        state.proceedings[message.reference]
                    );
                })
            ),
        removeMessage: (id) =>
            set(
                produce((state: ProceedingsState) => {
                    const reference = id.match(id_regex)?.[1];
                    if (!reference) return;
                    delete state.proceedings[reference].messages[id];
                    state.proceedings[reference].status = shouldHaveStatus(state.proceedings[reference]);
                })
            ),
        // TODO: Implement a file API…
        addAttachment: () => {
            throw new ReferenceError('Not implemented');
        },
        setProceedingStatus: (reference, status) => {
            set(
                produce((state: ProceedingsState) => {
                    const oldStatus = state.proceedings[reference].status;
                    state.proceedings[reference].status = status;
                    window.ON_PROCEEDING_STATUS_CHANGE?.(state.proceedings[reference], oldStatus);
                })
            );
        },
        reactivateProceeding: (reference) =>
            set(
                produce((state: ProceedingsState) => {
                    state.proceedings[reference].status = shouldHaveStatus(state.proceedings[reference], true);
                    window.ON_PROCEEDING_STATUS_CHANGE?.(state.proceedings[reference], 'done');
                })
            ),
        setReactorData: (id, reactorData) =>
            set(
                produce((state: ProceedingsState) => {
                    const reference = id.match(id_regex)?.[1];
                    if (!reference) return;
                    state.proceedings[reference].messages[id].reactorData = reactorData;
                })
            ),
        removeProceeding: (reference) =>
            set(
                produce((state: ProceedingsState) => {
                    delete state.proceedings[reference];
                })
            ),
        clearProceedings: () => set({ proceedings: {} }),
        mapEmailToProceeding: (email) => {
            const proceedings = get().proceedings;
            for (const [reference, prcd] of Object.entries(proceedings)) {
                if (prcd.status === 'done') continue;

                let replyFound = false;
                for (const msg of Object.values(prcd.messages)) {
                    if (msg.extra?.emailId && msg.extra.emailId === email.envelope.messageId) return;
                    if (
                        email.envelope.inReplyTo !== undefined &&
                        msg.extra?.emailId !== undefined &&
                        email.envelope.inReplyTo === msg.extra.emailId
                    )
                        replyFound = true;
                }
                if (replyFound) return reference;
                if (email.envelope.subject?.match(reference)) return reference;
            }
        },
        updateStatuses: () =>
            set(
                produce((state: ProceedingsState) => {
                    for (const [ref, prcd] of Object.entries(state.proceedings)) {
                        const oldStatus = state.proceedings[ref].status;
                        const newStatus = shouldHaveStatus(prcd);
                        if (oldStatus !== newStatus) {
                            state.proceedings[ref].status = newStatus;
                            window.ON_PROCEEDING_STATUS_CHANGE?.(state.proceedings[ref], oldStatus);
                        }
                    }
                })
            ),
        // TODO: remove the my requests migration code and notify users about the migration
        migrationDone: () => set({ _migratedLegacyRequests: true }),
        _hasHydrated: false,
        _migratedLegacyRequests: false,
    }),
    {
        name: 'Datenanfragen.de-proceedings',
        version: 0,
        getStorage: () => proceedingsStorage,
        onRehydrateStorage: () => (state) => {
            if (!state) return;

            state.drink();
            state.updateStatuses();
        },
        deserialize: (str) =>
            produce(JSON.parse(str) as ProceedingsStorageValue, (stored_object) => {
                if (!stored_object.state.proceedings) return;

                for (const [reference, proceeding] of Object.entries(stored_object.state.proceedings)) {
                    for (const [id, message] of Object.entries(proceeding.messages)) {
                        stored_object.state.proceedings[reference].messages[id].date = new Date(message.date);
                    }
                }
            }),
    }
);

export const getNameFromMesssage = <T = ComponentChildren>(msg: Message | undefined, fallback?: T) => {
    const recipient_name = msg?.correspondent_address?.split('\n')[0];
    const correspondent_email = msg?.correspondent_email;

    return recipient_name && recipient_name.length > 0
        ? recipient_name
        : correspondent_email && correspondent_email.length > 0
        ? correspondent_email
        : fallback;
};

export const compareMessage = (msgA: Message, msgB: Message) => {
    if (msgA.date < msgB.date) return -1;
    else if (msgA.date == msgB.date) {
        if ((msgA.slug ?? 0) < (msgB.slug ?? 0)) return -1;
        else if (msgA.slug == msgB.slug) {
            if (msgA.reference < msgB.reference) return -1;
            else if (msgA.reference == msgB.reference) return 0;
            return 1;
        }
        return 1;
    }
    return 1;
};

/**
 * A proceeding can have an unlimited number of `response`s written by the user or company, but only one each of the
 * messages we generate (initial request, admonition, complaint).
 *
 * Note: This restriction is currently not actually enforced by the store. If a proceeding (wrongly) has more than
 * one generated message of a type, this helper returns the first one.
 */
export const getGeneratedMessage = (
    proceeding: Proceeding,
    type: RequestType | 'request' | 'admonition' | 'complaint'
): Message | undefined =>
    Object.values(proceeding.messages).find((m) =>
        type === 'request' ? REQUEST_TYPES.includes(m.type as 'access') : m.type === type
    );
export const getNewestMessage = (proceeding: Proceeding): Message | undefined => {
    const msgArray = Object.values(proceeding.messages).sort(compareMessage);
    return msgArray[msgArray.length - 1];
};

export const getProceedingDueDate = (proceeding: Proceeding): Date | undefined => {
    const newestMessage = getNewestMessage(proceeding);
    // We can only determine a reasonable due dates for proceedings where the latest message was generated by us. For
    // everything else, we just don't have enough information.
    if (!newestMessage?.sentByMe) return undefined;

    const dueDate = new Date(newestMessage.date);

    // For complaints, the SVA needs to at least inform the data subject about the progress or outcome of the
    // complaint within three months (Art. 78(2) GDPR).
    if (newestMessage.type === 'complaint') dueDate.setDate(dueDate.getDate() + 3 * 31);
    // In our admonitions, we set a period of two weeks.
    else if (newestMessage.type === 'admonition') dueDate.setDate(dueDate.getDate() + 14);
    // For requests, controllers regularly have to respond within one month (Art. 12(3) GDPR). While this could be
    // extended to three months if justified, we can't handle that here.
    else if (newestMessage.type !== 'custom' && REQUEST_TYPES.includes(newestMessage.type as 'access'))
        dueDate.setDate(dueDate.getDate() + 31);
    // Otherwise, we can't know the due date.
    else return undefined;

    return dueDate;
};
const shouldHaveStatus = (proceeding: Proceeding, ignoreDone = false): ProceedingStatus => {
    if (!ignoreDone && proceeding.status === 'done') return 'done';

    const newestMessage = getNewestMessage(proceeding);
    if (newestMessage?.sentByMe) {
        const dueDate = getProceedingDueDate(proceeding);
        if (dueDate && new Date() > dueDate) return 'overdue';
        return 'waitingForResponse';
    }

    return 'actionNeeded';
};

const { devtools } =
    process.env.NODE_ENV === 'development' ? require('zustand/middleware') : { devtools: (d: unknown) => d };

// These monster types are necessary because the type inference doesn't work anymore "if you do something fancy". The types are taken from https://github.com/pmndrs/zustand/blob/4d8003b363cb06ee5b1da498300a60576419485a/tests/middlewareTypes.test.tsx
// TODO: This seems to change in zustand v4 and should make inference possible again? Revisit this if we update!
export const useProceedingsStore =
    process.env.NODE_ENV === 'development'
        ? create<
              ProceedingsState,
              SetState<ProceedingsState>,
              GetState<ProceedingsState>,
              Mutate<
                  StoreApi<ProceedingsState>,
                  [['zustand/persist', Partial<ProceedingsState>], ['zustand/devtools', never]]
              >
          >(devtools(proceedingsStore))
        : create<
              ProceedingsState,
              SetState<ProceedingsState>,
              GetState<ProceedingsState>,
              Mutate<StoreApi<ProceedingsState>, [['zustand/persist', Partial<ProceedingsState>]]>
          >(proceedingsStore);

export const proceedingFromRequest = (
    request: Request | UserRequest,
    subject?: string,
    content?: Content,
    extra?: Record<string, string>
): Proceeding => ({
    reference: request.reference,
    messages: {
        [`${request.reference}-00`]: {
            id: `${request.reference}-00`,
            reference: request.reference,
            date: new Date(request.date),
            type:
                request.type === 'custom'
                    ? // TODO: The `response_type` is only necessary to migrate the legacy requests. Remove it once the migration is done.
                      (request as typeof request & { response_type?: 'admonition' | 'complaint' }).response_type ||
                      'response'
                    : request.type,
            // Our batch implementation heavily depends on each company having a slug, which obviously breaks for custom
            // companies. I'm not happy with this but changing it be a huge hassle (I tried…). So instead, we generate a
            // slug in angle brackets for custom companies and then discard that slug here. This will work since the
            // company schema doesn't allow angle brackets in slugs.
            slug: request.slug.startsWith('<') ? undefined : request.slug,
            correspondent_address: isUserRequest(request) ? request.recipient : request.recipient_address,
            correspondent_email: request.email,
            transport_medium: isUserRequest(request) ? request.via : request.transport_medium,
            subject,
            content,
            sentByMe: true,
            extra,
        },
    },
    status: 'waitingForResponse',
});

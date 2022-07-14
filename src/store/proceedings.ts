import type { Request } from '../types/request';
import { Message, MessageId, Proceeding } from '../types/proceedings.d';
import create, { StateCreator, StoreApi } from 'zustand';
import { persist, StateStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { Privacy, PRIVACY_ACTIONS } from '../Utility/Privacy';
import type { SetOptional } from 'type-fest';
import { ErrorException } from '../Utility/errors';
import localforage from 'localforage';

export interface ProceedingsState {
    proceedings: Record<string, Proceeding>;
    addProceeding: (proceeding: Proceeding) => void;
    addRequest: (request: Request) => void;
    addMessage: (message: SetOptional<Message, 'id'>) => void;
    removeMessage: (id: MessageId) => void;
    addAttachment: (id: MessageId, file: unknown) => void;
    removeProceeding: (reference: string) => void;
    clearProceedings: () => void;
    _hasHydrated: boolean;
    drink: () => void;
}

const id_regex = /^(\d{4,}-[\dA-Za-z]{7,})-(\d+)$/;

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
        addRequest: (request) => get().addProceeding(proceedingFromRequest(request)),
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
                })
            ),
        removeMessage: (id) =>
            set(
                produce((state: ProceedingsState) => {
                    const reference = id.match(id_regex)?.[1];
                    if (!reference) return;
                    delete state.proceedings[reference].messages[id];
                })
            ),
        // TODO: Implement a file API…
        addAttachment: (id, file) => {
            throw new ReferenceError('Not implemented');
        },
        removeProceeding: (reference) =>
            set(
                produce((state: ProceedingsState) => {
                    delete state.proceedings[reference];
                })
            ),
        clearProceedings: () => set({ proceedings: {} }),
        _hasHydrated: false,
    }),
    {
        name: 'Datenanfragen.de-proceedings',
        version: 0,
        getStorage: () =>
            localforage.createInstance({ name: 'Datenanfragen.de', storeName: 'proceedings' }) as StateStorage, // This casting is necessary, because zustand only accepts Promise<void> as a retunr type, while localforage returns Promise<string>, the APIs are otherwise compatible.
        onRehydrateStorage: () => (state) => state && state.drink(),
    }
);

const { devtools } =
    process.env.NODE_ENV === 'development' ? require('zustand/middleware') : { devtools: (d: unknown) => d };

export const useProceedingsStore =
    process.env.NODE_ENV === 'development'
        ? create<ProceedingsState>(devtools(proceedingsStore))
        : create<ProceedingsState>(proceedingsStore);

export const proceedingFromRequest = (request: Request, subject?: string, content?: string): Proceeding => ({
    reference: request.reference,
    messages: {
        [`${request.reference}-00`]: {
            id: `${request.reference}-00`,
            reference: request.reference,
            date: new Date(request.date),
            type: request.type === 'custom' ? request.response_type || 'response' : request.type,
            slug: request.slug,
            recipient: request.recipient_address,
            email: request.email,
            transport_medium: request.transport_medium,
            subject,
            content,
        },
    },
    status: 'waitingForResponse',
});

import type { Request } from '../types/request';
import { Message, MessageId, Proceeding } from '../types/proceedings.d';
import create, { GetState, SetState, StoreApi, Mutate } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { Privacy, PRIVACY_ACTIONS } from '../Utility/Privacy';
import type { SetOptional } from 'type-fest';
import { ErrorException } from '../Utility/errors';
import { UserRequest } from '../DataType/UserRequests';
import { isUserRequest } from '../Utility/requests';
import { LocalforagePrivacy } from '../Utility/LocalforagePrivacy';

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
    _migratedLegacyRequests: boolean;
    migrationDone: () => void;
    drink: () => void;
}

const id_regex = /^(\d{4,}-[\dA-Za-z]{7,})-(\d+)$/;

const proceedingsStorage = new LocalforagePrivacy(() => Privacy.isAllowed(PRIVACY_ACTIONS.SAVE_MY_REQUESTS), {
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
        // TODO: remove the my requests migration code and notify users about the migration
        migrationDone: () => set({ _migratedLegacyRequests: true }),
        _hasHydrated: false,
        _migratedLegacyRequests: false,
    }),
    {
        name: 'Datenanfragen.de-proceedings',
        version: 0,
        getStorage: () => proceedingsStorage,
        onRehydrateStorage: () => (state) => state && state.drink(),
    }
);

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
    content?: string
): Proceeding => ({
    reference: request.reference,
    messages: {
        [`${request.reference}-00`]: {
            id: `${request.reference}-00`,
            reference: request.reference,
            date: new Date(request.date),
            type: request.type === 'custom' ? request.response_type || 'response' : request.type,
            slug: request.slug,
            recipient: isUserRequest(request) ? request.recipient : request.recipient_address,
            email: request.email,
            transport_medium: isUserRequest(request) ? request.via : request.transport_medium,
            subject,
            content,
        },
    },
    status: 'waitingForResponse',
});

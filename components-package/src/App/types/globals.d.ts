import type { appTranslations } from '../index';
import type { GetMessageResult } from '../../../../src/types/proceedings';

declare global {
    interface Window {
        readonly I18N_DEFINITION_APP: typeof appTranslations['en'];

        email: {
            recreateEmailClients: (options: RecreateEmailClientsOptions) => Promise<RecreateEmailClientsReturn>;
            verifyConnection: () => Promise<boolean>;
            setEmailAccountPassword: (protocol: 'imap' | 'smtp', password: string) => Promise<void>;
            sendMessage: (options: SendMessageOptions) => SendMessageReturn;
            getFolders: () => Promise<string[]>;
            getMessages: (options: GetMessageOptions) => Promise<GetMessageResult[]>;
            downloadMessage: (folder: string, seq: number) => Promise<ArrayBuffer>;
            htmlToPdf: (html: string, title?: string, address?: string) => Promise<Blob>;
        };
    }
}

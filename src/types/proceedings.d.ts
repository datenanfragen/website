import type { RequestType, TransportMedium } from '../types/request';
import type { ReactorState } from '../store/reactor';
import { PROCEEDING_STATUS } from '../Utility/requests';

type MessageId = string;

export type Proceeding = {
    reference: string;
    messages: Record<MessageId, Message>;
    status: ProceedingStatus;
};

export type ProceedingStatus = typeof PROCEEDING_STATUS[number];

export type Message = {
    id: MessageId;
    reference: string;
    date: Date;
    type: RequestType | 'response' | 'admonition' | 'complaint';
    slug?: string;
    correspondent_address: string;
    correspondent_email: string;
    transport_medium: TransportMedium;
    subject?: string;
    content?: Content;
    sentByMe: boolean;
    reactorData?: ReactorState['moduleData'];
    extra?: Record<string, string | undefined>;
};

export type Content = {
    blobId: string;
    filename?: string;
};

export type GetMessageResult = {
    seq: number;
    uid: number;
    envelope: {
        from?: EmailAddress[];
        to?: EmailAddress[];
        subject?: string;
        messageId?: string;
        inReplyTo?: string;
        date?: Date;
    };
};
type EmailAddress = {
    name?: string;
    address?: string;
};

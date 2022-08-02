import type { RequestType, TransportMedium } from '../types/request';
import { PROCEEDING_STATUS } from '../Utility/requests';

type MessageId = string;

type Proceeding = {
    reference: string;
    messages: Record<MessageId, Message>;
    status: ProceedingStatus;
};

export type ProceedingStatus = typeof PROCEEDING_STATUS[string];

type Message = {
    id: MessageId;
    reference: string;
    date: Date;
    type: RequestType | 'response' | 'admonition' | 'complaint';
    slug?: string;
    correspondent_address: string;
    correspondent_email: string;
    transport_medium: TransportMedium;
    subject?: string;
    content?: string;
    sentByMe: boolean;
};

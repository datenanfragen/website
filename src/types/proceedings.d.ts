import type { ResponseType, RequestType, TransportMedium } from '../types/request';
import { PROCEEDING_STATUS } from '../Utility/requests';

type MessageId = string;

type Proceeding = {
    reference: string;
    messages: Record<MessageId, Message>;
    status: ProceedingStatus;
};

type ProceedingStatus = typeof PROCEEDING_STATUS[string];

type Message = {
    id: MessageId;
    reference: string;
    date: Date;
    type: RequestType | ResponseType | 'response';
    slug?: string;
    correspondent_address: string;
    correspondent_email: string;
    transport_medium: TransportMedium;
    subject?: string;
    content?: string;
    sentByMe: boolean;
};

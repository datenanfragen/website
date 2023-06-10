declare module 'postal-mime' {
    export default class PostalMime {
        parse(email: string | ArrayBuffer | Blob): Promise<ParsedEmail>;
    }

    type ParsedEmail = {
        headers: { key: string; value: string }[];
        from: AddressObject;
        sender: AddressObject;
        replyTo: AddressObject;
        deliveredTo: string;
        returnPath;
        string;
        to: AddressObject[];
        cc: AddressObject[];
        bcc: AddressObject[];
        subject: string;
        messageId: string;
        inReplyTo: string;
        references: string;
        date: string;
        html: string;
        text: string;
        attachments: {
            filename: string;
            mimeType: string;
            disposition: 'attachment' | 'inline' | null;
            related: boolean;
            contentId: string;
            content: ArrayBuffer;
        }[];
    };
    type AddressObject = {
        name: string;
        address: string;
    };
}

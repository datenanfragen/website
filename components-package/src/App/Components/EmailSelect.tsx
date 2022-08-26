import { useEffect, useState } from 'preact/hooks';

type GetMessageResult = {
    seq: number;
    uid: number;
    envelope: {
        from?: string[];
        to?: string[];
        subject?: string;
        emailId?: string;
    };
};

type EmailSelectProps = {
    emailFolder: string;
};

export const EmailSelect = (props: EmailSelectProps) => {
    const [messages, setMessages] = useState<Set<GetMessageResult>>(new Set());
    const [messageCursor, setMessageCursor] = useState<number>(1);

    return (
        <>
            {props.emailFolder !== '' && (
                <>
                    <button
                        onClick={() =>
                            window.email
                                .getMessages({ folder: props.emailFolder, cursor: messageCursor })
                                .then((msgs) => setMessages(new Set([...messages, ...msgs])))
                        }>
                        Fetch Messages
                    </button>

                    {messages.size > 0 && (
                        <select multiple={true}>
                            {[...messages].map((msg) => (
                                <option value={msg.uid}>{msg.envelope.subject}</option>
                            ))}
                        </select>
                    )}
                </>
            )}
        </>
    );
};

import { useEffect, useRef } from 'react';
import Message from '../../ui/message/Message';
import MessageDate from '../../ui/message_date/MessageDate';
import NoMessages from '../../ui/no_messages/NoMessages';

import styles from '../messages_area/messages_area.module.css';

function MessagesArea({
    messages,
    currentUserId
}) {

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [messages]);

    return (
        <div className={styles.messages_list}>

            {messages.length === 0 && <NoMessages />}

            {messages.map((message, index) => {

                const currentDate =
                    new Date(message.sendedAt).toDateString();

                const prevDate =
                    index > 0
                        ? new Date(
                            messages[index - 1].sendedAt
                        ).toDateString()
                        : null;

                const showDate =
                    currentDate !== prevDate;

                const isMe =
                    message.senderId === currentUserId;

                return (
                    <div
                        key={message.id}
                    >
                        {showDate && (
                            <div className={styles.date_block}>
                                <MessageDate
                                    date={message.sendedAt}
                                />
                            </div>
                        )}

                        <div
                            className={styles.row}
                            style={{
                                justifyContent:
                                    isMe
                                        ? 'end'
                                        : 'start'
                            }}
                        >
                            <Message
                                isMe={isMe}
                                message={message.text}
                                senderName={
                                    !isMe
                                        ? message.senderName
                                        : null
                                }
                                createdAt={message.sendedAt}
                            />
                        </div>
                    </div>
                );
            })}

            <div ref={bottomRef}></div>

        </div>
    );
}

export default MessagesArea;
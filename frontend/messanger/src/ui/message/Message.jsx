import styles from '../message/message.module.css';

function Message({
    isMe,
    message,
    senderName,
    createdAt
}) {

    const time =
        new Date(createdAt).toLocaleTimeString(
            'ru-RU',
            {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }
        );

    return (
        <div
            className={styles.bubble}
            style={{
                backgroundColor:
                    isMe
                        ? '#b9cbea'
                        : '#f0f0f0',

                borderRadius:
                    isMe
                        ? '16px 1px 16px 16px'
                        : '1px 16px 16px 16px'
            }}
        >
            {senderName && (
                <div className={styles.sender_name}>
                    <p>{senderName}</p>
                </div>
            )}

            <div className={styles.text}>
                <p>{message}</p>
            </div>

            <div className={styles.time}>
                <p>{time}</p>
            </div>

        </div>
    );
}

export default Message;
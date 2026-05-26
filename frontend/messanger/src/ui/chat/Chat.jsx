import Avatar from '../avatar/Avatar';
import styles from '../chat/chat.module.css';
import LastMessage from '../last_message/LastMessage';
import MessageDate from '../message_date/MessageDate';
import UserName from '../user_name/UserName';

function Chat({
    active,
    onClick,
    name,
    receivedLastMessage,
    who,
    date
}) {

    return (
        <div
            className={`${styles.chat} ${active ? styles.active : ''}`}
            onClick={onClick}
        >
            <Avatar />

            <div className={styles.name_with_message_part}>
                <UserName name={name} />

                <LastMessage
                    who={who}
                    message={receivedLastMessage}
                />
            </div>

            <MessageDate date={date} />
        </div>
    );
}

export default Chat;
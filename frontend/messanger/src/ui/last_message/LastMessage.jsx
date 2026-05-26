import styles from '../last_message/last_message.module.css';

function LastMessage({who, message}){
    return(
        <div className={styles.who_and_last_message_block}>
            <p className={styles.who}>{`${who ? who + ':' : ''}`}</p>
            <p className={styles.message}>{message}</p>
        </div>
    )
}

export default LastMessage;
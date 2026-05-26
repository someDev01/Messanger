import { CircleSlash, MessageCircleWarningIcon } from 'lucide-react';
import styles from '../no_messages/no_messages.module.css';

function NoMessages(){
    return(
        <div className={styles.wrapper}>
            <MessageCircleWarningIcon size={36} color='#e0b700'/>
            <p>У вас нет сообщений с этим пользователем. Начните общаться и сообщения будут отображаться здесь</p>
        </div>
    )
}

export default NoMessages;
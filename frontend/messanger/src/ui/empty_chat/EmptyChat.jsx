import { MessageCircleOff, MessageSquareTextIcon } from 'lucide-react';
import styles from '../empty_chat/empty_chat.module.css';

function EmptyChat(){
    return(
        <div className={styles.empty}>
            <MessageCircleOff size={50} color='black'/>
            <h2>Пока нет сообщений</h2>
            <p>Выберите чат или начните новый чат</p>
        </div>
    )
}

export default EmptyChat;
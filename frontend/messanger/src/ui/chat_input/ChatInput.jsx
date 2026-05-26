import styles from '../chat_input/chat_input.module.css';

function ChatInput(){
    return(
        <div className={styles.chat_input}>
            <input 
                type='search' 
                onChange={() => {}}
                placeholder='поиск'
            />
        </div>
    )
}

export default ChatInput;
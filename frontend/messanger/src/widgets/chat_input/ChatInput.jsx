import { SendHorizontal, Upload } from 'lucide-react';
import styles from '../chat_input/chat_input.module.css';

function ChatInput({inputValue, setInputValue, onSend}){
    return(
        <div className={styles.section}>
            <button className={styles.load_button}>
                <Upload size={20} color='#282828'/>
            </button>
            <input 
                type="text" 
                placeholder='написать сообщение'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {if(e.key === 'Enter') onSend();}}
            />
            <button className={styles.send_button} onClick={onSend}>
                <SendHorizontal size={22} color='#282828'/>
            </button>
        </div>
    )
}

export default ChatInput;
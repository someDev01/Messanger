import { MessageCircleMoreIcon, PhoneCall, Settings } from 'lucide-react';
import styles from '../navigation_button/navigation_button.module.css';

function NavigationButton({type, active, onClick}){
    return(
        <div className={`${styles.button} ${active ? styles.active : ""}`} onClick={onClick}>
            {type === 'chats' && <MessageCircleMoreIcon size={22} color='#3b3b3b'/>}
            {type === 'calls' && <PhoneCall size={22} color='#3b3b3b'/>}
            {type === 'settings' && <Settings size={22} color='#3b3b3b'/>}
        </div>
    )
}

export default NavigationButton;
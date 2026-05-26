import { EllipsisVertical } from 'lucide-react';
import styles from '../info/info.module.css';

function Info({onClick}){
    return(
        <div className={styles.info} onClick={onClick}>
            <EllipsisVertical size={20} color='black'/>
        </div>
    )
}

export default Info;
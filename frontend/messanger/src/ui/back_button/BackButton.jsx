import { ChevronLeftIcon } from "lucide-react";
import styles from '../back_button/back_button.module.css';

function BackButton({onClick}){
    return(
        <button className={styles.block_button} onClick={onClick}>
            <ChevronLeftIcon size={20}/>
        </button>
    )
}

export default BackButton;

import styles from '../user_name/user_name.module.css';

function UserName({name}){
    return(
        <p className={styles.name}>{name}</p>
    )
}

export default UserName;
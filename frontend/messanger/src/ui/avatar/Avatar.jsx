import styles from '../avatar/avatar.module.css';
const API = import.meta.env.VITE_API_URL;

function Avatar({avatar, name}){
    return(
        <div className={styles.icon}>
            {user.avatar ? (
                <img
                    src={`${API}${avatar}`}
                    alt="avatar"
                />
            ) : (
                name[0]
            )}
        </div>
    )
}

export default Avatar;
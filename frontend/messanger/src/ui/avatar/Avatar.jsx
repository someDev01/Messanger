import styles from '../avatar/avatar.module.css';
const API = import.meta.env.VITE_API_URL;

function Avatar({ avatar, name }) {
    return (
        <div className={styles.icon}>
            {avatar ? (
                <img
                    className={styles.image}
                    src={`${API}${avatar}`}
                    alt="avatar"
                />
            ) : (
                <span className={styles.fallback}>
                    {name?.[0] || '?'}
                </span>
            )}
        </div>
    );
}

export default Avatar;
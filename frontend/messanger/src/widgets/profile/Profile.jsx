import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './profile.module.css';

const API = import.meta.env.VITE_API_URL;

function Profile({ setActiveTab, setIsAuth }) {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        id: '',
        name: '',
        number: '',
        avatar: ''
    });

    useEffect(() => {
        const request = async () => {
            const session = localStorage.getItem('session');

            try {
                const res = await fetch(`${API}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${session}`
                    }
                });

                const data = await res.json();

                if (data.success) {
                    setProfile({
                        name: data.name,
                        number: data.number,
                        id: data.id,
                        avatar: data.avatar || ''
                    });
                }

            } catch (err) {
                console.log(err);
            }
        };

        request();
    }, []);

    const logout = () => {
        localStorage.removeItem('session');
        setIsAuth(false);
        navigate('/');
    };

    return (
        <div className={styles.wrapper}>

            {/* BACK BUTTON */}
            <button
                className={styles.backBtn}
                onClick={() => setActiveTab('chats')}
            >
                ← Назад
            </button>

            {/* AVATAR */}
            <div className={styles.avatar}>
                {profile.avatar ? (
                    <img src={profile.avatar} alt="avatar" />
                ) : (
                    <div className={styles.placeholder}>
                        {profile.name?.[0] || '?'}
                    </div>
                )}
            </div>

            {/* INFO */}
            <div className={styles.user_name}>
                <p>{profile.name}</p>
            </div>

            <div className={styles.user_number}>
                <p>#{profile.number}</p>
            </div>

            {/* UPLOAD */}
            <button className={styles.uploadBtn}>
                Изменить аватар
            </button>

            {/* LOGOUT */}
            <button className={styles.logoutBtn} onClick={logout}>
                Выйти
            </button>

        </div>
    );
}

export default Profile;
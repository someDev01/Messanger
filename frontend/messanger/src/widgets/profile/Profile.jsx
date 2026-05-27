import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './profile.module.css';

const API = import.meta.env.VITE_API_URL;

function Profile({ setActiveTab, setIsAuth }) {

    const navigate = useNavigate();

    const fileInputRef = useRef(null);

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

                    const savedAvatar =
                        localStorage.getItem(`avatar_${data.id}`);

                    setProfile({
                        name: data.name,
                        number: data.number,
                        id: data.id,
                        avatar: savedAvatar || ''
                    });

                }

            } catch (err) {
                console.log(err);
            }

        };

        request();

    }, []);

    const handleAvatarChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {

            const base64 = reader.result;

            localStorage.setItem(
                `avatar_${profile.id}`,
                base64
            );

            setProfile(prev => ({
                ...prev,
                avatar: base64
            }));

        };

        reader.readAsDataURL(file);

    };

    const logout = () => {

        localStorage.removeItem('session');

        setIsAuth(false);

        navigate('/');

    };

    return (
        <div className={styles.wrapper}>

            <button
                className={styles.backBtn}
                onClick={() => setActiveTab('chats')}
            >
                ← Назад
            </button>

            <div className={styles.avatar}>

                {profile.avatar ? (

                    <img
                        src={profile.avatar}
                        alt="avatar"
                    />

                ) : (

                    <div className={styles.placeholder}>
                        {profile.name?.[0] || '?'}
                    </div>

                )}

            </div>

            <div className={styles.user_name}>
                <p>{profile.name}</p>
            </div>

            <div className={styles.user_number}>
                <p>#{profile.number}</p>
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
            />

            <button
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current.click()}
            >
                Изменить аватар
            </button>

            <button
                className={styles.logoutBtn}
                onClick={logout}
            >
                Выйти
            </button>

        </div>
    );
}

export default Profile;
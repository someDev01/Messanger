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

            const session =
                localStorage.getItem('session');

            try {

                const res = await fetch(
                    `${API}/api/auth/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${session}`
                        }
                    }
                );

                const data = await res.json();

                if (data.success) {

                    setProfile({
                        id: data.id,
                        name: data.name,
                        number: data.number,
                        avatar: data.avatar || ''
                    });

                }

            } catch (err) {
                console.log(err);
            }
        };

        request();

    }, []);

    const handleUploadAvatar = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const session =
            localStorage.getItem('session');

        const formData = new FormData();

        formData.append('file', file);

        try {

            const res = await fetch(
                `${API}/api/auth/upload-avatar`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${session}`
                    },
                    body: formData
                }
            );

            const data = await res.json();

            if (!data.success) {
                console.log(data.error);
                return;
            }

            setProfile(prev => ({
                ...prev,
                avatar: `${API}${data.avatar}`
            }));

        } catch (err) {
            console.log(err);
        }
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

            <label className={styles.uploadBtn}>

                Загрузить аватар

                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleUploadAvatar}
                />

            </label>

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
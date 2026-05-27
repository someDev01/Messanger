import { useEffect, useState } from 'react';
import styles from './auth_page.module.css';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../api/api';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_API_URL;

function AuthPage({setIsAuth}) {
    const [mode, setMode] = useState('login');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const session = localStorage.getItem('session');
            if (!session) return;

            try {
            const res = await fetch(`${API}/api/auth/me`, {
                headers: {
                Authorization: `Bearer ${session}`
                }
            });

            const data = await res.json();

            if (data.success) {
                setIsAuth(true);
                navigate('/chat');
            } else {
                localStorage.removeItem('session');
                setIsAuth(false);
            }
            } catch (err) {
            localStorage.removeItem('session');
            setIsAuth(false);
            }
        };

        checkAuth();
    }, [navigate, setIsAuth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            username: '',
            password: '',
        };

        if (!formData.username.trim()) {
            newErrors.username = 'Введите логин';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Введите пароль';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((err) => err);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            let response;

            if (mode === 'register') {
                response = await registerUser(
                    formData.username,
                    formData.password
                );

                if (!response.success) {
                    toast.error(response.error);
                    return;
                }

                toast.success(response.mes);
                return;
            } else {
                response = await loginUser(
                    formData.username,
                    formData.password
                );

                if (!response.success) {
                    toast.error(response.error);
                    return;
                }

                const session = response.session;

                localStorage.setItem('session', session);

                toast.success(response.mes);
                setIsAuth(true);
                navigate('/chat');
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
    <div className={styles.page}>
        <div className={styles.card}>
        <div className={styles.topPart}>
            <h1>{mode === 'login' ? 'Авторизация' : 'Регистрация'}</h1>
            <p>{mode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}</p>
        </div>

        <div className={styles.switchButtons}>
            <button
                className={mode === 'login' ? styles.activeButton : styles.switchButton}
                onClick={() => setMode('login')}
            >
                Вход
            </button>
            <button
                className={mode === 'register' ? styles.activeButton : styles.switchButton}
                onClick={() => setMode('register')}
            >
                Регистрация
            </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
            <label>Логин</label>
            <input
                type="text"
                name="username"
                placeholder="Введите логин"
                value={formData.username}
                onChange={handleChange}
            />
            {errors.username && (
                <span className={styles.error}>{errors.username}</span>
            )}
            </div>

            <div className={styles.field}>
            <label>Пароль</label>
            <input
                type="password"
                name="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
            />
            {errors.password && (
                <span className={styles.error}>{errors.password}</span>
            )}
            </div>

            <button type="submit" className={styles.submitButton}>
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
        </form>
        </div>
    </div>
    );
}

export default AuthPage;
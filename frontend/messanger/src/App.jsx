import { useEffect, useState } from "react";

import AuthPage from "./pages/auth/AuthPage";
import MainPage from "./pages/main/MainPage";

import {
    Route,
    Routes,
    Navigate,
    Outlet
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { webPushRegister } from "./api/api";

const PUBLIC_KEY_WEB_PUSH = 'BF7hknOjK-AJprw9Kkec6wnn-Z8EU0S-bk9rCQufgmws22qPMhF1szd0ns1Wv9Ig7RM0kzFIJSXoJsbBDDVBfGQ';
function App() {

    const [isAuth, setIsAuth] = useState(() => {
        return !!localStorage.getItem('session');
    });

    useEffect(() => {

        const checkAuth = async () => {
            const session = localStorage.getItem('session');            

            if (!session) {
                setIsAuth(false);
            }    
            else{
                setIsAuth(true);
            }

        }
        checkAuth();
        subscribeUser();
    }, []);

    async function subscribeUser(){
        const reg = await navigator.serviceWorker.register('/sw.js');
        const permission = await Notification.requestPermission();
        if(permission !== 'granted') return;

        const subscribtion = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY_WEB_PUSH)
        });

        await webPushRegister(subscribtion);
    };

    function urlBase64ToUint8Array(base64String){
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
    }

    if(isAuth === null){
        return <div className="">Loading...</div>
    }

    return (
        <>
            <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar={true}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                theme="dark"
            />

            <Routes>
                <Route path="/" element={<AuthPage setIsAuth={setIsAuth}/>}/>
                <Route element={<ProtectedRoute isAuth={isAuth}/>}>
                    <Route path="/chat" element={<MainPage setIsAuth={setIsAuth}/>}/>
                </Route>

            </Routes>
        </>
    );
}

export default App;

function ProtectedRoute({isAuth}) {

    if (!isAuth) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <Outlet />;
}
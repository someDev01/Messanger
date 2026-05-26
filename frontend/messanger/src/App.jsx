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

function App() {

    const [isAuth, setIsAuth] = useState(null);

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
    }, []);

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
import styles from '../main/main_page.module.css';
import ChatWindow from '../../widgets/chat_window/ChatWindow';
import SideBar from '../../widgets/side_bar/SideBar';

import { useEffect, useState } from 'react';
import Profile from '../../widgets/profile/Profile';

const API = import.meta.env.VITE_API_URL;

function MainPage({setIsAuth}) {

    const [currentUserId, setCurrentUserId] = useState(null);
    const [rooms, setRooms] = useState([]);

    const [selectedRoomId, setSelectedRoomId] = useState(null);    

    const selectedRoom =
        rooms.find(room => room.id === selectedRoomId);

    const [activeTab, setActiveTab] =
        useState('chats');

    const [isMobileChatOpen, setIsMobileChatOpen] =
        useState(false);

    const [isMobile, setIsMobile] =
        useState(window.innerWidth <= 768);
    
    useEffect(() => {
        const loadChats = async () => {

            const session = localStorage.getItem('session');

            try {
                const res = await fetch(`${API}/api/messages/chats`,
                    {
                        headers: {
                            Authorization: `Bearer ${session}`
                        }
                    }
                );

                const data = await res.json();

                setRooms(prev => {

                    // если вообще нет старых данных
                    if (!prev || prev.length === 0) {
                        return data;
                    }

                    // merge по id
                    const map = new Map(prev.map(r => [r.id, r]));

                    data.forEach(newRoom => {
                        map.set(newRoom.id, {
                            ...map.get(newRoom.id),
                            ...newRoom
                        });
                    });

                    return Array.from(map.values());
                });

            } catch (err) {
                console.log(err);
            }
        };

        loadChats();

        const interval = setInterval(loadChats, 3000);

        return () => clearInterval(interval);

    }, []);

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
                    setCurrentUserId(data.id);
                }

            } catch (err) {
                console.log(err);
            }
        };
        
        request();
    }, []);

    useEffect(() => {

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    return (
        <div className={styles.container}>

            {activeTab === 'chats' && (
                <>

                    {(!isMobile || !isMobileChatOpen) && (
                        <SideBar
                            rooms={rooms}
                            setRooms={setRooms}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            selectedRoomId={selectedRoomId}
                            setSelectedRoomId={setSelectedRoomId}
                            setIsMobileChatOpen={setIsMobileChatOpen}
                        />
                    )}

                    {(!isMobile || isMobileChatOpen) && (
                        <ChatWindow
                            selectedRoom={selectedRoom}
                            setIsMobileChatOpen={setIsMobileChatOpen}
                            isMobile={isMobile}
                            setRooms={setRooms}
                            setSelectedRoomId={setSelectedRoomId}
                            currentUserId={currentUserId}
                        />
                    )}

                </>
            )}
            {activeTab === 'settings' && <Profile setActiveTab={setActiveTab} setIsAuth={setIsAuth}/>}

        </div>
    );
}

export default MainPage;
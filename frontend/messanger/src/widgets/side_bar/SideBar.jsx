import { useState } from 'react';
import Chat from '../../ui/chat/Chat';
import ChatInput from '../../ui/chat_input/ChatInput';
import Info from '../../ui/info/Info';
import LogoTitle from '../../ui/logo/LogoTitle';
import UserNavigation from '../../ui/user_navigation/UserNavigation';

import styles from '../side_bar/side_bar.module.css';
import { User } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

function SideBar({
    rooms,
    setRooms,
    activeTab,
    setActiveTab,
    selectedRoomId,
    setSelectedRoomId,
    setIsMobileChatOpen
}) {

    const [isOpenInfo, setIsOpenInfo] = useState(false);

    const [search, setSearch] = useState('');

    const [users, setUsers] = useState([]);

    const handleSearch = async (e) => {

        const value = e.target.value;

        setSearch(value);

        if (!value.trim()) {
            setUsers([]);
            return;
        }

        try {
            const session = localStorage.getItem('session');
            const res = await fetch(
                `${API}/api/auth/search?query=${value}`,
                {
                    headers:{
                        Authorization: `Bearer ${session}`
                    }
                }
            );

            const data = await res.json();

            setUsers(data);

        } catch (err) {
            console.log(err);
        }
    };

    const openChat = (user) => {

        const room = {
            id: user.id,
            name: user.name,
            lastMessage: '',
            lastSenderName: ''
        };

        setRooms(prev => {

            const exists =
                prev.some(r => r.id === user.id);

            if (exists) return prev;

            return [room, ...prev];
        });

        setSelectedRoomId(user.id);

        setIsMobileChatOpen(true);

        setUsers([]);

        setSearch('');
    };

    return (
        <div className={styles.side_bar}>

            <div className={styles.top_part}>

                <div className={styles.title_with_info}>

                    <LogoTitle />

                    <Info onClick={() => setIsOpenInfo(true)} />

                    {isOpenInfo && (
                        <div
                            className={styles.info_form}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                transform: 'translateY(90%)',
                                padding: '8px',
                                backgroundColor: '#dbdbdb',
                                borderRadius: '10px',

                            }}
                        >
                            <button
                                onClick={() => setIsOpenInfo(false)}
                                style={{cursor:'pointer', display:'flex', justifyContent:'center', alignContent:'center', borderRadius: '4px', border:'1px solid transparent'}}
                            >
                                X
                            </button>

                            <div
                                onClick={() => setActiveTab('settings')}
                                style={{
                                    cursor:'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <p>
                                    <User /> Профиль
                                </p>
                            </div>

                        </div>
                    )}

                </div>

                {/* SEARCH */}

                <input
                    type="text"
                    placeholder="Поиск пользователей"
                    value={search}
                    onChange={handleSearch}
                />

                {/* SEARCH USERS */}

                {users.map(user => (

                    <div
                        key={user.id}
                        className={styles.search_user}
                        onClick={() => openChat(user)}
                    >

                        <div className={styles.search_avatar}>
                            {user.name[0]}
                        </div>

                        <div className={styles.search_info}>

                            <p className={styles.search_name}>
                                {user.name}
                            </p>

                            <span className={styles.search_number}>
                                #{user.number}
                            </span>

                        </div>

                    </div>

                ))}

            </div>

            <div className={styles.middle_part}>

                <div className={styles.chats_list}>

                    {rooms.map((room) => (

                        <Chat
                            key={room.id}

                            active={
                                selectedRoomId === room.id
                            }

                            onClick={() => {
                                setSelectedRoomId(room.id);
                                setIsMobileChatOpen(true);
                            }}

                            name={room.name}

                            receivedLastMessage={
                                room.lastMessage
                            }

                            who={
                                room.lastSenderName
                            }

                            date={
                                room.lastMessageDate
                            }
                        />

                    ))}

                </div>

            </div>

            <div className={styles.bottom_part}>

                <UserNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

            </div>

        </div>
    );
}

export default SideBar;
import { useEffect, useState } from 'react';
import Avatar from '../../ui/avatar/Avatar';
import BackButton from '../../ui/back_button/BackButton';

import UserName from '../../ui/user_name/UserName';
import ChatInput from '../chat_input/ChatInput';
import MessagesArea from '../messages_area/MessagesArea';

import styles from '../chat_with_messages/chat_with_messages.module.css';

const API = import.meta.env.VITE_API_URL;

function ChatWithMessages({
  isMobile,
  setIsMobileChatOpen,
  selectedRoom,
  setRooms,
  setSelectedRoomId,
  currentUserId
}) {
  const [scrollReason, setScrollReason] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

   useEffect(() => {
      const loadMessages = async () => {
        if (!selectedRoom?.id) return;

        setMessages([]);
        
        const session = localStorage.getItem('session');

        try {
          const res = await fetch(
            `${API}/api/messages/${selectedRoom.id}`,
            {
              headers: {
                Authorization: `Bearer ${session}`
              }
            }
          );

          const data = await res.json();

          setMessages(prev => {
            const map = new Map(
              prev.map(m => [m.id, m])
            );

            data.forEach(m => {
              map.set(m.id, m);
            });

            return Array
              .from(map.values())
              .sort(
                (a, b) =>
                  new Date(a.sendedAt) -
                  new Date(b.sendedAt)
              );
          });

        } catch (err) {
          console.log(err);
        }
      };

    loadMessages();

    setScrollReason('open');

    const interval = setInterval(() => {
      loadMessages();
    }, 3000);


    return () => clearInterval(interval);


  }, [selectedRoom?.id]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const session = localStorage.getItem('session');

    try {
      const res = await fetch(`${API}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session}`
        },
        body: JSON.stringify({
          receiverId: selectedRoom.id,
          text: inputValue
        })
      });

      const newMessage = await res.json();

      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      setScrollReason('send');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top_part}>
        <div className={styles.left_part}>
          {isMobile && (
            <BackButton
              onClick={() => {
                setIsMobileChatOpen(false);
                setSelectedRoomId(null);
              }}
            />
          )}

          <div className={styles.user_info}>
            <Avatar avatar={selectedRoom.avatar} name={selectedRoom.name}/>
            <div className={styles.name_and_status}>
              <UserName name={selectedRoom.name} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.middle_part}>
        <MessagesArea
          messages={messages}
          currentUserId={currentUserId}
          scrollReason={scrollReason}
          setScrollReason={setScrollReason}
        />
      </div>

      <div className={styles.bottom_part}>
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}

export default ChatWithMessages;
import EmptyChat from '../../ui/empty_chat/EmptyChat';
import ChatWithMessages from '../chat_with_messages/ChatWithMessages';

import styles from '../chat_window/chat_window.module.css';

function ChatWindow({
    selectedRoom,
    setIsMobileChatOpen,
    isMobile,
    setRooms,
    setSelectedRoomId,
    currentUserId
}) {

    return (
        <div className={styles.window}>
            {selectedRoom ? (
                <ChatWithMessages
                    isMobile={isMobile}
                    setIsMobileChatOpen={setIsMobileChatOpen}
                    selectedRoom={selectedRoom}
                    setRooms={setRooms}
                    setSelectedRoomId={setSelectedRoomId}
                    currentUserId={currentUserId}
                />
            ) : (
                <EmptyChat />
            )}
        </div>
    );
}

export default ChatWindow;
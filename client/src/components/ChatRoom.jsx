import React, { useState, useEffect } from 'react';

const ChatRoom = ({ socket, username }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typingUser, setTypingUser] = useState('');

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    socket.on('typing', (user) => setTypingUser(user));
    return () => {
      socket.off('message');
      socket.off('typing');
    };
  }, [socket]);

  const sendMessage = () => {
    if (!message) return;
    socket.emit('sendMessage', { user: username, text: message, timestamp: new Date() });
    setMessage('');
  };

  const handleTyping = () => {
    socket.emit('typing', username);
  };

  return (
    <div className="p-4">
      <div className="border h-64 overflow-y-auto mb-2 p-2">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.text} <span className="text-xs italic">({new Date(msg.timestamp).toLocaleTimeString()})</span>
          </div>
        ))}
      </div>
      {typingUser && <p className="italic">{typingUser} is typing...</p>}
      <input 
        type="text" 
        value={message} 
        onChange={e => setMessage(e.target.value)} 
        onKeyPress={handleTyping}
        className="border p-2 w-3/4"
      />
      <button onClick={sendMessage} className="ml-2 bg-green-500 text-white p-2">Send</button>
    </div>
  );
};

export default ChatRoom;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatRoom from './components/ChatRoom';
import Navbar from './components/Navbar';

const socket = io('http://localhost:5000');

const App = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username.trim()) {
      socket.emit('join', username);
      setIsLoggedIn(true);
    }
  };

  return (
    <div>
      <Navbar />
      {!isLoggedIn ? (
        <div className="p-4">
          <input 
            type="text" 
            placeholder="Enter username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            className="border p-2"
          />
          <button onClick={handleLogin} className="ml-2 bg-blue-500 text-white p-2">Join Chat</button>
        </div>
      ) : (
        <ChatRoom socket={socket} username={username} />
      )}
    </div>
  );
};

export default App;

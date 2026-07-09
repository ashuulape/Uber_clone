import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocketContext must be used inside a SocketProvider');
  }

  return context;
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const clientSocket = io(import.meta.env.VITE_BASE_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    clientSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server:', clientSocket.id);
    });

    clientSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    setSocket(clientSocket);

    return () => {
      clientSocket.disconnect();
    };
  }, []);

  const sendMessage = (eventName, payload) => {
    
    if (!socket) {
      console.log('Socket not ready');
      return false;
    }
    socket.emit(eventName, payload);
    return true;
  };
 

  const receiveMessage = (eventName, callback) => {
    if (!socket) return undefined;

    socket.on(eventName, callback);
    return () => socket.off(eventName, callback);
  };

  const value = useMemo(
    () => ({
      socket,
      connected,
      sendMessage,
      receiveMessage,
    }),
    [socket, connected]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;

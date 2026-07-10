import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  const socketRef = useRef(null);
  if (!socketRef.current) {
    socketRef.current = io(import.meta.env.VITE_BASE_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });
  }
  const socket = socketRef.current;

  useEffect(() => {
    socket.on('connect', () => console.log('Connected to server:', socket.id));
    socket.on('disconnect', () => console.log('Disconnected from server'));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  const value = useMemo(() => ({ socket }), [socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
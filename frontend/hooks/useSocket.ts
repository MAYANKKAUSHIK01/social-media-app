import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from "sonner"; // UPDATED: Direct import

const socket = io('http://localhost:3000', { autoConnect: false });

export const useNotificationSocket = (userId: string | null) => {
  
  useEffect(() => {
    if (!userId) return;
    
    socket.connect();
    socket.emit('joinRoom', { userId });

    socket.on('notification', (data) => {
      // UPDATED: New Sonner syntax
      toast("New Notification", {
        description: data.message,
      });
    });

    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, [userId]);
};
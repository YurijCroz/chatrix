import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  user: { id: number; firstName: string };
  content: string;
}

interface UseSocketReturn {
  notifications: string | null;
  setNotifications: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useSocket = (
  user: { id: number; firstName: string } | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[] | null>>
): UseSocketReturn => {
  const [notifications, setNotifications] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (user) {
      socketRef.current = io("ws://localhost:4000", {
        query: {
          userId: user.id,
          firstName: user.firstName,
        },
      });

      const socket = socketRef.current;

      socket.on("receiveMessage", (message) => {
        if (user.id !== message.user.id) {
          setMessages((prevMessages) => [...(prevMessages || []), message]);
        }
      });

      socket.on("userConnected", ({ userId, firstName }) => {
        if (Number(userId) !== user.id) {
          setNotifications(`${firstName} приєднався до чату`);
        }
      });

      socket.on("userDisconnected", ({ userId, firstName }) => {
        if (Number(userId) !== user.id) {
          setNotifications(`${firstName} вийшов з чату`);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  return { notifications, setNotifications };
};

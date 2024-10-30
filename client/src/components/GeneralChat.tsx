import React, { useEffect, useRef, useState } from "react";
import api from "../api/axiosConfig";
import { SendMessage } from "./SendMessage";
import { useSocket } from "../hooks/useSocket";

const GeneralChat = ({ user }: { user: any }) => {
  const [messages, setMessages] = useState<null | any[]>(null);
  const [sendMessage, setSendMessage] = useState<null | any>(null);
  const chatWindowRef = useRef<HTMLDivElement | null>(null);

  const { notifications, setNotifications } = useSocket(user, setMessages);

  const getAllChat = async () => {
    const { data, status } = await api.get("/chat/all");
    setMessages(data);
    if (status === 200 && sendMessage) {
      setSendMessage(null);
    }
  };

  const handleSendMessage = async () => {
    if (!sendMessage) return;

    try {
      let messageContent = sendMessage.message;

      // Если сообщение - файл (картинка или голос), отправляем файл на сервер
      if (
        sendMessage.messageType === "picture" ||
        sendMessage.messageType === "voice"
      ) {
        const formData = new FormData();
        formData.append("file", sendMessage.message);
        const uploadResponse = await api.post("/chat/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        messageContent = uploadResponse.data.path; // URL загруженного файла
      }

      // Отправляем само сообщение на сервер
      const newMessage = await api.post("/chat/general-send", {
        message: messageContent,
        messageType: sendMessage.messageType,
      });

      if (newMessage.status === 201) {
        getAllChat();
      }
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, sendMessage]);

  useEffect(() => {
    if (notifications) {
      //@ts-ignore
      const timer = setTimeout(() => setNotifications(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  useEffect(() => {
    getAllChat();
  }, []);

  useEffect(() => {
    handleSendMessage();
  }, [sendMessage]);

  return (
    <>
      <div className="chatWindow" ref={chatWindowRef}>
        {messages &&
          messages.map((msg: any) => (
            <div
              className={`msg ${msg.user.id === user?.id ? "ownMessage" : ""}`}
              key={msg.id}
            >
              <div className="msgContent">
                <p className="msgUser">{msg.user.firstName}</p>
                {msg.messageType === "text" ? (
                  <p className="msgText">{msg.message}</p>
                ) : msg.messageType === "picture" ? (
                  <img
                    src={`http://localhost:4000${msg.message}`}
                    alt="Отправленное изображение"
                    className="msgImage"
                  />
                ) : (
                  <audio
                    controls
                    src={`http://localhost:4000${msg.message}`}
                    className="msgVoice"
                  />
                )}
              </div>
              <h6 className="msgTime">
                {new Date(msg.createdAt).toLocaleTimeString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h6>
            </div>
          ))}
        {sendMessage && sendMessage.messageType === "text" && (
          <div className={`msg sendOwnMessage`} key={sendMessage.id}>
            <div className="msgContent">
              <p className="msgUser">{sendMessage.user.firstName}</p>
              <p className="msgText">{sendMessage.message}</p>
            </div>
            <h6 className="msgTime">
              {new Date(sendMessage.createdAt).toLocaleTimeString("uk-UA", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h6>
          </div>
        )}
      </div>
      {user && <SendMessage setSendMessage={setSendMessage} user={user} />}
      {notifications && <div className="notification">{notifications}</div>}
    </>
  );
};

export default GeneralChat;

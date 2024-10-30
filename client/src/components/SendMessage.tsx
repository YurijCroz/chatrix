import React, { useState, useRef } from "react";

export const SendMessage = ({
  setSendMessage,
  user,
}: {
  setSendMessage: any;
  user: any;
}) => {
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSendMessage = (type: "text" | "picture" | "voice", content: any) => {
    if (type === "text" && !message.trim()) return;

    setSendMessage({
      message: type === "text" ? message.trim() : content,
      messageType: type,
      id: new Date(),
      createdAt: new Date(),
      user,
    });

    setMessage("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSendMessage("picture", file);
    }
  };

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        const audioBlob = event.data;
        handleSendMessage("voice", audioBlob);
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="sendMessageContainer">
      <input
        type="text"
        className="messageInput"
        placeholder="Введіть повідомлення..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="sendButton" onClick={() => handleSendMessage("text", message)}>
        Отправить
      </button>
      <label className="fileUploadButton">
        Изображение
        <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
      </label>
      <button
        className="voiceRecordButton"
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? "Стоп" : "Запись"}
      </button>
    </div>
  );
};

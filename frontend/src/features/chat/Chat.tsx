import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ClientMessage, IncomingMessage, MongoMessage } from "../../types";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../users/usersSlice.ts";

const Chat = () => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<MongoMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/chat");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      if (user && user.token) {
        ws.current?.send(JSON.stringify({
          type: "LOGIN",
          payload: user.token,
        } as ClientMessage));
      } else {
        navigate("/login");
      }
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      if(decodedMessage.type === "ONLINE_USERS") {
        setOnlineUsers(decodedMessage.payload as string[]);
      } else if(decodedMessage.type === "ALL_MESSAGES") {
        setMessages(decodedMessage.payload as MongoMessage[]);
      } else if (decodedMessage.type === "NEW_MESSAGE") {
        setMessages((prevMessages) => [...prevMessages, decodedMessage.payload as MongoMessage]);
      }
    };

    return () => {
      if (ws.current) {
        ws.current?.close();
      }
    }
  }, []);

  return (
    <>
      {
        messages.map((message) => (
          <div key={message._id}>{message.text} <br/> {message.createdAt.toLocaleString()}</div>
        ))
      }

      {
        onlineUsers.map((user) => (
          <div>{user}</div>
        ))
      }
    </>
  );
};

export default Chat;
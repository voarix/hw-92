import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ClientMessage, IncomingMessage, MongoMessage } from "../../types";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../users/usersSlice.ts";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import { Button, TextField, Typography } from "@mui/material";

const Chat = () => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<MongoMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [oneMessage, setOneMessage] = useState<string>("");

  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const sendMessage = () => {
    if (ws.current && oneMessage.trim() && user) {
      ws.current.send(
        JSON.stringify({
          type: "SEND_MESSAGE",
          payload: oneMessage,
        } as ClientMessage),
      );
    }
    setOneMessage("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    let timeOutServer: NodeJS.Timeout;

    const connect = () => {
      ws.current = new WebSocket("ws://localhost:8000/chat");

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        if (user && user.token) {
          ws.current?.send(
            JSON.stringify({
              type: "LOGIN",
              payload: user.token,
            } as ClientMessage),
          );
        } else {
          navigate("/login");
        }
      };


      ws.current.onmessage = (event) => {
        const decodedMessage = JSON.parse(event.data) as IncomingMessage;

        if (decodedMessage.type === "ONLINE_USERS") {
          setOnlineUsers(decodedMessage.payload as string[]);
        } else if (decodedMessage.type === "ALL_MESSAGES") {
          setMessages(decodedMessage.payload as MongoMessage[]);
        } else if (decodedMessage.type === "NEW_MESSAGE") {
          setMessages((prevMessages) => [
            ...prevMessages,
            decodedMessage.payload as MongoMessage,
          ]);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket closed, wait 5 seconds");
        timeOutServer = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current?.close();
      }
      clearTimeout(timeOutServer);
    };
  }, []);

  return (
    <Grid container spacing={2} columns={6} sx={{height: "100vh", p: 2}}>
      <Grid size={{xs: 2}}>
        <Box
          sx={{
            backgroundColor: "#f0f4f8",
            p: 2,
            borderRadius: 2,
            boxShadow: 2,
            height: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{mb: 2}}>
            Online users:
          </Typography>
          {onlineUsers.map((user) => (
            <Box
              key={user}
              sx={{
                mb: 1,
                p: 1,
                backgroundColor: "#e0e0e0",
                borderRadius: 1,
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {user}
            </Box>
          ))}
        </Box>
      </Grid>
      <Grid size={{xs: 4}}>
        <Box
          sx={{
            borderRadius: 2,
            boxShadow: 2,
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message._id}
                sx={{
                  mb: 2,
                  p: 2,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 2,
                  borderLeft: "4px solid #1976d2",
                }}
              >
                <Typography variant="subtitle2" sx={{fontWeight: 600}}>
                  {message.user.username}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{color: "text.secondary", mb: 1}}
                >
                  {dayjs(message.createdAt).format("DD.MM HH:mm")}
                </Typography>
                <Typography variant="body1" sx={{wordWrap: "break-word"}}>
                  {message.text}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
              display: "flex",
              borderTop: "1px solid #ccc",
              p: 2,
            }}
          >
            <TextField
              onChange={(e) => setOneMessage(e.target.value)}
              value={oneMessage}
              sx={{flex: 1}}
              variant="outlined"
              placeholder="Yout message"
            />

            <Button
              type="submit"
              variant="contained"
              sx={{ml: 2, borderRadius: "8px"}}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Chat;
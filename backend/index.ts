import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import { WebSocket } from "ws";
import cookieParser from "cookie-parser";
import usersRouter from "./api/routers/users";
import mongoose from "mongoose";
import config from "./api/config";
import { ClientMessage, MongoMessage, ServerMessage } from "./types";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import User, { JWT_SECRET } from "./api/models/User";

const app = express();
const wsInstance = expressWs(app);

const port = 8000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use("/users", usersRouter);

const router = express.Router();
wsInstance.applyTo(router);

interface ActiveConnections {
  ws: WebSocket;
  userId?: string;
}

const activeConnections: { [id: string]: ActiveConnections } = {};
const Messages: MongoMessage[] = [];

router.ws("/chat", (ws, _req) => {
  const id = randomUUID();
  console.log("Client connected, id= " + id);
  activeConnections[id] = { ws };

  ws.send(
    JSON.stringify({
      type: "ALL_MESSAGES",
      messages: Messages.slice(-30),
    } as ServerMessage),
  );

  ws.on("message", async (messageWs) => {
    try {
      const decoded: ClientMessage = JSON.parse(messageWs.toString());
      console.log("Get new message: ", decoded);

      if (decoded.type === "LOGIN" && decoded.payload) {
        const decodedToken = jwt.verify(decoded.payload, JWT_SECRET) as {
          _id: string;
        };

        const user = await User.findById(decodedToken._id);
        if (!user) {
          ws.send(
            JSON.stringify({
              error: "Invalid token",
            }),
          );
          return;
        }

        activeConnections[id].userId = String(user._id);
        ws.send(
          JSON.stringify({
            type: "ALL_MESSAGES",
            messages: Messages.slice(-30),
          }),
        );
      } else if (decoded.type === "SEND_MESSAGE" && decoded.payload) {
        const userId = activeConnections[id].userId;
        if (!userId) {
          ws.send(
            JSON.stringify({
              error: "You are not logged in",
            }),
          );
          return;
        }

        const user = await User.findById(userId);
        if (!user) {
          ws.send(
            JSON.stringify({
              error: "User not found",
            }),
          );
          return;
        }

        const newMessage: MongoMessage = {
          _id: randomUUID(),
          user: {
            _id: String(user._id),
            username: user.username,
          },
          text: decoded.payload,
          createdAt: new Date(),
        };
        Messages.push(newMessage);

        Object.values(activeConnections).forEach((connectionWs) => {
          connectionWs.ws.send(JSON.stringify(newMessage));
        });
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          error: "Invalid message format",
        }),
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected, id= " + id);
    delete activeConnections[id];
  });
});

app.use(router);
const run = async () => {
  await mongoose.connect(config.db);
  app.listen(port, () => {
    console.log(`Server started on localhost:${port}`);
  });

  process.on("exit", () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);

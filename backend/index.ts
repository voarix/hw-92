import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import { WebSocket } from "ws";
import cookieParser from "cookie-parser";
import usersRouter from "./api/routers/users";
import mongoose from "mongoose";
import config from "./api/config";

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

const run = async () => {
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });

  process.on("exit", () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);

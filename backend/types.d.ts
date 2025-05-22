export interface UserFields {
  username: string;
  password: string;
  token: string;
  __confirmPassword: string;
  role: string;
}

export interface MongoMessage {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  text: string;
  createdAt: Date;
}

export interface ClientMessage {
  type: "LOGIN" | "SEND_MESSAGE" | "LOGOUT" | "DELETE_MESSAGE";
  payload?: string;
}

interface ServerMessage {
  type: "NEW_MESSAGE" | "ALL_MESSAGES" | "ONLINE_USERS" | "DELETED_MESSAGE";
  payload?: MongoMessage[] | string[] | MongoMessage | string;
}

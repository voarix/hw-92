export interface UserFields {
  username: string;
  password: string;
  token: string;
  __confirmPassword: string;
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
  type: "LOGIN" | "SEND_MESSAGE" | "LOGOUT";
  payload?: string;
}

interface ServerMessage {
  type: "NEW_MESSAGE" | "ALL_MESSAGES" | "ONLINE_USERS";
  payload?: MongoMessage[] | string[];
}

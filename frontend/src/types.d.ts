export interface RegisterMutation {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  token: string;
  role: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}

export interface ClientMessage {
  type: "LOGIN" | "SEND_MESSAGE" | "DELETE_MESSAGE";
  payload?: string;
}

export interface MongoMessage {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  text: string;
  createdAt: string;
}

export interface IncomingMessage {
  type: "ALL_MESSAGES" | "ONLINE_USERS" | "NEW_MESSAGE" | "DELETED_MESSAGE";
  payload: MongoMessage[] | string[] | MongoMessage | string;
}

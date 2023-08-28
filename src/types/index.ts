import { ReactNode, MouseEvent } from "react";
import { Socket } from "socket.io-client";

export enum LANGUAGE {
  ENGLISH = "english",
  VIETNAMESE = "vietnamese",
}

type Player = {
  id: string;
  name: string;
};

export type Room = {
  id: string;
  players: Player[];
};

export type Message = {
  type: "NOTIFICATION" | "MESSAGE";
  playerName: string;
  content: string;
};

export type Form = {
  serverUrl: string;
  playerName: string;
  roomId: string;
};

export type State = {
  form: Form;
  room: Room;
  messages: Message[];
  socket: Socket | null;
  language: LANGUAGE;

  clearMessages: () => void;
  setRoom: (room: Room) => void;
  setForm: (form: Form) => void;
  setSocket: (socket: Socket) => void;
  setMessages: (messages: Message) => void;
  toggleLanguage: () => void;
  setLanguage: (language: LANGUAGE) => void;
};

export type IconProps = {
  name?: string;
  isButton?: boolean;
  isLoading?: boolean;
  isTruncate?: boolean;
  size?: "NORMAL" | "LARGE";
  isCopyable?: boolean;
  children?: ReactNode;
};

export type ButtonProps = {
  name: string;
  isDisabled?: boolean;
  children?: ReactNode;
  size?: "NORMAL" | "LARGE";
  isStretch?: boolean;
  action?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export type PlayerProps = {
  name: string;
  isSelf?: boolean;
};

export type MessageProps = {
  isSelf: boolean;
  data: Message;
};

export type ChatProps = {
  isCollapse: boolean;
  toggleCollapse: (isCollapse: boolean) => void;
};

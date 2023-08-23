import { ReactNode, MouseEvent } from "react";
import { Socket } from "socket.io-client";

export enum COLOR {
  GRAY = "bg-gray-400",
  GREEN = "bg-green-400",
  BLUE = "bg-blue-400",
  RED = "bg-red-400",
  AMBER = "bg-amber-400",
  INDIGO = "bg-indigo-400",
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
  setRoom: (room: Room) => void;
  setForm: (form: Form) => void;
  setSocket: (socket: Socket) => void;
  setMessages: (messages: Message) => void;
  clearMessages: () => void;
};

export type IconProps = {
  name?: string;
  isLoading?: boolean;
  isTruncate?: boolean;
  size?: "NORMAL" | "LARGE";
  copyable?: boolean;
  children?: ReactNode;
};

export type ButtonProps = {
  name: string;
  disabled?: boolean;
  children?: ReactNode;
  size?: "SMALL" | "NORMAL";
  stretch?: boolean;
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

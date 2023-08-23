import { create } from "zustand";
import { State } from "../types";

const useStore = create<State>((set) => ({
  socket: null,
  form: {
    serverUrl: "",
    playerName: "",
    roomId: "",
  },
  room: {
    id: "",
    players: [],
  },
  messages: [],
  setForm: (form) => set(() => ({ form })),
  setRoom: (room) => set(() => ({ room })),
  setSocket: (socket) => set(() => ({ socket })),
  setMessages: (message) => set((state) => ({ messages: [message, ...state.messages] })),
  clearMessages: () => set(() => ({ messages: [] })),
}));

export default useStore;

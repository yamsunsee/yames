import { create } from "zustand";
import { LANGUAGE, State } from "../types";

const useStore = create<State>((set) => ({
  socket: null,
  form: {
    serverUrl: "http://localhost:5000",
    playerName: "Yam",
    roomId: "ABC123",
  },
  room: {
    id: "",
    players: [],
  },
  messages: [],
  language: LANGUAGE.ENGLISH,
  setForm: (form) => set(() => ({ form })),
  setRoom: (room) => set(() => ({ room })),
  setSocket: (socket) => set(() => ({ socket })),
  clearMessages: () => set(() => ({ messages: [] })),
  setMessages: (message) => set((state) => ({ messages: [message, ...state.messages] })),
  setLanguage: (language) => set(() => ({ language })),
  toggleLanguage: () =>
    set((state) => {
      const newLanguage = state.language === LANGUAGE.ENGLISH ? LANGUAGE.VIETNAMESE : LANGUAGE.ENGLISH;
      sessionStorage.setItem("yames-language", JSON.stringify(newLanguage));
      return { language: newLanguage };
    }),
}));

export default useStore;

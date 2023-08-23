import http from "http";
import socketIO from "socket.io";
import dotenv from "dotenv";
import Rooms from "./rooms.ts";

dotenv.config();
const isProduction = process.env.PRODUCTION === "true";
const DEVELOPMENT_URL = process.env.DEVELOPMENT_URL as string;
const PRODUCTION_URL = process.env.PRODUCTION_URL as string;

const rooms = new Rooms();

const socket = (server: http.Server) => {
  const io = new socketIO.Server(server, {
    cors: {
      origin: isProduction ? PRODUCTION_URL : DEVELOPMENT_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("SERVER", (action) => {
      const { type, payload } = action;
      switch (type) {
        case "JOIN_ROOM":
          const { isSuccess, room } = rooms.addPlayerToRoom(payload.roomId, socket.id, payload.playerName);
          if (isSuccess) {
            socket.join(payload.roomId);
            io.to(payload.roomId).emit("CLIENT", {
              type: "NOTIFICATIONS",
              payload: {
                playerName: payload.playerName,
                content: "has joined room",
                room,
              },
            });
          } else {
            io.to(socket.id).emit("CLIENT", {
              type: "ERRORS",
              payload: {
                message: "The room you selected is full! Please choose another room!",
              },
            });
          }
          break;

        case "MESSAGES":
          socket.to(payload.roomId).emit("CLIENT", {
            type: "MESSAGES",
            payload: {
              playerName: payload.playerName,
              content: payload.message,
            },
          });
          break;

        default:
          break;
      }
    });

    socket.on("disconnect", () => {
      const { player, room } = rooms.removePlayerFromRoom(socket.id);
      if (player && room)
        io.to(room.getId()).emit("CLIENT", {
          type: "NOTIFICATIONS",
          payload: {
            playerName: player.getName(),
            content: "has left room",
            room,
          },
        });
    });
  });
};

export default socket;

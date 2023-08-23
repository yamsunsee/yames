import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Chat from "../components/sections/Chat";
import Icon from "../components/elements/Icon";
import useStore from "../stores";

const MainLayout = () => {
  const navigate = useNavigate();
  const { socket, setSocket, form, setForm, setRoom, setMessages } = useStore();
  const [isCollapse, setIsCollapse] = useState(false);

  useEffect(() => {
    setMessages({
      type: "NOTIFICATION",
      playerName: "",
      content: "You has joined room",
    });
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("CLIENT", (action) => {
        const { type, payload } = action;

        switch (type) {
          case "NOTIFICATIONS":
            setMessages({
              type: "NOTIFICATION",
              playerName: payload.playerName,
              content: payload.content,
            });
            setRoom(payload.room);
            break;

          case "MESSAGES":
            setMessages({ type: "MESSAGE", ...payload });
            break;

          default:
            break;
        }
      });

      socket.on("connect_error", () => {
        toast.error("Something went wrong! Looks like the server is down!");
        navigate("/login");
        socket.close();
      });
    } else {
      const localData = sessionStorage.getItem("yames");

      if (localData) {
        const localForm = JSON.parse(localData);

        const newSocket = io(localForm.serverUrl, {
          extraHeaders: {
            "ngrok-skip-browser-warning": "false",
          },
        });

        const toastId = toast(<Icon isLoading>Reconnecting to the server...</Icon>, {
          autoClose: false,
        });

        newSocket.on("connect_error", () => {
          toast.update(toastId, {
            render: (
              <>
                <div>Failed to reconnect to the server!</div>
                <div>Something went wrong! Please try again!</div>
              </>
            ),
            type: "error",
            autoClose: 3000,
          });
          navigate("/login");
          newSocket.close();
        });

        newSocket.emit("SERVER", {
          type: "JOIN_ROOM",
          payload: {
            playerName: localForm.playerName,
            roomId: localForm.roomId,
          },
        });

        newSocket.on("CLIENT", (action) => {
          const { type, payload } = action;

          switch (type) {
            case "NOTIFICATIONS":
              setSocket(newSocket);
              setForm(localForm);
              setRoom(payload.room);
              toast.update(toastId, {
                render: "Successfully reconnected to the server!",
                type: "success",
                autoClose: 3000,
              });
              break;

            case "ERRORS":
              toast.update(toastId, {
                render: payload.message,
                type: "error",
                autoClose: 3000,
              });
              navigate("/login");
              break;

            default:
              break;
          }
        });
      } else navigate("/login");
    }
  }, [socket]);

  return (
    <>
      {form.serverUrl && (
        <div
          className={`flex h-screen bg-[url('/images/background.jpg')] bg-cover bg-no-repeat p-4 ${
            !isCollapse ? " gap-4" : ""
          }`}
        >
          <Chat isCollapse={isCollapse} toggleCollapse={setIsCollapse} />
          <Outlet />
        </div>
      )}
    </>
  );
};

export default MainLayout;

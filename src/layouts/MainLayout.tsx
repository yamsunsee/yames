import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useStore from "../stores";
import { useLanguages } from "../hooks";
import { Icon } from "../components/elements";
import { Chat } from "../components/sections";

const MainLayout = () => {
  const navigate = useNavigate();
  const translate = useLanguages();
  const { socket, setSocket, form, setForm, setRoom, setMessages, setLanguage } = useStore();
  const [isCollapse, setIsCollapse] = useState(false);

  useEffect(() => {
    setMessages({
      type: "NOTIFICATION",
      playerName: "",
      content: "You has joined room",
      translatedContent: "Bạn đã vào phòng",
    });
  }, []);

  useEffect(() => {
    const localData = sessionStorage.getItem("yames-language");
    if (localData) {
      const localLanguage = JSON.parse(localData);
      setLanguage(localLanguage);
    }
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
              translatedContent: payload.translatedContent,
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
        toast.error(
          translate(
            "Something went wrong! Looks like the server is down!",
            "Có gì đó không ổn! Có vẻ như máy chủ đã tạm dừng!"
          )
        );
        navigate("/login");
        socket.close();
      });
    } else {
      const localFormData = sessionStorage.getItem("yames-form");

      if (localFormData) {
        const localForm = JSON.parse(localFormData);

        const newSocket = io(localForm.serverUrl, {
          extraHeaders: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        const toastId = toast(
          <Icon isLoading>{translate("Reconnecting to the server...", "Đang tái kết nối với máy chủ...")}</Icon>,
          {
            autoClose: false,
          }
        );

        newSocket.on("connect_error", () => {
          toast.update(toastId, {
            render: (
              <>
                <div>{translate("Failed to reconnect to the server!", "Tái kết nối với máy chủ thất bại!")}</div>
                <div>
                  {translate("Something went wrong! Please try again!", "Có gì đó không ổn! Vui lòng thử lại!")}
                </div>
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
                render: translate("Successfully reconnected to the server!", "Tái kết nối với máy chủ thành công!"),
                type: "success",
                autoClose: 3000,
              });
              break;

            case "ERRORS":
              toast.update(toastId, {
                render: translate(payload.message, payload.translatedMessage),
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
  }, []);

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

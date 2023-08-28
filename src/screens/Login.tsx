import { useRef, useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import useStore from "../stores";
import { Button, Icon } from "../components/elements";
import { useLanguages } from "../hooks";

const Login = () => {
  const navigate = useNavigate();
  const translate = useLanguages();
  const { form, setSocket, setForm, setRoom, toggleLanguage } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const serverUrlRef = useRef<HTMLInputElement>(null);
  const roomIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    serverUrlRef.current?.focus();
    const localData = sessionStorage.getItem("yames");
    if (localData) {
      const localForm = JSON.parse(localData);
      setForm(localForm);
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const socket = io(form.serverUrl, {
      extraHeaders: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    const toastId = toast(
      <Icon isLoading>{translate("Connecting to the server...", "Đang kết nối với máy chủ...")}</Icon>,
      {
        autoClose: false,
      }
    );

    socket.on("connect_error", () => {
      toast.update(toastId, {
        render: (
          <>
            <div>{translate("Failed to connect to the server!", "Kết nối với máy chủ thất bại!")}</div>
            <div>
              {translate("Please make sure you provide a valid server URL!", "Vui lòng cung cấp một đường dẫn hợp lệ!")}
            </div>
          </>
        ),
        type: "error",
        autoClose: 3000,
      });
      setForm({ ...form, serverUrl: "" });
      serverUrlRef.current?.focus();
      setIsLoading(false);
      socket.close();
    });

    socket.emit("SERVER", {
      type: "JOIN_ROOM",
      payload: { playerName: form.playerName, roomId: form.roomId },
    });

    socket.on("CLIENT", (action) => {
      const { type, payload } = action;

      switch (type) {
        case "NOTIFICATIONS":
          setSocket(socket);
          setRoom(payload.room);
          toast.update(toastId, {
            render: translate("Successfully connected to the server!", "Kết nối với máy chủ thành công!"),
            type: "success",
            autoClose: 3000,
          });
          sessionStorage.setItem("yames-form", JSON.stringify(form));
          navigate("/");
          break;

        case "ERRORS":
          toast.update(toastId, {
            render: payload.message,
            type: "error",
            autoClose: 3000,
          });
          setForm({ ...form, roomId: "" });
          roomIdRef.current?.focus();
          setIsLoading(false);
          break;

        default:
          break;
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/images/background.jpg')] bg-cover bg-no-repeat">
      <form
        onSubmit={handleSubmit}
        className="relative flex h-[50rem] w-[40rem] flex-col justify-between rounded-b-3xl border border-white/10 p-20 backdrop-blur-3xl before:absolute before:left-0 before:top-0 before:h-2 before:w-full before:bg-gradient-to-r before:from-theme before:via-indigo-500 before:to-red-300"
      >
        <h1 className="text-center text-6xl font-bold uppercase leading-tight text-theme">
          {translate("Infinite Battlefield", "Chiến Đồng Bất Tận")}
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="serverUrl" className="font-bold text-white">
              <Icon name="dns">{translate("Server URL", "Đường dẫn đến máy chủ")}</Icon>
            </label>
            <input
              required
              ref={serverUrlRef}
              className="input"
              placeholder="https://XXXX-XXX-XX-XX-XXX.ngrok-free.app"
              readOnly={isLoading}
              id="serverUrl"
              type="text"
              value={form.serverUrl}
              onChange={(event) => {
                setForm({
                  ...form,
                  serverUrl: event.target.value,
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="playerName" className="font-bold text-white">
              <Icon name="person">{translate("Player Name", "Tên người chơi")}</Icon>
            </label>
            <input
              required
              className="input"
              placeholder="Yamin"
              readOnly={isLoading}
              id="playerName"
              type="text"
              value={form.playerName}
              onChange={(event) => {
                setForm({
                  ...form,
                  playerName: event.target.value,
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="roomId" className="font-bold text-white">
              <Icon name="meeting_room">{translate("Room ID", "Mã phòng")}</Icon>
            </label>
            <input
              required
              ref={roomIdRef}
              className="input"
              placeholder="ABC123"
              readOnly={isLoading}
              id="roomId"
              type="text"
              value={form.roomId}
              onChange={(event) => {
                setForm({
                  ...form,
                  roomId: event.target.value,
                });
              }}
            />
          </div>
        </div>
        <Button name="login" isDisabled={isLoading} size="LARGE">
          {translate("Join room", "Vào phòng")}
        </Button>
        <div
          onClick={toggleLanguage}
          className="absolute bottom-4 right-4 cursor-pointer text-white/50 hover:text-theme"
        >
          <Icon name="translate" />
        </div>
      </form>
    </div>
  );
};

export default Login;

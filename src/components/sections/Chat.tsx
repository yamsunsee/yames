import { FC, FormEvent, ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatProps } from "../../types";
import { toast } from "react-toastify";
import useStore from "../../stores";
import { useLanguages } from "../../hooks";
import { Button, Icon, Message, Player } from "../elements";

const Chat: FC<ChatProps> = ({ isCollapse, toggleCollapse }) => {
  const navigate = useNavigate();
  const translate = useLanguages();
  const { socket, form, room, messages, setMessages, clearMessages, toggleLanguage } = useStore();
  const [message, setMessage] = useState("");
  const [isNotice, setIsNotice] = useState(true);

  useEffect(() => {
    if (isCollapse && isNotice) {
      if (messages[0].type === "MESSAGE") {
        toast.info(
          <div className="flex items-center gap-2">
            <div className="flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-rival font-bold uppercase text-white">
              {messages[0].playerName.substring(0, 1)}
            </div>
            <div className="max-w-[80vw] break-words rounded-2xl bg-theme px-4 py-1 text-white">
              {messages[0].content}
            </div>
          </div>,
          {
            icon: false,
          }
        );
      } else {
        toast.info(
          <div className="flex gap-1 self-center italic">
            <div className="max-w-[10ch] truncate font-bold text-rival">{messages[0].playerName}</div>
            <div className="text-slate-400">{messages[0].content}</div>
          </div>
        );
      }
    }
  }, [messages]);

  const handleTyping = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim().length > 0) {
      socket?.emit("SERVER", {
        type: "MESSAGES",
        payload: { playerName: form.playerName, roomId: form.roomId, message },
      });
      setMessages({
        type: "MESSAGE",
        playerName: form.playerName,
        content: message,
      });
    }
    setMessage("");
  };

  const handleCollapse = () => toggleCollapse(true);

  const handleExpand = () => toggleCollapse(false);

  const handleNotice = () => setIsNotice(!isNotice);

  const handleClearChat = () => clearMessages();

  const handleLeave = () => {
    navigate("/login");
    clearMessages();
    socket?.close();
  };

  return (
    <>
      <div className={`sidebar${!isCollapse ? " expand" : ""}`}>
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="z-10 flex items-center justify-between rounded-t-3xl border border-white/10 p-4 backdrop-blur-3xl">
            <div className="text-2xl font-bold text-slate-400 hover:text-theme">
              <Icon name="meeting_room" isTruncate={true} isCopyable={true}>
                {form.roomId}
              </Icon>
            </div>
            <div className="flex gap-2">
              {room.players.map((player) => (
                <Player key={player.id} name={player.name} isSelf={player.name === form.playerName} />
              ))}
              <div className="group relative flex cursor-pointer items-center text-slate-400 hover:text-white">
                <div className="-mr-2">
                  <Icon name="more_vert" />
                </div>
                <div className="absolute right-0 top-full z-10 hidden translate-y-2 flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-4 before:absolute before:-top-10 before:right-0 before:h-14 before:w-8 group-hover:flex">
                  <Button action={handleCollapse} isStretch={true} name="left_panel_close">
                    {translate("Collapse", "Thu gọn")}
                  </Button>
                  <Button action={handleClearChat} isStretch={true} name="delete_sweep">
                    {translate("Clear chat", "Xoá tin nhắn")}
                  </Button>
                  <Button action={toggleLanguage} isStretch={true} name="translate">
                    {translate("Vietnamese", "Tiếng Anh")}
                  </Button>
                  <Button action={handleLeave} isStretch={true} name="logout">
                    {translate("Leave room", "Rời phòng")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col-reverse gap-2 overflow-y-scroll border border-white/10 p-4 backdrop-blur-3xl">
            {messages.map((message, index) =>
              message.type === "NOTIFICATION" ? (
                <div key={index} className="flex gap-1 self-center italic">
                  <div className="max-w-[10ch] truncate font-bold text-rival">{message.playerName}</div>
                  <div className="text-slate-400">
                    {translate(message.content, message?.translatedContent || message.content)}
                  </div>
                </div>
              ) : (
                <Message key={index} isSelf={message.playerName === form.playerName} data={message} />
              )
            )}
          </div>
          <form onSubmit={handleSend} className="flex gap-4">
            <input
              required
              className="input"
              type="text"
              placeholder={translate("Message...", "Tin nhắn...")}
              value={message}
              onInput={handleTyping}
              onDrop={(event) => event.preventDefault()}
            />
            <Button name="send" size="LARGE" />
          </form>
        </div>
      </div>
      {isCollapse && (
        <div className="fixed left-0 top-0 z-50 h-screen translate-x-[calc(1rem-100%)] border-white/10 p-4 transition-all ease-out hover:translate-x-0 hover:border-l hover:bg-slate-900/80">
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <Button action={handleExpand} name="left_panel_open" isStretch={true}>
              {translate("Expand", "Mở rộng")}
            </Button>
            <Button action={handleNotice} name={isNotice ? "visibility" : "visibility_off"} isStretch={true}>
              {isNotice ? translate("Hide Messages", "Ẩn thông báo") : translate("Show Messages", "Hiện thông báo")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;

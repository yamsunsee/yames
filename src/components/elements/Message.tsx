import { FC } from "react";
import { MessageProps } from "../../types";

const Message: FC<MessageProps> = ({ isSelf = true, data }) => {
  return (
    <div className={`flex items-end${isSelf ? " self-end" : ""}`}>
      <div
        title={data.content}
        className={`max-w-xs truncate rounded-full bg-theme px-4 py-2 text-white${
          isSelf ? " order-1 rounded-br-none" : " order-2 rounded-bl-none"
        }`}
      >
        {data.content}
      </div>
      <div
        className={`flex h-6 w-6 translate-y-2 items-center justify-center rounded-full text-xs font-bold uppercase text-white${
          isSelf ? " order-2 -ml-3 bg-self" : " z-10 order-1 -mr-3 bg-rival"
        }`}
      >
        {data.playerName.substring(0, 1)}
      </div>
    </div>
  );
};

export default Message;

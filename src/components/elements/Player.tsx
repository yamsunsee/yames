import { FC } from "react";
import { PlayerProps } from "../../types";

const Player: FC<PlayerProps> = ({ name, isSelf = false }) => {
  return (
    <div className={`player group${isSelf ? " self" : ""}`}>
      <div className="uppercase">{name.substring(0, 1)}</div>
      <div className="playerName group-hover:flex">
        <div className="truncate">{name}</div>
      </div>
    </div>
  );
};

export default Player;

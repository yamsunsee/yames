import { useLanguages } from "../hooks";

const Game = () => {
  const translate = useLanguages();

  return (
    <div className="flex flex-1 items-center justify-center rounded-3xl border border-white/10">
      <div className="text-5xl font-bold uppercase text-white">
        <span>{translate("Welcome to ", "Chào mừng đến với ")}</span>
        <span className="text-theme">{translate("Infinite Battlefield", "Chiến Đồng Bất Tận")}</span>
      </div>
    </div>
  );
};

export default Game;

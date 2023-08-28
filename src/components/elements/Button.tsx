import { FC, MouseEvent } from "react";
import { ButtonProps } from "../../types";
import Icon from "./Icon";

const Button: FC<ButtonProps> = ({ name, isDisabled, action, size = "NORMAL", isStretch = false, children }) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    if (typeof action === "function") action(event);
  };

  return (
    <button
      className={`button${isDisabled ? " disabled" : ""}${size === "LARGE" ? " large" : ""}${
        isStretch ? " stretch" : ""
      }`}
      onClick={handleClick}
    >
      <Icon name={name} isButton={true}>
        {children}
      </Icon>
    </button>
  );
};

export default Button;

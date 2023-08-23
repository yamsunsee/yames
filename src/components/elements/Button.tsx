import { FC, MouseEvent } from "react";
import { ButtonProps } from "../../types";
import Icon from "./Icon";

const Button: FC<ButtonProps> = ({
  name,
  disabled,
  action,
  size = "NORMAL",
  stretch = false,
  children,
}) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (typeof action === "function") action(event);
  };

  return (
    <button
      className={`button${disabled ? " disabled" : ""}${
        size === "SMALL" ? " small" : ""
      }${stretch ? " stretch" : ""}`}
      onClick={handleClick}
    >
      <Icon name={name}>{children}</Icon>
    </button>
  );
};

export default Button;

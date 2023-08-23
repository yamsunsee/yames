import { FC } from "react";
import { IconProps } from "../../types";
import { toast } from "react-toastify";

const Icon: FC<IconProps> = ({
  name,
  isLoading = false,
  isTruncate = false,
  copyable = false,
  size = "NORMAL",
  children,
}) => {
  const handleCopy = async () => {
    if (!copyable) return;
    try {
      await navigator.clipboard.writeText(children?.toString() ?? "");
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard!", error);
    }
  };

  return (
    <div
      onClick={handleCopy}
      title={copyable ? "Click to copy" : ""}
      className={`flex items-center ${isLoading ? "gap-2" : "gap-1"}${copyable ? " cursor-pointer" : ""}`}
    >
      <span
        className={`material-symbols-rounded${isLoading ? " animate-spin" : ""}${
          size === "LARGE" ? " text-4xl" : " text-2xl"
        }`}
      >
        {isLoading ? "progress_activity" : name}
      </span>
      {children && <div className={`whitespace-nowrap${isTruncate ? " max-w-[10ch] truncate" : ""}`}>{children}</div>}
    </div>
  );
};

export default Icon;

import { ArrowPathIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

interface RefreshButtonProps {
  onClick: () => void;
  isFetching: boolean;
}
export default function RefreshButton({
  onClick,
  isFetching,
}: RefreshButtonProps) {
  return (
    <button onClick={onClick} className="flex flex-col">
      <ArrowPathIcon
        className={clsx({ "animate-spin": isFetching }, "h-4 w-4")}
      />
    </button>
  );
}

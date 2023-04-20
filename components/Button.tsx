interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}
export default function Button({
  onClick,
  children,
  disabled,
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-xl bg-gray-600 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
    >
      {children}
    </button>
  );
}

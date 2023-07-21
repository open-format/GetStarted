interface TooltipProps {
  children: React.ReactNode;
}
export default function Tooltip({ children }: TooltipProps) {
  return (
    <div className="absolute bottom-full mb-2 hidden transform animate-fade-in whitespace-nowrap rounded-md bg-indigo-600 p-2 text-xs text-center text-white group-hover:block">
      {children}
    </div>
  );
}

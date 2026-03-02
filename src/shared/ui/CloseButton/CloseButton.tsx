type CloseButtonProps = {
  onClick: () => void;
  className?: string;
};

export const CloseButton = ({ onClick, className }: CloseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`shadow-2xl rounded-full h-10 w-10 flex items-center justify-center bg-(--color-brand) hover:bg-(--color-brand-hover) cursor-pointer text-white text-xl font-bold z-50 transition-colors ${className}`}
      aria-label="Закрыть"
    >
      ✕
    </button>
  );
};

type CloseButtonProps = {
  onClick: () => void;
  className?: string;
};

export const CloseButton = ({ onClick, className }: CloseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`shadow-2xl rounded-full h-10 w-10 flex items-center justify-center bg-(--color-brand) hover:bg-(--color-brand-hover) cursor-pointer text-white text-xl font-bold z-(--z-modal) transition-colors ${className}`}
      aria-label="Закрыть"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
  );
};

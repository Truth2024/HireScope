type ArrowProps = {
  dir?: 'left' | 'right' | 'down';
  size?: number;
  className?: string;
};

export default function Arrow({ dir = 'right', size = 24, className = '' }: ArrowProps) {
  const getPath = () => {
    switch (dir) {
      case 'left':
        return <path d="M15.75 4.5L8.25 12l7.5 7.5" />;
      case 'down':
        return <path d="M4.5 8.25l7.5 7.5 7.5-7.5" />;
      case 'right':
      default:
        return <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {getPath()}
    </svg>
  );
}

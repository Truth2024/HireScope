type LogoProps = {
  width?: number;
  height?: number;
};

export default function Logo({ width = 60, height = 60 }: LogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="url(#grad1)" />
      <line x1="12" y1="10" x2="12" y2="30" stroke="#fff" strokeWidth="3" />
      <line x1="28" y1="10" x2="28" y2="30" stroke="#fff" strokeWidth="3" />
      <line x1="12" y1="20" x2="28" y2="20" stroke="#fff" strokeWidth="3" />
    </svg>
  );
}

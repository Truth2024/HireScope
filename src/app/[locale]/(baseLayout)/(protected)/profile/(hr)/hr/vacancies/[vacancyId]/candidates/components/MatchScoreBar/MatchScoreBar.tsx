export const MatchScoreBar = ({ score, title }: { score: number; title: string }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{title}:</span>
        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${getScoreColor(score)}`} style={{ width: `${score}%` }} />
        </div>
        <span className="text-sm font-medium">{score}%</span>
      </div>
    </div>
  );
};

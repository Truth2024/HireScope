import { RotateCcw } from 'lucide-react';

import { Button } from '@ui';

type ResetButtonProps = {
  onClick: () => void;
};

export const ResetButton = ({ onClick }: ResetButtonProps) => {
  return (
    <Button onClick={onClick} className="h-10 min-w-10 p-0">
      <RotateCcw
        size={20}
        className="text-white/70 group-hover:text-white group-hover:-rotate-45 transition-all duration-300"
      />
    </Button>
  );
};

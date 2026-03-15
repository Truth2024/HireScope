'use client';

type SkillButton = {
  handleClick: () => void;
  isSelected: boolean;
  text: string;
};

export const SkillButton = ({ handleClick, isSelected, text }: SkillButton) => {
  return (
    <button
      onClick={handleClick}
      className={`
    px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-start border border-transparent cursor-pointer
    ${isSelected ? 'bg-(--color-brand) text-white hover:bg-(--color-brand)/90' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
    >
      {text}
    </button>
  );
};

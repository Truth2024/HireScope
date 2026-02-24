import { useTranslations } from 'next-intl';

type SkillsProps = {
  skills: string[] | null | undefined;
  title?: string;
  variant?: 'compact' | 'full';
};

export default function Skills({ skills, title, variant = 'full' }: SkillsProps) {
  const t = useTranslations('Card');
  const defaultTitle = t('skills');

  if (!skills || skills.length === 0) {
    return variant === 'compact' ? (
      <span className="text-xs text-gray-400 italic">{t('noSkills')}</span>
    ) : (
      <p className="text-gray-400 italic">{t('noSkills')}</p>
    );
  }

  const isCompact = variant === 'compact';
  const visibleSkills = isCompact ? skills.slice(0, 3) : skills;

  const chipSize = isCompact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  const content = (
    <div className="flex flex-wrap gap-2">
      {visibleSkills.map((skill, i) => (
        <span
          key={i}
          className={`bg-gray-50 text-gray-700 ${chipSize} font-medium rounded-lg border border-gray-100`}
        >
          {skill}
        </span>
      ))}

      {isCompact && skills.length > 3 && (
        <span className="text-xs text-gray-400 flex items-center">
          {t('moreSkills', { count: skills.length - 3 })}
        </span>
      )}
    </div>
  );

  if (isCompact) return content;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-(--color-brand) rounded-full" />
        {title || defaultTitle}
      </h2>
      {content}
    </section>
  );
}

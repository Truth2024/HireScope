import { useTranslations } from 'next-intl';

type ExperienceItem = {
  company?: string;
  position?: string;
  years?: number;
};

type ExperienceProps = {
  experience?: ExperienceItem[];
  variant?: 'compact' | 'full';
};

export const Experience = ({ experience, variant = 'full' }: ExperienceProps) => {
  const t = useTranslations('Card');

  if (!experience || experience.length === 0) {
    return variant === 'compact' ? (
      <div className="text-sm text-gray-400 italic">{t('notSpecified')}</div>
    ) : (
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('experience')}</h2>
        <p className="text-gray-400 italic">{t('noExperience')}</p>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        {experience.slice(0, 2).map((exp, index) => (
          <div key={index} className="text-sm">
            <span className="font-medium text-gray-900">{exp.position || t('notSpecified')}</span>
            {exp.company && (
              <span className="text-gray-600">
                {' '}
                {t('at')} {exp.company}
              </span>
            )}
            {exp.years && (
              <span className="text-gray-400 text-xs ml-2">
                ({exp.years} {exp.years > 1 ? t('years') : t('year')})
              </span>
            )}
          </div>
        ))}

        {experience.length > 2 && (
          <div className="text-xs text-gray-400">
            {t('morePositions', { count: experience.length - 2 })}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-(--color-brand) rounded-full" />
        {t('experience')}
      </h2>

      <div className="space-y-4">
        {experience.map((exp, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{exp.position || t('notSpecified')}</h3>

              {exp.years && (
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                  {exp.years} {exp.years > 1 ? t('years_full') : t('year_full')}
                </span>
              )}
            </div>

            {exp.company && (
              <p className="text-(--color-brand) font-medium text-base mb-2">{exp.company}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

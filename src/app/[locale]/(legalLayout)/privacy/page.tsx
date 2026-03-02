import { getTranslations } from 'next-intl/server';

export default async function PrivacyPolicy() {
  const t = await getTranslations('PrivacyPolicy');

  return (
    <section className="max-w-4xl p-3 text-gray-800">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-8 md:mb-12 text-indigo-600 leading-tight">
        {t('title')}
      </h1>

      <p className="mb-6 text-base md:text-lg leading-relaxed">
        {t.rich('description', {
          strong: (chunks) => <strong className="font-semibold">{chunks}</strong>,
        })}
      </p>

      <h2 className="text-xl md:text-2xl font-bold mt-8 md:mt-10 mb-4 text-indigo-500">
        {t('sections.dataCollection.title')}
      </h2>
      <ul className="list-disc pl-5 sm:pl-6 mb-6 space-y-2 text-base md:text-lg leading-relaxed">
        {t.raw('sections.dataCollection.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2 className="text-xl md:text-2xl font-bold mt-8 md:mt-10 mb-4 text-indigo-500">
        {t('sections.purposeOfProcessing.title')}
      </h2>
      <ul className="list-disc pl-5 sm:pl-6 mb-6 space-y-2 text-base md:text-lg leading-relaxed">
        {t.raw('sections.purposeOfProcessing.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2 className="text-xl md:text-2xl font-bold mt-8 md:mt-10 mb-4 text-indigo-500">
        {t('sections.dataHandling.title')}
      </h2>
      <ul className="list-disc pl-5 sm:pl-6 mb-6 space-y-2 text-base md:text-lg leading-relaxed">
        {t.raw('sections.dataHandling.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2 className="text-xl md:text-2xl font-bold mt-8 md:mt-10 mb-4 text-indigo-500">
        {t('sections.userRights.title')}
      </h2>
      <ul className="list-disc pl-5 sm:pl-6 mb-6 space-y-2 text-base md:text-lg leading-relaxed">
        {t.raw('sections.userRights.items').map((item: string, index: number) => {
          if (item.includes('<email>')) {
            return (
              <li key={index}>
                {t.rich('sections.userRights.items.' + index, {
                  email: (chunks) => (
                    <a
                      href="mailto:support@hirescope.com"
                      className="text-indigo-600 underline hover:text-indigo-800 break-all"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </li>
            );
          }
          return <li key={index}>{item}</li>;
        })}
      </ul>

      <h2 className="text-xl md:text-2xl font-bold mt-8 md:mt-10 mb-4 text-indigo-500">
        {t('sections.dataSecurity.title')}
      </h2>
      <p className="mb-6 text-base md:text-lg leading-relaxed">{t('sections.dataSecurity.text')}</p>

      <h2 className="text-xl md:text-2xl font-bold mt-8 md:mt-10 mb-4 text-indigo-500">
        {t('sections.changesToPolicy.title')}
      </h2>
      <p className="mb-6 text-base md:text-lg leading-relaxed">
        {t('sections.changesToPolicy.text')}
      </p>

      <h2 className="text-xl md:text-2xl font-bold mt-8 md:mt-10 mb-4 text-indigo-500">
        {t('sections.contact.title')}
      </h2>
      <div className="mb-6 text-base md:text-lg leading-relaxed space-y-2">
        <p>{t('sections.contact.text')}</p>
        <p>
          <span className="font-medium">{t('sections.contact.email')}</span>{' '}
          <a
            href="mailto:support@hirescope.com"
            className="text-indigo-600 underline hover:text-indigo-800 break-all"
          >
            support@hirescope.com
          </a>
        </p>
        <p>
          <span className="font-medium">{t('sections.contact.phone')}</span>{' '}
          <a
            href="tel:+18001234567"
            className="text-indigo-600 underline hover:text-indigo-800 whitespace-nowrap"
          >
            +1 (800) 123-4567
          </a>
        </p>
        <p className="pt-2 italic text-gray-600">{t('sections.contact.address')}</p>
      </div>

      <p className="text-center text-gray-500 mt-12 text-sm border-t pt-8">{t('copyright')}</p>
    </section>
  );
}

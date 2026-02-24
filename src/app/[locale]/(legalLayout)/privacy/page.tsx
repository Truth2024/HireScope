import { getTranslations } from 'next-intl/server';

export default async function PrivacyPolicy() {
  const t = await getTranslations('PrivacyPolicy');

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-indigo-600">{t('title')}</h1>

      <p className="mb-6 text-lg leading-relaxed">
        {t.rich('description', {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>

      {/* 1. Data Collection */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.dataCollection.title')}
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        {t.raw('sections.dataCollection.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* 2. Purpose of Data Processing */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.purposeOfProcessing.title')}
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        {t.raw('sections.purposeOfProcessing.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* 3. Data Handling and Storage */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.dataHandling.title')}
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        {t.raw('sections.dataHandling.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* 4. User Rights */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.userRights.title')}
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        {t.raw('sections.userRights.items').map((item: string, index: number) => {
          if (item.includes('<email>')) {
            return (
              <li key={index}>
                {t.rich('sections.userRights.items.' + index, {
                  email: (chunks) => (
                    <a
                      href="mailto:support@hirescope.com"
                      className="text-indigo-600 underline hover:text-indigo-800"
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

      {/* 5. Data Security */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.dataSecurity.title')}
      </h2>
      <p className="mb-6 text-lg leading-relaxed">{t('sections.dataSecurity.text')}</p>

      {/* 6. Changes to Privacy Policy */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.changesToPolicy.title')}
      </h2>
      <p className="mb-6 text-lg leading-relaxed">{t('sections.changesToPolicy.text')}</p>

      {/* Contact */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.contact.title')}
      </h2>
      <p className="mb-6 text-lg leading-relaxed">
        {t('sections.contact.text')} <br />
        {t('sections.contact.email')}{' '}
        <a
          href="mailto:support@hirescope.com"
          className="text-indigo-600 underline hover:text-indigo-800"
        >
          support@hirescope.com
        </a>{' '}
        <br />
        {t('sections.contact.phone')}{' '}
        <a href="tel:+18001234567" className="text-indigo-600 underline hover:text-indigo-800">
          +1 (800) 123-4567
        </a>{' '}
        <br />
        {t('sections.contact.address')}
      </p>

      <p className="text-center text-gray-500 mt-12 text-sm">{t('copyright')}</p>
    </section>
  );
}

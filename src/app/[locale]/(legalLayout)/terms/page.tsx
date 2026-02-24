import { getTranslations } from 'next-intl/server';

export default async function TermsOfService() {
  const t = await getTranslations('TermsOfService');

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-indigo-600">{t('title')}</h1>

      <p className="mb-6 text-lg leading-relaxed">
        {t.rich('description', {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>

      {/* 1. Use of the Platform */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.useOfPlatform.title')}
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        {t.raw('sections.useOfPlatform.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* 2. Accounts */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.accounts.title')}
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        {t.raw('sections.accounts.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* 3. User Content */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.userContent.title')}
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        {t.raw('sections.userContent.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* 4. Prohibited Actions */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.prohibitedActions.title')}
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        {t.raw('sections.prohibitedActions.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* 5. Termination */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.termination.title')}
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2 text-lg leading-relaxed">
        {t.raw('sections.termination.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* 6. Limitation of Liability */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.limitationOfLiability.title')}
      </h2>
      <p className="mb-6 text-lg leading-relaxed">{t('sections.limitationOfLiability.text')}</p>

      {/* 7. Changes to Terms */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-500">
        {t('sections.changesToTerms.title')}
      </h2>
      <p className="mb-6 text-lg leading-relaxed">{t('sections.changesToTerms.text')}</p>

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

import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Star } from 'lucide-react';
import type { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { siteNavigation } from '@siteNav';
import { Button } from '@ui';

type TranslationFn = ReturnType<typeof useTranslations>;

type ValueCardProps = {
  icon: ReactNode;
  title: string;
  text: string;
};
export const ValueProps = ({ t }: { t: TranslationFn }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="grid md:grid-cols-3 gap-8 mb-32"
  >
    <ValueCard
      icon={<Zap className="text-yellow-500" />}
      title={t('features.speed.title')}
      text={t('features.speed.text')}
    />
    <ValueCard
      icon={<ShieldCheck className="text-emerald-500" />}
      title={t('features.security.title')}
      text={t('features.security.text')}
    />
    <ValueCard
      icon={<Star className="text-(--color-brand)" />}
      title={t('features.quality.title')}
      text={t('features.quality.text')}
    />
  </motion.div>
);

const ValueCard = ({ icon, title, text }: ValueCardProps) => (
  <div className="text-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
    <div className="flex justify-center mb-4">{icon}</div>
    <h4 className="font-bold text-lg mb-1">{title}</h4>
    <p className="text-gray-500 text-sm">{text}</p>
  </div>
);

export const CTA = ({ t }: { t: TranslationFn }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
    viewport={{ once: true }}
    className="relative overflow-hidden"
  >
    <div className="bg-[rgb(35,31,30)] p-12 md:p-20 rounded-[3rem] text-white text-center relative z-10">
      <h2 className="text-4xl md:text-5xl font-black mb-8">{t('cta.title')}</h2>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Button href={siteNavigation.register} className="shadow-2xl shadow-indigo-500/20">
          {t('cta.register')}
        </Button>
        <Button href={siteNavigation.vacancies} variant="secondary">
          {t('cta.vacancies')}
        </Button>
      </div>
    </div>
  </motion.div>
);

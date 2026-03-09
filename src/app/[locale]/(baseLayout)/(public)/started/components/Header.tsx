import { motion } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Header = ({ t }: any) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center mb-20"
  >
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-(--color-brand) uppercase bg-indigo-50 rounded-full"
    >
      {t('badge')}
    </motion.span>
    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
      {t.rich?.('title', {
        br: () => <br />,
        span: (chunks: string) => <span className="text-(--color-brand)">{chunks}</span>,
      })}
    </h1>
    <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">{t('description')}</p>
  </motion.div>
);

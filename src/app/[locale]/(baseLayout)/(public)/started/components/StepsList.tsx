import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { UserPlus, Search, FileText, CheckCircle2 } from 'lucide-react';

import { Card } from '@ui';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StepsList = ({ t }: { t: any }) => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8 text-(--color-brand)" />,
      color: 'bg-blue-50',
      status: 'start',
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50',
      status: 'process',
    },
    {
      icon: <Search className="w-8 h-8 text-amber-600" />,
      color: 'bg-amber-50',
      status: 'process',
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      color: 'bg-emerald-50',
      status: 'finish',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mb-32">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid gap-12 relative"
      >
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: '80%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="hidden md:block absolute left-11 top-12 w-0.5 bg-linear-to-b from-blue-200 via-purple-200 to-transparent"
        />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-start gap-6 relative group"
          >
            <div
              className={`shrink-0 w-22 h-22 ${step.color} rounded-4xl flex items-center justify-center border-4 border-white shadow-xl z-10 group-hover:scale-105 transition-transform`}
            >
              {step.icon}
            </div>

            <Card className="w-full">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-(--color-brand) rounded-full">
                  {index + 1}
                </span>
                <span className="text-(--color-brand) font-bold text-sm uppercase tracking-widest">
                  {t(`steps.${step.status}`)}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                {t(`steps.${index + 1}.title`)}
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                {t(`steps.${index + 1}.desc`)}
              </p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

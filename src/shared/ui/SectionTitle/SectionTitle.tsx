import Link from 'next/link';
import React from 'react';

import { Arrow } from '@ui';

type SectionTitleProps = {
  sectionBtn?: string;
  title: string;
  path?: string;
  className?: string;
};

const SectionTitle = ({
  title,
  sectionBtn,
  path,
  className = 'justify-between',
}: SectionTitleProps) => {
  return (
    <div className="mb-6 sm:mb-10">
      <div className="content">
        <div className={`flex items-center ${className}`}>
          <h2 className="text-lg sm:text-2xl font-bold">{title}</h2>
          {sectionBtn && path && (
            <Link href={path}>
              <button className="flex items-center text-base sm:text-lg font-semibold hover:text-(--color-brand-hover) text-(--color-brand) cursor-pointer hover-arrow-right transition-colors duration-300 text-nowrap">
                {sectionBtn}
                <Arrow />
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionTitle;

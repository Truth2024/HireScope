import React from 'react';

type SectionProps = {
  children?: React.ReactNode;
};

export default function Section({ children }: SectionProps) {
  return <section className="pb-10">{children}</section>;
}

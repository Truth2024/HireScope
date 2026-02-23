type VacancyDescriptionProps = {
  descr: string;
};

export const VacancyDescription = ({ descr }: VacancyDescriptionProps) => {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-(--color-brand) rounded-full" />
        Description
      </h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{descr}</p>
    </section>
  );
};

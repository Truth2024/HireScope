'use client';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { Button } from '@ui';

type CommentFormProps = {
  onSubmit: (comment: { rating?: number; text: string }) => void;
  isSubmitting?: boolean;
};

export const CommentForm = ({ onSubmit, isSubmitting = false }: CommentFormProps) => {
  const t = useTranslations('Card');

  const [rating, setRating] = useState<number | undefined>(undefined);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError(t('errors.emptyText'));
      return;
    }

    if (!rating) {
      setError(t('errors.noRating'));
      return;
    }

    onSubmit({ rating, text: text.trim() });

    setRating(undefined);
    setHoverRating(0);
    setText('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm text-gray-600 mb-1 block">{t('yourRating')}</label>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              disabled={isSubmitting}
              aria-label={t('starAria', { count: star })}
              className="p-1 hover:scale-110 transition-transform focus:outline-none"
            >
              <span
                className={`text-2xl ${
                  (hoverRating || rating || 0) >= star ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError('');
          }}
          placeholder={t('placeholder')}
          rows={4}
          disabled={isSubmitting}
          aria-label={t('ariaText')}
          className={`w-full px-4 py-3 bg-gray-50 border ${
            error ? 'border-red-300' : 'border-gray-200'
          } rounded-xl focus:outline-none focus:ring-2 focus:ring-(--color-brand)/20 focus:border-(--color-brand) transition-all resize-none`}
        />

        {error && <p className="mt-1 text-center text-sm text-red-500">{error}</p>}
      </div>

      <div className="flex justify-end">
        <Button className="w-full" type="submit" disabled={isSubmitting || !text.trim()}>
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {t('submitting')}
            </>
          ) : (
            t('submit')
          )}
        </Button>
      </div>
    </form>
  );
};

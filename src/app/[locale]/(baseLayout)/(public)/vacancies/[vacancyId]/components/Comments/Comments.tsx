'use client';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslations } from 'next-intl';
import React from 'react';

import { CommentItem, CommentsStats, EmptyComments, FeedbackButton } from '@commentsComponents';
import { CommentsStore } from '@commentsStore';
import type { IComment } from '@myTypes/mongoTypes';
import { Card, Loader } from '@ui';

type CommentsProps = {
  vacancyId: string;
  comments: IComment[];
  rating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  commentsCount: number;
  showEmail?: boolean;
  currentPage: number;
  totalPages: number;
};

export const Comments = observer(
  ({
    rating,
    ratingDistribution,
    vacancyId,
    showEmail = false,
    currentPage,
    totalPages,
    comments,
    commentsCount,
  }: CommentsProps) => {
    const store = useLocalObservable(
      () =>
        new CommentsStore(vacancyId, {
          comments: comments,
          page: currentPage,
          totalPages,
          commentsCount,
          rating,
          ratingDistribution,
        })
    );

    const t = useTranslations('Card');
    const loaderRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!loaderRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (!store.isLoading && store.currentPage < store.totalPages) {
              store.changePage();
            }
          }
        },
        { rootMargin: '200px' }
      );

      observer.observe(loaderRef.current);

      return () => observer.disconnect();
    }, [store]);

    const hasNoComments = store.commentsCount === 0;
    if (hasNoComments) {
      return (
        <Card className="mt-10">
          <EmptyComments>
            <FeedbackButton store={store} />
          </EmptyComments>
        </Card>
      );
    }

    return (
      <Card className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-10 flex items-center gap-2">
          <span className="w-1 h-5 bg-(--color-brand) rounded-full" />
          {t('comments')} ({store.commentsCount})
        </h2>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col gap-10 lg:w-90">
            <div className="sticky top-20 self-start w-full">
              <div className="flex flex-col min-w-fit lg:min-w-90 gap-5">
                <CommentsStats store={store} />
                <FeedbackButton store={store} />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col  gap-4">
            {store.comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} showEmail={showEmail} />
            ))}
            {store.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {store.error}
              </div>
            )}

            {store.isLoading && (
              <div className="w-full flex justify-center p-5">
                <Loader />
              </div>
            )}
            <div ref={loaderRef} className="h-1 w-full" />
          </div>
        </div>
      </Card>
    );
  }
);

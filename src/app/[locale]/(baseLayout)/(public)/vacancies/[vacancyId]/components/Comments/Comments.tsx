import { getTranslations } from 'next-intl/server';

import { Card } from '@ui';
import type { IVacancy } from 'src/shared/types/mongoTypes';

import { CommentsItem } from './CommentItem';

type CommentsProps = {
  vacancy: IVacancy;
  showEmail?: boolean;
  maxComments?: number;
};

export const Comments = async ({ vacancy, showEmail = false }: CommentsProps) => {
  const comments = vacancy.comments;
  const t = await getTranslations('Card');

  return (
    <Card className="mt-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-(--color-brand) rounded-full" />
        {t('comments')} ({comments.length})
      </h2>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentsItem key={comment._id} comment={comment} showEmail={showEmail} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
          <span className="text-4xl mb-3 block">💬</span>
          <p className="text-gray-500">{t('noComments')}</p>
          <p className="text-sm text-gray-400 mt-1">{t('beFirstToLeaveReview')}</p>
        </div>
      )}
    </Card>
  );
};

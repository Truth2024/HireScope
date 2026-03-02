import { Avatar } from '@components';
import type { IUser } from '@myTypes/mongoTypes';

type CommentsItemProps = {
  comment: {
    _id: string;
    user: IUser;
    rating?: number;
    text?: string;
    createdAt?: string;
  };
  showEmail?: boolean;
};

export const CommentItem = ({ comment, showEmail = false }: CommentsItemProps) => {
  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          size="small"
          firstName={comment.user.firstName}
          secondName={comment.user.secondName}
          avatar={comment.user.avatar ?? null}
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-900">
              {comment.user.firstName} {comment.user.secondName}
            </span>

            {showEmail && comment.user.email && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{comment.user.email}</span>
              </>
            )}

            {comment.createdAt && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>

          {comment.rating !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-(--color-brand) text-sm">★</span>
              <span className="text-sm font-medium text-gray-700">{comment.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {comment.text && (
        <p className="text-gray-700 text-sm leading-relaxed pl-13">{comment.text}</p>
      )}
    </div>
  );
};

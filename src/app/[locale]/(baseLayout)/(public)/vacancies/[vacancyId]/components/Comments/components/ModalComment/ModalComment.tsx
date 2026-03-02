'use client';

import React from 'react';

import { CommentForm } from '@commentsComponents';
import type { CommentsStore } from '@commentsStore';
import { useStore } from '@providers/StoreProvider';
import { Card, CloseButton, Modal } from '@ui';

type ModalCommentProps = {
  isOpen: boolean;
  setClose: () => void;
  store: CommentsStore;
};

export const ModalComment = ({ isOpen, setClose, store }: ModalCommentProps) => {
  const { authStore } = useStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const handleSubmit = async (comment: { rating?: number; text: string }) => {
    if (!comment.rating || !comment.text) return;

    setIsSubmitting(true);
    try {
      await store.feedback(comment.text, comment.rating, authStore);
      setClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Modal open={isOpen} handleClose={setClose} position="center">
      {({ handleClick }) => (
        <Card className="w-full relative">
          <CommentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          <CloseButton
            onClick={handleClick}
            className="absolute top-2 right-2 md:-top-9.5 md:-right-9.5"
          />
        </Card>
      )}
    </Modal>
  );
};

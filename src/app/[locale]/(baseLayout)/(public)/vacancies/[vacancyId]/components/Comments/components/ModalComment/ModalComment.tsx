'use client';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import type { TransitionProps } from '@mui/material/transitions';
import React from 'react';

import { CommentForm } from '@commentsComponents';
import type { CommentsStore } from '@commentsStore';
import { useStore } from '@providers/StoreProvider';
import { Card, CloseButton } from '@ui';

// Стилизованный Card для MUI
const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '500px',
  margin: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1),
    maxWidth: 'calc(100vw - 32px)',
  },
}));

// Анимация появления сверху
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

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
    <Dialog
      open={isOpen}
      onClose={setClose}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="comment-modal-title"
      aria-describedby="comment-modal-description"
      PaperProps={{
        sx: {
          bgcolor: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        },
      }}
      sx={{
        '& .MuiDialog-paper': {
          margin: 0,
          borderRadius: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 0, overflow: 'visible' }}>
        <StyledCard>
          <CommentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          <CloseButton
            className="absolute top-2 right-2 md:-top-9.5 md:-right-9.5"
            onClick={setClose}
          />
        </StyledCard>
      </DialogContent>
    </Dialog>
  );
};

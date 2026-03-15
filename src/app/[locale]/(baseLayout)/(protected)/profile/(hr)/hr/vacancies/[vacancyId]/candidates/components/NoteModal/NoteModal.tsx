'use client';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import type { TransitionProps } from '@mui/material/transitions';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';

import type { ICandidate } from '@myTypes/mongoTypes';
import { Card, CloseButton, Input, Button, Loader } from '@ui';

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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

type NoteModalProps = {
  isOpen: boolean;
  candidate: ICandidate | null;
  onClose: () => void;
  onSave: (candidateId: string, notes: string) => void;
};

export const NoteModal = ({ isOpen, candidate, onClose, onSave }: NoteModalProps) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const t = useTranslations('Card');
  useEffect(() => {
    if (candidate) {
      setNotes(candidate.notes || '');
    }
  }, [candidate]);

  const handleSave = async () => {
    if (!candidate || !notes.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(candidate.id, notes);

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setNotes('');
    onClose();
  };

  if (!candidate) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="note-modal-title"
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
        <StyledCard sx={{ width: '400px' }}>
          <div className="p-6">
            <h3 className="text-lg font-semibold" id="note-modal-title">
              {t('Notesfor')}:
            </h3>
            <p className="text-lg font-semibold mb-4">
              {candidate.user?.firstName} {candidate.user?.secondName}
            </p>
            <Input
              value={notes}
              onChange={(e) => setNotes(e)}
              placeholder={t('enterNote')}
              className="w-full mb-4"
            />

            <div className="flex justify-start gap-4">
              <Button onClick={handleClose} variant="cancel">
                {t('cancel')}
              </Button>
              <Button onClick={handleSave} disabled={!notes.trim() || isSubmitting}>
                {isSubmitting ? <Loader color="white" size="s" /> : `${t('save')}`}
              </Button>
            </div>
          </div>

          <CloseButton
            className="absolute top-2 right-2 md:-top-9.5 md:-right-9.5"
            onClick={handleClose}
          />
        </StyledCard>
      </DialogContent>
    </Dialog>
  );
};

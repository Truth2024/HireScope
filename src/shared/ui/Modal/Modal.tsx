'use client';

import React from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalContentProps = {
  children: (props: { handleClick: () => void }) => ReactNode;
  handleClick: () => void;
  position: 'center' | 'top';
  isMounted: boolean;
  classNameWindow?: string;
};

const ModalContent = React.memo(
  ({ children, handleClick, position, isMounted, classNameWindow }: ModalContentProps) => {
    const positionClass = position === 'center' ? 'items-center' : '';
    const modalStateClass = isMounted ? 'backdrop-blur-md opacity-100' : 'opacity-0';
    const contentAnimationClass = isMounted ? 'slide-down' : 'slide-up';

    return (
      <div
        onClick={handleClick}
        className={`modal-overlay fixed inset-0 z-50 transition-opacity duration-300 flex justify-center ${positionClass} ${modalStateClass}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`modal-content w-full max-w-xs md:max-w-md px-4 ${
            position === 'top' ? 'mt-8' : ''
          } ${contentAnimationClass} ${classNameWindow}`}
        >
          {children({ handleClick })}
        </div>
      </div>
    );
  }
);

ModalContent.displayName = 'ModalContent';

type ModalProps = {
  children: (props: { handleClick: () => void }) => ReactNode;
  handleClose: () => void;
  open: boolean;
  classNameWindow?: string;
  position: 'center' | 'top';
  informationName?: string;
};

const Modal = ({ children, handleClose, open, classNameWindow, position = 'top' }: ModalProps) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);
  const scrollBarWidth = React.useRef(0);

  React.useEffect(() => {
    if (open) {
      setIsMounted(true);
      if (!scrollBarWidth.current) {
        scrollBarWidth.current = window.innerWidth - document.documentElement.clientWidth;
      }
      document.documentElement.style.setProperty(
        '--scrollbar-width',
        `${scrollBarWidth.current}px`
      );
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      document.body.classList.remove('modal-open');
    };
  }, [open]);

  const handleClick = React.useCallback(() => {
    setIsMounted(false);
    timerRef.current = window.setTimeout(() => {
      handleClose();
    }, 300);
  }, [handleClose]);

  return createPortal(
    <ModalContent
      handleClick={handleClick}
      position={position}
      isMounted={isMounted}
      classNameWindow={classNameWindow}
    >
      {children}
    </ModalContent>,
    document.body
  );
};

export default Modal;

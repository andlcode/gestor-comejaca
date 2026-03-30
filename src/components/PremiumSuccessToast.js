import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { IoCheckmarkCircle } from 'react-icons/io5';

const ANIM_MS = 300;

const Anchor = styled.div`
  position: fixed;
  z-index: 10000;
  left: 50%;
  bottom: max(1.15rem, env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  width: min(26rem, calc(100vw - 1.75rem));
  pointer-events: none;
  font-family: 'Inter', system-ui, sans-serif;

  @media (min-width: 768px) {
    left: auto;
    right: max(1.5rem, env(safe-area-inset-right, 0px));
    bottom: max(1.5rem, env(safe-area-inset-bottom, 0px));
    transform: none;
    width: min(22.5rem, calc(100vw - 2rem));
  }
`;

const Surface = styled.div`
  pointer-events: auto;
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 0.85rem 0.6rem 0.85rem 1rem;
  border-radius: 12px;
  background: #fafafa;
  border: 1px solid rgba(229, 231, 235, 0.95);
  border-left: 3px solid rgba(109, 93, 246, 0.42);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? 0 : 6)}px);
  transition:
    opacity ${ANIM_MS}ms cubic-bezier(0.22, 0.9, 0.36, 1),
    transform ${ANIM_MS}ms cubic-bezier(0.22, 0.9, 0.36, 1);
`;

const IconWrap = styled.span`
  flex-shrink: 0;
  display: flex;
  line-height: 0;
  margin-top: 0.04rem;
  color: #6d5df6;
  font-size: 1.25rem;
`;

const MessageText = styled.p`
  margin: 0;
  flex: 1;
  min-width: 0;
  padding-right: 0.25rem;
  padding-top: 0.02rem;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.5;
  color: #4b5563;
`;

const CloseBtn = styled.button.attrs({ type: 'button' })`
  flex-shrink: 0;
  align-self: flex-start;
  margin: -0.12rem -0.05rem 0 0;
  padding: 0.32rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(26, 22, 48, 0.36);
  cursor: pointer;
  line-height: 0;
  transition: color 0.2s ease, background 0.2s ease;

  &:hover {
    color: rgba(26, 22, 48, 0.66);
    background: rgba(93, 80, 168, 0.07);
  }

  &:focus-visible {
    outline: 2px solid rgba(93, 80, 168, 0.32);
    outline-offset: 2px;
  }
`;

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M4.28 4.22a.75.75 0 0 1 1.06 0L8 6.88l2.66-2.66a.75.75 0 1 1 1.06 1.06L9.06 8l2.66 2.66a.75.75 0 1 1-1.06 1.06L8 9.06l-2.66 2.66a.75.75 0 0 1-1.06-1.06L6.94 8 4.28 5.34a.75.75 0 0 1 0-1.06z"
      />
    </svg>
  );
}

export default function PremiumSuccessToast({
  open,
  onClose,
  message,
  autoDismissMs = 3800,
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const autoDismissRef = useRef(null);
  const onCloseRef = useRef(onClose);

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) {
      setVisible(false);
      const exitTimer = setTimeout(() => {
        setMounted(false);
      }, ANIM_MS);
      return () => clearTimeout(exitTimer);
    }

    setMounted(true);
    let rafNested;
    const rafOuter = requestAnimationFrame(() => {
      rafNested = requestAnimationFrame(() => {
        setVisible(true);
      });
    });

    autoDismissRef.current = setTimeout(() => {
      autoDismissRef.current = null;
      onCloseRef.current?.();
    }, autoDismissMs);

    return () => {
      cancelAnimationFrame(rafOuter);
      if (rafNested) cancelAnimationFrame(rafNested);
      clearTimeout(autoDismissRef.current);
      autoDismissRef.current = null;
    };
  }, [open, autoDismissMs]);

  const handleManualClose = () => {
    clearTimeout(autoDismissRef.current);
    autoDismissRef.current = null;
    onCloseRef.current?.();
  };

  if (!mounted) return null;

  const node = (
    <Anchor>
      <Surface
        $visible={visible}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <IconWrap aria-hidden>
          <IoCheckmarkCircle size={22} />
        </IconWrap>
        <MessageText>{message}</MessageText>
        <CloseBtn
          type="button"
          aria-label="Fechar notificação"
          onClick={handleManualClose}
        >
          <CloseIcon />
        </CloseBtn>
      </Surface>
    </Anchor>
  );

  return createPortal(node, document.body);
}

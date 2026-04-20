import React from 'react';
import styled from 'styled-components';

/** Marca que o usuário seguiu para o checkout (para exibir dica ao voltar ao painel). */
const MP_SESSION_KEY = 'mp_checkout_user_left';

export function markMercadoPagoCheckoutPending() {
  try {
    sessionStorage.setItem(MP_SESSION_KEY, '1');
  } catch {
    /* ignore */
  }
}

/** Retorna true uma vez se havia marcação pendente (e remove a chave). */
export function tryConsumeMercadoPagoCheckoutPending() {
  try {
    if (sessionStorage.getItem(MP_SESSION_KEY) === '1') {
      sessionStorage.removeItem(MP_SESSION_KEY);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

export const MERCADO_PAGO_CHECKOUT_HINT =
  "Você será redirecionado para o pagamento. Caso apareça a opção de abrir no aplicativo, escolha 'permanecer no navegador'.";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.45);
`;

const Dialog = styled.div`
  width: min(480px, calc(100vw - 24px));
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
  padding: 20px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
`;

const Text = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: #4b5563;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
`;

const Btn = styled.button`
  min-height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
`;

const BtnGhost = styled(Btn)`
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;

  &:hover {
    background: #f3f4f6;
  }
`;

const BtnPrimary = styled(Btn)`
  border: 1px solid #1f2133;
  background: #1f2133;
  color: #ffffff;

  &:hover {
    opacity: 0.92;
  }
`;

/**
 * Confirmação antes de redirecionar para o init_point do Mercado Pago (mesma aba / navegador).
 * @param {{ isOpen: boolean, initPoint: string, onCancel: () => void, onConfirm: (url: string) => void }} props
 */
export function MercadoPagoCheckoutModal({ isOpen, initPoint, onCancel, onConfirm }) {
  if (!isOpen || !initPoint) return null;

  return (
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="mp-checkout-title"
      onClick={onCancel}
    >
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title id="mp-checkout-title">Pagamento</Title>
        <Text>{MERCADO_PAGO_CHECKOUT_HINT}</Text>
        <Actions>
          <BtnGhost type="button" onClick={onCancel}>
            Cancelar
          </BtnGhost>
          <BtnPrimary type="button" onClick={() => onConfirm(initPoint)}>
            Continuar para pagamento
          </BtnPrimary>
        </Actions>
      </Dialog>
    </Overlay>
  );
}

const RETURN_TEXT =
  'Pagamento não identificado. Se não concluiu, use novamente o botão Pagar na sua inscrição. Deseja tentar novamente?';

/**
 * Dica após voltar do checkout (opcional).
 */
export function MercadoPagoReturnHintModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <Overlay role="dialog" aria-modal="true" aria-labelledby="mp-return-title" onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title id="mp-return-title">Pagamento</Title>
        <Text>{RETURN_TEXT}</Text>
        <Actions>
          <BtnPrimary type="button" onClick={onClose}>
            Entendi
          </BtnPrimary>
        </Actions>
      </Dialog>
    </Overlay>
  );
}

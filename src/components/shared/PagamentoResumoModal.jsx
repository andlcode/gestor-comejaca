import React from 'react';
import styled from 'styled-components';
import { MERCADO_PAGO_CHECKOUT_HINT } from './MercadoPagoCheckoutModal.jsx';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 85;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
`;

const Dialog = styled.div`
  width: min(520px, calc(100vw - 24px));
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
  box-shadow:
    0 24px 64px -24px rgba(15, 23, 42, 0.28),
    0 8px 20px -12px rgba(15, 23, 42, 0.12);
  padding: 22px 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 14px 12px;
  border-radius: 14px;
  background: rgba(248, 250, 252, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.9);
`;

const Row = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #334155;

  strong {
    color: #0f172a;
    font-weight: 600;
  }
`;

const MoneyRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.9375rem;
  color: #334155;

  span:first-child {
    flex: 1;
    min-width: 0;
  }

  span:last-child {
    font-weight: 700;
    color: #0f172a;
    white-space: nowrap;
  }
`;

const TotalRow = styled(MoneyRow)`
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.35);
  font-size: 1rem;

  span:last-child {
    font-size: 1.05rem;
  }
`;

const Hint = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #64748b;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 2px;
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
    opacity 0.18s ease;
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

function formatBRL(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

/**
 * Resumo do pagamento antes do redirect ao Mercado Pago (dados vindos do backend).
 * @param {{ isOpen: boolean, resumo: object|null, initPoint: string, onCancel: () => void, onContinue: (url: string) => void }} props
 */
export function PagamentoResumoModal({ isOpen, resumo, initPoint, onCancel, onContinue }) {
  if (!isOpen || !resumo || !initPoint) return null;

  const camisaObj =
    resumo.camisa != null && typeof resumo.camisa === 'object' && !Array.isArray(resumo.camisa)
      ? resumo.camisa
      : null;
  const temCamisaValor = camisaObj != null && Number(camisaObj.valor) > 0;
  const camisaLine =
    temCamisaValor &&
    [camisaObj.tipo, camisaObj.cor, camisaObj.tamanho].filter(Boolean).join(' ').trim();

  return (
    <Overlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="pagamento-resumo-title"
      onClick={onCancel}
    >
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title id="pagamento-resumo-title">Resumo do pagamento</Title>

        <Block>
          <Row>
            <strong>Nome:</strong> {resumo.nomeCompleto}
          </Row>
          <Row>
            <strong>Casa Espírita/IE:</strong> {resumo.casaEspiritaIe}
          </Row>
          <Row>
            <strong>Tipo:</strong> {resumo.tipoParticipacao}
          </Row>
        </Block>

        <Block>
          <MoneyRow>
            <span>Inscrição</span>
            <span>{formatBRL(resumo.valorInscricao)}</span>
          </MoneyRow>
          {temCamisaValor && camisaLine ? (
            <MoneyRow>
              <span>Camisa {camisaLine}</span>
              <span>{formatBRL(camisaObj.valor)}</span>
            </MoneyRow>
          ) : null}
          <TotalRow>
            <span>Total</span>
            <span>{formatBRL(resumo.total)}</span>
          </TotalRow>
        </Block>

        <Hint>{MERCADO_PAGO_CHECKOUT_HINT}</Hint>

        <Actions>
          <BtnGhost type="button" onClick={onCancel}>
            Cancelar
          </BtnGhost>
          <BtnPrimary
            type="button"
            onClick={() => onContinue(String(initPoint ?? '').trim())}
          >
            Continuar para pagamento
          </BtnPrimary>
        </Actions>
      </Dialog>
    </Overlay>
  );
}

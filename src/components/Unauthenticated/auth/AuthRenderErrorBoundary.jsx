import React from 'react';
import styled from 'styled-components';

const FallbackShell = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(180deg, #fbfcfe 0%, #eef2f7 100%);
  box-sizing: border-box;
`;

const FallbackCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 24px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  text-align: left;
`;

const FallbackTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
`;

const FallbackText = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #475569;
`;

class AuthRenderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[AuthRenderErrorBoundary] render crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackShell>
          <FallbackCard>
            <FallbackTitle>Não foi possível abrir esta tela</FallbackTitle>
            <FallbackText>
              Ocorreu um erro de renderização. Tente voltar para a tela anterior e abrir
              novamente.
            </FallbackText>
          </FallbackCard>
        </FallbackShell>
      );
    }

    return this.props.children;
  }
}

export default AuthRenderErrorBoundary;

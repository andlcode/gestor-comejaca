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

const FallbackDebug = styled.pre`
  margin: 12px 0 0;
  padding: 12px;
  max-height: 240px;
  overflow: auto;
  font-size: 12px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
  border-radius: 12px;
  background: #f8fafc;
  color: #334155;
  border: 1px solid rgba(15, 23, 42, 0.08);
`;

class AuthRenderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '', errorStack: '', componentStack: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Erro desconhecido',
      errorStack: error?.stack || '',
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[AuthRenderErrorBoundary] error.message:', error?.message);
    console.error('[AuthRenderErrorBoundary] error.stack:', error?.stack);
    console.error(
      '[AuthRenderErrorBoundary] errorInfo.componentStack:',
      errorInfo?.componentStack
    );

    this.setState({
      componentStack: errorInfo?.componentStack || '',
    });
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
            <FallbackDebug>
              {`message: ${this.state.errorMessage}\n\nstack: ${this.state.errorStack}\n\ncomponentStack: ${this.state.componentStack}`}
            </FallbackDebug>
          </FallbackCard>
        </FallbackShell>
      );
    }

    return this.props.children;
  }
}

export default AuthRenderErrorBoundary;

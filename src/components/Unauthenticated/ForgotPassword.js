import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthLayout from './auth/AuthLayout';
import AuthRenderErrorBoundary from './auth/AuthRenderErrorBoundary';
import {
  AuthButtonSpinner,
  AuthFlowButtonLabelWide,
  AuthFormAlert,
  AuthLoginActions,
  AuthLoginAuxLinks,
  AuthLoginAuxRouterLink,
  AuthLoginFieldStack,
  AuthLoginForm,
  AuthPrimaryButton,
} from './auth/authStyles';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

/* ================= SAFE MESSAGE ================= */
const getSafeMessage = (value, fallback) => {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return String(value);

  if (Array.isArray(value)) {
    const joined = value
      .map((item) => (typeof item === 'string' ? item : ''))
      .filter(Boolean)
      .join(', ');
    if (joined) return joined;
  }

  if (value && typeof value === 'object') {
    if (typeof value.message === 'string') return value.message;
    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }

  return fallback;
};

/* ================= STYLES ================= */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.12);
  padding: 0 14px;
  font-size: 16px;
  outline: none;
`;

const ForgotPasswordFeedback = styled(AuthFormAlert)`
  margin-top: 12px;
`;

const ForgotPasswordSuccess = styled(ForgotPasswordFeedback)`
  color: #166534;
  background: #f0fdf4;
`;

const ForgotPasswordError = styled(ForgotPasswordFeedback)`
  color: #7f1d1d;
  background: #fef2f2;
`;

const Footer = styled.div`
  margin-top: 20px;
`;

const FooterLink = styled(AuthLoginAuxRouterLink)`
  color: #334155;
`;

/* ================= COMPONENT ================= */

const ForgotPassword = () => {
  const navigate = useNavigate();
  const redirectTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let timer;

    if (disabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [disabled]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      const msg = 'Informe seu e-mail.';
      setFeedback({ type: 'error', message: msg });
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);
      setFeedback({ type: '', message: '' });

      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });

      const msg = 'Verifique seu e-mail para redefinir a senha.';

      if (!isMountedRef.current) return;

      setDisabled(true);
      setCountdown(30);
      setFeedback({ type: 'success', message: msg });

      toast.success(msg);

      redirectTimeoutRef.current = setTimeout(() => {
        navigate('/');
      }, 4000);

    } catch (error) {
      const message = getSafeMessage(
        error?.response?.data?.message ?? error?.response?.data ?? error?.message,
        'Erro ao conectar com o servidor.'
      );

      setFeedback({ type: 'error', message });
      toast.error(message);

    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  return (
    <AuthRenderErrorBoundary>
      <AuthLayout
        title="Redefinir senha"
        subtitle="Digite seu e-mail para receber o link"
        layoutPreset="login"
      >
        <Wrapper>
          <AuthLoginForm onSubmit={handleReset}>

            <AuthLoginFieldStack>
              {/* INPUT SIMPLES (SEM PREMIUM) */}
              <Input
                type="email"
                placeholder="nome@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || disabled}
              />
            </AuthLoginFieldStack>

            {feedback.type === 'success' && (
              <ForgotPasswordSuccess>
                {feedback.message}
              </ForgotPasswordSuccess>
            )}

            {feedback.type === 'error' && (
              <ForgotPasswordError>
                {feedback.message}
              </ForgotPasswordError>
            )}

            <AuthLoginActions>
              <AuthPrimaryButton
                type="submit"
                disabled={loading || disabled}
              >
                {loading
                  ? <AuthButtonSpinner />
                  : disabled
                  ? `Aguarde ${countdown}s`
                  : 'Enviar e-mail'}
              </AuthPrimaryButton>
            </AuthLoginActions>

          </AuthLoginForm>

          <Footer>
            <FooterLink to="/">Voltar para login</FooterLink>
          </Footer>
        </Wrapper>
      </AuthLayout>
    </AuthRenderErrorBoundary>
  );
};

export default ForgotPassword;
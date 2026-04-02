import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthLayout from './auth/AuthLayout';
import PremiumAuthField from './auth/PremiumAuthField';
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

const ForgotPasswordContentStack = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 100%;
  width: 100%;
  gap: 0;
`;

const ForgotPasswordContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100%;
  justify-content: center;
  width: 100%;

  @media (max-width: 639px) {
    flex: 1;
    min-height: 0;
    justify-content: center;
  }
`;

const ForgotPasswordForm = styled(AuthLoginForm)`
  margin-top: 0;
  flex-shrink: 0;
`;

const ForgotPasswordActions = styled(AuthLoginActions)`
  margin-top: 8px;
`;

const ForgotPasswordSubmitButton = styled(AuthPrimaryButton)`
  margin-top: 0;
  position: relative;
  overflow: hidden;
  min-height: 48px;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #5b7cfa, #7b5cfa);
  color: #f8fafc;
  box-shadow: 0 8px 20px rgba(91, 124, 250, 0.25);
  transition: all 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: 12px;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.06) 0%,
      transparent 46%
    );
    opacity: 0.72;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #5b7cfa, #7b5cfa);
    transform: scale(0.98);
    box-shadow: 0 8px 20px rgba(91, 124, 250, 0.25);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
    box-shadow: 0 8px 20px rgba(91, 124, 250, 0.25);
    background: linear-gradient(135deg, #5b7cfa, #7b5cfa);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    box-shadow:
      0 0 0 3px rgba(99, 102, 241, 0.14),
      0 16px 30px -18px rgba(79, 110, 247, 0.32);
  }

  &:disabled {
    background: #c7ced8;
    color: rgba(255, 255, 255, 0.96);
    box-shadow: 0 6px 14px -16px rgba(15, 23, 42, 0.16);

    &::before {
      border-color: rgba(255, 255, 255, 0.08);
    }

    &::after {
      opacity: 0.5;
    }
  }

  &[aria-busy='true'] {
    cursor: wait;
  }

  @media (max-width: 639px) {
    min-height: 48px;
    height: 48px;
    border-radius: 12px;
    font-size: 0.9375rem;
  }
`;

const ForgotPasswordFeedback = styled(AuthFormAlert)`
  margin-top: 12px;
`;

const ForgotPasswordSuccess = styled(ForgotPasswordFeedback)`
  color: #166534;
  background: #f0fdf4;
  border: 1px solid rgba(34, 197, 94, 0.16);
  border-left: 3px solid rgba(34, 197, 94, 0.42);
  box-shadow: none;
`;

const ForgotPasswordError = styled(ForgotPasswordFeedback)`
  color: #7f1d1d;
  background: #fef2f2;
  border: 1px solid rgba(248, 113, 113, 0.18);
  border-left: 3px solid rgba(239, 68, 68, 0.38);
  box-shadow: none;
`;

const ForgotPasswordFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: auto;
  padding: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  flex-shrink: 0;

  @media (max-width: 639px) {
    width: calc(100% + 32px);
    margin-top: auto;
    margin-left: -16px;
    margin-right: -16px;
    padding: 12px 16px max(12px, env(safe-area-inset-bottom, 0px));
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 -1px 0 rgba(15, 23, 42, 0.03);
  }
`;

const ForgotPasswordFooterActions = styled(AuthLoginAuxLinks)`
  margin-top: 0;
  padding: 0;
  max-width: none;
  justify-content: flex-end;

  @media (max-width: 639px) {
    justify-content: space-between;
  }
`;

const ForgotPasswordFooterLink = styled(AuthLoginAuxRouterLink)`
  color: #334155;
  font-weight: 500;
`;

const isValidEmail = (email) => {
  const normalizedEmail = String(email || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const redirectTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const [formData, setFormData] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [feedback, setFeedback] = useState({
    type: '',
    message: '',
  });

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let timer = null;

    if (disabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timer) {
              clearInterval(timer);
            }
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [disabled]);

  useEffect(() => {
    if (!disabled || countdown !== 30) return;
    setDisabled(false);
  }, [countdown, disabled]);

  const handleEmailChange = (e) => {
    const value = e?.target?.value ?? '';

    setFormData((prevData) => ({
      ...prevData,
      email: value,
    }));

    if (feedback.message) {
      setFeedback({ type: '', message: '' });
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    const trimmedEmail = formData.email?.trim();

    if (!trimmedEmail) {
      const message = 'Informe seu e-mail.';
      setFeedback({ type: 'error', message });
      toast.error(message, { position: 'top-center' });
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      const message = 'Informe um e-mail válido.';
      setFeedback({ type: 'error', message });
      toast.error(message, { position: 'top-center' });
      return;
    }

    try {
      setLoading(true);
      setFeedback({ type: '', message: '' });

      await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email: trimmedEmail,
      });

      const successMessage =
        'Se o e-mail existir em nossa base, enviaremos o link de redefinição em instantes.';

      if (!isMountedRef.current) return;

      setDisabled(true);
      setCountdown(30);
      setFeedback({
        type: 'success',
        message: successMessage,
      });

      toast.success('Enviamos o link de redefinição para seu e-mail.', {
        position: 'bottom-center',
        autoClose: 4000,
      });

      redirectTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          navigate('/');
        }
      }, 4200);
    } catch (error) {
      console.error('Erro em forgot-password:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao conectar com o servidor.';

      if (!isMountedRef.current) return;

      setFeedback({
        type: 'error',
        message: errorMessage,
      });

      toast.error(errorMessage, {
        position: 'top-center',
      });
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Informe seu e-mail para receber as instruções de redefinição."
      layoutPreset="login"
    >
      <ForgotPasswordContentStack>
        <ForgotPasswordContentWrapper>
          <ForgotPasswordForm onSubmit={handleReset} noValidate>
            <AuthLoginFieldStack>
              <PremiumAuthField
                id="forgot-password-email"
                type="email"
                name="email"
                label="E-mail"
                icon={faEnvelope}
                value={formData.email}
                onChange={handleEmailChange}
                required
                disabled={loading || disabled}
                autoComplete="email"
                inputMode="email"
                placeholder="nome@dominio.com"
              />
            </AuthLoginFieldStack>

            {feedback.type === 'success' ? (
              <ForgotPasswordSuccess role="status" aria-live="polite">
                {feedback.message}
              </ForgotPasswordSuccess>
            ) : null}

            {feedback.type === 'error' ? (
              <ForgotPasswordError role="alert" aria-live="assertive">
                {feedback.message}
              </ForgotPasswordError>
            ) : null}

            <ForgotPasswordActions>
              <ForgotPasswordSubmitButton
                type="submit"
                disabled={loading || disabled}
                aria-busy={loading ? 'true' : 'false'}
              >
                {loading ? <AuthButtonSpinner /> : null}

                <AuthFlowButtonLabelWide>
                  {loading ? (
                    'Enviar e-mail'
                  ) : disabled ? (
                    `Aguarde ${countdown}s`
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8 }} />
                      Enviar e-mail
                    </>
                  )}
                </AuthFlowButtonLabelWide>
              </ForgotPasswordSubmitButton>
            </ForgotPasswordActions>
          </ForgotPasswordForm>
        </ForgotPasswordContentWrapper>

        <ForgotPasswordFooter>
          <ForgotPasswordFooterActions aria-label="Ações secundárias">
            <ForgotPasswordFooterLink to="/">Entrar</ForgotPasswordFooterLink>
          </ForgotPasswordFooterActions>
        </ForgotPasswordFooter>
      </ForgotPasswordContentStack>
    </AuthLayout>
  );
};

export default ForgotPassword;
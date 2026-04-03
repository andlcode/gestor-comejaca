import React, { useEffect, useRef, useState } from 'react';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthLayout from './auth/AuthLayout';
import AuthRenderErrorBoundary from './auth/AuthRenderErrorBoundary';
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
  AuthPremiumInlineError,
  AuthPrimaryButton,
} from './auth/authStyles';
import { getSafeApiErrorMessage, getSafeMessage } from '../../utils/safeMessage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const REQUEST_TIMEOUT_MS = 15000;
const COOLDOWN_SECONDS = 30;

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
    min-height: 0;
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

const ForgotPasswordSubmitButton = styled(AuthPrimaryButton)`
  &[aria-busy='true'] {
    cursor: wait;
  }
`;

const ForgotPasswordFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: auto;
  padding: 16px 0 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  flex-shrink: 0;

  @supports ((-webkit-backdrop-filter: blur(12px)) or (backdrop-filter: blur(12px))) {
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
  }

  @media (max-width: 639px) {
    width: calc(100% + 32px);
    margin-left: -16px;
    margin-right: -16px;
    padding: 10px 0 max(10px, env(safe-area-inset-bottom, 0px));
    background: rgba(255, 255, 255, 0.96);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: 0 -1px 0 rgba(15, 23, 42, 0.03);
  }
`;

const ForgotPasswordFooterActions = styled(AuthLoginAuxLinks)`
  margin-top: 0;
  padding: 0;
  max-width: none;
  justify-content: flex-end;
`;

const ForgotPasswordFooterLink = styled(AuthLoginAuxRouterLink)`
  color: #334155;
  font-weight: 500;
`;

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const createFeedbackState = (type = '', message = '') => ({
  type,
  message: getSafeMessage(message, ''),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const redirectTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(COOLDOWN_SECONDS);
  const [feedback, setFeedback] = useState(createFeedbackState());
  const [emailError, setEmailError] = useState('');

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
        setCountdown((previousCountdown) => {
          if (previousCountdown <= 1) {
            clearInterval(timer);
            return COOLDOWN_SECONDS;
          }

          return previousCountdown - 1;
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
    if (disabled && countdown === COOLDOWN_SECONDS) {
      setDisabled(false);
    }
  }, [countdown, disabled]);

  const handleEmailChange = (event) => {
    const nextEmail = getSafeMessage(event?.target?.value, '');
    setEmail(nextEmail);
    setEmailError('');

    if (feedback.message) {
      setFeedback(createFeedbackState());
    }
  };

  const handleReset = async (event) => {
    event?.preventDefault?.();

    const normalizedEmail = email.trim().toLowerCase();
    setEmailError('');

    if (!normalizedEmail) {
      setEmailError('Informe seu e-mail.');
      setFeedback(createFeedbackState());
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setEmailError('Digite um e-mail válido.');
      setFeedback(createFeedbackState());
      return;
    }

    try {
      setLoading(true);
      setFeedback(createFeedbackState());

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }

      const response = await axios.post(
        `${API_URL}/api/auth/forgot-password`,
        { email: normalizedEmail },
        { timeout: REQUEST_TIMEOUT_MS }
      );

      if (!isMountedRef.current) {
        return;
      }

      const successMessage = getSafeMessage(
        response?.data?.message,
        'Se o e-mail existir em nossa base, enviaremos instruções.'
      );

      setDisabled(true);
      setCountdown(COOLDOWN_SECONDS);
      setFeedback(createFeedbackState('success', successMessage));

      toast.success(successMessage, {
        position: 'bottom-center',
        autoClose: 4000,
      });

      redirectTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          navigate('/');
        }
      }, 4200);
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }

      const errorMessage = getSafeApiErrorMessage(
        error,
        'Não foi possível enviar as instruções de redefinição.'
      );

      setFeedback(createFeedbackState('error', errorMessage));
      toast.error(errorMessage, { position: 'top-center' });
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <AuthRenderErrorBoundary>
      <AuthLayout
        title="Redefinir senha"
        subtitle="Informe seu e-mail para receber as instruções de redefinição."
        layoutPreset="login"
      >
        <ForgotPasswordContentStack>
          <ForgotPasswordContentWrapper>
            <AuthLoginForm onSubmit={handleReset} noValidate>
              <AuthLoginFieldStack>
                <PremiumAuthField
                  id="forgot-password-email"
                  type="text"
                  name="email"
                  label="E-mail"
                  icon={faEnvelope}
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading || disabled}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="nome@dominio.com"
                  error={Boolean(emailError)}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? 'forgot-password-email-error' : undefined}
                />
                {emailError ? (
                  <AuthPremiumInlineError
                    id="forgot-password-email-error"
                    $login
                    role="alert"
                  >
                    {emailError}
                  </AuthPremiumInlineError>
                ) : null}
              </AuthLoginFieldStack>

              {feedback.type === 'success' ? (
                <ForgotPasswordSuccess
                  id="forgot-password-feedback"
                  role="status"
                  aria-live="polite"
                >
                  {feedback.message}
                </ForgotPasswordSuccess>
              ) : null}

              {feedback.type === 'error' ? (
                <ForgotPasswordError
                  id="forgot-password-feedback"
                  role="alert"
                  aria-live="assertive"
                >
                  {feedback.message}
                </ForgotPasswordError>
              ) : null}

              <AuthLoginActions>
                <ForgotPasswordSubmitButton
                  type="submit"
                  disabled={loading || disabled}
                  aria-busy={loading ? 'true' : 'false'}
                >
                  {loading ? <AuthButtonSpinner /> : null}
                  <AuthFlowButtonLabelWide>
                    {loading
                      ? 'Enviando...'
                      : disabled
                        ? `Aguarde ${countdown}s`
                        : 'Enviar e-mail'}
                  </AuthFlowButtonLabelWide>
                </ForgotPasswordSubmitButton>
              </AuthLoginActions>
            </AuthLoginForm>
          </ForgotPasswordContentWrapper>

          <ForgotPasswordFooter>
            <ForgotPasswordFooterActions aria-label="Ações secundárias">
              <ForgotPasswordFooterLink to="/">Entrar</ForgotPasswordFooterLink>
            </ForgotPasswordFooterActions>
          </ForgotPasswordFooter>
        </ForgotPasswordContentStack>
      </AuthLayout>
    </AuthRenderErrorBoundary>
  );
};

export default ForgotPassword;
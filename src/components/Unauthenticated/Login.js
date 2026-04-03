import React, { useEffect, useState } from 'react';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import AuthLayout from './auth/AuthLayout';
import PremiumAuthField from './auth/PremiumAuthField';
import {
  AuthButtonSpinner,
  AuthFlowButtonLabel,
  AuthFormAlert,
  AuthLoginActions,
  AuthLoginAuxDivider,
  AuthLoginAuxLinks,
  AuthLoginAuxRouterLink,
  AuthPremiumInlineError,
  AuthLoginFieldStack,
  AuthLoginForm,
  AuthPrimaryButton,
} from './auth/authStyles';
import { getApiBaseUrl } from '../../utils/apiBaseUrl';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginContentStack = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 100%;
  width: 100%;
  gap: 0;

  @media (max-width: 639px) {
    flex: 1;
    min-height: 0;
  }
`;

const ContentWrapper = styled.div`
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

const LoginAlert = styled(AuthFormAlert)`
  color: #7f1d1d;
  background: #fef2f2;
  border: 1px solid rgba(248, 113, 113, 0.18);
  border-left: 3px solid rgba(239, 68, 68, 0.34);
  box-shadow: none;
`;

const LoginSubmitButton = styled(AuthPrimaryButton)`
  margin-top: 0;
  position: relative;
  overflow: hidden;
  min-height: 52px;
  height: 52px;
  border-radius: 16px;
  border: none;
  background: ${({ theme }) => theme.primaryGradient};
  color: #f8fafc;
  box-shadow:
    0 10px 24px rgba(91, 124, 250, 0.16),
    0 4px 10px rgba(91, 124, 250, 0.07),
    0 1px 0 rgba(255, 255, 255, 0.2) inset,
    0 -1px 0 rgba(73, 88, 192, 0.08) inset;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease,
    background 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: 16px;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primaryGradient};
    filter: brightness(1.04);
    transform: scale(0.98);
    box-shadow:
      0 14px 28px rgba(91, 124, 250, 0.2),
      0 6px 12px rgba(91, 124, 250, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.2) inset;
  }

  &:active:not(:disabled) {
    filter: brightness(0.99);
    transform: scale(0.98);
    box-shadow:
      0 8px 18px rgba(91, 124, 250, 0.16),
      0 4px 8px rgba(91, 124, 250, 0.06);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    box-shadow:
      0 0 0 3px rgba(${({ theme }) => theme.primaryRgb}, 0.14),
      0 16px 30px -18px rgba(79, 110, 247, 0.32);
  }

  &:disabled {
    background: #c7ced8;
    color: rgba(255, 255, 255, 0.96);
    box-shadow: none;

    &::before {
      border-color: rgba(255, 255, 255, 0.08);
    }
  }

  &[aria-busy='true'] {
    cursor: wait;
  }

  @media (max-width: 639px) {
    min-height: 52px;
    height: 52px;
  }
`;

const LoginFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: auto;
  padding: 16px 0 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  flex-shrink: 0;

  @media (max-width: 639px) {
    width: calc(100% + 32px);
    margin-top: auto;
    margin-left: -16px;
    margin-right: -16px;
    padding: 10px 0 max(10px, env(safe-area-inset-bottom, 0px));
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 -1px 0 rgba(15, 23, 42, 0.03);
  }
`;

const LoginFooterActions = styled(AuthLoginAuxLinks)`
  margin-top: 0;
  padding: 0;
  max-width: none;
  justify-content: space-between;

  @media (max-width: 639px) {
    justify-content: space-between;
  }
`;

const LoginInlineLink = styled(AuthLoginAuxRouterLink)`
  color: #334155;
  font-weight: 500;
`;

const LoginFooterLink = styled(AuthLoginAuxRouterLink)`
  color: #334155;
  font-weight: 500;
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = getApiBaseUrl();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/painel');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError(null);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [name]: '',
    }));
  };

  const clearAuthStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isVerified');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('nome');
    localStorage.removeItem('email');
    localStorage.removeItem('tokenExpiration');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const nextFieldErrors = {
      email: '',
      password: '',
    };

    setError(null);
    setFieldErrors(nextFieldErrors);

    if (!trimmedEmail) {
      nextFieldErrors.email = 'Informe seu e-mail.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextFieldErrors.email = 'Digite um e-mail válido.';
    }

    if (!formData.password.trim()) {
      nextFieldErrors.password = 'Senha é obrigatória.';
    }

    if (nextFieldErrors.email || nextFieldErrors.password) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      clearAuthStorage();

      const response = await axios.post(`${API_URL}/api/auth/entrar`, {
        ...formData,
        email: trimmedEmail,
      });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', trimmedEmail);
      localStorage.setItem('isVerified', user.isVerified);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('nome', user.name);
      localStorage.setItem('email', user.email);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          userEmail: user.email,
          isVerified: user.isVerified,
          role: user.role || null,
        })
      );

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());

      navigate(user.isVerified ? '/painel' : '/verificar');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError('Usuário ou senha incorretos.');
        } else {
          setError(err.response.data.message || 'Erro inesperado. Tente novamente.');
        }
      } else {
        setError('Erro de rede ou servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Acesse sua conta com e-mail e senha."
      layoutPreset="login"
      showUtilityActions={false}
    >
      <LoginContentStack>
        <ContentWrapper>
          <AuthLoginForm onSubmit={handleSubmit} noValidate>
            <AuthLoginFieldStack>
              <PremiumAuthField
                id="login-email"
                type="text"
                name="email"
                label="E-mail"
                icon={faEnvelope}
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
                inputMode="email"
                placeholder="nome@dominio.com"
                error={Boolean(fieldErrors.email)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
              />
              {fieldErrors.email ? (
                <AuthPremiumInlineError id="login-email-error" $login role="alert">
                  {fieldErrors.email}
                </AuthPremiumInlineError>
              ) : null}

              <PremiumAuthField
                id="login-password"
                type="password"
                name="password"
                label="Senha"
                icon={faLock}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                error={Boolean(fieldErrors.password)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
              />
              {fieldErrors.password ? (
                <AuthPremiumInlineError id="login-password-error" $login role="alert">
                  {fieldErrors.password}
                </AuthPremiumInlineError>
              ) : null}
            </AuthLoginFieldStack>

            {error ? (
              <LoginAlert id="login-feedback" role="alert">
                {error}
              </LoginAlert>
            ) : null}

            <AuthLoginActions>
              <LoginSubmitButton
                type="submit"
                disabled={loading}
                aria-busy={loading ? 'true' : 'false'}
              >
                {loading ? <AuthButtonSpinner /> : null}
                <AuthFlowButtonLabel>Entrar</AuthFlowButtonLabel>
              </LoginSubmitButton>
            </AuthLoginActions>
          </AuthLoginForm>
        </ContentWrapper>

        <LoginFooter>
          <LoginFooterActions aria-label="Ações secundárias">
            <LoginInlineLink to="/recuperarsenha">
              Esqueci minha senha
            </LoginInlineLink>
            <AuthLoginAuxDivider />
            <LoginFooterLink to="/registrar">
              Criar conta
            </LoginFooterLink>
          </LoginFooterActions>
        </LoginFooter>
      </LoginContentStack>
    </AuthLayout>
  );
};

export default Login;
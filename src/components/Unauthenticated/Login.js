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
  AuthLoginFieldStack,
  AuthLoginForm,
  AuthPrimaryButton,
} from './auth/authStyles';

const LoginContentStack = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 100%;
  gap: 0;

  @media (max-width: 639px) {
    flex: 1;
    min-height: 0;
    justify-content: space-between;
  }
`;

const LoginFormShell = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 100%;
  justify-content: space-between;
  gap: 0;
  padding-top: 0.14rem;

  @media (min-width: 640px) {
    padding-top: 0.18rem;
  }

  @media (max-width: 639px) {
    flex: 1;
    min-height: 0;
    justify-content: space-between;
    padding-top: 0;
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
  min-height: 48px;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(180deg, #6d5df6 0%, #4f6ef7 100%);
  color: #f8fafc;
  box-shadow:
    0 10px 24px -10px rgba(79, 110, 247, 0.34),
    0 18px 30px -20px rgba(109, 93, 246, 0.24);
  transition:
    background 0.18s ease,
    transform 0.15s ease,
    box-shadow 0.18s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: 12px;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, #7667fb 0%, #5674fb 100%);
    transform: translateY(-1px);
    box-shadow:
      0 16px 30px -18px rgba(79, 110, 247, 0.42),
      0 24px 36px -28px rgba(109, 93, 246, 0.34);
  }

  &:active:not(:disabled) {
    transform: scale(0.985);
    box-shadow: 0 5px 12px rgba(17, 24, 39, 0.1);
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
    box-shadow: none;

    &::before {
      border-color: rgba(255, 255, 255, 0.08);
    }
  }

  &[aria-busy='true'] {
    cursor: wait;
  }

  @media (max-width: 639px) {
    min-height: 48px;
    height: 48px;
  }
`;

const LoginFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 24px;
  padding-top: 0.78rem;
  border-top: 1px solid #e5e7eb;
  width: 100%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fbfcfe 100%);

  @media (max-width: 639px) {
    width: calc(100% + 32px);
    margin-top: auto;
    margin-left: -16px;
    margin-right: -16px;
    padding: 0.42rem 16px max(0.55rem, env(safe-area-inset-bottom, 0px));
    border-top: 1px solid #e5e7eb;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/painel');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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

    try {
      setLoading(true);
      setError(null);
      clearAuthStorage();

      const response = await axios.post(`${API_URL}/api/auth/entrar`, formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('isVerified', user.isVerified);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('nome', user.name);
      localStorage.setItem('email', user.email);

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
        <LoginFormShell>
          <AuthLoginForm onSubmit={handleSubmit}>
            <AuthLoginFieldStack>
              <PremiumAuthField
                id="login-email"
                type="email"
                name="email"
                label="E-mail"
                icon={faEnvelope}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="username"
                inputMode="email"
                placeholder="nome@dominio.com"
                error={Boolean(error)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'login-feedback' : undefined}
              />

              <PremiumAuthField
                id="login-password"
                type="password"
                name="password"
                label="Senha"
                icon={faLock}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                error={Boolean(error)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'login-feedback' : undefined}
              />
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
        </LoginFormShell>
      </LoginContentStack>
    </AuthLayout>
  );
};

export default Login;
import React, { useEffect, useState } from 'react';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import AuthLayout from './auth/AuthLayout';
import PremiumAuthField from './auth/PremiumAuthField';
import {
  AuthButtonSpinner,
  AuthFlowButtonLabel,
  AuthFormAlert,
  AuthLoginActions,
  AuthLoginFieldStack,
  AuthLoginForm,
  AuthPrimaryButton,
} from './auth/authStyles';

const LoginContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const LoginFormShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 0.18rem;

  @media (min-width: 640px) {
    padding-top: 0.22rem;
  }

  @media (max-width: 639px) {
    padding-top: 0.16rem;
  }
`;

const LoginAlert = styled(AuthFormAlert)`
  color: #7f1d1d;
  background: linear-gradient(
    180deg,
    rgba(255, 249, 249, 0.98) 0%,
    rgba(254, 242, 242, 0.98) 100%
  );
  border: 1px solid rgba(248, 113, 113, 0.18);
  border-left: 3px solid rgba(239, 68, 68, 0.38);
  box-shadow: 0 10px 22px -20px rgba(239, 68, 68, 0.3);
`;

const LoginSubmitButton = styled(AuthPrimaryButton)`
  position: relative;
  overflow: hidden;
  min-height: 52px;
  height: 52px;
  border-radius: 5px;
  border: none;
  background: linear-gradient(180deg, #2b2d42 0%, #1f2133 100%);
  color: #f8fafc;
  box-shadow: 0 6px 16px rgba(17, 24, 39, 0.12);
  transition:
    background 0.18s ease,
    transform 0.15s ease,
    box-shadow 0.18s ease,
    filter 0.15s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 1px;
  border-radius: 5px;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
  border-radius: 5px;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.06) 0%,
      transparent 46%
    );
    opacity: 0.72;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, #323550 0%, #24263a 100%);
    transform: translateY(-1px);
    filter: brightness(1.01);
    box-shadow: 0 10px 22px rgba(17, 24, 39, 0.14);
  }

  &:active:not(:disabled) {
    transform: scale(0.985);
    box-shadow: 0 5px 12px rgba(17, 24, 39, 0.1);
    background: linear-gradient(180deg, #25283d 0%, #1a1c2d 100%);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    box-shadow:
      0 0 0 3px rgba(124, 58, 237, 0.12),
      0 8px 18px rgba(17, 24, 39, 0.12);
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
    min-height: 52px;
    height: 52px;
  border-radius: 5px;
    font-size: 0.96875rem;
  }
`;

const LoginFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  margin-top: 0.82rem;
  padding-top: 0.72rem;
  border-top: 1px solid #e5e7eb;
  width: 100%;

  @media (max-width: 639px) {
    margin-top: 0.74rem;
    padding-top: 0.66rem;
  }
`;

const LoginInlineLink = styled(Link)`
  color: #6b7280;
  text-decoration: none;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.012em;
  transition: color 0.15s ease;

  &:hover,
  &:focus-visible {
    color: #7c3aed;
  }

  &:focus {
    outline: none;
  }
`;

const LoginFooterLink = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  transition: color 0.15s ease;

  &:hover,
  &:focus-visible {
    color: #7c3aed;
  }

  &:focus {
    outline: none;
  }
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

  const handleSubmit = async () => {
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

      const redirectPath = user.isVerified ? '/painel' : '/verificar';
      navigate(redirectPath);
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
          <AuthLoginForm
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
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
            <LoginInlineLink to="/recuperarsenha">
              Esqueci minha senha
            </LoginInlineLink>

            <LoginFooterLink to="/registrar">
              Criar conta
            </LoginFooterLink>
          </LoginFooter>
        </LoginFormShell>
      </LoginContentStack>
    </AuthLayout>
  );
};

export default Login;
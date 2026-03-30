import React, { useEffect, useState } from 'react';
import {
  faEnvelope,
  faKey,
  faLock,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  AuthRememberRow,
} from './auth/authStyles';

const LoginContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const LoginIntro = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.85rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.78);

  @media (min-width: 640px) {
    padding-bottom: 1.45rem;
  }

  @media (max-width: 639px) {
    gap: 0.72rem;
    padding-bottom: 1.1rem;
  }
`;

const LoginEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.72rem;
  border-radius: 999px;
  background: rgba(245, 247, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.92);
  box-shadow: 0 8px 20px -22px rgba(15, 23, 42, 0.22);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.734375rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #556274;

  svg {
    font-size: 0.75rem;
    color: #5c54df;
  }
`;

const LoginHighlights = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0;

  @media (max-width: 639px) {
    gap: 0.5rem;
  }
`;

const LoginHighlight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.125rem;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(248, 250, 255, 0.78);
  box-shadow: 0 10px 22px -22px rgba(15, 23, 42, 0.22);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  color: #536172;

  svg {
    font-size: 0.8125rem;
    color: #5c54df;
  }
`;

const LoginFormShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 1.25rem;

  @media (min-width: 640px) {
    padding-top: 1.45rem;
  }

  @media (max-width: 639px) {
    padding-top: 1.1rem;
  }
`;

const LoginSupportRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;

  @media (max-width: 639px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.55rem;
    margin-top: 0.9rem;
  }
`;

const LoginInlineLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 2.25rem;
  padding: 0.15rem 0;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.828125rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  color: #556274;
  text-decoration: none;
  transition: color 0.18s ease, opacity 0.18s ease;

  &:hover {
    color: #111827;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    color: #3f46a8;
  }

  @media (max-width: 639px) {
    min-height: 2.5rem;
    font-size: 0.90625rem;
  }
`;

const LoginAlert = styled(AuthFormAlert)`
  color: #7f1d1d;
  background: linear-gradient(180deg, rgba(255, 249, 249, 0.98) 0%, rgba(254, 242, 242, 0.98) 100%);
  border: 1px solid rgba(248, 113, 113, 0.18);
  border-left: 3px solid rgba(239, 68, 68, 0.38);
  box-shadow: 0 10px 22px -20px rgba(239, 68, 68, 0.3);
`;

const LoginSubmitButton = styled(AuthPrimaryButton)`
  position: relative;
  overflow: hidden;
  min-height: 54px;
  height: 54px;
  border-radius: 16px;
  background: #111827;
  color: #f8fafc;
  box-shadow:
    0 8px 18px -16px rgba(15, 23, 42, 0.34),
    0 14px 28px -24px rgba(15, 23, 42, 0.2),
    0 1px 0 rgba(255, 255, 255, 0.08) inset,
    0 0 0 1px rgba(15, 23, 42, 0.04);
  transition:
    background-color 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.18s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.05);
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 42%);
    opacity: 0.9;
  }

  &:hover:not(:disabled) {
    background: #0f172a;
    transform: translateY(-1px);
    box-shadow:
      0 10px 22px -18px rgba(15, 23, 42, 0.38),
      0 16px 30px -24px rgba(15, 23, 42, 0.22),
      0 1px 0 rgba(255, 255, 255, 0.09) inset,
      0 0 0 1px rgba(15, 23, 42, 0.05);
  }

  &:active:not(:disabled) {
    background: #0b1220;
    transform: translateY(0);
    box-shadow:
      0 5px 14px -14px rgba(15, 23, 42, 0.32),
      0 10px 22px -26px rgba(15, 23, 42, 0.18),
      0 1px 0 rgba(255, 255, 255, 0.06) inset;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    box-shadow:
      0 0 0 4px rgba(15, 23, 42, 0.09),
      0 10px 22px -18px rgba(15, 23, 42, 0.32),
      0 1px 0 rgba(255, 255, 255, 0.08) inset;
  }

  &:disabled {
    background: #c7ced8;
    color: rgba(255, 255, 255, 0.96);
    box-shadow:
      0 6px 14px -16px rgba(15, 23, 42, 0.16),
      0 1px 0 rgba(255, 255, 255, 0.1) inset;

    &::before {
      border-color: rgba(255, 255, 255, 0.08);
    }

    &::after {
      opacity: 0.52;
    }
  }

  &[aria-busy='true'] {
    cursor: wait;
    background: #0f172a;
    color: #f8fafc;
    box-shadow:
      0 8px 18px -18px rgba(15, 23, 42, 0.34),
      0 12px 24px -24px rgba(15, 23, 42, 0.2),
      0 1px 0 rgba(255, 255, 255, 0.08) inset;

    &::after {
      opacity: 0.7;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;

    &:hover:not(:disabled) {
      transform: none;
    }
  }

  @media (max-width: 639px) {
    min-height: 52px;
    height: 52px;
    border-radius: 15px;
    font-size: 0.96875rem;
  }
`;

const LoginButtonContent = styled.span`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
`;

const LoginFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1.35rem;
  padding-top: 1.05rem;
  border-top: 1px solid rgba(226, 232, 240, 0.74);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.84375rem;
  font-weight: 500;
  letter-spacing: -0.012em;
  color: #64748b;

  @media (max-width: 639px) {
    margin-top: 1.1rem;
    padding-top: 0.95rem;
    font-size: 0.90625rem;
  }
`;

const LoginFooterLink = styled(Link)`
  color: #111827;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: -0.016em;
  transition: color 0.18s ease;

  &:hover {
    color: #4f46e5;
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Usuário já está logado, redirecionando...');
      navigate('/painel');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      localStorage.clear();
  
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
      expirationDate.setDate(expirationDate.getDate() + (formData.rememberMe ? 30 : 7));
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());
  
      const redirectPath = user.isVerified ? '/painel' : '/verificar';
      navigate(redirectPath);
    } catch (err) {
      console.error("❌ Erro no login automático:", err);
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
      title="Acesse sua conta"
      subtitle="Entre para acompanhar sua inscrição, consultar atualizações e continuar seu fluxo com clareza."
      layoutPreset="login"
      showUtilityActions={false}
    >
      <LoginContentStack>
        <LoginIntro>
          <LoginEyebrow>
            <FontAwesomeIcon icon={faShieldHalved} />
            Acesso autenticado
          </LoginEyebrow>
          <LoginHighlights>
            <LoginHighlight>
              <FontAwesomeIcon icon={faShieldHalved} />
              Ambiente seguro
            </LoginHighlight>
            <LoginHighlight>
              <FontAwesomeIcon icon={faKey} />
              Acesso ao painel
            </LoginHighlight>
          </LoginHighlights>
        </LoginIntro>

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

            <LoginSupportRow>
              <AuthRememberRow $login>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Manter acesso neste dispositivo</span>
              </AuthRememberRow>
              <LoginInlineLink to="/recuperarsenha">Esqueci a senha</LoginInlineLink>
            </LoginSupportRow>

            {error ? (
              <LoginAlert id="login-feedback" role="alert">
                {error}
              </LoginAlert>
            ) : null}

            <AuthLoginActions>
              <LoginSubmitButton type="submit" disabled={loading} $loading={loading}>
                {loading ? <AuthButtonSpinner /> : null}
                <AuthFlowButtonLabel>Entrar</AuthFlowButtonLabel>
              </LoginSubmitButton>
            </AuthLoginActions>
          </AuthLoginForm>

          <LoginFooter>
            Primeiro acesso?
            <LoginFooterLink to="/registrar">Criar conta</LoginFooterLink>
          </LoginFooter>
        </LoginFormShell>
      </LoginContentStack>
    </AuthLayout>
  );
};

export default Login;
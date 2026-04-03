import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faLock,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import AuthLayout from './auth/AuthLayout';
import PremiumAuthField from './auth/PremiumAuthField';
import {
  AuthFormAlert,
  AuthLoginActions,
  AuthLoginAuxDivider,
  AuthLoginAuxLinks,
  AuthLoginAuxRouterLink,
  AuthLoginFieldStack,
  AuthLoginForm,
  AuthPremiumInlineError,
  AuthPrimaryButton,
} from './auth/authStyles';
import { getApiBaseUrl } from '../../utils/apiBaseUrl';

const RegisterContentStack = styled.div`
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

const RegisterFormShell = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 100%;
  justify-content: space-between;
  gap: 0;
  padding-top: 0.18rem;

  @media (min-width: 640px) {
    padding-top: 0.22rem;
  }

  @media (max-width: 639px) {
    flex: 1;
    min-height: 0;
    justify-content: space-between;
    padding-top: 0;
  }
`;

const RegisterAlert = styled(AuthFormAlert)`
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

const RegisterSubmitButton = styled(AuthPrimaryButton)`
  margin-top: 0;
  position: relative;
  overflow: hidden;
  min-height: 48px;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.primaryGradient};
  color: #f8fafc;
  box-shadow:
    0 10px 22px rgba(91, 124, 250, 0.15),
    0 4px 10px rgba(91, 124, 250, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.2) inset,
    0 -1px 0 rgba(73, 88, 192, 0.08) inset;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease,
    background 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primaryGradient};
    filter: brightness(1.04);
    transform: scale(0.98);
    box-shadow:
      0 12px 26px rgba(91, 124, 250, 0.18),
      0 6px 12px rgba(91, 124, 250, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.2) inset;
  }

  &:active:not(:disabled) {
    filter: brightness(0.99);
    transform: scale(0.98);
    box-shadow:
      0 8px 18px rgba(91, 124, 250, 0.14),
      0 4px 8px rgba(91, 124, 250, 0.06);
  }

  &:disabled {
    background: #c7ced8;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (max-width: 639px) {
    min-height: 48px;
    height: 48px;
  }
`;

const PasswordFeedback = styled.p`
  margin: 0;
  padding: 0;
  font-size: 12px;
  line-height: 1.45;
  color: ${(props) => (props.$valid ? '#16a34a' : '#6b7280')};
  font-weight: ${(props) => (props.$valid ? 600 : 500)};
`;

const SubmitButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
`;

const SubmitSpinner = styled(FontAwesomeIcon)`
  font-size: 0.95rem;
`;

const RegisterFooter = styled.div`
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
    margin-top: auto;
    margin-left: -16px;
    margin-right: -16px;
    padding: 10px 16px max(10px, env(safe-area-inset-bottom, 0px));
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 -1px 0 rgba(15, 23, 42, 0.03);
  }
`;

const RegisterFooterActions = styled(AuthLoginAuxLinks)`
  margin-top: 0;
  padding: 0;
  max-width: none;
  justify-content: space-between;

  @media (max-width: 639px) {
    justify-content: space-between;
  }
`;

const RegisterFooterLink = styled(AuthLoginAuxRouterLink)`
  color: #334155;
  font-weight: 500;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = getApiBaseUrl();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getPasswordValidation = (password) => {
    if (!password) {
      return { show: false, valid: false, message: '' };
    }

    if (password.length < 8) {
      return {
        show: true,
        valid: false,
        message: 'Senha deve ter pelo menos 8 caracteres',
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        show: true,
        valid: false,
        message: 'Inclua uma letra maiúscula',
      };
    }

    return {
      show: true,
      valid: true,
      message: 'Senha válida ✔',
    };
  };

  const passwordValidation = getPasswordValidation(formData.password);
  const confirmPasswordMismatch =
    formData.confirmPassword !== '' && formData.confirmPassword !== formData.password;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError(null);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
      ...(name === 'password' ? { confirmPassword: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const nextFieldErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    setError(null);
    setFieldErrors(nextFieldErrors);

    if (!trimmedName) {
      nextFieldErrors.name = 'Informe seu nome completo.';
      setFieldErrors(nextFieldErrors);
      setError(nextFieldErrors.name);
      return;
    }

    if (!trimmedEmail) {
      nextFieldErrors.email = 'Informe seu e-mail.';
      setFieldErrors(nextFieldErrors);
      setError(nextFieldErrors.email);
      return;
    }

    if (!formData.password.trim()) {
      nextFieldErrors.password = 'Senha é obrigatória.';
      setFieldErrors(nextFieldErrors);
      setError(nextFieldErrors.password);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      nextFieldErrors.confirmPassword = 'As senhas não coincidem';
      setFieldErrors(nextFieldErrors);
      setError('As senhas não coincidem.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      nextFieldErrors.email = 'Por favor, insira um e-mail válido.';
      setFieldErrors(nextFieldErrors);
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (!passwordValidation.valid) {
      nextFieldErrors.password =
        passwordValidation.message || 'A senha informada é inválida.';
      setFieldErrors(nextFieldErrors);
      setError(passwordValidation.message || 'A senha informada é inválida.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/api/auth/registrar`, {
        name: trimmedName,
        email: trimmedEmail,
        password: formData.password,
      });

      toast.success('Sucesso. Verifique seu email.', {
        position: 'bottom-center',
        autoClose: 4000,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        const { id, name, email } = response.data.user;
        localStorage.setItem(
          'user',
          JSON.stringify({ name, userEmail: email, id })
        );
        localStorage.setItem('isVerified', 'false');

        navigate('/verificar');
      }

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || 'Erro ao registrar usuário'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Preencha seus dados para iniciar seu acesso ao sistema."
      layoutPreset="login"
      showUtilityActions={false}
    >
      <RegisterContentStack>
        <RegisterFormShell>
          <AuthLoginForm onSubmit={handleSubmit} noValidate>
            <AuthLoginFieldStack>
              <PremiumAuthField
                id="register-name"
                type="text"
                name="name"
                label="Nome completo"
                icon={faUser}
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
                placeholder="Digite seu nome completo"
                error={Boolean(fieldErrors.name)}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'register-name-error' : undefined}
              />
              {fieldErrors.name ? (
                <AuthPremiumInlineError id="register-name-error" $login role="alert">
                  {fieldErrors.name}
                </AuthPremiumInlineError>
              ) : null}

              <PremiumAuthField
                id="register-email"
                type="text"
                name="email"
                label="E-mail"
                icon={faEnvelope}
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
                inputMode="email"
                placeholder="nome@dominio.com"
                error={Boolean(fieldErrors.email)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
              />
              {fieldErrors.email ? (
                <AuthPremiumInlineError id="register-email-error" $login role="alert">
                  {fieldErrors.email}
                </AuthPremiumInlineError>
              ) : null}

              <PremiumAuthField
                id="register-password"
                type="password"
                name="password"
                label="Senha"
                icon={faLock}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                placeholder="Digite sua senha"
                error={Boolean(fieldErrors.password)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'register-password-error' : undefined}
              />
              {fieldErrors.password ? (
                <AuthPremiumInlineError id="register-password-error" $login role="alert">
                  {fieldErrors.password}
                </AuthPremiumInlineError>
              ) : null}

              {passwordValidation.show ? (
                <PasswordFeedback $valid={passwordValidation.valid}>
                  {passwordValidation.message}
                </PasswordFeedback>
              ) : null}

              <PremiumAuthField
                id="register-confirm-password"
                type="password"
                name="confirmPassword"
                label="Confirmar senha"
                icon={faLock}
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                placeholder="Confirme sua senha"
                error={Boolean(fieldErrors.confirmPassword) || confirmPasswordMismatch}
                aria-invalid={Boolean(fieldErrors.confirmPassword) || confirmPasswordMismatch}
                aria-describedby={
                  fieldErrors.confirmPassword || confirmPasswordMismatch
                    ? 'register-confirm-password-error'
                    : undefined
                }
              />
              {fieldErrors.confirmPassword || confirmPasswordMismatch ? (
                <AuthPremiumInlineError
                  id="register-confirm-password-error"
                  $login
                  role="alert"
                >
                  {fieldErrors.confirmPassword || 'As senhas não coincidem'}
                </AuthPremiumInlineError>
              ) : null}
            </AuthLoginFieldStack>

            {error ? <RegisterAlert>{error}</RegisterAlert> : null}

            <AuthLoginActions>
              <RegisterSubmitButton type="submit" disabled={loading}>
                <SubmitButtonContent>
                  {loading ? <SubmitSpinner icon={faSpinner} spin /> : null}
                  <span>{loading ? 'Registrando...' : 'Criar conta'}</span>
                </SubmitButtonContent>
              </RegisterSubmitButton>
            </AuthLoginActions>
          </AuthLoginForm>

          <RegisterFooter>
            <RegisterFooterActions aria-label="Ações secundárias">
              <RegisterFooterLink to="/">Entrar</RegisterFooterLink>
              <AuthLoginAuxDivider />
              <RegisterFooterLink to="/recuperarsenha">
                Recuperar senha
              </RegisterFooterLink>
            </RegisterFooterActions>
          </RegisterFooter>
        </RegisterFormShell>
      </RegisterContentStack>
    </AuthLayout>
  );
};

export default Register;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
  AuthLoginFieldStack,
  AuthLoginForm,
  AuthPrimaryButton,
} from './auth/authStyles';

const RegisterContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const RegisterFormShell = styled.div`
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

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, #323550 0%, #24263a 100%);
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(17, 24, 39, 0.14);
  }

  &:active:not(:disabled) {
    transform: scale(0.985);
    box-shadow: 0 5px 12px rgba(17, 24, 39, 0.1);
  }

  &:disabled {
    background: #c7ced8;
    cursor: not-allowed;
    box-shadow: none;
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

const RegisterFooterLink = styled(Link)`
  color: #6b7280;
  text-decoration: none;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.012em;
  transition: color 0.15s ease;

  &:hover,
  &:focus-visible {
    color: #2563eb;
  }

  &:focus {
    outline: none;
  }
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
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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

  const isFormValid = () => {
    const { name, email, password, confirmPassword } = formData;

    return (
      name.trim() !== '' &&
      isValidEmail(email.trim()) &&
      passwordValidation.valid &&
      confirmPassword === password
    );
  };

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
          <AuthLoginForm onSubmit={handleSubmit}>
            <AuthLoginFieldStack>
              <PremiumAuthField
                id="register-name"
                type="text"
                name="name"
                label="Nome completo"
                icon={faUser}
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="name"
                placeholder="Digite seu nome completo"
                error={Boolean(fieldErrors.name)}
                aria-invalid={Boolean(fieldErrors.name)}
              />

              <PremiumAuthField
                id="register-email"
                type="email"
                name="email"
                label="E-mail"
                icon={faEnvelope}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="email"
                inputMode="email"
                placeholder="nome@dominio.com"
                error={Boolean(fieldErrors.email)}
                aria-invalid={Boolean(fieldErrors.email)}
              />

              <PremiumAuthField
                id="register-password"
                type="password"
                name="password"
                label="Senha"
                icon={faLock}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="new-password"
                placeholder="Digite sua senha"
                error={Boolean(fieldErrors.password)}
                aria-invalid={Boolean(fieldErrors.password)}
              />

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
                required
                disabled={loading}
                autoComplete="new-password"
                placeholder="Confirme sua senha"
                error={Boolean(fieldErrors.confirmPassword) || confirmPasswordMismatch}
                aria-invalid={Boolean(fieldErrors.confirmPassword) || confirmPasswordMismatch}
              />

              {confirmPasswordMismatch ? (
                <PasswordFeedback $valid={false}>As senhas não coincidem</PasswordFeedback>
              ) : null}
            </AuthLoginFieldStack>

            {error ? <RegisterAlert>{error}</RegisterAlert> : null}

            <AuthLoginActions>
              <RegisterSubmitButton type="submit" disabled={!isFormValid() || loading}>
                <SubmitButtonContent>
                  {loading ? <SubmitSpinner icon={faSpinner} spin /> : null}
                  <span>{loading ? 'Registrando...' : 'Criar conta'}</span>
                </SubmitButtonContent>
              </RegisterSubmitButton>
            </AuthLoginActions>
          </AuthLoginForm>

          <RegisterFooter>
            <RegisterFooterLink to="/">Entrar</RegisterFooterLink>
            <RegisterFooterLink to="/recuperarsenha">
              Recuperar senha
            </RegisterFooterLink>
          </RegisterFooter>
        </RegisterFormShell>
      </RegisterContentStack>
    </AuthLayout>
  );
};

export default Register;
import React, { useEffect, useState } from 'react';
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
  AuthLoginActions,
  AuthLoginFieldStack,
  AuthLoginForm,
  AuthPrimaryButton,
} from './auth/authStyles';

const ForgotPasswordContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const ForgotPasswordFormShell = styled.div`
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

const ForgotPasswordForm = styled(AuthLoginForm)`
  margin-top: 0;
`;

const ForgotPasswordActions = styled(AuthLoginActions)`
  margin-top: 18px;

  @media (min-width: 640px) {
    margin-top: 18px;
  }

  @media (max-width: 639px) {
    margin-top: 18px;
  }
`;

const ForgotPasswordSubmitButton = styled(AuthPrimaryButton)`
  position: relative;
  overflow: hidden;
  min-height: 52px;
  height: 52px;
  border-radius: 5px;
  border: none;
  background: linear-gradient(180deg, #2b2d42 0%, #1f2133 100%);
  color: #f8fafc;
  box-shadow:
    0 8px 18px rgba(17, 24, 39, 0.14),
    0 16px 28px -24px rgba(17, 24, 39, 0.18);
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
    box-shadow:
      0 12px 24px rgba(17, 24, 39, 0.16),
      0 18px 34px -24px rgba(17, 24, 39, 0.2);
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

const ForgotPasswordFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.9rem;
  margin-top: 16px;
  padding-top: 0;
  border-top: 1px solid #e5e7eb;
  width: 100%;

  @media (max-width: 639px) {
    margin-top: 16px;
    padding-top: 0;
  }
`;

const ForgotPasswordFooterLink = styled(Link)`
  display: inline-flex;
  align-items: center;
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, formData);
      setDisabled(true);

      toast.success('Enviamos o link de redefinição para seu e-mail.', {
        position: 'bottom-center',
        autoClose: 4000,
      });

      setTimeout(() => navigate('/'), 4200);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Erro ao conectar com o servidor.',
        { position: 'top-center' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Informe seu e-mail para receber as instruções de redefinição."
      layoutPreset="login"
      brandMode="muted"
      spacingMode="recovery"
      showUtilityActions={false}
    >
      <ForgotPasswordContentStack>
        <ForgotPasswordFormShell>
          <ForgotPasswordForm onSubmit={handleReset}>
            <AuthLoginFieldStack>
              <PremiumAuthField
                id="forgot-password-email"
                type="email"
                name="email"
                label="E-mail"
                icon={faEnvelope}
                value={formData.email}
                onChange={(e) =>
                  setFormData((prevData) => ({ ...prevData, email: e.target.value }))
                }
                required
                disabled={loading}
                autoComplete="email"
                inputMode="email"
                placeholder="nome@dominio.com"
              />
            </AuthLoginFieldStack>

            <ForgotPasswordActions>
              <ForgotPasswordSubmitButton
                type="submit"
                disabled={loading || disabled}
                aria-busy={loading ? 'true' : 'false'}
              >
                {loading ? <AuthButtonSpinner /> : null}
                <AuthFlowButtonLabelWide>
                  {loading ? 'Enviar e-mail' : disabled ? (
                    `Aguarde ${countdown}s`
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faEnvelope} />
                      Enviar e-mail
                    </>
                  )}
                </AuthFlowButtonLabelWide>
              </ForgotPasswordSubmitButton>
            </ForgotPasswordActions>
          </ForgotPasswordForm>

          <ForgotPasswordFooter>
            <ForgotPasswordFooterLink to="/">Entrar</ForgotPasswordFooterLink>
          </ForgotPasswordFooter>
        </ForgotPasswordFormShell>
      </ForgotPasswordContentStack>
    </AuthLayout>
  );
};

export default ForgotPassword;
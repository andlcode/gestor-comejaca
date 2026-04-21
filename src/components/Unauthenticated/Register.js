import React, { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faLock,
  faSpinner,
  faCheck,
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
import { meetsNewPasswordPolicy } from '../../utils/newPasswordPolicy';

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

const PasswordHintsPanel = styled.div`
  margin-top: 8px;
  padding: 10px 12px 11px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.65) inset;

  @media (max-width: 639px) {
    padding: 10px 11px 11px;
    border-radius: 11px;
  }
`;

const PasswordHintsTitle = styled.p`
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #64748b;
  line-height: 1.35;
`;

const RequirementRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: ${({ $met }) => ($met ? '#15803d' : '#64748b')};
  font-weight: ${({ $met }) => ($met ? 500 : 400)};
  transition: color 0.2s ease, opacity 0.2s ease;

  & + & {
    margin-top: 6px;
  }
`;

const RequirementIcon = styled.span`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 10px;
  color: ${({ $met }) => ($met ? '#fff' : '#94a3b8')};
  background: ${({ $met }) =>
    $met ? 'linear-gradient(145deg, #22c55e 0%, #16a34a 100%)' : 'rgba(148, 163, 184, 0.22)'};
  box-shadow: ${({ $met }) =>
    $met ? '0 1px 2px rgba(22, 163, 74, 0.25)' : 'none'};
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

  ${({ $met }) =>
    $met &&
    `
    transform: scale(1);
  `}
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
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordBlurredOnce, setPasswordBlurredOnce] = useState(false);
  const [confirmBlurredOnce, setConfirmBlurredOnce] = useState(false);
  const [passwordSubmitRejected, setPasswordSubmitRejected] = useState(false);

  const navigate = useNavigate();
  const API_URL = getApiBaseUrl();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const password = formData.password;
  const confirmPassword = formData.confirmPassword;

  const passwordReqMinLen = useMemo(() => String(password || '').length >= 8, [password]);
  const passwordReqUppercase = useMemo(() => /[A-Z]/.test(String(password || '')), [password]);
  const passwordPolicyMet = useMemo(() => meetsNewPasswordPolicy(password), [password]);

  const passwordHintsVisible = passwordFocused || String(password || '').length > 0;

  const passwordShowHardError = useMemo(() => {
    if (fieldErrors.password) return true;
    if (
      passwordSubmitRejected &&
      !passwordPolicyMet &&
      String(password || '').length > 0
    ) {
      return true;
    }
    if (
      !passwordFocused &&
      passwordBlurredOnce &&
      String(password || '').length > 0 &&
      !passwordPolicyMet
    ) {
      return true;
    }
    return false;
  }, [
    fieldErrors.password,
    passwordSubmitRejected,
    passwordPolicyMet,
    password,
    passwordFocused,
    passwordBlurredOnce,
  ]);

  const passwordAriaDescribedBy = useMemo(() => {
    const ids = [];
    if (passwordHintsVisible) ids.push('register-password-requirements');
    if (fieldErrors.password) ids.push('register-password-error');
    return ids.length ? ids.join(' ') : undefined;
  }, [passwordHintsVisible, fieldErrors.password]);

  const confirmMismatchActive =
    String(confirmPassword || '').length > 0 &&
    confirmPassword !== password &&
    (confirmBlurredOnce || Boolean(fieldErrors.confirmPassword));

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError(null);
    if (name === 'password') {
      setPasswordSubmitRejected(false);
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
      ...(name === 'password' ? { confirmPassword: '' } : {}),
    }));
  };

  const handlePasswordFocus = useCallback(() => {
    setPasswordFocused(true);
    setPasswordSubmitRejected(false);
  }, []);

  const handlePasswordBlur = useCallback(() => {
    setPasswordFocused(false);
    setPasswordBlurredOnce(true);
  }, []);

  const handleConfirmBlur = useCallback((e) => {
    if (String(e?.target?.value ?? '').length > 0) {
      setConfirmBlurredOnce(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const verificationRoute = '/verificar';
    const nextFieldErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    setError(null);
    setPasswordSubmitRejected(false);
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

    if (!isValidEmail(trimmedEmail)) {
      nextFieldErrors.email = 'Por favor, insira um e-mail válido.';
      setFieldErrors(nextFieldErrors);
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (!formData.password.trim()) {
      nextFieldErrors.password = 'Senha é obrigatória.';
      setFieldErrors(nextFieldErrors);
      return;
    }

    if (!meetsNewPasswordPolicy(formData.password)) {
      setPasswordSubmitRejected(true);
      setFieldErrors(nextFieldErrors);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      nextFieldErrors.confirmPassword = 'As senhas não coincidem.';
      setConfirmBlurredOnce(true);
      setFieldErrors(nextFieldErrors);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('[Register] antes do submit', {
        apiUrl: API_URL,
        requestUrl: `${API_URL}/api/auth/registrar`,
        payload: {
          name: trimmedName,
          email: trimmedEmail,
        },
        passwordMeta: {
          present: Boolean(formData.password),
          length: formData.password ? formData.password.length : 0,
        },
      });

      const response = await axios.post(`${API_URL}/api/auth/registrar`, {
        name: trimmedName,
        email: trimmedEmail,
        password: formData.password,
      });

      console.log('[Register] resposta de sucesso recebida', {
        status: response?.status,
        data: response?.data,
      });

      if (!(response?.status >= 200 && response?.status < 300)) {
        throw new Error('O cadastro não retornou um status de sucesso esperado.');
      }

      const authToken = response?.data?.token;
      const responseUser = response?.data?.user || {};
      const verificationContext = {
        email: trimmedEmail,
        name: responseUser?.name || trimmedName,
      };

      if (!authToken) {
        throw new Error(
          'Cadastro concluído, mas o token necessário para a verificação não foi retornado.'
        );
      }

      localStorage.setItem('token', authToken);
      localStorage.setItem('userEmail', trimmedEmail);
      localStorage.setItem('isVerified', String(responseUser?.isVerified ?? false));

      if (responseUser?.id || responseUser?.name || trimmedEmail) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: responseUser?.id || null,
            name: responseUser?.name || trimmedName,
            userEmail: trimmedEmail,
          })
        );
      }

      toast.success('Sucesso. Verifique seu email.', {
        position: 'bottom-center',
        autoClose: 4000,
      });

      console.log('[Register] navegando para verificação', {
        route: verificationRoute,
        state: verificationContext,
      });

      navigate(verificationRoute, {
        state: verificationContext,
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('[Register] erro no fluxo de cadastro', {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
        stack: err?.stack,
      });
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
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                disabled={loading}
                autoComplete="new-password"
                placeholder="Digite sua senha"
                error={passwordShowHardError}
                aria-invalid={passwordShowHardError}
                aria-describedby={passwordAriaDescribedBy}
              />
              {passwordHintsVisible ? (
                <PasswordHintsPanel
                  id="register-password-requirements"
                  role="group"
                  aria-label="Requisitos da senha"
                >
                  <PasswordHintsTitle>Sua senha precisa ter</PasswordHintsTitle>
                  <RequirementRow $met={passwordReqMinLen}>
                    <RequirementIcon $met={passwordReqMinLen} aria-hidden>
                      {passwordReqMinLen ? (
                        <FontAwesomeIcon icon={faCheck} style={{ fontSize: '0.65rem' }} />
                      ) : (
                        <span style={{ fontSize: '0.55rem', opacity: 0.85 }}>•</span>
                      )}
                    </RequirementIcon>
                    <span>Mínimo de 8 caracteres</span>
                  </RequirementRow>
                  <RequirementRow $met={passwordReqUppercase}>
                    <RequirementIcon $met={passwordReqUppercase} aria-hidden>
                      {passwordReqUppercase ? (
                        <FontAwesomeIcon icon={faCheck} style={{ fontSize: '0.65rem' }} />
                      ) : (
                        <span style={{ fontSize: '0.55rem', opacity: 0.85 }}>•</span>
                      )}
                    </RequirementIcon>
                    <span>Pelo menos 1 letra maiúscula</span>
                  </RequirementRow>
                </PasswordHintsPanel>
              ) : null}
              {fieldErrors.password ? (
                <AuthPremiumInlineError id="register-password-error" $login role="alert">
                  {fieldErrors.password}
                </AuthPremiumInlineError>
              ) : null}

              <PremiumAuthField
                id="register-confirm-password"
                type="password"
                name="confirmPassword"
                label="Confirmar senha"
                icon={faLock}
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleConfirmBlur}
                disabled={loading}
                autoComplete="new-password"
                placeholder="Confirme sua senha"
                error={confirmMismatchActive}
                aria-invalid={confirmMismatchActive}
                aria-describedby={
                  confirmMismatchActive ? 'register-confirm-password-error' : undefined
                }
              />
              {confirmMismatchActive ? (
                <AuthPremiumInlineError
                  id="register-confirm-password-error"
                  $login
                  role="alert"
                >
                  As senhas não coincidem.
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
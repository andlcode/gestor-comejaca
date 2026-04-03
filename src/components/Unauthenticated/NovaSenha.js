import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import AuthLayout from './auth/AuthLayout';
import AuthRenderErrorBoundary from './auth/AuthRenderErrorBoundary';
import PremiumAuthField from './auth/PremiumAuthField';
import {
  AuthButtonSpinner,
  AuthFlowButtonLabelWide,
  AuthFormAlert,
  AuthLoginActions,
  AuthLoginFieldStack,
  AuthLoginForm,
  AuthPremiumInlineError,
  AuthPrimaryButton,
} from './auth/authStyles';
import { getSafeApiErrorMessage, getSafeMessage } from '../../utils/safeMessage';
import { getApiBaseUrl } from '../../utils/apiBaseUrl';

const API_URL = getApiBaseUrl();
const REQUEST_TIMEOUT_MS = 15000;

const ResetPasswordContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const ResetPasswordFormShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 0.12rem;
`;

const ResetPasswordForm = styled(AuthLoginForm)`
  margin-top: 0;
`;

const ResetPasswordActions = styled(AuthLoginActions)`
  margin-top: 16px;
`;

const ResetPasswordInfo = styled(AuthFormAlert)`
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 3px solid rgba(37, 99, 235, 0.28);
  box-shadow: none;
`;

const ResetPasswordError = styled(AuthFormAlert)`
  color: #7f1d1d;
  background: #fef2f2;
  border: 1px solid rgba(248, 113, 113, 0.18);
  border-left: 3px solid rgba(239, 68, 68, 0.38);
  box-shadow: none;
`;

const ResetPasswordSuccess = styled(AuthFormAlert)`
  color: #166534;
  background: #f0fdf4;
  border: 1px solid rgba(34, 197, 94, 0.16);
  border-left: 3px solid rgba(34, 197, 94, 0.42);
  box-shadow: none;
`;

const PasswordFeedback = styled.p`
  margin: 8px 0 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: ${({ $valid }) => ($valid ? '#16a34a' : '#6b7280')};
`;

const ResetPasswordSubmitButton = styled(AuthPrimaryButton)`
  position: relative;
  overflow: hidden;
  min-height: 52px;
  height: 52px;
  border-radius: 5px;
  border: none;
  background: linear-gradient(180deg, #2b2d42 0%, #1f2133 100%);
  color: #f8fafc;
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.14);
  transition:
    background 0.18s ease,
    transform 0.15s ease,
    box-shadow 0.18s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, #323550 0%, #24263a 100%);
    transform: translateY(-1px);
    box-shadow: 0 12px 26px rgba(17, 24, 39, 0.16);
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
      0 0 0 3px rgba(124, 58, 237, 0.12),
      0 10px 24px rgba(17, 24, 39, 0.14);
  }

  &:disabled {
    background: #c7ced8;
    color: rgba(255, 255, 255, 0.96);
    box-shadow: none;
    cursor: not-allowed;
  }

  &[aria-busy='true'] {
    cursor: wait;
  }
`;

const ResetPasswordFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #e5e7eb;
  width: 100%;

  @media (max-width: 639px) {
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 0.75rem;
  }
`;

const ResetPasswordFooterLink = styled(Link)`
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

const createStatusState = (type = '', message = '') => ({
  type,
  message: getSafeMessage(message, ''),
});

const NovaSenha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(
    () => getSafeMessage(searchParams.get('token'), '').trim(),
    [searchParams]
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [invalidToken, setInvalidToken] = useState(false);
  const [userName, setUserName] = useState('');
  const [status, setStatus] = useState(createStatusState());
  const [fieldErrors, setFieldErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const passwordFeedback = useMemo(() => {
    if (!newPassword) return '';
    if (newPassword.length < 8) return 'Senha deve ter pelo menos 8 caracteres';
    if (!/[A-Z]/.test(newPassword)) return 'Inclua uma letra maiúscula';
    return 'Senha válida ✔';
  }, [newPassword]);

  const passwordIsValid =
    newPassword.length >= 8 && /[A-Z]/.test(newPassword);

  const confirmPasswordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  useEffect(() => {
    let ignore = false;

    const validateToken = async () => {
      if (!token) {
        const message = 'Este link é inválido ou está incompleto.';
        setInvalidToken(true);
        setStatus(createStatusState('error', message));
        setValidating(false);
        toast.error(message);
        return;
      }

      try {
        setValidating(true);
        setStatus(createStatusState('info', 'Validando o link enviado para o seu e-mail...'));

        const response = await axios.get(
          `${API_URL}/api/auth/reset-password/validate`,
          {
            params: { token },
            timeout: REQUEST_TIMEOUT_MS,
          }
        );

        if (ignore) return;

        setUserName(getSafeMessage(response.data?.user?.name, 'participante'));
        setInvalidToken(false);
        setStatus(createStatusState());
      } catch (error) {
        if (ignore) return;

        const message = getSafeApiErrorMessage(
          error,
          'Este link é inválido, expirou ou já foi utilizado.'
        );

        setInvalidToken(true);
        setStatus(createStatusState('error', message));
        toast.error(message);
      } finally {
        if (!ignore) {
          setValidating(false);
        }
      }
    };

    validateToken();

    return () => {
      ignore = true;
    };
  }, [token]);

  const layoutCopy = useMemo(() => {
    if (validating) {
      return {
        title: 'Validando link',
        subtitle: 'Estamos conferindo o seu link de redefinição.',
      };
    }

    if (invalidToken) {
      return {
        title: 'Link inválido ou expirado',
        subtitle: 'Solicite um novo link para redefinir sua senha.',
      };
    }

    return {
      title: `Olá, ${userName || 'participante'}`,
      subtitle: 'Informe e confirme sua nova senha.',
    };
  }, [invalidToken, userName, validating]);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (!token) {
      const message = 'Token inválido ou expirado.';
      setStatus(createStatusState('error', message));
      toast.error(message);
      return;
    }

    const nextFieldErrors = {
      newPassword: '',
      confirmPassword: '',
    };

    if (!newPassword.trim()) {
      nextFieldErrors.newPassword = 'Senha é obrigatória.';
    } else if (!passwordIsValid) {
      nextFieldErrors.newPassword =
        'A senha deve ter pelo menos 8 caracteres e uma letra maiúscula.';
    }

    if (!confirmPassword.trim()) {
      nextFieldErrors.confirmPassword = 'Confirme sua nova senha.';
    } else if (newPassword !== confirmPassword) {
      nextFieldErrors.confirmPassword = 'As senhas não coincidem.';
    }

    setFieldErrors(nextFieldErrors);

    if (nextFieldErrors.newPassword || nextFieldErrors.confirmPassword) {
      setStatus(createStatusState());
      return;
    }

    try {
      setLoading(true);
      setStatus(createStatusState());

      const response = await axios.post(
        `${API_URL}/api/auth/reset-password`,
        {
          token,
          newPassword,
        },
        {
          timeout: REQUEST_TIMEOUT_MS,
        }
      );

      const successMessage = getSafeMessage(
        response?.data?.message,
        'Senha atualizada com sucesso.'
      );

      setStatus(createStatusState('success', successMessage));
      toast.success(successMessage);
      navigate('/');
    } catch (error) {
      const message = getSafeApiErrorMessage(
        error,
        'Não foi possível atualizar a senha.'
      );
      setStatus(createStatusState('error', message));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRenderErrorBoundary>
      <AuthLayout
        title={layoutCopy.title}
        subtitle={layoutCopy.subtitle}
        layoutPreset="login"
      >
        <ResetPasswordContentStack>
          <ResetPasswordFormShell>
            {validating ? (
              <ResetPasswordInfo>
                Aguarde um instante enquanto validamos o token enviado para o seu e-mail.
              </ResetPasswordInfo>
            ) : null}

            {!validating && status.type === 'error' && invalidToken ? (
              <>
                <ResetPasswordError role="alert" aria-live="assertive">
                  {status.message}
                </ResetPasswordError>

                <ResetPasswordFooter>
                  <ResetPasswordFooterLink to="/recuperarsenha">
                    Solicitar novo link
                  </ResetPasswordFooterLink>
                  <ResetPasswordFooterLink to="/">Voltar para o login</ResetPasswordFooterLink>
                </ResetPasswordFooter>
              </>
            ) : null}

            {!validating && !invalidToken ? (
              <>
                <ResetPasswordForm onSubmit={handleSubmit} noValidate>
                  <AuthLoginFieldStack>
                    <PremiumAuthField
                      id="reset-password-new-password"
                      type="password"
                      name="newPassword"
                      label="Nova senha"
                      icon={faLock}
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(getSafeMessage(event?.target?.value, ''));
                        setFieldErrors((previousErrors) => ({
                          ...previousErrors,
                          newPassword: '',
                        }));
                        if (status.message) {
                          setStatus(createStatusState());
                        }
                      }}
                      disabled={loading}
                      autoComplete="new-password"
                      placeholder="Digite sua nova senha"
                      error={Boolean(fieldErrors.newPassword)}
                      aria-invalid={Boolean(fieldErrors.newPassword)}
                      aria-describedby={
                        fieldErrors.newPassword ? 'reset-password-new-password-error' : undefined
                      }
                    />
                    {fieldErrors.newPassword ? (
                      <AuthPremiumInlineError
                        id="reset-password-new-password-error"
                        $login
                        role="alert"
                      >
                        {fieldErrors.newPassword}
                      </AuthPremiumInlineError>
                    ) : null}

                    {passwordFeedback ? (
                      <PasswordFeedback $valid={passwordIsValid}>{passwordFeedback}</PasswordFeedback>
                    ) : null}

                    <PremiumAuthField
                      id="reset-password-confirm-password"
                      type="password"
                      name="confirmPassword"
                      label="Confirmar nova senha"
                      icon={faLock}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(getSafeMessage(event?.target?.value, ''));
                        setFieldErrors((previousErrors) => ({
                          ...previousErrors,
                          confirmPassword: '',
                        }));
                        if (status.message) {
                          setStatus(createStatusState());
                        }
                      }}
                      disabled={loading}
                      autoComplete="new-password"
                      placeholder="Confirme sua nova senha"
                      error={Boolean(fieldErrors.confirmPassword) || confirmPasswordMismatch}
                      aria-invalid={Boolean(fieldErrors.confirmPassword) || confirmPasswordMismatch}
                      aria-describedby={
                        fieldErrors.confirmPassword || confirmPasswordMismatch
                          ? 'reset-password-confirm-password-error'
                          : undefined
                      }
                    />

                    {fieldErrors.confirmPassword || confirmPasswordMismatch ? (
                      <AuthPremiumInlineError
                        id="reset-password-confirm-password-error"
                        $login
                        role="alert"
                      >
                        {fieldErrors.confirmPassword || 'As senhas não coincidem'}
                      </AuthPremiumInlineError>
                    ) : null}
                  </AuthLoginFieldStack>

                  {status.type === 'error' && !invalidToken ? (
                    <ResetPasswordError role="alert" aria-live="assertive">
                      {status.message}
                    </ResetPasswordError>
                  ) : null}

                  {status.type === 'success' ? (
                    <ResetPasswordSuccess role="status" aria-live="polite">
                      {status.message}
                    </ResetPasswordSuccess>
                  ) : null}

                  <ResetPasswordActions>
                    <ResetPasswordSubmitButton
                      type="submit"
                      disabled={loading}
                      aria-busy={loading ? 'true' : 'false'}
                    >
                      {loading ? <AuthButtonSpinner /> : null}
                      <AuthFlowButtonLabelWide>
                        {loading ? 'Salvando...' : 'Salvar nova senha'}
                      </AuthFlowButtonLabelWide>
                    </ResetPasswordSubmitButton>
                  </ResetPasswordActions>
                </ResetPasswordForm>

                <ResetPasswordFooter>
                  <ResetPasswordFooterLink to="/">Voltar para o login</ResetPasswordFooterLink>
                </ResetPasswordFooter>
              </>
            ) : null}
          </ResetPasswordFormShell>
        </ResetPasswordContentStack>
      </AuthLayout>
    </AuthRenderErrorBoundary>
  );
};

export default NovaSenha;
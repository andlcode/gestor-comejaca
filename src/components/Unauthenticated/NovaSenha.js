import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLock } from '@fortawesome/free-solid-svg-icons';
import AuthLayout from './auth/AuthLayout';
import PremiumAuthField from './auth/PremiumAuthField';
import {
  AuthButtonSpinner,
  AuthFlowButtonLabelWide,
  AuthFormAlert,
  AuthLoginActions,
  AuthLoginFieldStack,
  AuthLoginForm,
  AuthPrimaryButton,
} from './auth/authStyles';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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

const NovaSenha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [invalidToken, setInvalidToken] = useState(false);
  const [userName, setUserName] = useState('');

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
        setInvalidToken(true);
        setValidating(false);
        toast.error('Token inválido ou expirado.');
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/auth/reset-password/validate`,
          {
            params: { token },
          }
        );

        if (ignore) return;

        setUserName(response.data?.user?.name || '');
        setInvalidToken(false);
      } catch (error) {
        if (ignore) return;

        setInvalidToken(true);
        toast.error(
          error.response?.data?.message || 'Token inválido ou expirado.'
        );
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
    e.preventDefault();

    if (!token) {
      toast.error('Token inválido ou expirado.');
      return;
    }

    if (!passwordIsValid) {
      toast.error(
        'A senha deve ter pelo menos 8 caracteres e uma letra maiúscula.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('A confirmação da senha não coincide.');
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        newPassword,
      });

      toast.success('Senha atualizada com sucesso.');
      navigate('/');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Erro ao atualizar senha.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={layoutCopy.title}
      subtitle={layoutCopy.subtitle}
      layoutPreset="login"
      brandMode="muted"
      spacingMode="recovery"
      showUtilityActions={false}
    >
      <ResetPasswordContentStack>
        <ResetPasswordFormShell>
          {validating ? (
            <ResetPasswordInfo>
              Aguarde um instante enquanto validamos o token enviado para o seu e-mail.
            </ResetPasswordInfo>
          ) : null}

          {!validating && invalidToken ? (
            <>
              <ResetPasswordError>
                Este link de redefinição é inválido, expirou ou já foi utilizado.
              </ResetPasswordError>

              <ResetPasswordFooter>
                <ResetPasswordFooterLink to="/recuperarsenha">
                  Solicitar novo link
                </ResetPasswordFooterLink>

                <ResetPasswordFooterLink to="/">
                  <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} />
                  Voltar para o login
                </ResetPasswordFooterLink>
              </ResetPasswordFooter>
            </>
          ) : null}

          {!validating && !invalidToken ? (
            <>
              <ResetPasswordForm onSubmit={handleSubmit}>
                <AuthLoginFieldStack>
                  <PremiumAuthField
                    id="reset-password-new-password"
                    type="password"
                    name="newPassword"
                    label="Nova senha"
                    icon={faLock}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    placeholder="Digite sua nova senha"
                  />

                  {passwordFeedback ? (
                    <PasswordFeedback $valid={passwordIsValid}>
                      {passwordFeedback}
                    </PasswordFeedback>
                  ) : null}

                  <PremiumAuthField
                    id="reset-password-confirm-password"
                    type="password"
                    name="confirmPassword"
                    label="Confirmar nova senha"
                    icon={faLock}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    placeholder="Confirme sua nova senha"
                    error={confirmPasswordMismatch}
                  />

                  {confirmPasswordMismatch ? (
                    <PasswordFeedback>As senhas não coincidem</PasswordFeedback>
                  ) : null}
                </AuthLoginFieldStack>

                <ResetPasswordActions>
                  <ResetPasswordSubmitButton
                    type="submit"
                    disabled={loading}
                    aria-busy={loading ? 'true' : 'false'}
                  >
                    {loading ? <AuthButtonSpinner /> : null}
                    <AuthFlowButtonLabelWide>
                      Salvar nova senha
                    </AuthFlowButtonLabelWide>
                  </ResetPasswordSubmitButton>
                </ResetPasswordActions>
              </ResetPasswordForm>

              <ResetPasswordFooter>
                <ResetPasswordFooterLink to="/">
                  <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} />
                  Voltar para o login
                </ResetPasswordFooterLink>
              </ResetPasswordFooter>
            </>
          ) : null}
        </ResetPasswordFormShell>
      </ResetPasswordContentStack>
    </AuthLayout>
  );
};

export default NovaSenha;
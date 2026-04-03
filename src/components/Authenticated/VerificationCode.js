import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../Unauthenticated/auth/AuthLayout';
import PremiumAuthField from '../Unauthenticated/auth/PremiumAuthField';
import {
  AuthButtonSpinner,
  AuthFlowButtonLabel,
  AuthFormAlert,
  AuthLoginActions,
  AuthLoginFieldStack,
  AuthLoginForm,
  AuthPrimaryButton,
} from '../Unauthenticated/auth/authStyles';
import { getApiBaseUrl } from '../../utils/apiBaseUrl';

const VerificationContentStack = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 100%;
  width: 100%;
  gap: 0;
  justify-content: space-between;

  @media (max-width: 639px) {
    min-height: 0;
  }
`;

const VerificationContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  justify-content: center;
  width: 100%;

  @media (max-width: 639px) {
    justify-content: center;
  }
`;

const VerificationSuccess = styled(AuthFormAlert)`
  color: #166534;
  background: #f0fdf4;
  border: 1px solid rgba(34, 197, 94, 0.16);
  border-left: 3px solid rgba(34, 197, 94, 0.42);
  box-shadow: none;
`;

const VerificationError = styled(AuthFormAlert)`
  color: #7f1d1d;
  background: #fef2f2;
  border: 1px solid rgba(248, 113, 113, 0.18);
  border-left: 3px solid rgba(239, 68, 68, 0.34);
  box-shadow: none;
`;

const VerificationSubmitButton = styled(AuthPrimaryButton)`
  margin-top: 0;
  position: relative;
  overflow: hidden;
  min-height: 52px;
  height: 52px;
  border-radius: 16px;

  &[aria-busy='true'] {
    cursor: wait;
  }
`;

const VerificationFooter = styled.div`
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
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 -1px 0 rgba(15, 23, 42, 0.03);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
`;

const VerificationFooterActions = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;

  @media (max-width: 639px) {
    gap: 8px;
  }
`;

const VerificationSecondaryButton = styled.button`
  flex: 1 1 50%;
  min-height: 46px;
  padding: 0.75rem 0.9rem;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.88);
  color: rgba(51, 65, 85, 0.9);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(15, 23, 42, 0.12);
    color: #1f2937;
    box-shadow: 0 6px 16px -14px rgba(15, 23, 42, 0.18);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.62;
    box-shadow: none;
  }
`;

const VerificationCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verificationState = location.state || {};
      useEffect(() => {
        const token = localStorage.getItem("token");
      
        if (!token) {
          navigate("/");
        }
      }, [navigate]);
     
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // Adicionando estado para controlar a submissão
  const API_URL = getApiBaseUrl();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

   // Corrigido para o nome correto da chave
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.id;  
  const emailForVerification =
    verificationState?.email || storedUser?.userEmail || storedUser?.email || userEmail || '';
  console.log("E-mail salvo:", storedUser?.userEmail);
  console.log('[VerificationCode] state recebido:', verificationState);
  
  console.log("Token:", token);
  console.log("ID do usuário:", userId);



if (storedUser) {
  console.log("ID salvo no localStorage:", storedUser.id);
} else {
  console.log("Nenhum usuário encontrado no localStorage.");
}

// Verifica se o token existe
if (token) {
  console.log("Token:", token);
} else {
  console.log("Nenhum token encontrado no localStorage.");
}




// Modificação do Input onChange para permitir apenas números
const handleCodeChange = (e) => {
  const inputValue = e.target.value;

  // Filtra para permitir apenas números e limita a 6 dígitos
  if (/^\d{0,6}$/.test(inputValue)) {
    setCode(inputValue);  // Atualiza o estado com o valor filtrado
  }
};

useEffect(() => {
  const token = localStorage.getItem("token");
console.log("token: " + token);
  if (!token) {
    navigate("/");  // Caso não haja token, redireciona para a página inicial
  }
}, [navigate]);
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("ID do usuário:", userId);  // Verificar o ID do usuário
  if (code.length !== 6) {
    setError('Por favor, insira um código válido de 6 dígitos.');
    return;
  }

  setIsSubmitting(true); // Indicando que a submissão está em andamento

  try {
   const response = await axios.post(`${API_URL}/api/auth/verificar`,
      {
        userId: userId,
        verificationCode: code, // Envia o código digitado pelo usuário
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(userId, code, token);

    // Verifica se o usuário foi verificado
    if (response.data.user && response.data.user.isVerified) {
      
      setSuccess(true);
      setCode(''); // Limpa o campo de código
      localStorage.removeItem('verificationCode'); // Limpa o código de verificação do localStorage

      // Preserva role existente e atualiza o snapshot do usuário verificado.
      const { id, name, email, role } = response.data.user;
      const existingStoredRole = localStorage.getItem('role');
      const resolvedRole = role || existingStoredRole || null;

      localStorage.setItem(
        'user',
        JSON.stringify({
          id,
          name,
          email,
          userEmail: email,
          role: resolvedRole,
        })
      );

      if (resolvedRole) {
        localStorage.setItem('role', resolvedRole);
      }
  
      alert('Conta verificada com sucesso!');
      localStorage.setItem('isVerified', 'true');
            if (window.location.hostname === 'localhost') {
        // Se estiver em localhost, redireciona para o ambiente local
        window.location.replace('http://localhost:3000/painel');
      } else {
        // Caso contrário, redireciona para o ambiente de produção
        window.location.replace('https://www.comejaca.org.br/painel');
      }
      setError(response.data.error || 'Erro desconhecido.');
    }
  } catch (err) {
    console.error('Erro ao verificar o código:', err);
    setError('Ocorreu um erro ao verificar o código. Tente novamente.');
  } finally {
    setIsSubmitting(false); // Finaliza o estado de submissão
  }
};
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("Usuário no localStorage:", user);  // Verificar o usuário no localStorage
}, []);
  const handleResendCode = async () => {
  
    setIsResendDisabled(true);
    setCountdown(60);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/enviarcodigo`,
        {
          email: String(userEmail || '').trim().toLowerCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setError(''); // Limpa mensagens de erro anteriores
        setSuccess('Novo código enviado com sucesso!');
      } else {
        setError(response.data.message || 'Erro ao enviar o novo código.');
      }
    } catch (error) {
      console.error('Erro ao solicitar um novo código:', error);
      setError('Erro ao solicitar um novo código.');
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  useEffect(() => {
    if (code.length === 6) {
      handleSubmit(new Event('submit')); // Submete o formulário automaticamente
    }
  }, [code]);

  return (
    <AuthLayout
      title="Verificar código"
      subtitle={`Enviamos um código para o e-mail ${emailForVerification || 'informado no cadastro'}.`}
      layoutPreset="login"
    >
      <VerificationContentStack>
        <VerificationContentWrapper>
          <AuthLoginForm onSubmit={handleSubmit} noValidate>
            <AuthLoginFieldStack>
              <PremiumAuthField
                id="verification-code"
                type="text"
                name="verificationCode"
                label="Código de verificação"
                icon={faKey}
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Digite o código de 6 dígitos"
                disabled={isSubmitting}
                aria-invalid={Boolean(error)}
                aria-describedby={error || success ? 'verification-feedback' : undefined}
              />
            </AuthLoginFieldStack>

            {success ? (
              <VerificationSuccess id="verification-feedback" role="status" aria-live="polite">
                {typeof success === 'string' ? success : 'Código verificado com sucesso! 🎉'}
              </VerificationSuccess>
            ) : null}

            {error ? (
              <VerificationError id="verification-feedback" role="alert" aria-live="assertive">
                {error}
              </VerificationError>
            ) : null}

            <AuthLoginActions>
              <VerificationSubmitButton
                type="submit"
                disabled={isSubmitting || code.length !== 6}
                aria-busy={isSubmitting ? 'true' : 'false'}
              >
                {isSubmitting ? <AuthButtonSpinner /> : null}
                <AuthFlowButtonLabel>{isSubmitting ? 'Ativando...' : 'Ativar'}</AuthFlowButtonLabel>
              </VerificationSubmitButton>
            </AuthLoginActions>
          </AuthLoginForm>
        </VerificationContentWrapper>

        <VerificationFooter>
          <VerificationFooterActions aria-label="Ações secundárias">
            <VerificationSecondaryButton
              type="button"
              onClick={handleResendCode}
              disabled={isResendDisabled}
            >
              {isResendDisabled ? `Aguarde ${countdown}s` : 'Reenviar'}
            </VerificationSecondaryButton>
            <VerificationSecondaryButton
              type="button"
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
            >
              Sair
            </VerificationSecondaryButton>
          </VerificationFooterActions>
        </VerificationFooter>
      </VerificationContentStack>
    </AuthLayout>
  );
};

export default VerificationCode;

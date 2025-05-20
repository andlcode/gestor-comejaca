import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { toast } from "react-toastify";

import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
// Animação de fundo
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 95vh;

  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  box-sizing: border-box;
  background: #e7ecef;
  @media (max-width: 480px) {
    padding: 0;
  }
`;








const AuthWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  padding: 2.5rem;
  margin: 1rem;
  background: #e7ecef;
  backdrop-filter: blur(20px);
  border-radius: 5px;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0;
    border-radius: 0;
  
    flex-direction: column;
    justify-content: center;
  }
`;


const Title = styled.h1`
  text-align: center;
  color: #22223b;
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  margin-bottom: 2.5rem;
  @media (max-width: 600px) {
    font-size: 2.3rem /* Reduz o tamanho do título em telas pequenas */
  }
`;
const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #fff;;
  border: 1px solid #ccc;
  border-radius: 12px;
  transition: border-color 0.3s ease;

/*   &:focus-within {
    border-color: #4a4a4a;
 
  } */
    &:focus-within {
    border-color: #4a4e69;
    box-shadow: 0 0 3px rgba(74, 78, 105, 0.5);
  }
  &:hover {

    border: #0d1b2a 1px solid
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    gap: 0.8rem;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 1rem;
  border: none;
  outline: none;
  background: transparent;
  color: #333;
  font-family: 'Poppins', sans-serif;

  &::placeholder {
    color: #aaa;
  }

  @media (max-width: 600px) {
    font-size: 0.9rem; 
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;

  color: white;
  border: none;
  border-radius: 5px;
height: 49px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;

  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #22223b 0%, #22223b 100%);
  margin-top: 1.5rem;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #f39c12 0%, #f39c12 100%);
  }
  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    padding: 10px; /* Reduz o padding em telas pequenas */
    font-size: 0.9rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

// Mensagem de erro
const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  font-family: 'Poppins', sans-serif;

  ${({ hasError }) => hasError && `
    color: #e74c3c;
    font-size: 14px;
    font-weight: 600;
  `}
  @media (max-width: 600px) {
    font-size: 0.8rem; /* Reduz o tamanho da fonte em telas pequenas */
  }
`;

const StyledLink = styled(Link)`
  color: #22223b;
  text-decoration: none;
  font-size: 14px;
  display: block;
  text-align: center;
  margin-top: 15px;
  font-family: 'Poppins', sans-serif;
  transition: color 0.3s;

  &:hover {
    color: #335c67;
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    font-size: 0.8rem; 
    margin-bottom: 120px;
  }
`;

// Ícones
const Icon = styled.span`
  margin-right: 10px;
  color: #4a4e69;

  @media (max-width: 600px) {
    font-size: 0.9rem; /* Reduz o tamanho do ícone em telas pequenas */
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

 
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  const isFormValid = () => {
    const { name, email, password, confirmPassword } = formData;
    return (
      name.trim() !== '' &&
      isValidEmail(email) &&
      password.length === 8 &&
      confirmPassword === password
    );
  };
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangePassword = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
  
      // Validações
      if (name === 'password') {
        if (value.length !== 8) {
          setErrorMessage('A senha deve ter exatamente 8 caracteres.');
        } else {
          setErrorMessage('');
        }
      }
  
      if (name === 'confirmPassword') {
        if (value !== updatedData.password) {
          setErrorMessage('A confirmação da senha deve ser igual à senha.');
        } else if (value.length !== 8) {
          setErrorMessage('A confirmação da senha deve ter exatamente 8 caracteres.');
        } else {
          setErrorMessage('');
        }
      }
  
      return updatedData;
    });
  };
  
  
  const handleSubmit = async (e) => {
    localStorage.clear();
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
  
    if (!isValidEmail(formData.email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/api/auth/registrar`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
        toast.success("Sucesso. Verifique seu email.", {
              position: "bottom-center",
              autoClose: 4000,
            });
      
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
  
        // Aqui estamos pegando o id da resposta da API e salvando no localStorage
        const { id, name, email } = response.data.user; // Supondo que o id, name e email estão na resposta
  
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: name,
            userEmail: email, // Salvando o e-mail como 'userEmail'
            id: id, // Salvando o id
          })
        );
  
        localStorage.setItem('isVerified', 'false');
  
        setError('Código de verificação enviado. Por favor, verifique seu e-mail.');
        navigate('/verificar');
      }
  
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro ao registrar usuário');
      console.error('Erro de registro:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
<AuthContainer>
  <AuthWrapper>
    <Title>NOVA CONTA</Title>
    <Form onSubmit={handleSubmit}>
      <InputWrapper>
        <Icon><FiUser /></Icon>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome completo"
          required
          aria-label="Nome completo"
        />
      </InputWrapper>

      <InputWrapper>
        <Icon><FiMail /></Icon>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="E-mail"
          required
          aria-label="E-mail"
        />
      </InputWrapper>

      <InputWrapper>
        <Icon><FiLock /></Icon>
        <Input
          type="password"
          name="password"
          value={formData.password}
         // onChange={handleChangePassword}
          placeholder="Senha"
          required
          maxLength={8}
          aria-label="Senha"
          className={errorMessage ? 'error' : ''}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
      </InputWrapper>

      <InputWrapper>
        <Icon><FiLock /></Icon>
        <Input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
       //   onChange={handleChangePassword}
          placeholder="Confirmar senha"
          required
          maxLength={8}
          aria-label="Confirmar senha"
          className={errorMessage ? 'error' : ''}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
      </InputWrapper>

{/*       {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {isPasswordFocused && (
        <PasswordStrengthIndicator password={formData.password} />
      )}
 */}
      <Button disabled={!isFormValid() || loading} type="submit">
        {loading
          ? 'Registrando...'
          : !isFormValid()
          ? 'Preencha tudo corretamente'
          : 'Registrar'}
      </Button>
    </Form>

    {error && <ErrorMessage>{error}</ErrorMessage>}

    <StyledLink to="/">Já tem uma conta? Faça login aqui.</StyledLink>
  </AuthWrapper>
</AuthContainer>

  );
};

export default Register;
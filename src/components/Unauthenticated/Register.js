import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { toast } from "react-toastify";

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
    background-size: 100% 100%; /* ← Reduza o tamanho */
  animation: none; /* ← Desative a animação no mobile */

  @media (max-width: 768px) {
    animation: none;
  }
`;

const span = styled.div`
 font-size: 0.7rem;
  
`;
const AuthWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  margin: 1rem;
  background: #e7ecef;
  backdrop-filter: blur(20px);
  border-radius: 5px;

    @media (max-width: 768px) {
    backdrop-filter: none; 
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #22223b;
  font-size: 2.5rem;
  margin-bottom: 2.5rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
`;

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 12px;
  transition: none;

  &:focus-within {
    border-color: #4a4e69;
    /* Evite box-shadow no mobile */
    box-shadow: none;
  }

  &:hover {
    border: #0d1b2a 1px solid;
  }
  
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 1rem;
  border: none;
  outline: none;
  background: #fff;
  color: #333;
  font-family: 'Poppins', sans-serif;

  &::placeholder {
    color: #aaa;
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
  height: 49px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #22223b 0%, #22223b 100%);
  margin-top: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #f39c12 0%, #f39c12 100%);
  }

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  font-family: 'Poppins', sans-serif;
`;

const StyledLink = styled(Link)`
  color: #22223b;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  margin-top: 15px;
  font-family: 'Poppins', sans-serif;

  &:hover {
    color: #335c67;
    text-decoration: underline;
  }
`;

const Icon = styled.span`
  margin-right: 10px;
  color: #4a4e69;
`;

const PasswordCriteriaList = styled.ul`
  list-style: none;
  padding-left: 0;
  font-size: 0.85rem;
  color: #555;
  margin-top: 0.5rem;
  text-align: left;
`;

const PasswordCriteriaItem = styled.li`
  color: ${(props) => (props.met ? '#27ae60' : '#999')};
  margin-bottom: 0.3rem;
  font-weight: ${(props) => (props.met ? '600' : '400')};
  &:before {
    content: '${(props) => (props.met ? '✔' : '✖')}';
    display: inline-block;
    width: 1em;
    margin-right: 0.5em;
    color: ${(props) => (props.met ? '#27ae60' : '#999')};
  }
`;

// Critérios de senha
const passwordCriteria = {
  length: {
    test: (pw) => pw.length === 8,
    label: "Exatamente 8 caracteres",
  },
  uppercase: {
    test: (pw) => /[A-Z]/.test(pw),
    label: "Pelo menos 1 letra maiúscula",
  },
  lowercase: {
    test: (pw) => /[a-z]/.test(pw),
    label: "Pelo menos 1 letra minúscula",
  },
  number: {
    test: (pw) => /[0-9]/.test(pw),
    label: "Pelo menos 1 número",
  },
  specialChar: {
    test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    label: "Pelo menos 1 caractere especial",
  },
};

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

  // Verifica os critérios da senha e retorna um objeto com booleanos
  const checkCriteria = (pw) => {
    const results = {};
    for (const key in passwordCriteria) {
      results[key] = passwordCriteria[key].test(pw);
    }
    return results;
  };

  const criteriaResults = checkCriteria(formData.password);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = () => {
    const { name, email, password, confirmPassword } = formData;
    // Ajustei a condição para validar todos os critérios
    const allCriteriaMet = Object.values(criteriaResults).every(Boolean);
    return (
      name.trim() !== '' &&
      isValidEmail(email) &&
      allCriteriaMet &&
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

      // Mensagem dinâmica conforme critérios
      if (!passwordCriteria.length.test(updatedData.password)) {
        setErrorMessage('A senha deve ter exatamente 8 caracteres.');
      } else if (updatedData.confirmPassword && updatedData.confirmPassword !== updatedData.password) {
        setErrorMessage('A confirmação da senha deve ser igual à senha.');
      } else {
        setErrorMessage('');
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.clear();

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    const allCriteriaMet = Object.values(criteriaResults).every(Boolean);
    if (!allCriteriaMet) {
      setError('A senha não atende todos os critérios.');
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

        const { id, name, email } = response.data.user;
        localStorage.setItem('user', JSON.stringify({ name, userEmail: email, id }));
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
      setError(err.response?.data?.error || err.message || 'Erro ao registrar usuário');
      console.error('Erro de registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>Criar Conta</Title>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <Icon><FiUser /></Icon>
            <Input
              type="text"
              name="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={handleChange}
            />
          </InputWrapper>

          <InputWrapper>
            <Icon><FiMail /></Icon>
            <Input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
            />
          </InputWrapper>

          <InputWrapper>
            <Icon><FiLock /></Icon>
            <Input
              type="password"
              name="password"
              placeholder="Senha (8 caracteres)"
              value={formData.password}
              onChange={handleChangePassword}
              maxLength={8}
            />
          </InputWrapper>

          {/* Lista dinâmica de critérios da senha */}
          <PasswordCriteriaList>
            {Object.entries(passwordCriteria).map(([key, { label }]) => (
              <PasswordCriteriaItem key={key} met={criteriaResults[key]}>
                {label}
              </PasswordCriteriaItem>
            ))}
          </PasswordCriteriaList>

          <InputWrapper>
            <Icon><FiLock /></Icon>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={handleChangePassword}
              maxLength={8}
            />
          </InputWrapper>

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={!isFormValid() || loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </Form>

        <StyledLink to="/">Já tem uma conta? Entrar</StyledLink>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default Register;
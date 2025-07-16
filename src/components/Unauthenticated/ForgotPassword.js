import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faArrowLeft,
  faLock,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const LinkVoltar = styled.div`
  margin-top: 5rem;
  color: #0d1b2a;
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background: #e7ecef;
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 20px;
`;

const AuthWrapper = styled.div`
  background-color: #e7ecef;
  border-radius: 5px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  color: #000;
  margin-bottom: 30px;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 50px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:hover {
    border-color: #0d1b2a;
  }

  &:focus {
    border-color: #0d1b2a;
    outline: none;
  }
`;

const StyledButton = styled.button`
  background-color: #0d1b2a;
  color: #fff;
  padding: 10px 20px;
  border: none;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
height: 50px;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

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

      // Mostra notificação antes do redirecionamento
      toast.success("E-mail enviado.", {
        position: "bottom-center",
        autoClose: 4000,
      });

      // Redireciona após o toast ser exibido
      setTimeout(() => navigate("/"), 4200);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao conectar com o servidor.",
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>
          <FontAwesomeIcon icon={faLock} /> Redefinir Senha
        </Title>
        <form onSubmit={handleReset}>
          <StyledInput
            type="email"
            name="email"
            placeholder="Digite seu e-mail"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <StyledButton type="submit" disabled={loading || disabled}>
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : disabled ? (
              `Aguarde ${countdown}s`
            ) : (
              <>
                <FontAwesomeIcon icon={faEnvelope} /> Enviar e-mail
              </>
            )}
          </StyledButton>
        </form>
        <LinkVoltar>
          <Link to="/">
            <FontAwesomeIcon icon={faArrowLeft} /> Voltar para o login
          </Link>
        </LinkVoltar>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default ForgotPassword;

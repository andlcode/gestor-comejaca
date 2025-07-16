import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  AuthContainer,
  AuthWrapper,
  Title,
  StyledInput,
  StyledButton,
  LinkVoltar,
} from "./SharedAuthStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const NovaSenha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (!token) {
      toast.error("Token inválido ou ausente.");
      navigate("/");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const password = formData.newPassword;

  if (password !== formData.confirmPassword) {
    return toast.error("As senhas não coincidem.");
  }

  // Verifica se tem no mínimo 6 caracteres, uma letra maiúscula e um número
  const senhaForteRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!senhaForteRegex.test(password)) {
    return toast.error("A senha deve ter pelo menos 6 caracteres, uma letra maiúscula e um número.");
  }

  try {
    setLoading(true);
    await axios.post(`${API_URL}/api/auth/reset-password`, {
      token,
      newPassword: password,
    });

    toast.success("Senha redefinida com sucesso!");
    navigate("/");
  } catch (error) {
    toast.error(error.response?.data?.message || "Erro ao redefinir senha.");
  } finally {
    setLoading(false);
  }
};



  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>
          <FontAwesomeIcon icon={faLock} /> Criar Nova Senha
        </Title>
        <form onSubmit={handleSubmit}>
          <StyledInput
            type="password"
            name="newPassword"
            placeholder="Nova senha"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <StyledInput
            type="password"
            name="confirmPassword"
            placeholder="Confirmar nova senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <StyledButton type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Redefinir Senha"}
          </StyledButton>
        </form>
        <LinkVoltar>
          <a href="/">
            <FontAwesomeIcon icon={faArrowLeft} /> Voltar ao login
          </a>
        </LinkVoltar>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default NovaSenha;

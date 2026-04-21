import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  AuthContainer,
  AuthWrapper,
  Title,
  StyledInput,
  StyledButton,
  LinkVoltar,
} from "./SharedAuthStyles"; // ajuste o caminho conforme necessário
import {
  meetsNewPasswordPolicy,
  NEW_PASSWORD_POLICY_MESSAGE,
} from "../../utils/newPasswordPolicy";
import { getSafeApiErrorMessage } from "../../utils/safeMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("A nova senha e a confirmação não coincidem.");
    }

    if (!meetsNewPasswordPolicy(formData.newPassword)) {
      return toast.error(NEW_PASSWORD_POLICY_MESSAGE);
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/auth/change-password`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Senha alterada com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error(
        getSafeApiErrorMessage(error, "Erro ao alterar senha.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthWrapper>
        <Title>
          <FontAwesomeIcon icon={faLock} /> Alterar Senha
        </Title>
        <form onSubmit={handleSubmit}>
          <StyledInput
            type="password"
            name="currentPassword"
            placeholder="Senha atual"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
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
            {loading ? "Salvando..." : "Alterar Senha"}
          </StyledButton>
        </form>
        <LinkVoltar>
          <a href="/">
            <FontAwesomeIcon icon={faArrowLeft} /> Voltar
          </a>
        </LinkVoltar>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default ChangePassword;

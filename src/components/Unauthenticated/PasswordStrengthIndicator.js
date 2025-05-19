import React from "react";
import styled from "styled-components";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  color: ${(props) => (props.$valid ? "green" : "red")}; // Alterado para $valid
  margin-bottom: 5px;
  font-size: 14px;

  svg {
    margin-right: 8px;
  }
`;

const PasswordStrengthIndicator = ({ password }) => {
  const safePassword = password || '';

  const rules = [
    {
      label: "Pelo menos 8 caracteres",
      test: (pw) => pw.length >= 8,
    },
    {
      label: "Letra minúscula",
      test: (pw) => /[a-z]/.test(pw),
    },
    {
      label: "Letra maiúscula",
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      label: "Número",
      test: (pw) => /[0-9]/.test(pw),
    },
    {
      label: "Caractere especial",
      test: (pw) => /[!@#$%^&*(),.?":{}|<>_+=~`[\]\\-]/.test(pw), // Regex corrigida
    },
  ];

  return (
    <List>
      {rules.map((rule, index) => {
        const isValid = rule.test(safePassword);
        return (
          <ListItem key={index} $valid={isValid}> {/* Usando $valid para evitar avisos */}
            {isValid ? <FaCheckCircle /> : <FaTimesCircle />}
            {rule.label}
          </ListItem>
        );
      })}
    </List>
  );
};

export default PasswordStrengthIndicator;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { ThemeProvider, keyframes, css } from "styled-components";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  FiArrowLeft,
  FiClock,
  FiUser,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiInfo,
  FiPhone,
  FiFileText,
  FiLoader,
  FiShield,
  FiHome,
  FiHeart,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { ptBR } from "date-fns/locale";
import axios from "axios";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const themes = {
  dashboardLike: {
    background: "#f5f5f7",
    cardBackground: "rgba(255, 255, 255, 0.96)",
    sectionBackground: "rgba(255, 255, 255, 0.88)",
    textColor: "#1d1d1f",
    secondaryText: "#6e6e73",
    subtleText: "#8e8e93",
    borderColor: "#ececf1",
    inputBackground: "#ffffff",
    inputBorder: "#e3e3e8",
    inputFocus: "#8b5cf6",
    buttonBackground: "#111111",
    buttonHover: "#1c1c1e",
    checkboxAccent: "#0a84ff",
    dangerSoft: "rgba(255, 59, 48, 0.08)",
    dangerBorder: "rgba(255, 59, 48, 0.14)",
    shadow: "0 4px 14px rgba(0, 0, 0, 0.025)",
    sectionShadow: "0 2px 8px rgba(0, 0, 0, 0.015)",
    softShadow: "0 6px 16px rgba(0, 0, 0, 0.04)",
  },
};

const PAGE_MAX_WIDTH = "980px";
const TOPBAR_HEIGHT = "64px";
const TOPBAR_HEIGHT_MOBILE = "58px";

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: calc(24px + ${TOPBAR_HEIGHT}) 18px 40px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter",
    "Segoe UI", sans-serif;
  color: ${({ theme }) => theme.textColor};

  @media (max-width: 768px) {
    padding: calc(12px + ${TOPBAR_HEIGHT_MOBILE}) 12px 24px;
  }
`;

const Content = styled.div`
  max-width: ${PAGE_MAX_WIDTH};
  margin: 0 auto;
`;

const TopBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${TOPBAR_HEIGHT};
  z-index: 50;
  border-bottom: 1px solid rgba(236, 236, 241, 0.9);
  background: rgba(245, 245, 247, 0.74);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    height: ${TOPBAR_HEIGHT_MOBILE};
    background: rgba(245, 245, 247, 0.86);
  }
`;

const TopBarInner = styled.div`
  height: 100%;
  max-width: ${PAGE_MAX_WIDTH};
  margin: 0 auto;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 0 12px;
    gap: 10px;
  }
`;

const FormCard = styled.form`
  background: ${({ theme }) => theme.cardBackground};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadow};
  animation: ${fadeIn} 0.25s ease;

  @media (max-width: 768px) {
    padding: 18px 16px;
    border-radius: 5px;
    background: ${({ theme }) => theme.cardBackground};
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
  padding-bottom: 18px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 22px;
    padding-bottom: 14px;
  }
`;

const BackButton = styled.button`
  min-height: 40px;
  min-width: 40px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: rgba(255, 255, 255, 0.92);
  color: ${({ theme }) => theme.secondaryText};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
    color: ${({ theme }) => theme.textColor};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
    border-color: ${({ theme }) => theme.inputFocus};
  }

  @media (max-width: 768px) {
    min-height: 38px;
    min-width: 38px;
    border-radius: 11px;
    padding: 0 10px;
  }
`;

const HeaderBadge = styled.span`
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: rgba(242, 242, 247, 0.95);
  color: ${({ theme }) => theme.secondaryText};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  @media (max-width: 768px) {
    min-height: 28px;
    padding: 0 10px;
    font-size: 0.68rem;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  line-height: 1.12;
  letter-spacing: -0.04em;
  font-weight: 700;
  color: ${({ theme }) => theme.textColor};

  @media (max-width: 768px) {
    font-size: 27px;
    line-height: 1.15;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.secondaryText};
  font-size: 14px;
  line-height: 1.6;
  max-width: 620px;

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.55;
  }
`;

const ErrorBox = styled.div`
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.dangerSoft};
  border: 1px solid ${({ theme }) => theme.dangerBorder};
  color: #b42318;
  text-align: left;
  font-size: 14px;
`;

const Section = styled.section`
  background: ${({ theme }) => theme.sectionBackground};
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 34px;
  box-shadow: ${({ theme }) => theme.sectionShadow};

  @media (max-width: 768px) {
    padding: 16px 14px;
    border-radius: 18px;
    margin-bottom: 20px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 18px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 14px;
  }
`;

const SectionIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #f2f2f7;
  color: #3a3a3c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.02rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 34px;
    height: 34px;
    font-size: 0.95rem;
  }
`;

const SectionTitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.textColor};
  font-weight: 600;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 1.3;
  }
`;

const SectionDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.secondaryText};
  font-size: 14px;
  line-height: 1.55;

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.5;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 7px;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const InputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.secondaryText};
  margin-bottom: 0;
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.4;
  }
`;

const fieldBaseStyles = css`
  width: 100%;
  min-height: 56px;
  padding: 0 16px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: ${({ theme }) => theme.inputBackground};
  color: #1d1d1f;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;

  &::placeholder {
    color: #8e8e93;
    opacity: 1;
  }

  &:hover {
    border-color: #d7dbe3;
  }

  &:focus {
    border-color: ${({ theme }) => theme.inputFocus};
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
  }

  &[aria-invalid="true"],
  &[data-error="true"] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }

  &:disabled {
    background: #f3f4f6;
    color: #6b7280;
    border-color: #e5e7eb;
    cursor: not-allowed;
  }
`;

const AppField = styled.input`
  ${fieldBaseStyles}
`;

const InputField = AppField;
const StyledInput = AppField;

const AppSelect = styled.select`
  ${fieldBaseStyles}
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238e8e93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 40px;
`;

const Select = AppSelect;

const AppTextArea = styled.textarea`
  width: 100%;
  min-height: 124px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: ${({ theme }) => theme.inputBackground};
  color: #1d1d1f;
  resize: vertical;
  font-family: inherit;
  font-size: 15px;
  transition: all 0.2s ease;
  outline: none;

  &::placeholder {
    color: #8e8e93;
    opacity: 1;
  }

  &:hover {
    border-color: #d7dbe3;
  }

  &:focus {
    border-color: ${({ theme }) => theme.inputFocus};
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
  }

  &[aria-invalid="true"],
  &[data-error="true"] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }

  &:disabled {
    background: #f3f4f6;
    color: #6b7280;
    border-color: #e5e7eb;
    cursor: not-allowed;
  }
`;

const TextArea = AppTextArea;

const AppDatePicker = styled(DatePicker)`
  width: 100%;

  .MuiInputBase-root {
    min-height: 56px;
    border-radius: 16px;
    background: ${({ theme }) => theme.inputBackground};
    border: 1px solid #e5e7eb;
    font-family: inherit;
    color: #1d1d1f;
    transition: all 0.2s ease;
    padding-right: 12px;
  }

  .MuiInputBase-root:hover {
    border-color: #d7dbe3;
  }

  .MuiInputBase-root.Mui-focused {
    border-color: ${({ theme }) => theme.inputFocus};
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
  }

  .MuiInputBase-root.Mui-error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }

  .MuiInputBase-root.Mui-disabled {
    background: #f3f4f6;
    color: #6b7280;
    border-color: #e5e7eb;
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  input {
    padding: 15px 16px;
    font-size: 15px;
    color: #1d1d1f;
    -webkit-text-fill-color: #1d1d1f;
    opacity: 1;
  }

  .MuiSvgIcon-root {
    color: #8e8e93;
    font-size: 1.1rem;
  }

  .MuiInputBase-input::placeholder {
    color: #8e8e93;
    opacity: 1;
  }
`;

const StyledDatePicker = AppDatePicker;

const checkboxBaseStyles = css`
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0;

  &:hover {
    border-color: #bfc5d0;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
    border-color: ${({ theme }) => theme.inputFocus};
  }

  &:checked {
    border-color: ${({ theme }) => theme.inputFocus};
    background: ${({ theme }) => theme.inputFocus};
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const ChipsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const ChipLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 5px;
  background: #f8f8fa;
  border: 1px solid #e6e6eb;
  color: #3a3a3c;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #d6d6dc;
  }

  input {
    ${checkboxBaseStyles}
    width: 18px;
    height: 18px;
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 18px;
  cursor: pointer;

  @media (max-width: 768px) {
    gap: 9px;
    margin-top: 16px;
  }
`;

const AppCheckbox = styled.input`
  ${checkboxBaseStyles}
  margin-top: 1px;
  flex-shrink: 0;
`;

const CheckboxInput = AppCheckbox;

const CheckboxLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.secondaryText};
  line-height: 1.55;

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.5;
  }
`;

const FooterActions = styled.div`
  margin-top: 28px;

  @media (max-width: 768px) {
    margin-top: 22px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  min-height: 52px;
  padding: 0 24px;
  background: ${({ theme }) => theme.buttonBackground};
  color: #fff;
  border: none;
  border-radius: 16px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  @media (max-width: 768px) {
    min-height: 50px;
    font-size: 15px;
  }

  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }

  &:active {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LinkText = styled.span`
  color: #0a84ff;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(29, 29, 31, 0.22);
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;

  @media (max-width: 768px) {
    align-items: stretch;
    justify-content: stretch;
  }
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid #ececf1;
  border-radius: 24px;
  width: min(920px, calc(100vw - 32px));
  height: min(86vh, 900px);
  padding: 28px;
  position: relative;
  overflow-y: auto;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);

  h2 {
    font-size: 28px;
    margin-bottom: 0.5rem;
    color: #1d1d1f;
    letter-spacing: -0.03em;
  }

  h3 {
    font-size: 18px;
    margin-bottom: 0.5rem;
    color: #1d1d1f;
    letter-spacing: -0.02em;
  }

  h4 {
    font-size: 16px;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: #1d1d1f;
  }

  p,
  li {
    color: #3c3c43;
    line-height: 1.65;
    font-size: 15px;
  }

  blockquote {
    background: #f8f8fa;
    border-left: 4px solid #0a84ff;
    padding: 1rem 1.2rem;
    margin: 1rem 0;
    font-style: italic;
    border-radius: 14px;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    padding: 22px 18px;
  }
`;

const ModalTitle = styled.h2`
  text-align: center;
  margin: 0;
`;

const ModalSubtitle = styled.h3`
  text-align: center;
  margin: 0 0 12px 0;
  font-weight: 500;
  color: #6e6e73;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid #ececf1;
  background: #fafafc;
  color: #636366;
  font-size: 1rem;
  cursor: pointer;
`;

const PlanoGeralModal = ({ isOpen, onClose }) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <ModalOverlay isVisible={visible}>
      {visible && (
        <ModalContent>
          <CloseButton onClick={onClose}>✕</CloseButton>

          <ModalTitle>Plano Geral — XLVI COMEJACA 2025</ModalTitle>
          <ModalSubtitle>
            Confraternização das Mocidades Espíritas de Jacarepaguá
          </ModalSubtitle>

          <section>
            <h3>1. Dados de Identificação</h3>
            <p>
              <strong>1.1 Evento:</strong> XLVI COMEJACA – Confraternização das Mocidades
              Espíritas de Jacarepaguá.
            </p>
            <p>
              <strong>1.2 Promoção e Coordenação Geral:</strong> Área de Educação do 20º CEU I e II / CEERJ
            </p>
            <p>
              <strong>1.3 Período:</strong> 19 e 20 de julho de 2025
            </p>
            <ul>
              <li><strong>Início:</strong> 19/07 (Sábado)</li>
              <li><strong>Término:</strong> 20/07 (Domingo)</li>
            </ul>

            <p><strong>1.4 Público-Alvo:</strong></p>
            <ul>
              <li><strong>Confraternistas:</strong> Jovens espíritas de 11 a 21 anos completos até a data do evento.</li>
              <li><strong>Tarefeiros do Bem:</strong> Espíritas de 22 a 26 anos completos até a data do evento.</li>
              <li><strong>Membros de Equipe:</strong> Espíritas a partir de 18 anos até a data do evento.</li>
              <li><strong>Pequenos Companheiros:</strong> Filhos de membros de equipe, de 3 a 10 anos.</li>
              <li><strong>Pais:</strong> Participantes há mais de 1 ano em uma Instituição Espírita.</li>
              <li><strong>Demais CEUs/CEERJ:</strong> Inscrições aceitas desde que atendam os critérios.</li>
            </ul>
          </section>

          <section>
            <h3>2. Objetivo</h3>
            <ul>
              <li>Valorizar o estudo sistemático da Doutrina Espírita.</li>
              <li>Estimular a vivência dos ensinamentos cristãos.</li>
              <li>Fortalecer a unificação do Movimento Espírita local.</li>
            </ul>
          </section>

          <section>
            <h3>3. Metodologias de Ação</h3>
            <ul>
              <li>Reuniões de estudo</li>
              <li>Atividades complementares</li>
              <li>Atividades de desenvolvimento interpessoal</li>
            </ul>
          </section>

          <section>
            <h3>4. Tema Central</h3>
            <blockquote>
              <p><strong>Mediunidade... precisamos conversar!</strong></p>
              <footer>“Vossos filhos e vossas filhas profetizarão.” — Atos 2:17</footer>
            </blockquote>
          </section>

          <section>
            <h3>5. Inscrições</h3>
            <p><strong>Período:</strong> 13/04/2025 a 15/06/2025</p>
            <p><strong>Repasse das fichas:</strong> Até 15/06/2025</p>
            <p><strong>Investimento:</strong> R$ 60,00 ou mais / R$ 45,00 para Pequenos Companheiros</p>
            <p><strong>PIX:</strong> coordenacaogeral@comejaca.org.br</p>
            <p><strong>Observação:</strong> A inscrição é pessoal e intransferível.</p>

            <p style={{ textAlign: "center", marginTop: "2rem" }}>
              <a
                href="#"
                onClick={onClose}
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  color: "#0a84ff",
                  cursor: "pointer",
                  fontWeight: "500",
                  width: "100%",
                }}
              >
                Voltar
              </a>
            </p>
          </section>
        </ModalContent>
      )}
    </ModalOverlay>
  );
};

const Formulario = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    dataNascimento: null,
    nomeCracha: "",
    sexo: "",
    email: "",
    telefone: "",
    tipoParticipacao: "",
    nomeCompletoResponsavel: "",
    documentoResponsavel: "",
    telefoneResponsavel: "",
    comissao: "",
    camisa: false,
    tamanhoCamisa: "",
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
    medicacao: "",
    alergia: "",
    outrasInformacoes: "",
    IE: "",
    vegetariano: "",
    nomeSocial: "",
    outroGenero: "",
    otherInstitution: "",
    primeiraComejaca: false,
    deficienciaAuditiva: false,
    deficienciaAutismo: false,
    deficienciaIntelectual: false,
    deficienciaParalisiaCerebral: false,
    deficienciaVisual: false,
    deficienciaFisica: false,
    deficienciaOutra: false,
    deficienciaOutraDescricao: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [isMinor, setIsMinor] = useState(false);
  const [theme] = useState(themes.dashboardLike);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/painel");
      return;
    }

    const fetchInstitutions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/instituicoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInstitutions(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/entrar");
        }
      }
    };

    fetchInstitutions();
  }, [navigate, API_URL]);

  const calculateAge = (date) => {
    if (!date) return 0;
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const formatPhone = (value) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length > 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
    if (cleaned.length > 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    }
    if (cleaned.length > 2) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    if (name === "telefone" || name === "telefoneResponsavel") {
      formattedValue = formatPhone(value);
    }

    if (name === "documentoResponsavel") {
      const cleaned = value.replace(/\D/g, "");

      if (cleaned.length === 11) {
        formattedValue = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      } else if (cleaned.length >= 9 && cleaned.length <= 10) {
        formattedValue = cleaned.replace(
          /(\d{2})(\d{3})(\d{3})(\d{0,2})/,
          (match, p1, p2, p3, p4) => (p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`)
        );
      } else {
        formattedValue = cleaned;
      }

      if (formattedValue.replace(/\D/g, "").length > 11) {
        formattedValue = formattedValue.substring(0, 14);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : formattedValue,
    }));
  };

  const handleDateChange = (date) => {
    const isUnderage = calculateAge(date) < 18;

    setFormData((prev) => ({
      ...prev,
      dataNascimento: date,
      ...(calculateAge(date) >= 18 && {
        nomeCompletoResponsavel: "",
        documentoResponsavel: "",
        telefoneResponsavel: "",
      }),
    }));

    setIsMinor(isUnderage);
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    setFormData((prevState) => ({ ...prevState, cep }));

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData((prevState) => ({
            ...prevState,
            cep,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          }));
        } else {
          alert("CEP não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      const token = localStorage.getItem("token");
      const dataNascimento = new Date(formData.dataNascimento);

      if (isNaN(dataNascimento.getTime())) {
        setErrors([{ message: "Escolha uma data de nascimento válida." }]);
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...formData,
        comissao: String(formData.comissao),
        dataNascimento: dataNascimento.toISOString().split("T")[0],
        telefone: formData.telefone.replace(/\D/g, ""),
        documentoResponsavel: formData.documentoResponsavel?.replace(/\D/g, ""),
        telefoneResponsavel: formData.telefoneResponsavel?.replace(/\D/g, ""),
        cep: formData.cep.replace(/\D/g, ""),
        id: formData.id,
        otherInstitution: formData.otherInstitution,
        primeiraComejaca: formData.primeiraComejaca,
      };

      const response = await axios.post(`${API_URL}/api/auth/inscrever`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        navigate("/painel");
      }
    } catch (error) {
      const detalhes = error.response?.data?.details;

      if (Array.isArray(detalhes)) {
        setErrors(detalhes);
      } else {
        setErrors([{ message: detalhes || "Não foi possível salvar sua inscrição agora." }]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/painel");
  };

  const today = new Date();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <ThemeProvider theme={theme}>
        <Container>
          <TopBar>
            <TopBarInner>
              <BackButton type="button" onClick={handleBack} aria-label="Voltar">
                <FiArrowLeft size={15} />
              </BackButton>
              <HeaderBadge>COMEJACA 2026</HeaderBadge>
            </TopBarInner>
          </TopBar>

          <Content>
            <FormCard onSubmit={handleSubmit}>
              <Header>
                <Title>INSCRIÇÃO</Title>

                <Subtitle>
               
                </Subtitle>

                {errors.length > 0 && (
                  <ErrorBox>
                    {errors.map((err, index) => (
                      <div key={index}>⚠️ {err.message}</div>
                    ))}
                  </ErrorBox>
                )}
              </Header>

              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <FiUser />
                  </SectionIcon>
                  <SectionTitleWrap>
                    <SectionTitle>Sobre você</SectionTitle>
                    <SectionDescription>
                      Vamos começar com suas informações principais.
                    </SectionDescription>
                  </SectionTitleWrap>
                </SectionHeader>

                <FormGrid>
                  <InputGroup>
                    <InputLabel><FiUser /> Nome completo *</InputLabel>
                    <InputField
                      name="nomeCompleto"
                      placeholder=""
                      value={formData.nomeCompleto}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiUser /> Nome social</InputLabel>
                    <InputField
                      name="nomeSocial"
                      placeholder=""
                      value={formData.nomeSocial}
                      onChange={handleChange}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiUser /> Nome no crachá *</InputLabel>
                    <InputField
                      name="nomeCracha"
                      placeholder=""
                      value={formData.nomeCracha}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiCalendar /> Data de nascimento *</InputLabel>
                    <StyledDatePicker
                      value={formData.dataNascimento}
                      onChange={handleDateChange}
                      format="dd/MM/yyyy"
                      maxDate={today}
                    />
                  </InputGroup>

                  {isMinor && (
                    <>
                      <InputGroup>
                        <InputLabel><FiShield /> Nome do responsável *</InputLabel>
                        <InputField
                          name="nomeCompletoResponsavel"
                          value={formData.nomeCompletoResponsavel}
                          onChange={handleChange}
                          placeholder=""
                          required={isMinor}
                        />
                      </InputGroup>

                      <InputGroup>
                        <InputLabel><FiFileText /> Documento do responsável *</InputLabel>
                        <InputField
                          name="documentoResponsavel"
                          value={formData.documentoResponsavel || ""}
                          onChange={handleChange}
                          placeholder="CPF ou RG"
                          maxLength={14}
                          required={isMinor}
                        />
                      </InputGroup>

                      <InputGroup>
                        <InputLabel><FiPhone /> Telefone do responsável *</InputLabel>
                        <InputField
                          name="telefoneResponsavel"
                          value={formData.telefoneResponsavel}
                          onChange={handleChange}
                          placeholder="Número para contato"
                          required={isMinor}
                        />
                      </InputGroup>
                    </>
                  )}

                  <InputGroup>
                    <InputLabel><FiUser /> Gênero *</InputLabel>
                    <Select name="sexo" value={formData.sexo} onChange={handleChange} required>
                      <option value="">Selecione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="prefironaoresponder">Prefiro não responder</option>
                      <option value="outro">Outro</option>
                    </Select>
                  </InputGroup>

                  {formData.sexo === "outro" && (
                    <InputGroup>
                      <InputLabel>Como você prefere se identificar</InputLabel>
                      <InputField
                        type="text"
                        name="outroGenero"
                        value={formData.outroGenero}
                        placeholder="Escreva aqui"
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  )}

                  <InputGroup>
                    <InputLabel><FaWhatsapp /> WhatsApp *</InputLabel>
                    <InputField
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder=""
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiMail /> E-mail *</InputLabel>
                    <InputField
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=""
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>Como você vai participar? *</InputLabel>
                    <Select
                      name="tipoParticipacao"
                      value={formData.tipoParticipacao}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Confraternista">Confraternista</option>
                      <option value="Trabalhador">Trabalhador</option>
                    </Select>
                  </InputGroup>

                  {formData.tipoParticipacao === "Trabalhador" && (
                    <InputGroup>
                      <InputLabel>Em qual equipe você gostaria de atuar? *</InputLabel>
                      <Select
                        name="comissao"
                        value={formData.comissao}
                        onChange={handleChange}
                      >
                        <option value="">Selecione</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Atendimento Fraterno">Atendimento Fraterno</option>
                        <option value="Coordenação Geral">Coordenação Geral</option>
                        <option value="Divulgação">Divulgação</option>
                        <option value="Estudos Doutrinários">Estudos Doutrinários</option>
                        <option value="Multimeios">Multimeios</option>
                        <option value="Secretaria">Secretaria</option>
                        <option value="Serviços Gerais">Serviços Gerais</option>
                        <option value="Recepção">Recepção</option>
                      </Select>
                    </InputGroup>
                  )}

                  <FullWidth>
                    <CheckboxContainer>
                      <CheckboxInput
                        type="checkbox"
                        name="primeiraComejaca"
                        checked={formData.primeiraComejaca}
                        onChange={handleChange}
                      />
                      <CheckboxLabel>
                        Esta será minha primeira COMEJACA.
                      </CheckboxLabel>
                    </CheckboxContainer>
                  </FullWidth>
                </FormGrid>
              </Section>

              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <FiHome />
                  </SectionIcon>
                  <SectionTitleWrap>
                    <SectionTitle>Onde você mora e de onde vem</SectionTitle>
                    <SectionDescription>
                      Agora, algumas informações de endereço e instituição.
                    </SectionDescription>
                  </SectionTitleWrap>
                </SectionHeader>

                <FormGrid>
                  <InputGroup>
                    <InputLabel><FiMapPin /> CEP *</InputLabel>
                    <InputField
                      name="cep"
                      value={formData.cep}
                      placeholder="Digite seu CEP"
                      onChange={handleCepChange}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiMapPin /> Estado *</InputLabel>
                    <InputField
                      name="estado"
                      disabled
                      value={formData.estado}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiMapPin /> Cidade *</InputLabel>
                    <InputField
                      name="cidade"
                      disabled
                      value={formData.cidade}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiMapPin /> Bairro *</InputLabel>
                    <InputField
                      name="bairro"
                      disabled
                      value={formData.bairro}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiMapPin /> Logradouro *</InputLabel>
                    <InputField
                      name="logradouro"
                      disabled
                      value={formData.logradouro}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiMapPin /> Número *</InputLabel>
                    <InputField
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      placeholder="Número"
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiMapPin /> Complemento</InputLabel>
                    <InputField
                      name="complemento"
                      value={formData.complemento}
                      onChange={handleChange}
                      placeholder="Apartamento, bloco, referência..."
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiMapPin /> Instituição espírita *</InputLabel>
                    <Select name="IE" value={formData.IE} onChange={handleChange} required>
                      <option value="">Selecione</option>
                      {institutions.map((inst) => (
                        <option key={inst.id} value={inst.nome}>
                          {inst.nome}
                        </option>
                      ))}
                      <option value="outro">Outra</option>
                    </Select>
                  </InputGroup>

                  {formData.IE === "outro" && (
                    <InputGroup>
                      <InputLabel>Nome da instituição</InputLabel>
                      <InputField
                        type="text"
                        name="otherInstitution"
                        value={formData.otherInstitution}
                        onChange={handleChange}
                        placeholder="Escreva o nome da instituição"
                        required
                      />
                    </InputGroup>
                  )}
                </FormGrid>
              </Section>

              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <FiHeart />
                  </SectionIcon>
                  <SectionTitleWrap>
                    <SectionTitle>Cuidados e informações importantes</SectionTitle>
                    <SectionDescription>
                      Se houver algo que possa nos ajudar a te acolher melhor, conte pra gente.
                    </SectionDescription>
                  </SectionTitleWrap>
                </SectionHeader>

                <FormGrid>
                  <InputGroup>
                    <InputLabel><FiInfo /> Alimentação *</InputLabel>
                    <Select
                      name="vegetariano"
                      value={formData.vegetariano}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Como é sua alimentação?</option>
                      <option value="Não">Sem restrição vegetariana</option>
                      <option value="Vegetariano">Vegetariana</option>
                      <option value="Vegano">Vegana</option>
                    </Select>
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiInfo /> Alergias ou restrições alimentares</InputLabel>
                    <TextArea
                      name="alergia"
                      placeholder="Se quiser, conte aqui o que devemos considerar."
                      value={formData.alergia}
                      onChange={handleChange}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel><FiInfo /> Uso de medicamento</InputLabel>
                    <TextArea
                      name="medicacao"
                      placeholder="Você faz uso de algum medicamento atualmente? Se quiser, conte aqui."
                      value={formData.medicacao}
                      onChange={handleChange}
                    />
                  </InputGroup>

                  <FullWidth>
                    <InputGroup>
                      <InputLabel><FiInfo /> Existe alguma condição que você gostaria que soubéssemos?</InputLabel>
                      <ChipsGroup>
                        <ChipLabel>
                          <input
                            type="checkbox"
                            name="deficienciaAuditiva"
                            checked={formData.deficienciaAuditiva}
                            onChange={handleChange}
                          />
                          Auditiva
                        </ChipLabel>

                        <ChipLabel>
                          <input
                            type="checkbox"
                            name="deficienciaAutismo"
                            checked={formData.deficienciaAutismo}
                            onChange={handleChange}
                          />
                          Autismo
                        </ChipLabel>

                        <ChipLabel>
                          <input
                            type="checkbox"
                            name="deficienciaIntelectual"
                            checked={formData.deficienciaIntelectual}
                            onChange={handleChange}
                          />
                          Intelectual
                        </ChipLabel>

                        <ChipLabel>
                          <input
                            type="checkbox"
                            name="deficienciaParalisiaCerebral"
                            checked={formData.deficienciaParalisiaCerebral}
                            onChange={handleChange}
                          />
                          Paralisia cerebral
                        </ChipLabel>

                        <ChipLabel>
                          <input
                            type="checkbox"
                            name="deficienciaVisual"
                            checked={formData.deficienciaVisual}
                            onChange={handleChange}
                          />
                          Visual
                        </ChipLabel>

                        <ChipLabel>
                          <input
                            type="checkbox"
                            name="deficienciaFisica"
                            checked={formData.deficienciaFisica}
                            onChange={handleChange}
                          />
                          Física
                        </ChipLabel>

                        <ChipLabel>
                          <input
                            type="checkbox"
                            name="deficienciaOutra"
                            checked={formData.deficienciaOutra}
                            onChange={handleChange}
                          />
                          Outra
                        </ChipLabel>
                      </ChipsGroup>
                    </InputGroup>
                  </FullWidth>

                  {formData.deficienciaOutra && (
                    <FullWidth>
                      <InputGroup>
                        <InputLabel>Se quiser, explique melhor</InputLabel>
                        <StyledInput
                          type="text"
                          name="deficienciaOutraDescricao"
                          value={formData.deficienciaOutraDescricao}
                          onChange={handleChange}
                          placeholder="Escreva aqui"
                        />
                      </InputGroup>
                    </FullWidth>
                  )}

                  <FullWidth>
                    <InputGroup>
                      <InputLabel><FiInfo /> Algo mais que você queira nos contar?</InputLabel>
                      <TextArea
                        name="outrasInformacoes"
                        placeholder="Esse espaço é seu, caso queira compartilhar alguma informação importante."
                        value={formData.outrasInformacoes}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FullWidth>
                </FormGrid>
              </Section>

              <Section>
       {/*  */}

                <CheckboxContainer>
                  <CheckboxInput type="checkbox" required />
                  <CheckboxLabel>
                    Li e estou de acordo com as orientações do{" "}
                    <LinkText onClick={() => setModalOpen(true)}>plano geral</LinkText> da XLVI
                    COMEJACA. *
                  </CheckboxLabel>
                </CheckboxContainer>
              </Section>

              <PlanoGeralModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

              <FooterActions>
                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <FiLoader className="spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <FiFileText />
                      Finalizar inscrição
                    </>
                  )}
                </SubmitButton>
              </FooterActions>
            </FormCard>
          </Content>
        </Container>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default Formulario;
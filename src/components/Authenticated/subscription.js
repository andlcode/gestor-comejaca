import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { ThemeProvider, keyframes, css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserTag,
  faIdBadge,
  faCalendarDays,
  faShieldHalved,
  faIdCard,
  faPhone,
  faVenusMars,
  faPen,
  faEnvelope,
  faPeopleGroup,
  faSitemap,
  faMapLocationDot,
  faBuilding,
  faCircleInfo,
  faSeedling,
  faShirt,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
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
import { ptBR } from "date-fns/locale";
import axios from "axios";
import AppHeader, {
  APP_HEADER_HEIGHT,
  APP_HEADER_HEIGHT_MOBILE,
  AppHeaderBadge,
} from "../shared/AppHeader";
import { EVENT } from "../../config/eventConfig";
import {
  CAMISA_TAMANHOS,
  CAMISA_TAMANHO_INFANTIL,
  CAMISA_IDADES_INFANTIL,
  CAMISA_TIPO_OPCOES,
  CAMISA_COR_OPCOES,
  isTamanhoCamisaInfantil,
  getIdadeCamisaInfantilValidationError,
  parseTamanhoCamisaDoBanco,
  encodeTamanhoCamisaParaPersistencia,
} from "../../config/camisaParticipante";
import CamisaModeloGalleryTrigger from "../shared/CamisaModeloGallery";
import { authTheme } from "../Unauthenticated/auth/authTheme";
import { AuthGradientLoginButton } from "../Unauthenticated/auth/authStyles";
import PremiumAuthField, {
  InputShell,
  InputInner,
  InputIconSlot,
  FieldTrack,
  FloatingLabel,
  PremiumAuthSelect,
  PremiumAuthTextarea,
} from "../Unauthenticated/auth/PremiumAuthField";

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
    background: "#F6F7F9",
    cardBackground: "#FFFFFF",
    sectionBackground: "#FFFFFF",
    textColor: "#111827",
    secondaryText: "#6B7280",
    subtleText: "#8e8e93",
    borderColor: "#E5E7EB",
    inputBackground: "#ffffff",
    inputBorder: "#E5E7EB",
    inputFocus: "#8b5cf6",
    buttonBackground: "#1C1C1E",
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

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: calc(24px + ${APP_HEADER_HEIGHT}) 18px 40px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter",
    "Segoe UI", sans-serif;
  color: ${({ theme }) => theme.textColor};

  @media (max-width: 768px) {
    padding: calc(12px + ${APP_HEADER_HEIGHT_MOBILE}) 12px 24px;
  }
`;

const Content = styled.div`
  max-width: ${PAGE_MAX_WIDTH};
  margin: 0 auto;
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

const StepBackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 50px;
  width: 100%;
  gap: 6px;
  padding: 0 14px;
  border: 1px solid #ececf1;
  background: #f8f9fc;
  border-radius: 14px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;

  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.16s ease;

  svg {
    color: currentColor;
    font-size: 14px;
    opacity: 0.9;
  }

  &:hover {
    background: #f1f5f9;
    border-color: #e2e8f0;
    color: #475569;
  }

  &:active {
    transform: scale(0.992);
  }

  &:focus-visible {
    outline: none;
    border-color: rgba(100, 128, 247, 0.45);
    box-shadow: 0 0 0 3px rgba(100, 128, 247, 0.12);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    min-height: 48px;
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

const PrefillNotice = styled.div`
  margin-top: 10px;
  padding: 12px 14px;
  border-radius: 5px;
  border: 1px solid #e7e8ee;
  background: rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.secondaryText};
  font-size: 13px;
  line-height: 1.55;
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
  margin-bottom: 22px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 16px;
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
  gap: 8px;

  @media (max-width: 768px) {
    gap: 7px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.textColor};
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 17px;
    line-height: 1.3;
  }
`;

const SectionDescription = styled.p`
  margin: 0;
  color: #5f636d;
  font-size: 14px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.55;
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

const SubscriptionStaticLabel = styled.p`
  margin: 0 0 10px 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.014em;
  color: rgba(71, 85, 105, 0.82);
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.45;
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const ParticipationSelectWrap = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 22px;

  @media (max-width: 768px) {
    margin-bottom: 18px;
  }
`;

const ParticipationShirtFields = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ParticipationShirtTipoCorRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ParticipationInfoCard = styled.div`
  grid-column: 1 / -1;
  background: #f8f9fc;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 14px;
  padding: 22px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media (max-width: 768px) {
    padding: 18px 16px;
    gap: 18px;
  }
`;

const ParticipationInfoHeading = styled.h3`
  margin: 0 0 10px 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.018em;
  color: #0f172a;
  line-height: 1.3;
`;

const ParticipationInfoList = styled.ul`
  margin: 0;
  padding: 0 0 0 1.15rem;
  list-style: disc;

  li {
    margin-bottom: 10px;
    font-family: "Inter", system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.58;
    color: #64748b;
  }

  li:last-child {
    margin-bottom: 0;
  }

  strong {
    color: #475569;
    font-weight: 600;
  }
`;

const DatePickerAuthTrack = styled.div`
  width: 100%;
  padding-top: 4px;

  & .MuiInputBase-root {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    min-height: auto;
    margin: 0;
    padding: 0;
  }

  & .MuiInputBase-input {
    font-family: "Inter", system-ui, sans-serif;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.014em;
    color: #111827;
    padding: 6px 0 0 !important;
  }

  & .MuiSvgIcon-root {
    color: #9aa4b2;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  & .MuiInputBase-input::placeholder {
    color: transparent;
    opacity: 0;
  }
`;

function SubscriptionBirthDateField({ id, label, value, onChange, maxDate }) {
  const [focused, setFocused] = useState(false);
  const active = focused || Boolean(value);

  return (
    <InputShell data-error={undefined}>
      <InputInner>
        <InputIconSlot>
          <FontAwesomeIcon
            icon={faCalendarDays}
            style={{ display: "block", width: "1.125rem", height: "1.125rem" }}
            aria-hidden
          />
        </InputIconSlot>
        <FieldTrack>
          <FloatingLabel htmlFor={id} $active={active} $error={false}>
            {label}
          </FloatingLabel>
          <DatePickerAuthTrack>
            <DatePicker
              value={value}
              onChange={onChange}
              maxDate={maxDate}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  id,
                  variant: "standard",
                  fullWidth: true,
                  placeholder: " ",
                  InputProps: { disableUnderline: true },
                  inputProps: { placeholder: " " },
                  onFocus: () => setFocused(true),
                  onBlur: () => setFocused(false),
                },
              }}
            />
          </DatePickerAuthTrack>
        </FieldTrack>
      </InputInner>
    </InputShell>
  );
}

const checkboxBaseStyles = css`
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0;

  &:hover {
    border-color: rgba(100, 128, 247, 0.45);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(${({ theme }) => theme.primaryRgb}, 0.12);
    border-color: ${({ theme }) => theme.primary};
  }

  &:checked {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary};
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const ChipsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 4px;

  @media (max-width: 768px) {
    gap: 11px;
  }
`;

const ChipLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 18px;
  background: ${({ $selected, theme }) =>
    $selected ? `rgba(${theme.primaryRgb}, 0.1)` : "rgba(15, 23, 42, 0.02)"};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? `rgba(${theme.primaryRgb}, 0.35)` : "rgba(0, 0, 0, 0.06)"};
  color: ${({ $selected, theme }) => ($selected ? theme.primary : "#3a3a3c")};
  font-family: "Inter", system-ui, sans-serif;
  font-size: 14px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 500)};
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: ${({ $selected, theme }) =>
    $selected ? `0 1px 3px rgba(${theme.primaryRgb}, 0.12)` : "none"};

  &:hover {
    background: #ffffff;
    border-color: ${({ $selected, theme }) =>
      $selected ? `rgba(${theme.primaryRgb}, 0.45)` : "rgba(0, 0, 0, 0.08)"};
    transform: translateY(-1px);
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
  margin-top: ${({ $final }) => ($final ? "24px" : "18px")};
  cursor: pointer;
  padding: ${({ $final }) => ($final ? "16px 18px" : "0")};
  border-radius: ${({ $final }) => ($final ? "18px" : "0")};
  background: ${({ $final }) => ($final ? "rgba(15, 23, 42, 0.02)" : "transparent")};
  border: ${({ $final }) => ($final ? "1px solid rgba(0, 0, 0, 0.06)" : "none")};
  font-family: "Inter", system-ui, sans-serif;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ $final }) => ($final ? "rgba(0, 0, 0, 0.08)" : "transparent")};
    background: ${({ $final }) => ($final ? "rgba(255, 255, 255, 0.78)" : "transparent")};
  }

  @media (max-width: 768px) {
    gap: 9px;
    margin-top: ${({ $final }) => ($final ? "20px" : "16px")};
    padding: ${({ $final }) => ($final ? "14px 14px" : "0")};
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
  color: ${({ $final, theme }) => ($final ? theme.textColor : theme.secondaryText)};
  line-height: 1.6;
  font-weight: ${({ $final }) => ($final ? 500 : 400)};

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.5;
  }
`;

const ParticipationCheckboxRow = styled(FullWidth)`
  margin-top: 32px;

  @media (max-width: 768px) {
    margin-top: 26px;
  }
`;

const ParticipationFirstComeCheckbox = styled(CheckboxContainer)`
  margin-top: 0 !important;
  padding: 18px 20px !important;
  border-radius: 14px !important;
  background: #ffffff !important;
  border: 1px solid rgba(15, 23, 42, 0.08) !important;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  gap: 12px;

  &:hover {
    border-color: rgba(15, 23, 42, 0.12) !important;
    background: #fafbff !important;
  }

  @media (max-width: 768px) {
    padding: 16px 16px !important;
  }

  ${CheckboxLabel} {
    font-size: 15px;
    color: #334155;
    font-weight: 500;
    line-height: 1.55;
  }
`;

const ParticipationComissaoGroup = styled(InputGroup)`
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 16px;
  }
`;

const FooterActions = styled.div`
  margin-top: 34px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  align-items: stretch;

  @media (max-width: 768px) {
    margin-top: 28px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
`;

const SubscriptionFooterPrimaryButton = styled(AuthGradientLoginButton)`
  width: 100%;
  box-sizing: border-box;
  grid-column: ${({ $hasBack }) => ($hasBack ? "auto" : "1 / -1")};

  @media (max-width: 768px) {
    grid-column: ${({ $hasBack }) => ($hasBack ? "auto" : "1 / -1")};
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
  font-weight: 600;
  text-underline-offset: 3px;
  transition: color 0.2s ease;

  &:hover {
    text-decoration: underline;
    color: #0668c7;
  }

  &:focus-visible {
    outline: none;
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

const RulesHighlight = styled.div`
  background: rgba(255, 59, 48, 0.06);
  border: 1px solid rgba(255, 59, 48, 0.2);
  border-radius: 14px;
  padding: 1rem 1.2rem;
  margin: 0.5rem 0 0;

  ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  li {
    margin-bottom: 0.4rem;
  }
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

          <ModalTitle>Plano Geral — {EVENT.displayName}</ModalTitle>
          <ModalSubtitle>
            {EVENT.fullName || "Confraternização das Mocidades Espíritas de Jacarepaguá"}
          </ModalSubtitle>

          <section>
            <h3>1. Dados de identificação</h3>
            <p>
              <strong>1.1 Evento:</strong> XLVII COMEJACA – Confraternização das Mocidades Espíritas de
              Jacarepaguá.
            </p>
            <p>
              <strong>1.2 Promoção e Coordenação Geral:</strong> Área de Educação do 20º CEU I e II / CEERJ
            </p>
            <p>
              <strong>1.3 Período do evento:</strong> 04 e 05 de julho de 2026
            </p>
            <ul>
              <li>
                <strong>Início da COMEJACA:</strong> 04/07/2026 (sábado)
              </li>
              <li>
                <strong>Encerramento:</strong> 05/07/2026 (domingo)
              </li>
            </ul>

            <p>
              <strong>1.4 Categorias e clientela (texto informativo e regras)</strong>
            </p>
            <ul>
              <li>
                <strong>Confraternistas:</strong> jovens espíritas de 11 a 21 anos completos até a data do
                evento, frequentando reuniões do Setor de Juventude de uma Instituição Espírita por no mínimo 1
                ano até a data da inscrição, com 70% de frequência.
              </li>
              <li>
                <strong>Tarefeiros do Bem:</strong> espíritas de 22 a 26 anos completos até a data do evento,
                vinculados ao setor de juventude ou a outro setor de uma Instituição Espírita por no mínimo 1 ano,
                com 70% de frequência. Além das atividades de estudo, poderão participar de atividades nas
                equipes, como estágio e trabalho voluntário.
              </li>
              <li>
                <strong>Membros de Equipe:</strong> espíritas a partir de 18 anos até a data do evento,
                participando ativamente há pelo menos 1 ano de uma Instituição Espírita. Ao se inscrever, convém
                listar as tarefas que tem habilidade para desempenhar, colocando-se à disposição da Coordenação
                Geral para aproveitamento em alguma equipe. Para participar da equipe de estudos, o participante
                deve estar atuando como evangelizador de algum ciclo de juventude ou de infância, se for
                evangelizar Pequenos Companheiros.
              </li>
              <li>
                <strong>Pequenos Companheiros:</strong> filhos de Membros de Equipe, de 3 a 10 anos de idade na
                data do evento.
              </li>
              <li>
                <strong>Pais:</strong> participantes há mais de 1 ano em uma Instituição Espírita e que sejam pais
                ou responsáveis de um jovem presente na COMEJACA.
              </li>
              <li>
                <strong>Demais CEUs / CEERJ:</strong> aceitar inscrições de outros CEUs/CEERJ, desde que atendam
                aos critérios estabelecidos para Confraternistas, Tarefeiros do Bem, Pais e Membros de Equipe. A
                ficha de inscrição deve ser assinada pelo presidente da Instituição Espírita a que pertença.
              </li>
            </ul>
            <p>
              <strong>Uso desta ficha eletrônica:</strong> escolha <strong>Confraternista</strong> quando se
              enquadrar como confraternista, pai/responsável ou perfil equivalente previsto no plano; escolha{" "}
              <strong>Membro de Equipe / Tarefeiro do Bem</strong> quando for atuar em equipe (incluindo
              tarefeiros em equipe) e informe a área de interesse. O valor de Pequeno Companheiro é aplicado pelo
              sistema conforme a idade na data do evento (3 a 10 anos), alinhado ao plano geral. Utilize o passo
              final e observações, se precisar, para detalhar tarefas ou contexto da instituição.
            </p>
          </section>

          <section>
            <h3>2. Objetivo do evento</h3>
            <p>Oferecer aos participantes condições que os levem:</p>
            <ul>
              <li>à valorização do estudo sistemático da Doutrina Espírita;</li>
              <li>
                à sensibilização para a vivência dos ensinamentos cristãos, consigo mesmo, perante a família, a
                Instituição Espírita e a sociedade;
              </li>
              <li>à intensificação da unificação do Movimento Espírita da região.</li>
            </ul>
          </section>

          <section>
            <h3>3. Metodologias de ação</h3>
            <ul>
              <li>Reuniões de estudo</li>
              <li>Atividades complementares</li>
              <li>Atividades de desenvolvimento interpessoal</li>
            </ul>
          </section>

          <section>
            <h3>4. Tema central</h3>
            <blockquote>
              <p>
                <strong>Espiritismo: o que me atrai e o que me afasta!</strong>
              </p>
            </blockquote>
          </section>

          <section>
            <h3>5. Período de inscrição e investimento</h3>
            <p>
              <strong>Abertura das inscrições:</strong> 19/04/2026
            </p>
            <p>
              <strong>Encerramento das inscrições:</strong> 07/06/2026
            </p>
            <p>
              <strong>Data limite para repasse das fichas para a Coordenação Geral:</strong> 07/06/2026
            </p>
            <p>
              <strong>Investimento:</strong>
            </p>
            <ul>
              <li>
                <strong>R$ 65,00 ou mais:</strong> Confraternistas, Tarefeiros do Bem, Pais e Membros de Equipe
              </li>
              <li>
                <strong>R$ 50,00:</strong> Pequenos Companheiros
              </li>
            </ul>
            <p>
              <strong>Observações:</strong>
            </p>
            <ul>
              <li>
                Este investimento destina-se às despesas de alimentação, material de estudo, material de limpeza e
                materiais diversos necessários para a realização da COMEJACA.
              </li>
              <li>
                Todos deverão contribuir com a importância acima mencionada até a data limite da inscrição.
              </li>
              <li>
                Qualquer dificuldade deverá ser resolvida pela Instituição Espírita do participante, que então
                repassará para a Coordenação Geral através de comunicado por escrito.
              </li>
            </ul>
          </section>

          <section>
            <h3>6. Dados de pagamento</h3>
            <ul>
              <li>
                <strong>PIX (e-mail):</strong> coordenacaogeral@comejaca.org.br
              </li>
              <li>
                <strong>Banco:</strong> Itaú (341)
              </li>
              <li>
                <strong>Agência:</strong> 7151
              </li>
              <li>
                <strong>Conta poupança:</strong> 08882-5
              </li>
              <li>
                <strong>Favorecido:</strong> Vicente Jose L. Crisostomo
              </li>
            </ul>
            <p>
              <strong>Instruções obrigatórias:</strong> o comprovante deverá ser enviado por e-mail para{" "}
              <strong>coordenacaogeral@comejaca.org.br</strong> com a informação dos beneficiários deste
              pagamento. As fichas deverão ser entregues à Coordenação Geral até o dia{" "}
              <strong>07 de junho de 2026</strong> na <strong>3ª RGP</strong>.
            </p>
          </section>

          <section>
            <h3>7. Regras importantes</h3>
            <RulesHighlight>
              <ul>
                <li>Não serão aceitas inscrições após 07/06/2026.</li>
                <li>Não serão feitas inscrições no local do evento.</li>
                <li>A inscrição é pessoal e intransferível.</li>
                <li>Não são permitidas substituições.</li>
                <li>
                  O representante da Área de Educação da Instituição Espírita deve assegurar que todos os dados da
                  ficha estejam preenchidos corretamente, principalmente a data de nascimento.
                </li>
              </ul>
            </RulesHighlight>
          </section>

          <section>
            <h3>8. Confirmação de inscrição</h3>
            <ul>
              <li>
                <strong>Confraternistas, Tarefeiros do Bem, Pequenos Companheiros e Pais:</strong> confirmação
                através de comunicação da Coordenação Geral diretamente para os participantes via e-mail.
              </li>
              <li>
                <strong>Membros de Equipe:</strong> confirmação através da participação nas Reuniões Gerais e nas
                reuniões de Equipe.
              </li>
            </ul>
            <p>
              <strong>Observação:</strong> procure saber as datas das reuniões das equipes e frequentá-las
              assiduamente (mínimo de 70%), garantindo assim o direito de participar da COMEJACA.
            </p>
          </section>

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
        </ModalContent>
      )}
    </ModalOverlay>
  );
};

const Formulario = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
  const TOTAL_STEPS = 5;
  const STEP_TITLES = ["Sobre você", "Participação", "Endereço", "Cuidados", "Finalização"];
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [prefillNoticeName, setPrefillNoticeName] = useState("");
  const [hasAppliedReenrollment, setHasAppliedReenrollment] = useState(false);
  const [step, setStep] = useState(1);

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
    comprarCamisa: "",
    camisaTipo: "",
    camisaCor: "",
    tamanhoCamisa: "",
    idadeCamisaInfantil: "",
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
  const [theme] = useState(() => ({ ...themes.dashboardLike, ...authTheme }));

  const goNextStep = () => {
    setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  };

  const goPrevStep = () => {
    setStep((current) => Math.max(1, current - 1));
  };

  const handleNextStep = (event) => {
    const form = event?.currentTarget?.form;
    if (form && !form.reportValidity()) {
      return;
    }
    goNextStep();
  };

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

  useEffect(() => {
    const reenrollment = location.state?.reenrollment;
    if (!reenrollment || hasAppliedReenrollment) return;

    const incoming = reenrollment.prefillData || {};

    setFormData((prev) => ({
      ...prev,
      ...incoming,
      dataNascimento: incoming.dataNascimento || prev.dataNascimento,
      primeiraComejaca: false,
      comissao: "",
      comprarCamisa:
        incoming.camisa === true
          ? "sim"
          : incoming.camisa === false
            ? "nao"
            : prev.comprarCamisa || "",
      ...(incoming.camisa === true
        ? (() => {
            const parsed = parseTamanhoCamisaDoBanco(
              incoming.tamanhoCamisa || prev.tamanhoCamisa
            );
            return {
              tamanhoCamisa: parsed.tamanhoCamisa || prev.tamanhoCamisa || "",
              idadeCamisaInfantil: parsed.idadeCamisaInfantil || prev.idadeCamisaInfantil || "",
            };
          })()
        : { tamanhoCamisa: "", idadeCamisaInfantil: "" }),
      camisaTipo:
        incoming.camisa === true
          ? String(incoming.camisaTipo || prev.camisaTipo || "").trim()
          : "",
      camisaCor:
        incoming.camisa === true
          ? String(incoming.camisaCor || prev.camisaCor || "").trim()
          : "",
    }));

    if (incoming?.dataNascimento) {
      setIsMinor(calculateAge(incoming.dataNascimento) < 18);
    }

    setStep(1);
    setPrefillNoticeName(reenrollment.firstName || "");
    setHasAppliedReenrollment(true);
  }, [location.state, hasAppliedReenrollment]);

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

    if (name === "comprarCamisa") {
      setFormData((prev) => ({
        ...prev,
        comprarCamisa: value,
        ...(value !== "sim"
          ? {
              tamanhoCamisa: "",
              camisaTipo: "",
              camisaCor: "",
              idadeCamisaInfantil: "",
            }
          : {}),
      }));
      return;
    }

    if (name === "tamanhoCamisa") {
      setFormData((prev) => ({
        ...prev,
        tamanhoCamisa: value,
        idadeCamisaInfantil: isTamanhoCamisaInfantil(value)
          ? prev.idadeCamisaInfantil
          : "",
      }));
      return;
    }

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

    if (step !== TOTAL_STEPS) {
      goNextStep();
      return;
    }

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

      const { comprarCamisa, idadeCamisaInfantil: _idadeForm, ...restForm } = formData;
      const querCamisa = comprarCamisa === "sim";

      const idadeInfantilErr = getIdadeCamisaInfantilValidationError(
        formData.tamanhoCamisa,
        formData.idadeCamisaInfantil,
        querCamisa
      );
      if (idadeInfantilErr) {
        setErrors([{ message: idadeInfantilErr }]);
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...restForm,
        camisa: querCamisa,
        tamanhoCamisa: querCamisa
          ? encodeTamanhoCamisaParaPersistencia(
              formData.tamanhoCamisa,
              formData.idadeCamisaInfantil
            ) || null
          : null,
        camisaTipo: querCamisa ? String(formData.camisaTipo || "").trim() : null,
        camisaCor: querCamisa ? String(formData.camisaCor || "").trim() : null,
        email: (formData.email || "").trim().toLowerCase(),
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

      console.log("PAYLOAD INSCRIÇÃO:", payload);
      console.log("[subscription] iniciando envio de inscrição", {
        apiUrl: API_URL,
        url: `${API_URL}/api/auth/inscrever`,
        tokenPresent: Boolean(token),
      });

      const response = await axios.post(`${API_URL}/api/auth/inscrever`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("[subscription] resposta da inscrição", {
        status: response?.status,
        data: response?.data,
      });

      if (response.data.success) {
        navigate("/painel");
      }
    } catch (error) {
      console.error("[subscription] erro ao enviar inscrição", {
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
        responseStatus: error?.response?.status,
        responseData: error?.response?.data,
      });
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
          <AppHeader
            showBack
            onBack={handleBack}
            rightContent={<AppHeaderBadge>{EVENT.displayName}</AppHeaderBadge>}
          />

          <Content>
            <FormCard onSubmit={handleSubmit}>
              <Header>
                <Title>Nova Inscrição</Title>

                <Subtitle>
                  Passo {step} de {TOTAL_STEPS} - {STEP_TITLES[step - 1]}
                </Subtitle>

                {prefillNoticeName && (
                  <PrefillNotice>
                    Formulário preenchido com base na inscrição anterior de{" "}
                    <strong>{prefillNoticeName}</strong>. Revise os dados antes de continuar.
                  </PrefillNotice>
                )}

                {errors.length > 0 && (
                  <ErrorBox>
                    {errors.map((err, index) => (
                      <div key={index}>⚠️ {err.message}</div>
                    ))}
                  </ErrorBox>
                )}
              </Header>

              {(step === 1 || step === 2) && (
                <Section>
                  <SectionHeader>
                    <SectionIcon>
                      {step === 1 ? <FiUser /> : <FiClock />}
                    </SectionIcon>
                    <SectionTitleWrap>
                      <SectionTitle>{step === 1 ? "Sobre você" : "Participação"}</SectionTitle>
                      <SectionDescription>
                        {step === 1
                          ? ""
                          : "Conte como você vai participar desta edição."}
                      </SectionDescription>
                    </SectionTitleWrap>
                  </SectionHeader>

                  <FormGrid>
                    {step === 1 && (
                      <>
                        <InputGroup>
                          <PremiumAuthField
                            id="sub-nomeCompleto"
                            name="nomeCompleto"
                            label="Nome completo *"
                            icon={faUser}
                            value={formData.nomeCompleto}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                          />
                        </InputGroup>

                        <InputGroup>
                          <PremiumAuthField
                            id="sub-nomeSocial"
                            name="nomeSocial"
                            label="Nome social"
                            icon={faUserTag}
                            value={formData.nomeSocial}
                            onChange={handleChange}
                            autoComplete="nickname"
                          />
                        </InputGroup>

                        <InputGroup>
                          <PremiumAuthField
                            id="sub-nomeCracha"
                            name="nomeCracha"
                            label="Nome no crachá *"
                            icon={faIdBadge}
                            value={formData.nomeCracha}
                            onChange={handleChange}
                            required
                          />
                        </InputGroup>

                        <InputGroup>
                          <SubscriptionBirthDateField
                            id="sub-dataNascimento"
                            label="Data de nascimento *"
                            value={formData.dataNascimento}
                            onChange={handleDateChange}
                            maxDate={today}
                          />
                        </InputGroup>

                        {isMinor && (
                          <>
                            <InputGroup>
                              <PremiumAuthField
                                id="sub-nomeCompletoResponsavel"
                                name="nomeCompletoResponsavel"
                                label="Nome do responsável *"
                                icon={faShieldHalved}
                                value={formData.nomeCompletoResponsavel}
                                onChange={handleChange}
                                required={isMinor}
                              />
                            </InputGroup>

                            <InputGroup>
                              <PremiumAuthField
                                id="sub-documentoResponsavel"
                                name="documentoResponsavel"
                                label="Documento do responsável *"
                                icon={faIdCard}
                                value={formData.documentoResponsavel || ""}
                                onChange={handleChange}
                                maxLength={14}
                                required={isMinor}
                              />
                            </InputGroup>

                            <InputGroup>
                              <PremiumAuthField
                                id="sub-telefoneResponsavel"
                                name="telefoneResponsavel"
                                label="Telefone do responsável *"
                                icon={faPhone}
                                value={formData.telefoneResponsavel}
                                onChange={handleChange}
                                inputMode="tel"
                                autoComplete="tel"
                                required={isMinor}
                              />
                            </InputGroup>
                          </>
                        )}

                        <InputGroup>
                          <PremiumAuthSelect
                            id="sub-sexo"
                            name="sexo"
                            label="Gênero *"
                            icon={faVenusMars}
                            value={formData.sexo}
                            onChange={handleChange}
                            required
                          >
                            <option value=""> </option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="prefironaoresponder">Prefiro não responder</option>
                            <option value="outro">Outro</option>
                          </PremiumAuthSelect>
                        </InputGroup>

                        {formData.sexo === "outro" && (
                          <InputGroup>
                            <PremiumAuthField
                              id="sub-outroGenero"
                              type="text"
                              name="outroGenero"
                              label="Como você prefere se identificar *"
                              icon={faPen}
                              value={formData.outroGenero}
                              onChange={handleChange}
                              placeholder="Escreva aqui"
                              required
                            />
                          </InputGroup>
                        )}

                        <InputGroup>
                          <PremiumAuthField
                            id="sub-telefone"
                            name="telefone"
                            label="WhatsApp *"
                            icon={faWhatsapp}
                            value={formData.telefone}
                            onChange={handleChange}
                            inputMode="tel"
                            autoComplete="tel"
                            required
                          />
                        </InputGroup>

                        <InputGroup>
                          <PremiumAuthField
                            id="sub-email"
                            type="email"
                            name="email"
                            label="E-mail *"
                            icon={faEnvelope}
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            inputMode="email"
                            required
                          />
                        </InputGroup>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <ParticipationSelectWrap>
                          <InputGroup>
                            <PremiumAuthSelect
                              id="sub-tipoParticipacao"
                              name="tipoParticipacao"
                              label="Como você vai participar? *"
                              icon={faPeopleGroup}
                              value={formData.tipoParticipacao}
                              onChange={handleChange}
                              required
                            >
                              <option value=""> </option>
                              <option value="Confraternista">Confraternista</option>
                              <option value="Trabalhador">Membro de Equipe / Tarefeiro do Bem</option>
                            </PremiumAuthSelect>
                          </InputGroup>
                        </ParticipationSelectWrap>

                        <ParticipationShirtFields>
                          <InputGroup>
                            <PremiumAuthSelect
                              id="sub-comprarCamisa"
                              name="comprarCamisa"
                              label="Deseja comprar camisa? *"
                              icon={faShirt}
                              value={formData.comprarCamisa}
                              onChange={handleChange}
                              required
                            >
                              <option value=""> </option>
                              <option value="nao">Não</option>
                              <option value="sim">Sim</option>
                            </PremiumAuthSelect>
                          </InputGroup>

                          <CamisaModeloGalleryTrigger
                            apiBaseUrl={API_URL}
                            linkPlacement="below"
                          />

                          {formData.comprarCamisa === "sim" && (
                            <>
                              <ParticipationShirtTipoCorRow>
                                <InputGroup>
                                  <PremiumAuthSelect
                                    id="sub-camisaTipo"
                                    name="camisaTipo"
                                    label="Tipo da camisa *"
                                    icon={faShirt}
                                    value={formData.camisaTipo}
                                    onChange={handleChange}
                                    required
                                  >
                                    <option value=""> </option>
                                    {CAMISA_TIPO_OPCOES.map((o) => (
                                      <option key={o.value} value={o.value}>
                                        {o.label} — {o.precoLabel}
                                      </option>
                                    ))}
                                  </PremiumAuthSelect>
                                </InputGroup>
                                <InputGroup>
                                  <PremiumAuthSelect
                                    id="sub-camisaCor"
                                    name="camisaCor"
                                    label="Cor da camisa *"
                                    icon={faShirt}
                                    value={formData.camisaCor}
                                    onChange={handleChange}
                                    required
                                  >
                                    <option value=""> </option>
                                    {CAMISA_COR_OPCOES.map((o) => (
                                      <option key={o.value} value={o.value}>
                                        {o.label}
                                      </option>
                                    ))}
                                  </PremiumAuthSelect>
                                </InputGroup>
                              </ParticipationShirtTipoCorRow>
                              <InputGroup>
                                <PremiumAuthSelect
                                  id="sub-tamanhoCamisa"
                                  name="tamanhoCamisa"
                                  label="Tamanho da camisa *"
                                  icon={faShirt}
                                  value={formData.tamanhoCamisa}
                                  onChange={handleChange}
                                  required
                                >
                                  <option value=""> </option>
                                  {CAMISA_TAMANHOS.map((t) => (
                                    <option key={t} value={t}>
                                      {t}
                                      {t === 'XXG' || t === 'G1' || t === 'G2'
                                        ? ' (+R$ 10 plus size)'
                                        : ''}
                                    </option>
                                  ))}
                                  <option value={CAMISA_TAMANHO_INFANTIL}>
                                    {CAMISA_TAMANHO_INFANTIL}
                                  </option>
                                </PremiumAuthSelect>
                              </InputGroup>
                              {isTamanhoCamisaInfantil(formData.tamanhoCamisa) ? (
                                <InputGroup>
                                  <PremiumAuthSelect
                                    id="sub-idadeCamisaInfantil"
                                    name="idadeCamisaInfantil"
                                    label="Idade da criança *"
                                    icon={faShirt}
                                    value={formData.idadeCamisaInfantil}
                                    onChange={handleChange}
                                    required
                                  >
                                    <option value=""> </option>
                                    {CAMISA_IDADES_INFANTIL.map((idade) => (
                                      <option key={idade} value={String(idade)}>
                                        {idade} {idade === 1 ? "ano" : "anos"}
                                      </option>
                                    ))}
                                  </PremiumAuthSelect>
                                </InputGroup>
                              ) : null}
                            </>
                          )}
                        </ParticipationShirtFields>

                        <ParticipationInfoCard>
                          <div>
                            <ParticipationInfoHeading>Tipos de participação</ParticipationInfoHeading>
                            <ParticipationInfoList>
                              <li>
                                <strong>Confraternista</strong> — jovens de 11 a 21 anos (idade na data do evento).
                              </li>
                              <li>
                                <strong>Membro de Equipe / Tarefeiro do Bem</strong> — quem atua em equipe no
                                encontro.
                              </li>
                              <li>
                                <strong>Pequeno Companheiro</strong> — crianças de 3 a 10 anos; o valor é calculado
                                automaticamente pela idade.
                              </li>
                            </ParticipationInfoList>
                          </div>

                          <div>
                            <ParticipationInfoHeading>Informações importantes</ParticipationInfoHeading>
                            <ParticipationInfoList>
                              <li>O tipo selecionado define o valor da inscrição.</li>
                              <li>
                                Pequeno Companheiro é calculado automaticamente pela idade na data do evento.
                              </li>
                            </ParticipationInfoList>
                          </div>

                          <div>
                            <ParticipationInfoHeading>Datas</ParticipationInfoHeading>
                            <ParticipationInfoList>
                              <li>
                                <strong>Inscrições:</strong> 19/04 a 07/06/2026
                              </li>
                              <li>
                                <strong>Evento:</strong> 04 e 05/07/2026
                              </li>
                            </ParticipationInfoList>
                          </div>
                        </ParticipationInfoCard>

                        {formData.tipoParticipacao === "Trabalhador" && (
                          <ParticipationComissaoGroup>
                            <PremiumAuthSelect
                              id="sub-comissao"
                              name="comissao"
                              label="Em qual equipe você gostaria de atuar? *"
                              icon={faSitemap}
                              value={formData.comissao}
                              onChange={handleChange}
                            >
                              <option value=""> </option>
                              <option value="Alimentação">Alimentação</option>
                              <option value="Atendimento Fraterno">Atendimento Fraterno</option>
                              <option value="Coordenação Geral">Coordenação Geral</option>
                              <option value="Divulgação">Divulgação</option>
                              <option value="Estudos Doutrinários">Estudos Doutrinários</option>
                              <option value="Multimeios">Multimeios</option>
                              <option value="Secretaria">Secretaria</option>
                              <option value="Serviços Gerais">Serviços Gerais</option>
                              <option value="Recepção">Recepção</option>
                            </PremiumAuthSelect>
                          </ParticipationComissaoGroup>
                        )}

                        <ParticipationCheckboxRow>
                          <ParticipationFirstComeCheckbox>
                            <CheckboxInput
                              type="checkbox"
                              name="primeiraComejaca"
                              checked={formData.primeiraComejaca}
                              onChange={handleChange}
                            />
                            <CheckboxLabel>
                              Esta será minha primeira {EVENT.name}.
                            </CheckboxLabel>
                          </ParticipationFirstComeCheckbox>
                        </ParticipationCheckboxRow>
                      </>
                    )}
                  </FormGrid>
                </Section>
              )}

              {step === 3 && (
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
                    <PremiumAuthField
                      id="sub-cep"
                      name="cep"
                      label="CEP *"
                      icon={faMapLocationDot}
                      value={formData.cep}
                      onChange={handleCepChange}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <PremiumAuthField
                      id="sub-estado"
                      name="estado"
                      label="Estado *"
                      icon={faMapLocationDot}
                      value={formData.estado}
                      onChange={handleChange}
                      disabled
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <PremiumAuthField
                      id="sub-cidade"
                      name="cidade"
                      label="Cidade *"
                      icon={faMapLocationDot}
                      value={formData.cidade}
                      onChange={handleChange}
                      disabled
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <PremiumAuthField
                      id="sub-bairro"
                      name="bairro"
                      label="Bairro *"
                      icon={faMapLocationDot}
                      value={formData.bairro}
                      onChange={handleChange}
                      disabled
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <PremiumAuthField
                      id="sub-logradouro"
                      name="logradouro"
                      label="Logradouro *"
                      icon={faMapLocationDot}
                      value={formData.logradouro}
                      onChange={handleChange}
                      disabled
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <PremiumAuthField
                      id="sub-numero"
                      name="numero"
                      label="Número *"
                      icon={faMapLocationDot}
                      value={formData.numero}
                      onChange={handleChange}
                      autoComplete="address-line2"
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <PremiumAuthField
                      id="sub-complemento"
                      name="complemento"
                      label="Complemento"
                      icon={faMapLocationDot}
                      value={formData.complemento}
                      onChange={handleChange}
                    />
                  </InputGroup>

                  <InputGroup>
                    <PremiumAuthSelect
                      id="sub-IE"
                      name="IE"
                      label="Instituição espírita *"
                      icon={faBuilding}
                      value={formData.IE}
                      onChange={handleChange}
                      required
                    >
                      <option value=""> </option>
                      {institutions.map((inst) => (
                        <option key={inst.id} value={inst.nome}>
                          {inst.nome}
                        </option>
                      ))}
                      <option value="outro">Outra</option>
                    </PremiumAuthSelect>
                  </InputGroup>

                  {formData.IE === "outro" && (
                    <InputGroup>
                      <PremiumAuthField
                        id="sub-otherInstitution"
                        type="text"
                        name="otherInstitution"
                        label="Nome da instituição *"
                        icon={faBuilding}
                        value={formData.otherInstitution}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  )}
                </FormGrid>
              </Section>
              )}

              {step === 4 && (
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
                    <PremiumAuthTextarea
                      id="sub-alergia"
                      name="alergia"
                      label="Alergias ou restrições alimentares"
                      icon={faCircleInfo}
                      value={formData.alergia}
                      onChange={handleChange}
                      rows={4}
                    />
                  </InputGroup>

                  <InputGroup>
                    <PremiumAuthTextarea
                      id="sub-medicacao"
                      name="medicacao"
                      label="Uso de medicamento"
                      icon={faCircleInfo}
                      value={formData.medicacao}
                      onChange={handleChange}
                      rows={4}
                    />
                  </InputGroup>
                  <FullWidth>
                    <InputGroup>
                      <PremiumAuthTextarea
                        id="sub-outrasInformacoes"
                        name="outrasInformacoes"
                        label="Algo mais que você queira nos contar?"
                        icon={faCircleInfo}
                        value={formData.outrasInformacoes}
                        onChange={handleChange}
                        rows={5}
                      />
                    </InputGroup>
                  </FullWidth>
                  <FullWidth>
                    <InputGroup>
                      <SubscriptionStaticLabel>
                        <FiInfo aria-hidden />
                        Existe alguma condição que você gostaria que soubéssemos?
                      </SubscriptionStaticLabel>
                      <ChipsGroup>
                        <ChipLabel $selected={formData.deficienciaAuditiva}>
                          <input
                            type="checkbox"
                            name="deficienciaAuditiva"
                            checked={formData.deficienciaAuditiva}
                            onChange={handleChange}
                          />
                          Auditiva
                        </ChipLabel>

                        <ChipLabel $selected={formData.deficienciaAutismo}>
                          <input
                            type="checkbox"
                            name="deficienciaAutismo"
                            checked={formData.deficienciaAutismo}
                            onChange={handleChange}
                          />
                          Autismo
                        </ChipLabel>

                        <ChipLabel $selected={formData.deficienciaIntelectual}>
                          <input
                            type="checkbox"
                            name="deficienciaIntelectual"
                            checked={formData.deficienciaIntelectual}
                            onChange={handleChange}
                          />
                          Intelectual
                        </ChipLabel>

                        <ChipLabel $selected={formData.deficienciaParalisiaCerebral}>
                          <input
                            type="checkbox"
                            name="deficienciaParalisiaCerebral"
                            checked={formData.deficienciaParalisiaCerebral}
                            onChange={handleChange}
                          />
                          Paralisia cerebral
                        </ChipLabel>

                        <ChipLabel $selected={formData.deficienciaVisual}>
                          <input
                            type="checkbox"
                            name="deficienciaVisual"
                            checked={formData.deficienciaVisual}
                            onChange={handleChange}
                          />
                          Visual
                        </ChipLabel>

                        <ChipLabel $selected={formData.deficienciaFisica}>
                          <input
                            type="checkbox"
                            name="deficienciaFisica"
                            checked={formData.deficienciaFisica}
                            onChange={handleChange}
                          />
                          Física
                        </ChipLabel>

                        <ChipLabel $selected={formData.deficienciaOutra}>
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
                        <PremiumAuthField
                          id="sub-deficienciaOutraDescricao"
                          type="text"
                          name="deficienciaOutraDescricao"
                          label="Se quiser, explique melhor"
                          icon={faPen}
                          value={formData.deficienciaOutraDescricao}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </FullWidth>
                  )}

                  <InputGroup>
                    <PremiumAuthSelect
                      id="sub-vegetariano"
                      name="vegetariano"
                      label="Alimentação *"
                      icon={faSeedling}
                      value={formData.vegetariano}
                      onChange={handleChange}
                      required
                    >
                      <option value=""> </option>
                      <option value="Não">Sem restrição</option>
                      <option value="Vegetariano">Vegetariana</option>
                      <option value="Vegano">Vegana</option>
                    </PremiumAuthSelect>
                  </InputGroup>
                </FormGrid>
              </Section>
              )}

              {step === 5 && (
              <Section>
       {/*  */}

                <CheckboxContainer $final>
                  <CheckboxInput type="checkbox" required />
                  <CheckboxLabel $final>
                    Li e estou de acordo com as orientações do{" "}
                    <LinkText onClick={() => setModalOpen(true)}>plano geral</LinkText> da{" "}
                    {EVENT.displayName}. *
                  </CheckboxLabel>
                </CheckboxContainer>
              </Section>
              )}

              <PlanoGeralModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

              <FooterActions>
                {step > 1 && (
                  <StepBackButton type="button" onClick={goPrevStep}>
                    <FiArrowLeft size={15} />
                    Voltar
                  </StepBackButton>
                )}

                {step < TOTAL_STEPS ? (
                  <SubscriptionFooterPrimaryButton
                    type="button"
                    $hasBack={step > 1}
                    onClick={handleNextStep}
                  >
                    Próximo
                  </SubscriptionFooterPrimaryButton>
                ) : (
                  <SubscriptionFooterPrimaryButton
                    type="submit"
                    disabled={isSubmitting}
                    $hasBack={step > 1}
                    aria-busy={isSubmitting ? "true" : undefined}
                  >
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
                  </SubscriptionFooterPrimaryButton>
                )}
              </FooterActions>
            </FormCard>
          </Content>
        </Container>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default Formulario;
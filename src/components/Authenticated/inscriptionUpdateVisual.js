/**
 * UI compartilhada com o formulário de Nova Inscrição (`subscription.js`).
 * Apenas layout / estilos — não contém lógica de negócio.
 */
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  InputShell,
  InputInner,
  InputIconSlot,
  FieldTrack,
  FloatingLabel,
  TextareaShell,
} from "../Unauthenticated/auth/PremiumAuthField";
import {
  APP_HEADER_HEIGHT,
  APP_HEADER_HEIGHT_MOBILE,
} from "../shared/AppHeader";
import { authTheme } from "../Unauthenticated/auth/authTheme";
import { AuthGradientLoginButton } from "../Unauthenticated/auth/authStyles";

export const dashboardThemeTokens = {
  background: "#f1f2f4",
  cardBackground: "#fcfcfc",
  sectionBackground: "transparent",
  textColor: "#111827",
  secondaryText: "#64748b",
  subtleText: "#8e8e93",
  borderColor: "rgba(15, 23, 42, 0.08)",
  inputBackground: "#f7f7f5",
  inputBorder: "rgba(15, 23, 42, 0.07)",
  inputFocus: "#8b5cf6",
  buttonBackground: "#1C1C1E",
  buttonHover: "#1c1c1e",
  checkboxAccent: "#0a84ff",
  dangerSoft: "rgba(255, 59, 48, 0.06)",
  dangerBorder: "rgba(255, 59, 48, 0.12)",
  shadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
  sectionShadow: "none",
  softShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
};

export const mergeUpdateFormTheme = () => ({
  ...dashboardThemeTokens,
  ...authTheme,
});

/** Escopo visual: inputs/selects/textareas do fluxo de atualização (não altera lógica). */
export const UpdateFormFieldScope = styled.div`
  ${InputShell},
  ${TextareaShell} {
    min-height: 46px;
    border-radius: 12px;
    background: ${({ theme }) => theme.inputBackground};
    border: 1px solid ${({ theme }) => theme.inputBorder};
    box-shadow: none;
    transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
  }

  ${TextareaShell} {
    min-height: 118px;
  }

  ${InputShell}[data-error="true"],
  ${TextareaShell}[data-error="true"] {
    background: rgba(255, 250, 250, 0.94);
    border-color: rgba(220, 100, 100, 0.14);
    box-shadow: none;
  }

  ${InputShell}:hover:not(:focus-within):not([data-error="true"]),
  ${TextareaShell}:hover:not(:focus-within):not([data-error="true"]) {
    background: #fafaf8;
    border-color: rgba(15, 23, 42, 0.075);
  }

  ${InputShell}:focus-within:not([data-error="true"]),
  ${TextareaShell}:focus-within:not([data-error="true"]) {
    background: #ffffff;
    border-color: rgba(100, 128, 247, 0.4);
    box-shadow: 0 0 0 2px rgba(100, 128, 247, 0.09);
  }

  ${InputShell}[data-error="true"]:focus-within,
  ${TextareaShell}[data-error="true"]:focus-within {
    box-shadow: 0 0 0 2px rgba(220, 95, 95, 0.08);
  }

  ${InputInner} {
    min-height: 46px;
    padding: 0 14px;
    gap: 10px;
  }

  ${TextareaShell} ${InputInner} {
    min-height: 100px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  ${InputIconSlot} {
    color: #a8b0bd;
    opacity: 0.9;
  }

  ${InputShell}:focus-within:not([data-error="true"]) ${InputIconSlot},
  ${TextareaShell}:focus-within:not([data-error="true"]) ${InputIconSlot} {
    color: ${({ theme }) => theme.primary};
    opacity: 0.88;
  }

  ${FieldTrack} {
    padding-bottom: 7px;
  }

  ${FloatingLabel} {
    letter-spacing: -0.012em;
  }

  @media (max-width: 768px) {
    ${InputShell},
    ${TextareaShell} {
      min-height: 42px;
      border-radius: 11px;
    }

    ${InputInner} {
      min-height: 42px;
      padding: 0 12px;
      gap: 9px;
    }

    ${TextareaShell} {
      min-height: 104px;
    }

    ${TextareaShell} ${InputInner} {
      min-height: 90px;
      padding-top: 7px;
      padding-bottom: 7px;
    }
  }
`;

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

const PAGE_MAX_WIDTH = "980px";

export const UpdatePageContainer = styled.div`
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

export const UpdatePageContent = styled.div`
  max-width: ${PAGE_MAX_WIDTH};
  margin: 0 auto;
`;

export const UpdateFormCard = styled.form`
  background: ${({ theme }) => theme.cardBackground};
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 16px;
  padding: 26px 28px 30px;
  box-shadow: ${({ theme }) => theme.shadow};
  animation: ${fadeIn} 0.25s ease;

  @media (max-width: 768px) {
    padding: 16px 14px 20px;
    border-radius: 14px;
    background: ${({ theme }) => theme.cardBackground};
  }
`;

export const UpdateFormHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 22px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 18px;
    padding-bottom: 16px;
  }
`;

export const UpdateFormTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  line-height: 1.14;
  letter-spacing: -0.035em;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};

  @media (max-width: 768px) {
    font-size: 24px;
    line-height: 1.16;
  }
`;

export const UpdateFormSubtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.secondaryText};
  font-size: 13px;
  line-height: 1.58;
  max-width: 620px;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 12.5px;
    line-height: 1.55;
  }
`;

export const UpdateErrorBox = styled.div`
  margin-top: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: ${({ theme }) => theme.dangerSoft};
  border: 1px solid ${({ theme }) => theme.dangerBorder};
  color: #b42318;
  text-align: left;
  font-size: 13px;
  line-height: 1.45;
`;

export const UpdateSection = styled.section`
  background: ${({ theme }) => theme.sectionBackground};
  border-radius: 0;
  padding: 8px 0 30px;
  margin-bottom: 4px;
  box-shadow: none;
  border: none;

  @media (max-width: 768px) {
    padding: 6px 0 22px;
    margin-bottom: 2px;
  }
`;

export const UpdateSectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 18px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 14px;
  }
`;

export const UpdateSectionIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.04);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.98rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 0.92rem;
  }
`;

export const UpdateSectionTitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 7px;
  }
`;

export const UpdateSectionTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  color: ${({ theme }) => theme.textColor};
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.015em;

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 1.3;
  }
`;

export const UpdateSectionDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.55;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 12.5px;
    line-height: 1.52;
  }
`;

/** Linha “Passo X de Y” — hierarquia leve (só apresentação). */
export const UpdateStepProgressLabel = styled(UpdateSectionDescription)`
  font-weight: 500;
  font-size: 13px;
  letter-spacing: -0.01em;
  color: #475569;

  @media (max-width: 768px) {
    font-size: 12.5px;
  }
`;

export const UpdateFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 22px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 13px;
  }
`;

export const UpdateInputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

export const UpdateFullWidthGroup = styled(UpdateInputGroup)`
  grid-column: 1 / -1;
`;

/** Linha de apoio com ícone (ex.: primeira COMEJACA, condições). */
export const UpdateFormCalloutLabel = styled(UpdateSectionDescription)`
  margin-bottom: 10px;
  font-weight: 500;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  line-height: 1.45;

  svg {
    flex-shrink: 0;
    opacity: 0.82;
  }

  @media (max-width: 768px) {
    margin-bottom: 8px;
    font-size: 12.5px;
  }
`;

/** Agrupa campos de camisa como subseção leve. */
export const UpdateCamisaSubsection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 6px;
  padding-top: 14px;
  border-top: 1px solid rgba(15, 23, 42, 0.055);

  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 4px;
    padding-top: 12px;
  }
`;

/** Alinhado ao `ParticipationFirstComeCheckbox` em `subscription.js`. */
export const UpdateFirstComejacaBox = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 11px;
  cursor: pointer;
  padding: 14px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.inputBackground};
  border: 1px solid rgba(15, 23, 42, 0.055);
  box-shadow: none;
  transition: border-color 0.18s ease, background 0.18s ease;

  &:hover {
    border-color: rgba(15, 23, 42, 0.09);
    background: #fafaf8;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    gap: 10px;
  }
`;

export const UpdateFirstComejacaCheckbox = styled.input`
  width: 20px;
  height: 20px;
  margin-top: 1px;
  flex-shrink: 0;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(100, 128, 247, 0.45);
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => `0 0 0 3px rgba(${theme.primaryRgb}, 0.12)`};
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

export const UpdateFirstComejacaText = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 400;
  line-height: 1.52;
`;

/** Alinhado a `ChipsGroup` + `ChipLabel` em `subscription.js`. */
export const UpdateChipsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 2px;

  @media (max-width: 768px) {
    gap: 9px;
  }
`;

export const UpdateChipLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 15px;
  border-radius: 14px;
  background: ${({ $selected, theme }) =>
    $selected ? `rgba(${theme.primaryRgb}, 0.08)` : "rgba(15, 23, 42, 0.025)"};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? `rgba(${theme.primaryRgb}, 0.28)` : "rgba(15, 23, 42, 0.06)"};
  color: ${({ $selected, theme }) => ($selected ? theme.primary : "#475569")};
  font-family: "Inter", system-ui, sans-serif;
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 500)};
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
  box-shadow: none;

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected ? `rgba(${theme.primaryRgb}, 0.1)` : "rgba(255, 255, 255, 0.9)"};
    border-color: ${({ $selected, theme }) =>
      $selected ? `rgba(${theme.primaryRgb}, 0.36)` : "rgba(15, 23, 42, 0.09)"};
  }

  input[type="checkbox"] {
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
    flex-shrink: 0;

    &:hover {
      border-color: rgba(100, 128, 247, 0.45);
    }

    &:focus-visible {
      outline: none;
      box-shadow: ${({ theme }) => `0 0 0 3px rgba(${theme.primaryRgb}, 0.12)`};
      border-color: ${({ theme }) => theme.primary};
    }

    &:checked {
      border-color: ${({ theme }) => theme.primary};
      background: ${({ theme }) => theme.primary};
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
      background-position: center;
      background-repeat: no-repeat;
    }
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
    padding: 5px 0 0 !important;
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

export function InscriptionBirthDateField({ id, label, value, onChange, maxDate }) {
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

export const UpdateStepMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
`;

export const UpdateStepDots = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

export const UpdateStepDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: ${({ $active, $done }) =>
    $active ? "#3b6df0" : $done ? "#94a3b8" : "#e2e8f0"};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 3px rgba(59, 109, 240, 0.14)" : "none"};
  transition: background 0.2s ease, box-shadow 0.2s ease;
`;

export const UpdateReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 11px;
  }
`;

export const UpdateReviewItem = styled.div`
  grid-column: ${({ fullWidth }) => (fullWidth ? "1 / -1" : "auto")};
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.65);
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: none;
`;

export const UpdateReviewLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 5px;
`;

export const UpdateReviewValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor};
  font-weight: 500;
  line-height: 1.48;
  word-break: break-word;
`;

export const UpdateLoadingWrap = styled.div`
  max-width: ${PAGE_MAX_WIDTH};
  margin: 0 auto;
  padding: 24px 18px 40px;
`;

export const UpdateStepBackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  width: 100%;
  gap: 6px;
  padding: 0 14px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  background: rgba(15, 23, 42, 0.03);
  border-radius: 12px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;

  svg {
    color: currentColor;
    font-size: 13px;
    opacity: 0.88;
  }

  &:hover {
    background: rgba(15, 23, 42, 0.045);
    border-color: rgba(15, 23, 42, 0.1);
    color: #475569;
  }

  &:active {
    transform: scale(0.995);
  }

  &:focus-visible {
    outline: none;
    border-color: rgba(100, 128, 247, 0.35);
    box-shadow: 0 0 0 2px rgba(100, 128, 247, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    min-height: 44px;
    font-size: 12.5px;
  }
`;

export const UpdateFooterActions = styled.div`
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;

  @media (max-width: 768px) {
    margin-top: 20px;
    padding-top: 18px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
`;

export const UpdateFooterPrimaryButton = styled(AuthGradientLoginButton)`
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

export const UpdateLoadingCard = styled.div`
  margin-top: 16px;
  background: ${({ theme }) => theme.cardBackground};
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 14px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${({ theme }) => theme.textColor};
  font-size: 14px;
  font-weight: 500;

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

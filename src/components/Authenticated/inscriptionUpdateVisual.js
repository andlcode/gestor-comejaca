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
} from "../Unauthenticated/auth/PremiumAuthField";
import {
  APP_HEADER_HEIGHT,
  APP_HEADER_HEIGHT_MOBILE,
} from "../shared/AppHeader";
import { authTheme } from "../Unauthenticated/auth/authTheme";
import { AuthGradientLoginButton } from "../Unauthenticated/auth/authStyles";

export const dashboardThemeTokens = {
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
};

export const mergeUpdateFormTheme = () => ({
  ...dashboardThemeTokens,
  ...authTheme,
});

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

export const UpdateFormHeader = styled.header`
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

export const UpdateFormTitle = styled.h1`
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

export const UpdateFormSubtitle = styled.p`
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

export const UpdateErrorBox = styled.div`
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.dangerSoft};
  border: 1px solid ${({ theme }) => theme.dangerBorder};
  color: #b42318;
  text-align: left;
  font-size: 14px;
`;

export const UpdateSection = styled.section`
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

export const UpdateSectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 22px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 16px;
  }
`;

export const UpdateSectionIcon = styled.div`
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

export const UpdateSectionDescription = styled.p`
  margin: 0;
  color: #5f636d;
  font-size: 14px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.55;
  }
`;

export const UpdateFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const UpdateInputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 7px;
  }
`;

export const UpdateFullWidthGroup = styled(UpdateInputGroup)`
  grid-column: 1 / -1;
`;

/** Alinhado ao `ParticipationFirstComeCheckbox` em `subscription.js`. */
export const UpdateFirstComejacaBox = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 18px 20px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: rgba(15, 23, 42, 0.12);
    background: #fafbff;
  }

  @media (max-width: 768px) {
    padding: 16px 16px;
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
  font-size: 15px;
  color: #334155;
  font-weight: 500;
  line-height: 1.55;
`;

/** Alinhado a `ChipsGroup` + `ChipLabel` em `subscription.js`. */
export const UpdateChipsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 4px;

  @media (max-width: 768px) {
    gap: 11px;
  }
`;

export const UpdateChipLabel = styled.label`
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
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ $active, $done }) =>
    $active ? "#1d4ed8" : $done ? "#94a3b8" : "#dbe2ea"};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 4px rgba(29, 78, 216, 0.12)" : "none"};
  transition: all 0.2s ease;
`;

export const UpdateReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const UpdateReviewItem = styled.div`
  grid-column: ${({ fullWidth }) => (fullWidth ? "1 / -1" : "auto")};
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: rgba(255, 255, 255, 0.96);
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: ${({ theme }) => theme.sectionShadow};
`;

export const UpdateReviewLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
`;

export const UpdateReviewValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textColor};
  font-weight: 500;
  line-height: 1.5;
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

export const UpdateFooterActions = styled.div`
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
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  padding: 28px;
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

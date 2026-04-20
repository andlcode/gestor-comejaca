import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const tShell = 'all 0.2s ease';
const tLabel =
  'top 0.18s ease, transform 0.18s ease, font-size 0.18s ease, font-weight 0.18s ease, color 0.18s ease, letter-spacing 0.18s ease';
const tInput = 'color 0.18s ease, padding 0.18s ease';

export const InputShell = styled.div`
  position: relative;
  width: 100%;
  min-height: 48px;
  border-radius: 18px;
  box-sizing: border-box;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.045);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.018);
  transition: ${tShell};

  @supports ((-webkit-backdrop-filter: blur(12px)) or (backdrop-filter: blur(12px))) {
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
  }

  @media (max-width: 639px) {
    background: rgba(255, 255, 255, 0.92);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }

  &:hover:not(:focus-within) {
    background: rgba(15, 23, 42, 0.022);
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.024);
  }

  &:focus-within {
    background: rgba(255, 255, 255, 0.78);
    border-color: ${({ theme }) => theme.primary};
    box-shadow:
      0 0 0 3px rgba(${({ theme }) => theme.primaryRgb}, 0.08),
      0 8px 20px -16px rgba(${({ theme }) => theme.primaryRgb}, 0.14);
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
  }

  ${({ $error }) =>
    $error &&
    `
    background: rgba(255, 250, 250, 0.86);
    border-color: rgba(220, 100, 100, 0.18);
    box-shadow:
      0 2px 8px rgba(17, 24, 39, 0.03),
      0 10px 18px -18px rgba(220, 95, 95, 0.1);

    &:hover:not(:focus-within) {
      border-color: rgba(220, 100, 100, 0.22);
    }

    &:focus-within {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(220, 95, 95, 0.32);
      box-shadow: 0 0 0 3px rgba(220, 95, 95, 0.07);
    }
  `}
`;

export const InputInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 12px;
  min-height: 48px;
  padding: 0 16px;
  box-sizing: border-box;
`;

export const InputIconSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  align-self: center;
  color: #9aa4b2;
  opacity: 1;
  transition: color 0.18s ease, opacity 0.18s ease;

  ${InputShell}:focus-within:not([data-error='true']) & {
    color: ${({ theme }) => theme.primary};
    opacity: 0.9;
  }

  ${InputShell}[data-error='true'] & {
    color: rgba(185, 102, 102, 0.78);
    opacity: 0.88;
  }

  ${InputShell}[data-error='true']:focus-within & {
    color: rgba(185, 96, 96, 0.84);
  }
`;

export const FieldTrack = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 8px;
  box-sizing: border-box;
`;

export const FloatingLabel = styled.label`
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 1;
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.15;
  transition: ${tLabel};

  ${({ $active, $error }) =>
    $active
      ? `
    top: 7px;
    transform: translateY(0) scale(0.88);
    transform-origin: left top;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: ${$error ? 'rgba(156, 101, 101, 0.84)' : 'rgba(71, 85, 105, 0.72)'};
    background: rgba(255, 255, 255, 0.94);
    padding: 0 6px 1px 0;
    margin-left: -1px;
    border-radius: 5px;
    width: fit-content;
    max-width: calc(100% - 4px);
  `
      : `
    top: 50%;
    transform: translateY(calc(-50% + 0.5px)) scale(1);
    transform-origin: left center;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.014em;
    color: ${$error ? 'rgba(129, 107, 111, 0.82)' : 'rgba(71, 85, 105, 0.82)'};
    background: transparent;
    padding: 0;
    margin-left: 0;
    border-radius: 0;
    width: auto;
    max-width: none;
  `}

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.014em;
  color: #111827;
  line-height: 1.4;
  padding: ${({ $active }) => ($active ? '6px 0 0' : '0')};
  margin: 0;
  min-height: 22px;
  box-sizing: border-box;
  transition: ${tInput};

  &::placeholder {
    color: transparent;
    opacity: 0;
  }

  &:disabled {
    opacity: 0.62;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
  }
`;

const IconFa = styled(FontAwesomeIcon)`
  display: block;
  width: 1.125rem;
  height: 1.125rem;
`;

const isValidFontAwesomeIcon = (icon) => {
  if (!icon) return false;
  if (typeof icon === 'string') return true;
  if (Array.isArray(icon)) return icon.length > 0;

  return Boolean(
    icon &&
      typeof icon === 'object' &&
      (icon.iconName || icon.prefix || Array.isArray(icon.icon))
  );
};

const PremiumAuthField = forwardRef(function PremiumAuthField(
  {
    label,
    icon,
    value,
    placeholder: _placeholderUnused,
    onChange,
    onFocus,
    onBlur,
    error = false,
    disabled = false,
    required = false,
    id,
    name,
    type = 'text',
    autoComplete,
    inputMode,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    className,
    ...inputProps
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const hasValue = value != null && String(value).length > 0;
  const active = focused || hasValue;
  const safeLabel = typeof label === 'string' ? label : '';
  const canRenderIcon = isValidFontAwesomeIcon(icon);

  return (
    <InputShell
      className={className}
      $error={error}
      data-error={error ? 'true' : undefined}
    >
      <InputInner>
        <InputIconSlot>
          {canRenderIcon ? <IconFa icon={icon} aria-hidden /> : null}
        </InputIconSlot>

        <FieldTrack>
          <FloatingLabel htmlFor={id} $active={active} $error={error}>
            {safeLabel}
          </FloatingLabel>

          <StyledInput
            ref={ref}
            id={id}
            name={name}
            type={type}
            required={required}
            autoComplete={autoComplete}
            inputMode={inputMode}
            value={value ?? ''}
            onChange={onChange}
            disabled={disabled}
            $active={active}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            {...inputProps}
            placeholder=" "
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
          />
        </FieldTrack>
      </InputInner>
    </InputShell>
  );
});

PremiumAuthField.displayName = 'PremiumAuthField';

const selectChevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239aa4b2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`;

const StyledSelectInner = styled.select`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.014em;
  color: #111827;
  line-height: 1.4;
  padding: ${({ $active }) => ($active ? '6px 0 0' : '0')};
  margin: 0;
  min-height: 22px;
  box-sizing: border-box;
  transition: ${tInput};
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: ${selectChevron};
  background-repeat: no-repeat;
  background-position: right 2px center;
  background-size: 12px 12px;
  padding-right: 22px;

  &:disabled {
    opacity: 0.62;
    cursor: not-allowed;
  }
`;

export const PremiumAuthSelect = forwardRef(function PremiumAuthSelect(
  {
    label,
    icon,
    value,
    onChange,
    onFocus,
    onBlur,
    error = false,
    disabled = false,
    required = false,
    id,
    name,
    className,
    children,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const hasValue = value != null && String(value).length > 0;
  const active = focused || hasValue;
  const safeLabel = typeof label === 'string' ? label : '';
  const canRenderIcon = isValidFontAwesomeIcon(icon);

  return (
    <InputShell
      className={className}
      $error={error}
      data-error={error ? 'true' : undefined}
    >
      <InputInner>
        <InputIconSlot>
          {canRenderIcon ? <IconFa icon={icon} aria-hidden /> : null}
        </InputIconSlot>

        <FieldTrack>
          <FloatingLabel htmlFor={id} $active={active} $error={error}>
            {safeLabel}
          </FloatingLabel>

          <StyledSelectInner
            ref={ref}
            id={id}
            name={name}
            value={value ?? ''}
            onChange={onChange}
            disabled={disabled}
            required={required}
            $active={active}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
          >
            {children}
          </StyledSelectInner>
        </FieldTrack>
      </InputInner>
    </InputShell>
  );
});

PremiumAuthSelect.displayName = 'PremiumAuthSelect';

const TextareaShell = styled(InputShell)`
  min-height: 128px;
`;

const TextareaInner = styled(InputInner)`
  align-items: flex-start;
  padding-top: 10px;
  padding-bottom: 10px;
  min-height: 108px;
`;

const TextareaIconSlot = styled(InputIconSlot)`
  align-self: flex-start;
  margin-top: 6px;
`;

const TextareaFieldTrack = styled(FieldTrack)`
  padding-bottom: 10px;
  min-height: 96px;
`;

const StyledTextareaInner = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.014em;
  color: #111827;
  line-height: 1.5;
  padding: ${({ $active }) => ($active ? '8px 0 6px' : '4px 0 6px')};
  margin: 0;
  min-height: 88px;
  resize: vertical;
  box-sizing: border-box;
  transition: ${tInput};

  &::placeholder {
    color: transparent;
    opacity: 0;
  }

  &:disabled {
    opacity: 0.62;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
  }
`;

export const PremiumAuthTextarea = forwardRef(function PremiumAuthTextarea(
  {
    label,
    icon,
    value,
    placeholder: _placeholderUnusedTextarea,
    onChange,
    onFocus,
    onBlur,
    error = false,
    disabled = false,
    required = false,
    id,
    name,
    rows = 4,
    className,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const hasValue = value != null && String(value).length > 0;
  const active = focused || hasValue;
  const safeLabel = typeof label === 'string' ? label : '';
  const canRenderIcon = isValidFontAwesomeIcon(icon);

  return (
    <TextareaShell
      className={className}
      $error={error}
      data-error={error ? 'true' : undefined}
    >
      <TextareaInner>
        <TextareaIconSlot>
          {canRenderIcon ? <IconFa icon={icon} aria-hidden /> : null}
        </TextareaIconSlot>

        <TextareaFieldTrack>
          <FloatingLabel htmlFor={id} $active={active} $error={error}>
            {safeLabel}
          </FloatingLabel>

          <StyledTextareaInner
            ref={ref}
            id={id}
            name={name}
            rows={rows}
            required={required}
            disabled={disabled}
            value={value ?? ''}
            onChange={onChange}
            $active={active}
            placeholder=" "
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
          />
        </TextareaFieldTrack>
      </TextareaInner>
    </TextareaShell>
  );
});

PremiumAuthTextarea.displayName = 'PremiumAuthTextarea';

export default PremiumAuthField;
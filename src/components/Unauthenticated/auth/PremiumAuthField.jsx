import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const tShell =
  'background 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease';
const tLabel =
  'top 0.18s ease, transform 0.18s ease, font-size 0.18s ease, font-weight 0.18s ease, color 0.18s ease, letter-spacing 0.18s ease';
const tInput = 'color 0.18s ease, padding 0.18s ease';

export const InputShell = styled.div`
  position: relative;
  width: 100%;
  min-height: 54px;
  border-radius: 5px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 1px 2px rgba(17, 24, 39, 0.04),
    0 6px 14px -16px rgba(17, 24, 39, 0.08);
  transition: ${tShell};

  &:hover:not(:focus-within) {
    border-color: #d1d5db;
    box-shadow:
      0 1px 2px rgba(17, 24, 39, 0.04),
      0 6px 14px -18px rgba(17, 24, 39, 0.08);
  }

  &:focus-within {
    background: #ffffff;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
  }

  ${({ $error }) =>
    $error &&
    `
    background: #fffafa;
    border-color: rgba(220, 100, 100, 0.24);
    box-shadow:
      0 1px 2px rgba(17, 24, 39, 0.03),
      0 6px 14px -18px rgba(220, 95, 95, 0.14);

    &:hover:not(:focus-within) {
      border-color: rgba(220, 100, 100, 0.3);
    }

    &:focus-within {
      background: #ffffff;
      border-color: rgba(220, 95, 95, 0.52);
      box-shadow: 0 0 0 3px rgba(220, 95, 95, 0.1);
    }
  `}
`;

export const InputInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 12px;
  min-height: 54px;
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
    color: #2563eb;
    opacity: 0.96;
  }

  ${InputShell}[data-error='true'] & {
    color: rgba(210, 95, 95, 0.86);
    opacity: 0.92;
  }

  ${InputShell}[data-error='true']:focus-within & {
    color: rgba(200, 78, 78, 0.92);
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
    color: ${$error ? 'rgba(198, 82, 82, 0.92)' : 'rgba(37, 99, 235, 0.72)'};
  `
      : `
    top: 50%;
    transform: translateY(calc(-50% + 0.5px)) scale(1);
    transform-origin: left center;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.014em;
    color: ${$error ? 'rgba(126, 95, 95, 0.84)' : '#475569'};
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
    color: #9ca3af;
    font-weight: 500;
    letter-spacing: -0.01em;
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

const PremiumAuthField = forwardRef(function PremiumAuthField(
  {
    label,
    icon,
    value,
    placeholder = ' ',
    onChange,
    onFocus,
    onBlur,
    error = false,
    disabled = false,
    id,
    name,
    type = 'text',
    autoComplete,
    inputMode,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    className,
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const hasValue = value != null && String(value).length > 0;
  const active = focused || hasValue;

  return (
    <InputShell
      className={className}
      $error={error}
      data-error={error ? 'true' : undefined}
    >
      <InputInner>
        <InputIconSlot>
          <IconFa icon={icon} aria-hidden />
        </InputIconSlot>

        <FieldTrack>
          <FloatingLabel htmlFor={id} $active={active} $error={error}>
            {label}
          </FloatingLabel>

          <StyledInput
            ref={ref}
            id={id}
            name={name}
            type={type}
            autoComplete={autoComplete}
            inputMode={inputMode}
            value={value}
            onChange={onChange}
            disabled={disabled}
            $active={active}
            placeholder={active && !hasValue ? placeholder : ' '}
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
        </FieldTrack>
      </InputInner>
    </InputShell>
  );
});

PremiumAuthField.displayName = 'PremiumAuthField';

export default PremiumAuthField;
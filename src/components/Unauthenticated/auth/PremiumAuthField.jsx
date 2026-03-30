import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const tShell = 'background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease';
const tLabel =
  'top 0.2s ease, transform 0.2s ease, font-size 0.2s ease, font-weight 0.2s ease, color 0.2s ease, letter-spacing 0.2s ease';

export const InputShell = styled.div`
  position: relative;
  width: 100%;
  min-height: 58px;
  border-radius: 18px;
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(252, 253, 255, 0.98) 0%, rgba(247, 248, 252, 0.98) 100%);
  border: 1px solid rgba(15, 23, 42, 0.04);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.028),
    0 10px 24px -18px rgba(15, 23, 42, 0.16);
  transition: ${tShell};

  &:hover:not(:focus-within) {
    border-color: rgba(94, 86, 234, 0.08);
    box-shadow:
      0 2px 5px rgba(15, 23, 42, 0.035),
      0 16px 30px -22px rgba(15, 23, 42, 0.18);
  }

  &:focus-within {
    background: #ffffff;
    border-color: rgba(109, 93, 246, 0.18);
    box-shadow:
      0 0 0 3px rgba(109, 93, 246, 0.09),
      0 3px 10px rgba(109, 93, 246, 0.06),
      0 18px 34px -24px rgba(15, 23, 42, 0.16);
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
  }

  ${({ $error }) =>
    $error &&
    `
    background: #fef8f8;
    border-color: rgba(220, 100, 100, 0.12);
    box-shadow:
      0 1px 2px rgba(15, 23, 42, 0.03),
      0 4px 14px -6px rgba(200, 90, 90, 0.06);

    &:hover:not(:focus-within) {
      border-color: rgba(220, 100, 100, 0.18);
      box-shadow:
        0 2px 4px rgba(15, 23, 42, 0.035),
        0 8px 22px -8px rgba(200, 90, 90, 0.07);
    }

    &:focus-within {
      background: #ffffff;
      border-color: rgba(218, 88, 88, 0.3);
      box-shadow:
        0 0 0 3px rgba(220, 95, 95, 0.09),
        0 2px 8px rgba(220, 95, 95, 0.07);
    }
  `}
`;

export const InputInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 11px;
  min-height: 58px;
  padding: 0 18px;
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
  color: rgba(100, 116, 139, 0.72);
  opacity: 0.82;
  transition: color 0.2s ease, opacity 0.2s ease, transform 0.2s ease;

  ${InputShell}:focus-within:not([data-error='true']) & {
    color: #6d5df6;
    opacity: 0.96;
    transform: translateY(-0.5px);
  }

  ${InputShell}[data-error='true'] & {
    color: rgba(210, 95, 95, 0.85);
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
  padding-bottom: 10px;
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
    top: 8px;
    transform: translateY(0) scale(0.88);
    transform-origin: left top;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.022em;
    color: ${$error ? 'rgba(198, 82, 82, 0.92)' : 'rgba(97, 82, 229, 0.94)'};
  `
      : `
    top: 50%;
    transform: translateY(calc(-50% + 0.5px)) scale(1);
    transform-origin: left center;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.013em;
    color: ${$error ? 'rgba(115, 110, 106, 0.82)' : 'rgba(100, 116, 139, 0.92)'};
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
  letter-spacing: -0.011em;
  color: #0f172a;
  line-height: 1.4;
  padding: ${({ $active }) => ($active ? '8px 0 1px' : '1px 0 1px')};
  margin: 0;
  min-height: 22px;
  box-sizing: border-box;
  transition:
    color 0.2s ease,
    padding 0.2s ease;

  &::placeholder {
    color: rgba(152, 162, 179, 0.92);
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

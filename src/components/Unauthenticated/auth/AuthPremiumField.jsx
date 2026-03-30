import React, { useId, useState } from 'react';
import {
  AuthInputRow,
  AuthPremiumFieldIconSlot,
  AuthPremiumFieldBody,
  AuthPremiumFieldLabel,
  AuthPremiumFieldControl,
  AuthInputIcon,
  AuthPremiumFieldRoot,
  AuthPremiumFieldFeedbackSlot,
  AuthPremiumInlineError,
  AuthPremiumInlineSuccess,
} from './authStyles';

export default function AuthPremiumField({
  label,
  icon,
  invalid = false,
  errorMessage,
  success = false,
  successMessage,
  className,
  hint,
  onFocus,
  onBlur,
  value,
  layout = 'default',
  placeholder: placeholderProp,
  ...inputProps
}) {
  const id = useId();
  const errId = `${id}-error`;
  const okId = `${id}-ok`;
  const [focused, setFocused] = useState(false);
  const strValue = value == null ? '' : String(value);
  const floating = focused || strValue.length > 0;
  const placeholder = placeholderProp ?? hint ?? '';
  const hasFieldError = Boolean(errorMessage);
  const showInvalid = invalid || hasFieldError;
  const hasSuccessText = Boolean(successMessage);
  const showSuccess = Boolean(success) && !showInvalid;
  const isLoginLayout = layout === 'login';

  return (
    <AuthPremiumFieldRoot className={className}>
      <AuthInputRow $invalid={showInvalid} $success={showSuccess} $login={isLoginLayout}>
        <AuthPremiumFieldIconSlot aria-hidden $login={isLoginLayout}>
          <AuthInputIcon icon={icon} />
        </AuthPremiumFieldIconSlot>
        <AuthPremiumFieldBody $floating={floating}>
          <AuthPremiumFieldLabel
            htmlFor={id}
            $floating={floating}
            $invalid={showInvalid}
            $login={isLoginLayout}
          >
            {label}
          </AuthPremiumFieldLabel>
          <AuthPremiumFieldControl
            id={id}
            $floating={floating}
            $login={isLoginLayout}
            placeholder={placeholder}
            aria-invalid={showInvalid || undefined}
            aria-describedby={
              [hasFieldError ? errId : null, hasSuccessText && showSuccess ? okId : null]
                .filter(Boolean)
                .join(' ') || undefined
            }
            {...inputProps}
            value={value}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
          />
        </AuthPremiumFieldBody>
      </AuthInputRow>
      <AuthPremiumFieldFeedbackSlot aria-live="polite">
        {hasFieldError ? (
          <AuthPremiumInlineError id={errId} role="status" $login={isLoginLayout}>
            {errorMessage}
          </AuthPremiumInlineError>
        ) : null}
        {hasSuccessText && showSuccess ? (
          <AuthPremiumInlineSuccess id={okId}>{successMessage}</AuthPremiumInlineSuccess>
        ) : null}
      </AuthPremiumFieldFeedbackSlot>
    </AuthPremiumFieldRoot>
  );
}

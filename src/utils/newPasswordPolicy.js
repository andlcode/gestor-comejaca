/**
 * Política para **nova** senha (cadastro, redefinição, perfil).
 * Alinhar com `backend/src/utils/passwordPolicy.js`.
 */
export const NEW_PASSWORD_POLICY_MESSAGE =
  'A senha deve ter no mínimo 8 caracteres e pelo menos 1 letra maiúscula.';

export function meetsNewPasswordPolicy(password) {
  const s = String(password ?? '');
  return s.length >= 8 && /[A-Z]/.test(s);
}

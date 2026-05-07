/**
 * URL de checkout válida (evita javascript:, vazio, esquemas inválidos).
 * @param {unknown} url
 * @returns {boolean}
 */
export function isHttpOrHttpsUrl(url) {
  if (url == null) return false;
  const s = String(url).trim();
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

export const PAYMENT_LINK_ERROR =
  'Não foi possível gerar o link de pagamento. Tente novamente ou fale com a organização.';

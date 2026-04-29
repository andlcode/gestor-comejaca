/** Valores enviados à API (alinhados ao backend). */
export const CAMISA_TIPO_OPCOES = [
  { value: "algodao", label: "Algodão", precoLabel: "R$ 55,00" },
  { value: "poliester", label: "Poliéster", precoLabel: "R$ 35,00" },
];

export const CAMISA_COR_OPCOES = [
  { value: "preto", label: "Preto" },
  { value: "branco", label: "Branco" },
];

export const CAMISA_TAMANHOS = ["PP", "P", "M", "G", "GG", "XG"];

export function labelCamisaTipo(value) {
  const o = CAMISA_TIPO_OPCOES.find((x) => x.value === value);
  return o ? `${o.label} (${o.precoLabel})` : value || "—";
}

export function labelCamisaCor(value) {
  const o = CAMISA_COR_OPCOES.find((x) => x.value === value);
  return o ? o.label : value || "—";
}

/** Valores enviados à API (alinhados ao backend). */
export const CAMISA_TIPO_OPCOES = [
  { value: "algodao", label: "Algodão", precoLabel: "R$ 55,00" },
  { value: "poliester", label: "Poliéster", precoLabel: "R$ 35,00" },
];

export const CAMISA_COR_OPCOES = [
  { value: "preto", label: "Preto" },
  { value: "branco", label: "Branco" },
];

export const CAMISA_TAMANHOS = ["PP", "P", "M", "G", "GG", "XG", "XXG", "G1", "G2"];

/** Valor no formulário (select); no banco grava-se a idade (1–14) em `tamanhoCamisa`. */
export const CAMISA_TAMANHO_INFANTIL = "Infantil";

export const CAMISA_IDADES_INFANTIL = Array.from({ length: 14 }, (_, i) => i + 1);

const IDADE_INFANTIL_PERSISTIDA_RE = /^([1-9]|1[0-4])$/;

export function isTamanhoCamisaInfantil(tamanho) {
  return String(tamanho || "").trim() === CAMISA_TAMANHO_INFANTIL;
}

/** `tamanhoCamisa` salvo no banco como idade (ex.: "8"), não como "Infantil". */
export function isIdadeInfantilPersistidaEmTamanho(tamanho) {
  return IDADE_INFANTIL_PERSISTIDA_RE.test(String(tamanho || "").trim());
}

/** Converte valor do banco → estado do formulário. */
export function parseTamanhoCamisaDoBanco(tamanhoSalvo) {
  const raw = String(tamanhoSalvo || "").trim();
  if (!raw) {
    return { tamanhoCamisa: "", idadeCamisaInfantil: "" };
  }
  if (raw === CAMISA_TAMANHO_INFANTIL) {
    return { tamanhoCamisa: CAMISA_TAMANHO_INFANTIL, idadeCamisaInfantil: "" };
  }
  if (isIdadeInfantilPersistidaEmTamanho(raw)) {
    return { tamanhoCamisa: CAMISA_TAMANHO_INFANTIL, idadeCamisaInfantil: raw };
  }
  return { tamanhoCamisa: raw, idadeCamisaInfantil: "" };
}

/** Converte formulário → valor gravado em `tamanhoCamisa`. */
export function encodeTamanhoCamisaParaPersistencia(tamanhoForm, idadeCamisaInfantil) {
  const t = String(tamanhoForm || "").trim();
  if (isTamanhoCamisaInfantil(t)) {
    const idade = Number(idadeCamisaInfantil);
    if (Number.isInteger(idade) && idade >= 1 && idade <= 14) {
      return String(idade);
    }
    // Legado / edição paga sem idade no formulário: não gravar "0" nem "NaN"
    return CAMISA_TAMANHO_INFANTIL;
  }
  return t;
}

export function labelTamanhoCamisaExibicao(tamanhoSalvo, tamanhoForm, idadeForm) {
  if (isTamanhoCamisaInfantil(tamanhoForm) && idadeForm) {
    return `Infantil (${idadeForm} anos)`;
  }
  const parsed = parseTamanhoCamisaDoBanco(tamanhoSalvo);
  if (parsed.idadeCamisaInfantil) {
    return `Infantil (${parsed.idadeCamisaInfantil} anos)`;
  }
  return String(tamanhoSalvo || tamanhoForm || "").trim() || "";
}

/** Retorna mensagem de erro ou null se válido / não aplicável. */
export function getIdadeCamisaInfantilValidationError(
  tamanhoCamisa,
  idadeCamisaInfantil,
  querCamisa = true
) {
  if (!querCamisa || !isTamanhoCamisaInfantil(tamanhoCamisa)) return null;
  if (
    idadeCamisaInfantil === "" ||
    idadeCamisaInfantil === null ||
    idadeCamisaInfantil === undefined
  ) {
    return "Informe a idade da criança para a camisa infantil.";
  }
  const idade = Number(idadeCamisaInfantil);
  if (!Number.isInteger(idade) || idade < 1 || idade > 14) {
    return "A idade deve ser entre 1 e 14 anos.";
  }
  return null;
}

export function labelCamisaTipo(value) {
  const o = CAMISA_TIPO_OPCOES.find((x) => x.value === value);
  return o ? `${o.label} (${o.precoLabel})` : value || "—";
}

export function labelCamisaCor(value) {
  const o = CAMISA_COR_OPCOES.find((x) => x.value === value);
  return o ? o.label : value || "—";
}

export const EVENT = {
  name: process.env.REACT_APP_EVENT_NAME || "COMEJACA",
  year: process.env.REACT_APP_EVENT_YEAR || "2026",
  displayName:
    process.env.REACT_APP_EVENT_DISPLAY_NAME || "XLVII COMEJACA 2026",
  fullName:
    process.env.REACT_APP_EVENT_FULL_NAME ||
    "Confraternização das Mocidades Espíritas de Jacarepaguá",
  systemName: process.env.REACT_APP_EVENT_SYSTEM_NAME || "Sistema",
  /**
   * URL única (imagem ou .pdf) — `REACT_APP_EVENT_CAMISA_IMAGEM_URL`.
   * No evento da API: `camisaImagemUrl` = primeira entrada de `camisaImagens`; este .env só entra se a API não tiver URLs.
   */
  camisaImagemUrl: (process.env.REACT_APP_EVENT_CAMISA_IMAGEM_URL || "").trim(),
  /**
   * Opcional: se a API devolver lista vazia e `camisaImagemUrl` acima estiver vazio, ainda assim exibe o link da galeria
   * (útil para teste/local). Ex.: `https://…/modelo.png`
   */
  camisaImagemFallbackUrl: (process.env.REACT_APP_EVENT_CAMISA_FALLBACK_URL || "").trim(),
};

export default EVENT;

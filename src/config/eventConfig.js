export const EVENT = {
  name: process.env.REACT_APP_EVENT_NAME || "COMEJACA",
  year: process.env.REACT_APP_EVENT_YEAR || "2026",
  displayName:
    process.env.REACT_APP_EVENT_DISPLAY_NAME || "XLVII COMEJACA 2026",
  fullName:
    process.env.REACT_APP_EVENT_FULL_NAME ||
    "Confraternização das Mocidades Espíritas de Jacarepaguá",
  systemName: process.env.REACT_APP_EVENT_SYSTEM_NAME || "Sistema",
};

export default EVENT;

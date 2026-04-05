export const EVENT = {
  name: process.env.REACT_APP_EVENT_NAME || "Evento",
  year: process.env.REACT_APP_EVENT_YEAR || "",
  displayName: process.env.REACT_APP_EVENT_DISPLAY_NAME || "Evento",
  fullName: process.env.REACT_APP_EVENT_FULL_NAME || "",
  systemName: process.env.REACT_APP_EVENT_SYSTEM_NAME || "Sistema",
};

export default EVENT;

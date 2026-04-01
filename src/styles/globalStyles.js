// src/globalStyles.js

import { createGlobalStyle } from 'styled-components';

 const GlobalStyles = createGlobalStyle`
  /* Definição das cores */
  :root {
    --app-bg: #F6F7F9;
    --card-bg: #FFFFFF;
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --btn-primary-bg: #1C1C1E;
    --btn-primary-text: #FFFFFF;
    --btn-secondary-border: #E5E7EB;
    --status-pending-bg: #FEF3C7;
    --status-pending-text: #92400E;
    --status-success-bg: #DCFCE7;
    --status-success-text: #166534;
    --status-error-bg: #FEE2E2;
    --status-error-text: #991B1B;
    --card-shadow: 0 6px 18px rgba(17, 24, 39, 0.06);
    --secondary-gold: #f39c12;
    --primary-purple: #1C1C1E;
    --background: #F6F7F9;
    --text-color: #111827;
    --border-color: #E5E7EB;
  }

  /* Reset básico */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    font-family: Arial, sans-serif;
    background-color: var(--app-bg);
    color: var(--text-primary);
    overflow-y: auto  }

  a {
    text-decoration: none;
    color: var(--primary-purple);
  }

  a:hover {
    color: var(--secondary-gold);
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    color: var(--primary-purple);
  }

  p {
    line-height: 1.6;
  }

  button {
    cursor: pointer;
    font-family: inherit;
    background: var(--primary-purple);
    color: #fff;
    padding: 12px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    transition: background 0.3s ease;
  }

  button:hover {
    background: var(--secondary-gold);
  }

  input, textarea {
    font-family: inherit;
    padding: 8px;
    border: 1px solid var(--border-color);
    outline: none;
    border-radius: 4px;
  }

  input:focus, textarea:focus {
    border-color: var(--primary-purple);
  }
  
  /* Estilização do container principal */
  .container {
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
`;
export default GlobalStyles;
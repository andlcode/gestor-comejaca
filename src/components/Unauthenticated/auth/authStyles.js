import styled, { css, keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

/** Entrada do card: curta e discreta (microinteração, sem exagero). */
export const authCardEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/** Mensagem de erro / aviso: apenas fade, tom calmo. */
export const authFormAlertEnter = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

/** Texto de validação abaixo do campo: fade suave. */
export const authInlineFeedbackIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const authSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const authSlideDrawer = keyframes`
  from {
    opacity: 0;
    transform: translateX(6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const authFadeOverlay = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const AuthPageShell = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(1.2rem, 3.6vh, 1.95rem) clamp(1.1rem, 3.5vw, 1.85rem);
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
  background:
    radial-gradient(
      ellipse 90% 60% at 50% -18%,
      rgba(109, 93, 246, 0.14) 0%,
      transparent 52%
    ),
    radial-gradient(
      ellipse 70% 45% at 100% 85%,
      rgba(56, 189, 248, 0.06) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse 55% 40% at 0% 60%,
      rgba(109, 93, 246, 0.07) 0%,
      transparent 45%
    ),
    linear-gradient(165deg, #0a0b14 0%, #121429 42%, #151731 100%);

  @media (min-width: 640px) {
    padding: clamp(1.15rem, 3.4vh, 1.85rem) clamp(1.2rem, 3.8vw, 1.95rem);
  }

  @media (min-width: 1024px) {
    padding: clamp(1.25rem, 3.75vh, 2rem) clamp(1.35rem, 4.25vw, 2.35rem);
    background:
      radial-gradient(
        ellipse 88% 58% at 50% -16%,
        rgba(109, 93, 246, 0.17) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse 62% 44% at 100% 88%,
        rgba(56, 189, 248, 0.075) 0%,
        transparent 48%
      ),
      radial-gradient(
        ellipse 52% 42% at 0% 55%,
        rgba(129, 140, 248, 0.09) 0%,
        transparent 46%
      ),
      radial-gradient(
        ellipse 120% 80% at 50% 120%,
        rgba(0, 0, 0, 0.35) 0%,
        transparent 55%
      ),
      linear-gradient(165deg, #0a0b14 0%, #121429 42%, #151731 100%);
  }

  ${({ $login }) =>
    $login &&
    `
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    min-height: 100dvh;
    background:
      radial-gradient(
        ellipse 78% 52% at 50% -10%,
        rgba(255, 255, 255, 0.92) 0%,
        rgba(255, 255, 255, 0) 62%
      ),
      radial-gradient(
        ellipse 42% 30% at 12% 22%,
        rgba(147, 197, 253, 0.12) 0%,
        rgba(147, 197, 253, 0) 72%
      ),
      radial-gradient(
        ellipse 38% 28% at 88% 78%,
        rgba(196, 181, 253, 0.12) 0%,
        rgba(196, 181, 253, 0) 74%
      ),
      linear-gradient(180deg, #fbfcfe 0%, #f2f5f9 46%, #e9eef5 100%);

    @media (min-width: 1024px) {
      background:
        radial-gradient(
          ellipse 82% 56% at 50% -8%,
          rgba(255, 255, 255, 0.98) 0%,
          rgba(255, 255, 255, 0) 60%
        ),
        radial-gradient(
          ellipse 34% 26% at 8% 24%,
          rgba(147, 197, 253, 0.14) 0%,
          rgba(147, 197, 253, 0) 74%
        ),
        radial-gradient(
          ellipse 30% 24% at 92% 78%,
          rgba(196, 181, 253, 0.14) 0%,
          rgba(196, 181, 253, 0) 74%
        ),
        radial-gradient(
          ellipse 85% 70% at 50% 115%,
          rgba(148, 163, 184, 0.12) 0%,
          rgba(148, 163, 184, 0) 62%
        ),
        linear-gradient(180deg, #fbfcfe 0%, #f2f5f9 44%, #e9eef5 100%);
    }
  `}

  @media (max-width: 639px) {
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    overscroll-behavior: none;
    ${({ $saas }) =>
      $saas
        ? `
      align-items: center;
      justify-content: center;
      padding: max(0.65rem, env(safe-area-inset-top, 0px))
        clamp(0.65rem, 3.2vw, 0.875rem)
        max(0.5rem, env(safe-area-inset-bottom, 0px));
    `
        : `
      align-items: stretch;
      justify-content: stretch;
      padding: 0;
    `}
    ${({ $login }) =>
      $login &&
      `
      align-items: stretch;
      justify-content: stretch;
      padding: 0;
    `}
    box-sizing: border-box;
  }
`;

export const AuthAmbient = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 50% 28%,
      rgba(99, 102, 241, 0.06) 0%,
      transparent 42%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.02) 0%,
      transparent 35%,
      rgba(0, 0, 0, 0.12) 100%
    );

  @media (min-width: 640px) {
    background:
      radial-gradient(
        ellipse 56% 46% at 50% 36%,
        rgba(99, 102, 241, 0.09) 0%,
        transparent 54%
      ),
      radial-gradient(
        circle at 50% 26%,
        rgba(99, 102, 241, 0.065) 0%,
        transparent 44%
      ),
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.028) 0%,
        transparent 38%,
        rgba(0, 0, 0, 0.14) 100%
      );
  }

  @media (min-width: 1200px) {
    background:
      radial-gradient(
        ellipse 52% 42% at 50% 34%,
        rgba(99, 102, 241, 0.095) 0%,
        transparent 56%
      ),
      radial-gradient(
        ellipse 70% 48% at 88% 18%,
        rgba(56, 189, 248, 0.055) 0%,
        transparent 46%
      ),
      radial-gradient(
        circle at 50% 24%,
        rgba(99, 102, 241, 0.055) 0%,
        transparent 46%
      ),
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.03) 0%,
        transparent 42%,
        rgba(0, 0, 0, 0.16) 100%
      );
  }

  ${({ $login }) =>
    $login &&
    `
    background:
      radial-gradient(
        ellipse 40% 24% at 50% 16%,
        rgba(255, 255, 255, 0.42) 0%,
        transparent 68%
      ),
      radial-gradient(
        ellipse 42% 24% at 50% 24%,
        rgba(124, 58, 237, 0.03) 0%,
        transparent 64%
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, transparent 62%);

    @media (min-width: 1024px) {
      background:
        radial-gradient(
          ellipse 40% 24% at 50% 18%,
          rgba(255, 255, 255, 0.44) 0%,
          transparent 66%
        ),
        radial-gradient(
          ellipse 42% 24% at 50% 24%,
          rgba(124, 58, 237, 0.03) 0%,
          transparent 58%
        ),
        radial-gradient(
          ellipse 58% 40% at 84% 18%,
          rgba(99, 102, 241, 0.025) 0%,
          transparent 48%
        ),
        linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, transparent 58%);
    }
  `}
`;

/** Coluna que centra o cartão (login SaaS). */
export const AuthLayoutColumn = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  min-height: 0;
  box-sizing: border-box;
  gap: 0;

  ${({ $login }) =>
    $login &&
    `
    min-height: 100%;
    justify-content: center;
    padding: clamp(1.1rem, 5vh, 2.4rem) 0;
  `}
`;

/** Marca acima do cartão — discreta, ~70% opacidade no cluster. */
export const AuthPageBrandCluster = styled.div`
  width: 100%;
  max-width: min(440px, 92vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: 0.7;
  flex-shrink: 0;
  padding: 0 0.35rem;
  box-sizing: border-box;
`;

export const AuthPageBrandHeadingRow = styled.p`
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.15rem 0.35rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(0.6875rem, 1.6vw, 0.75rem);
  font-weight: 600;
  letter-spacing: 0.055em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.96);
  line-height: 1.35;
`;

export const AuthPageBrandAccent = styled.span`
  color: rgba(180, 174, 255, 0.96);
  font-weight: 700;
  letter-spacing: 0.035em;
`;

export const AuthPageBrandNameMuted = styled.span`
  letter-spacing: 0.08em;
  color: rgba(241, 245, 249, 0.94);
`;

export const AuthPageBrandYearMuted = styled.span`
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  color: rgba(148, 163, 184, 0.92);
  margin-left: 0.15em;
`;

export const AuthPageBrandTagline = styled.p`
  margin: 0.3rem 0 0;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(0.625rem, 1.45vw, 0.6875rem);
  font-weight: 400;
  letter-spacing: 0.018em;
  color: rgba(186, 198, 216, 0.9);
  line-height: 1.4;
`;

export const AuthPageBrandActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 0.45rem;
`;

/** Topo do cartão (login SaaS): identidade à esquerda, ações discretas à direita. */
export const AuthSaaSCardTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8125rem;
  margin: 0 0 1.125rem;
  padding-bottom: 0.96875rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.055);

  @media (max-width: 639px) {
    gap: 0.75rem;
    margin-bottom: 0.95rem;
    padding-bottom: 0.875rem;
  }
`;

export const AuthSaaSIdentityBlock = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  padding-top: 0;
`;

export const AuthSaaSIdentityLine = styled.p`
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.71875rem;
  font-weight: 700;
  letter-spacing: 0.085em;
  text-transform: uppercase;
  line-height: 1.3;
  color: #8593a8;
`;

export const AuthSaaSIdentityMark = styled.span`
  font-weight: 700;
  color: rgba(99, 102, 241, 0.84);
  margin-right: 0.24em;
`;

export const AuthSaaSIdentityName = styled.span`
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #475569;
`;

export const AuthSaaSIdentityYear = styled.span`
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
  color: rgba(100, 116, 139, 0.72);
  margin-left: 0.24em;
`;

export const AuthSaaSIdentityTagline = styled.p`
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.65625rem;
  font-weight: 400;
  letter-spacing: 0.03em;
  line-height: 1.45;
  color: rgba(100, 116, 139, 0.8);
`;

export const AuthSaaSCardTopActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
  flex-shrink: 0;
  padding-top: 0;
`;

export const AuthSaaSMateriaisLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin: 0;
  padding: 0.45rem 0.7rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  line-height: 1.2;
  color: #5f6d82;
  background: rgba(248, 250, 255, 0.86);
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 11px;
  box-shadow: 0 6px 16px -14px rgba(15, 23, 42, 0.18);
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    color: #5e56ea;
    background: rgba(255, 255, 255, 0.98);
    border-color: rgba(99, 102, 241, 0.16);
    box-shadow: 0 10px 22px -18px rgba(94, 86, 234, 0.28);
  }

  &:active {
    color: #4f47d4;
    background: rgba(94, 86, 234, 0.09);
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.1s;
  }
`;

export const AuthSaaSMenuIconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
  color: #64748b;
  background: rgba(248, 250, 255, 0.84);
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 11px;
  box-shadow: 0 6px 16px -14px rgba(15, 23, 42, 0.16);
  cursor: pointer;
  transition:
    color 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    color: #0f172a;
    background: rgba(255, 255, 255, 0.98);
    border-color: rgba(148, 163, 184, 0.2);
    box-shadow: 0 10px 22px -18px rgba(15, 23, 42, 0.24);
  }

  &:active {
    background: rgba(15, 23, 42, 0.08);
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.1s;
  }

  @media (max-width: 639px) {
    width: 38px;
    height: 38px;
    border-radius: 10px;
  }
`;

export const AuthCardWrap = styled.div`
  position: relative;
  z-index: 2;
  width: min(92vw, 516px);
  max-width: min(92vw, 516px);
  margin: 0 auto;
  align-self: center;
  flex-shrink: 0;
  box-sizing: border-box;

  ${({ $saas }) =>
    $saas &&
    `
    width: min(92vw, 440px);
    max-width: min(92vw, 440px);
  `}

  ${({ $login }) =>
    $login &&
    `
    width: 100%;
    max-width: 720px;

    &::before {
      content: '';
      position: absolute;
      inset: 1.4rem 1.25rem -1.9rem;
      z-index: -1;
      border-radius: 28px;
      background: radial-gradient(
        ellipse at center,
        rgba(124, 58, 237, 0.12) 0%,
        rgba(124, 58, 237, 0.04) 40%,
        transparent 74%
      );
      filter: blur(30px);
      opacity: 0.18;
      pointer-events: none;
    }
  `}

  @media (min-width: 900px) {
    width: min(92vw, 532px);
    max-width: min(92vw, 532px);

    ${({ $saas }) =>
      $saas &&
      `
      width: min(92vw, 440px);
      max-width: min(92vw, 440px);
    `}

    ${({ $login }) =>
      $login &&
      `
      width: 100%;
      max-width: 720px;
    `}
  }

  @media (min-width: 1280px) {
    width: min(92vw, 544px);
    max-width: min(92vw, 544px);

    ${({ $saas }) =>
      $saas &&
      `
      width: min(92vw, 440px);
      max-width: min(92vw, 440px);
    `}

    ${({ $login }) =>
      $login &&
      `
      width: 100%;
      max-width: 720px;
    `}
  }

  @media (max-width: 639px) {
    width: 100%;
    max-width: none;
    margin: 0;
    align-self: stretch;
    height: 100%;
    min-height: 0;
    overflow: hidden;

    ${({ $saas }) =>
      $saas &&
      `
      width: min(92vw, 440px);
      max-width: min(92vw, 440px);
    `}

    ${({ $login }) =>
      $login &&
      `
      width: 100%;
      max-width: none;
      height: 100%;
      min-height: 0;

      &::before {
        display: none;
      }
    `}
  }
`;

export const AuthCard = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  background: #ffffff;
  border-radius: 5px;
  border: 1px solid rgba(15, 23, 42, 0.054);
  box-shadow:
    0 2px 5px rgba(15, 23, 42, 0.034),
    0 22px 48px -18px rgba(15, 23, 42, 0.118),
    0 0 0 1px rgba(255, 255, 255, 0.7) inset,
    0 1px 0 rgba(255, 255, 255, 0.76) inset;
  overflow: hidden;
  box-sizing: border-box;
  animation: ${authCardEnter} 0.24s ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @media (min-width: 640px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 720px;
    border-radius: 5px;
    border: 1px solid rgba(15, 23, 42, 0.052);
    box-shadow:
      0 3px 7px rgba(15, 23, 42, 0.038),
      0 28px 58px -21px rgba(15, 23, 42, 0.132),
      0 0 0 1px rgba(255, 255, 255, 0.73) inset,
      0 1px 0 rgba(255, 255, 255, 0.81) inset;
  }

  @media (min-width: 1200px) {
    box-shadow:
      0 3px 9px rgba(15, 23, 42, 0.04),
      0 34px 66px -23px rgba(15, 23, 42, 0.138),
      0 0 0 1px rgba(255, 255, 255, 0.75) inset,
      0 1px 0 rgba(255, 255, 255, 0.83) inset;
  }

  @media (max-width: 639px) {
    min-height: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    justify-content: flex-start;
    width: 100%;
    max-height: 100%;
    border-radius: 0;
    border: 1px solid rgba(15, 23, 42, 0.07);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.65) inset,
      0 4px 20px rgba(15, 23, 42, 0.07),
      0 0 0 1px rgba(15, 23, 42, 0.04);
    animation: ${authCardEnter} 0.22s ease-out both;
  }

  @media (max-width: 639px) and (prefers-reduced-motion: reduce) {
    animation: none;
  }

  ${({ $login }) =>
    $login &&
    css`
    border-radius: 5px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    box-shadow: 0 18px 40px rgba(17, 24, 39, 0.08);

    @media (min-width: 640px) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 720px;
      border-radius: 5px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 18px 40px rgba(17, 24, 39, 0.08);
    }

    @media (min-width: 1200px) {
      box-shadow: 0 20px 44px rgba(17, 24, 39, 0.08);
    }

    @media (max-width: 639px) {
      min-height: 0;
      height: 100%;
      border-radius: 0;
      border: 1px solid #e5e7eb;
      box-shadow: none;
    }

    animation: ${authCardEnter} 0.22s ease-out both;
  `}
`;

export const AuthCardHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: clamp(0.75rem, 3vw, 1.35rem);
  padding: clamp(1rem, 2.4vw, 1.28rem) clamp(1.15rem, 3vw, 2rem)
    clamp(1rem, 2.2vw, 1.15rem);
  box-sizing: border-box;
  background: linear-gradient(180deg, #fcfcfe 0%, #f5f7fb 100%);
  border-bottom: 1px solid rgba(15, 23, 42, 0.065);
  flex-shrink: 0;

  @media (min-width: 640px) {
    align-items: center;
    padding: clamp(1.05rem, 2.1vw, 1.32rem) clamp(1.25rem, 2.6vw, 1.85rem)
      clamp(1.02rem, 2vw, 1.18rem);
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    background: linear-gradient(180deg, #fdfdff 0%, #f4f6fa 100%);
  }

  @media (max-width: 639px) {
    padding: 0.8rem max(1rem, env(safe-area-inset-right, 0px)) 0.72rem
      max(1rem, env(safe-area-inset-left, 0px));
    gap: 0.65rem;
  }

  ${({ $login }) =>
    $login &&
    `
    background: linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%);
    border-bottom: 1px solid #e5e7eb;
    padding: 1.2rem 1.45rem 1.08rem;

    @media (min-width: 640px) {
      background: linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%);
      border-bottom: 1px solid #e5e7eb;
      padding: 1.28rem 1.6rem 1.12rem;
    }

    @media (max-width: 639px) {
      padding: max(0.72rem, env(safe-area-inset-top, 0px)) max(0.95rem, env(safe-area-inset-right, 0px)) 0.64rem
        max(0.95rem, env(safe-area-inset-left, 0px));
      gap: 0.5rem;
    }
  `}
`;

export const AuthBrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.234375rem;
  min-width: 0;
  justify-content: center;
  flex: 1;
  padding-top: 0.015625rem;

  ${({ $login }) =>
    $login &&
    `
    gap: 0.22rem;
  `}
`;

export const AuthBrandTitle = styled.h1`
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(0.9375rem, 2.35vw, 1.0625rem);
  font-weight: 700;
  letter-spacing: -0.032em;
  line-height: 1.2;
  color: #0b1220;

  ${({ $login, $mutedBrand }) =>
    $login &&
    `
    font-size: clamp(0.90625rem, 2.1vw, 1rem);
    font-weight: ${$mutedBrand ? 700 : 600};
    letter-spacing: -0.022em;
    color: #111827;
  `}
`;

export const AuthBrandOrdinal = styled.span`
  font-weight: 700;
  margin-right: 0.28em;
  color: #5b4cdb;
  letter-spacing: -0.02em;

  ${({ $login, $mutedBrand }) =>
    $login &&
    `
    color: ${$mutedBrand ? '#64748b' : '#5b4cdb'};
    opacity: ${$mutedBrand ? 1 : 0.78};
  `}
`;

export const AuthBrandName = styled.span`
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  font-size: 0.88em;
  color: #0f172a;

  ${({ $login, $mutedBrand }) =>
    $login &&
    `
    color: ${$mutedBrand ? '#111827' : '#1f2937'};
    letter-spacing: 0.06em;
    font-weight: ${$mutedBrand ? 800 : 700};
  `}
`;

export const AuthBrandYear = styled.span`
  font-size: 0.78em;
  font-weight: 600;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  margin-left: 0.35em;
  color: #64748b;

  ${({ $login }) =>
    $login &&
    `
    color: #9ca3af;
  `}
`;

export const AuthBrandSubtitle = styled.p`
  margin: 0;
  max-width: 28rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(0.78125rem, 2vw, 0.8125rem);
  font-weight: 400;
  letter-spacing: 0.008em;
  line-height: 1.42;
  text-transform: none;
  color: #8e98a8;

  ${({ $login }) =>
    $login &&
    `
    color: #6b7280;
    font-size: clamp(0.734375rem, 1.8vw, 0.78125rem);
    margin-top: 0.14rem;
    opacity: 0.9;
  `}
`;

export const AuthHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
  padding-top: 0.09375rem;

  @media (min-width: 640px) {
    padding-top: 0;
  }
`;

const headerSecondaryBtn = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-family: 'Inter', system-ui, sans-serif;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #475569 !important;
  background: rgba(255, 255, 255, 0.92) !important;
  border: 1px solid rgba(15, 23, 42, 0.08) !important;
  border-radius: 11px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: #ffffff !important;
    border-color: rgba(15, 23, 42, 0.11) !important;
    color: #0f172a !important;
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.06);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
    &:active {
      transform: none;
    }
  }
`;

export const AuthMateriaisBtn = styled.button`
  ${headerSecondaryBtn}
  padding: 0.38rem 0.72rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const AuthMenuIconBtn = styled.button`
  ${headerSecondaryBtn}
  display: none;
  width: 38px;
  height: 38px;
  padding: 0;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: inline-flex;
  }

  @media (max-width: 639px) {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }
`;

export const AuthCardBody = styled.div`
  padding: clamp(1.38rem, 3.1vw, 1.95rem) clamp(1.15rem, 3vw, 2rem)
    clamp(1.28rem, 3vw, 1.72rem);

  @media (min-width: 480px) {
    padding: clamp(1.45rem, 3vw, 2rem) clamp(1.25rem, 3.2vw, 2.1rem)
      clamp(1.32rem, 3vw, 1.78rem);
  }

  @media (min-width: 640px) {
    padding: clamp(1.44rem, 2.45vw, 1.84rem) clamp(1.36rem, 2.75vw, 1.96rem)
      clamp(1.4rem, 2.55vw, 1.76rem);
  }

  @media (min-width: 1024px) {
    padding: clamp(1.5rem, 2.35vw, 1.9rem) clamp(1.44rem, 2.45vw, 2rem)
      clamp(1.44rem, 2.45vw, 1.82rem);
  }

  @media (max-width: 639px) {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 0;
    padding: 0.7rem max(0.95rem, env(safe-area-inset-right, 0px))
      max(0.6rem, env(safe-area-inset-bottom, 0px))
      max(0.95rem, env(safe-area-inset-left, 0px));
    overflow: hidden;
  }

  ${({ $saas }) =>
    $saas &&
    `
    padding: clamp(1.75rem, 4vw, 2.125rem) clamp(1.5rem, 3.5vw, 1.75rem)
      clamp(1.625rem, 3.5vw, 1.875rem);

    @media (min-width: 640px) {
      padding: 2rem 1.75rem 1.75rem;
    }

    @media (min-width: 1024px) {
      padding: 2.0625rem 1.875rem 1.8125rem;
    }

    @media (max-width: 639px) {
      padding: 1.35rem max(1.1rem, env(safe-area-inset-right, 0px))
        max(1rem, env(safe-area-inset-bottom, 0px))
        max(1.1rem, env(safe-area-inset-left, 0px));
    }
  `}

  ${({ $login }) =>
    $login &&
    `
    padding: 26px 28px 22px;

    @media (min-width: 640px) {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      padding: 28px 32px 24px;
    }

    @media (min-width: 1024px) {
      padding: 28px 32px 24px;
    }

    @media (max-width: 639px) {
      padding: 12px max(16px, env(safe-area-inset-right, 0px))
        max(10px, env(safe-area-inset-bottom, 0px))
        max(16px, env(safe-area-inset-left, 0px));
      overflow: hidden;
    }
  `}
`;

export const AuthContentInner = styled.div`
  width: 100%;
  max-width: min(400px, 100%);
  min-width: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  text-align: left;

  ${({ $saas }) =>
    $saas &&
    `
    max-width: 100%;
  `}

  ${({ $login }) =>
    $login &&
    `
    max-width: 460px;
    flex: 1 1 auto;
    min-height: 100%;
    gap: 0;
  `}

  @media (max-width: 639px) {
    flex: 1 1 auto;
    min-height: 0;
    padding-top: 0;
    max-width: none;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
  }
`;

export const AuthPageTitle = styled.h1`
  margin: 0;
  margin-bottom: ${({ $recoverSpacing, $withSubtitle }) => {
    if ($recoverSpacing) return '0.34375rem';
    if ($withSubtitle) return '0.34375rem';
    return '0.46875rem';
  }};
  font-family: 'Inter', system-ui, sans-serif;
  font-size: ${({ $recoverSpacing }) =>
    $recoverSpacing
      ? 'clamp(1.5625rem, 3.85vw, 1.6875rem)'
      : 'clamp(1.625rem, 4.1vw, 1.796875rem)'};
  font-weight: 700;
  letter-spacing: ${({ $recoverSpacing }) =>
    $recoverSpacing ? '-0.039em' : '-0.037em'};
  line-height: ${({ $recoverSpacing }) => ($recoverSpacing ? '1.17' : '1.15')};
  color: ${({ $recoverSpacing }) => ($recoverSpacing ? '#0b1220' : '#080d18')};

  @media (max-width: 639px) {
    margin-bottom: ${({ $recoverSpacing, $withSubtitle }) => {
      if ($recoverSpacing) return '0.234375rem';
      if ($withSubtitle) return '0.234375rem';
      return '0.3125rem';
    }};
    font-size: ${({ $recoverSpacing }) =>
      $recoverSpacing
        ? 'clamp(1.5rem, 5.2vw, 1.625rem)'
        : 'clamp(1.5rem, 5.4vw, 1.734375rem)'};
    letter-spacing: ${({ $recoverSpacing }) =>
      $recoverSpacing ? '-0.037em' : '-0.034em'};
  }

  ${({ $saas }) =>
    $saas &&
    `
    font-size: clamp(1.375rem, 3.35vw, 1.625rem);
    font-weight: 600;
    letter-spacing: -0.038em;
    line-height: 1.2;
    color: #0f172a;
    margin-top: 0;
    margin-bottom: 1.25rem;

    @media (max-width: 639px) {
      margin-bottom: 1.0625rem;
      font-size: clamp(1.3125rem, 5vw, 1.5rem);
      letter-spacing: -0.036em;
    }
  `}

  ${({ $login, $recoverySpacing }) =>
    $login &&
    `
    font-size: clamp(1.875rem, 4vw, 2.125rem);
    font-weight: 700;
    letter-spacing: -0.038em;
    line-height: 1.08;
    color: #111827;
    margin-bottom: 8px;

    @media (max-width: 639px) {
      font-size: clamp(1.4375rem, 5.4vw, 1.6875rem);
      margin-bottom: 8px;
      letter-spacing: -0.032em;
      line-height: 1.06;
    }
  `}
`;

export const AuthPageSubtitle = styled.p`
  margin: 0;
  margin-bottom: ${({ $recoverSpacing }) =>
    $recoverSpacing
      ? 'clamp(0.98rem, 2.85vw, 1.32rem)'
      : 'clamp(1.0625rem, 3vw, 1.4375rem)'};
  font-family: 'Inter', system-ui, sans-serif;
  font-size: ${({ $recoverSpacing }) =>
    $recoverSpacing ? '0.9375rem' : '0.8828125rem'};
  font-weight: 400;
  letter-spacing: ${({ $recoverSpacing }) =>
    $recoverSpacing ? '-0.011em' : '-0.005em'};
  line-height: ${({ $recoverSpacing }) => ($recoverSpacing ? '1.5' : '1.48')};
  color: #657287;

  @media (max-width: 639px) {
    margin-bottom: ${({ $recoverSpacing }) =>
      $recoverSpacing ? 'clamp(0.72rem, 2.4vw, 1rem)' : 'clamp(0.78rem, 2.55vw, 1.08rem)'};
    font-size: ${({ $recoverSpacing }) =>
      $recoverSpacing ? '0.9375rem' : '0.8984375rem'};
  }

  ${({ $login, $recoverySpacing }) =>
    $login &&
    `
    max-width: 32rem;
    margin-bottom: 24px;
    color: #6b7280;
    font-size: 0.90625rem;
    line-height: 1.58;

    @media (max-width: 639px) {
      margin-bottom: 24px;
      font-size: 0.875rem;
      line-height: 1.46;
    }
  `}
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5625rem;

  @media (max-width: 639px) {
    flex: 1 1 auto;
    min-height: 0;
    gap: 0.5rem;
  }
`;

/** Login, recuperar senha e fluxos irmãos — ritmo vertical intencional. */
export const AuthFlowForm = styled(AuthForm)`
  gap: 0.59375rem;
  margin-top: 0.0625rem;

  @media (min-width: 640px) {
    gap: 0.625rem;
    margin-top: 0.09375rem;
  }

  @media (max-width: 639px) {
    gap: 0.5625rem;
    margin-top: 0.0625rem;
  }
`;

/** Login SaaS: mais espaço entre campos e ações. */
export const AuthFlowFormSaaS = styled(AuthFlowForm)`
  gap: 0.75rem;
  margin-top: 0.125rem;

  @media (min-width: 640px) {
    gap: 0.875rem;
    margin-top: 0.1875rem;
  }

  @media (max-width: 639px) {
    gap: 0.6875rem;
  }
`;

export const AuthLoginForm = styled(AuthFlowFormSaaS)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 0;
`;

export const AuthLoginFieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const AuthLoginActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-top: 8px;
`;

export const AuthRememberRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #56606b;
  user-select: none;
  margin: 0.25rem 0 0;
  padding: 0.09375rem 0;

  ${({ $login }) =>
    $login &&
    `
    margin: 0;
    padding: 0.03125rem 0 0;
    gap: 0.5rem;
    color: #6b7280;
    font-size: 0.84375rem;
    letter-spacing: -0.01em;
    line-height: 1.35;
  `}

  input {
    width: 1rem;
    height: 1rem;
    border-radius: 4px;
    accent-color: #6d5df6;
    cursor: pointer;
  }

  ${({ $login }) =>
    $login &&
    `
    input {
      appearance: none;
      -webkit-appearance: none;
      display: inline-grid;
      place-content: center;
      width: 1rem;
      height: 1rem;
      margin: 0;
      flex-shrink: 0;
      border-radius: 0.3125rem;
      border: 1px solid #d1d5db;
      background: #ffffff;
      box-shadow:
        0 1px 1px rgba(17, 24, 39, 0.06),
        0 0 0 1px rgba(255, 255, 255, 0.85) inset;
      transition:
        background 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;
    }

    input::before {
      content: '';
      width: 0.56rem;
      height: 0.56rem;
      border-radius: 0.18rem;
      transform: scale(0);
      transition: transform 0.2s ease;
      box-shadow: inset 1em 1em #5e56ea;
    }

    input:hover {
      border-color: #9ca3af;
      box-shadow:
        0 3px 8px -5px rgba(15, 23, 42, 0.22),
        0 1px 0 rgba(255, 255, 255, 0.95) inset;
    }

    input:focus-visible {
      outline: none;
      border-color: rgba(99, 102, 241, 0.42);
      box-shadow:
        0 0 0 4px rgba(99, 102, 241, 0.12),
        0 3px 8px -5px rgba(15, 23, 42, 0.2);
    }

    input:checked {
      border-color: rgba(99, 102, 241, 0.5);
      background: #eef2ff;
      box-shadow:
        0 0 0 3px rgba(99, 102, 241, 0.08),
        0 3px 8px -5px rgba(94, 86, 234, 0.25);
    }

    input:checked::before {
      transform: scale(1);
    }

    span {
      display: inline-flex;
      align-items: center;
      min-height: 1.25rem;
    }
  `}

  @media (max-width: 639px) {
    min-height: 44px;
    margin: 0.125rem 0 0;
    padding: 0.375rem 0;
    font-size: 0.875rem;
    gap: 0.55rem;

    input {
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
    }
  }
`;

/** Texto do botão primário: largura mínima estável no loading (login). */
export const AuthFlowButtonLabel = styled.span`
  display: inline-block;
  min-width: 7.25rem;
  text-align: center;
`;

/** Variação para rótulos mais longos (ex.: recuperar senha, ícone + texto). */
export const AuthFlowButtonLabelWide = styled(AuthFlowButtonLabel)`
  min-width: 9.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
`;

export const AuthInputRow = styled.div`
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  min-height: 56px;
  height: auto;
  padding: 0 0.9rem 0 0.45rem;
  gap: 0.25rem;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 14px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.035),
    0 10px 24px -18px rgba(15, 23, 42, 0.18);
  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;

  &:hover:not(:focus-within) {
    background: #ffffff;
    border-color: rgba(100, 116, 139, 0.24);
    box-shadow:
      0 2px 4px rgba(15, 23, 42, 0.04),
      0 16px 26px -20px rgba(15, 23, 42, 0.2);
  }

  &:focus-within {
    background: #ffffff;
    border-color: rgba(99, 102, 241, 0.26);
    box-shadow:
      0 0 0 4px rgba(99, 102, 241, 0.12),
      0 2px 6px rgba(15, 23, 42, 0.04),
      0 16px 32px -22px rgba(99, 102, 241, 0.32);
  }

  &:focus-within .auth-field-icon {
    color: #6d5df6;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
  }

  ${({ $success, $invalid }) =>
    $success &&
    !$invalid &&
    `
    border-color: rgba(16, 185, 129, 0.18);

    &:not(:focus-within) {
      background: linear-gradient(180deg, #fbfefd 0%, #f6fcfa 100%);
      border-color: rgba(45, 140, 105, 0.24);
      box-shadow:
        0 0 0 3px rgba(16, 185, 129, 0.07),
        0 10px 22px -18px rgba(15, 23, 42, 0.14);
    }

    &:hover:not(:focus-within) {
      background: linear-gradient(180deg, #f8fcfa 0%, #f2fbf7 100%);
      border-color: rgba(45, 140, 105, 0.3);
      box-shadow:
        0 0 0 3px rgba(16, 185, 129, 0.08),
        0 12px 24px -20px rgba(15, 23, 42, 0.16);
    }

    &:not(:focus-within) .auth-field-icon {
      color: #4a9b7a;
    }
  `}

  ${({ $invalid }) =>
    $invalid &&
    `
    background: linear-gradient(180deg, #fffdfd 0%, #fef8f8 100%);
    border-color: rgba(239, 68, 68, 0.18);
    box-shadow:
      0 0 0 3px rgba(239, 68, 68, 0.05),
      0 8px 20px -18px rgba(239, 68, 68, 0.28);

    &:hover:not(:focus-within) {
      background: linear-gradient(180deg, #fffafa 0%, #fef4f4 100%);
      border-color: rgba(239, 68, 68, 0.24);
      box-shadow:
        0 0 0 3px rgba(239, 68, 68, 0.06),
        0 12px 22px -18px rgba(239, 68, 68, 0.22);
    }

    &:focus-within {
      background: #ffffff;
      border-color: rgba(239, 68, 68, 0.26);
      box-shadow:
        0 0 0 4px rgba(239, 68, 68, 0.1),
        0 2px 6px rgba(15, 23, 42, 0.04),
        0 16px 30px -22px rgba(239, 68, 68, 0.28);
    }

    & .auth-field-icon {
      color: rgba(220, 38, 38, 0.86);
    }
  `}

  @media (max-width: 639px) {
    min-height: 56px;
    padding: 0 0.82rem 0 0.3rem;
    border-radius: 13px;
  }

  ${({ $login }) =>
    $login &&
    `
    min-height: 52px;
    padding: 0 0.95rem 0 0.78rem;
    gap: 0.42rem;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 16px;
    box-shadow:
      0 1px 2px rgba(17, 24, 39, 0.05),
      0 6px 14px -16px rgba(17, 24, 39, 0.16);
    transition:
      border-color 0.16s ease,
      box-shadow 0.16s ease,
      background 0.16s ease;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      background: none;
      opacity: 0;
      transition: all 0.2s ease;
    }

    &:hover:not(:focus-within) {
      background: #ffffff;
      border-color: #9ca3af;
      box-shadow:
        0 2px 4px rgba(17, 24, 39, 0.06),
        0 10px 18px -18px rgba(17, 24, 39, 0.16);
    }

    &:focus-within {
      background: #ffffff;
      border-color: #7c3aed;
      box-shadow:
        0 0 0 3px rgba(124, 58, 237, 0.12),
        0 2px 6px rgba(17, 24, 39, 0.08),
        0 12px 22px -20px rgba(124, 58, 237, 0.28);
    }

    &:focus-within .auth-field-icon {
      color: #7c3aed;
      opacity: 0.9;
      transform: none;
    }

    @media (max-width: 639px) {
      min-height: 52px;
      padding: 0 0.92rem 0 0.74rem;
      gap: 0.4rem;
    }
  `}

  ${({ $login, $success, $invalid }) =>
    $login &&
    $success &&
    !$invalid &&
    `
    border-color: rgba(74, 155, 122, 0.14);

    &:not(:focus-within) {
      background: linear-gradient(180deg, #fcfefd 0%, #f8fcfa 100%);
      box-shadow:
        0 0 0 3px rgba(16, 185, 129, 0.035),
        0 6px 14px -18px rgba(15, 23, 42, 0.1);
    }
  `}

  ${({ $login, $invalid }) =>
    $login &&
    $invalid &&
    `
    background: linear-gradient(180deg, #fffefe 0%, #fdf8f8 100%);
    border-color: rgba(220, 95, 95, 0.16);
    box-shadow:
      0 0 0 3px rgba(220, 95, 95, 0.03),
      0 6px 14px -18px rgba(220, 95, 95, 0.1);

    &:focus-within {
      border-color: rgba(220, 95, 95, 0.2);
      box-shadow:
        0 0 0 3px rgba(220, 95, 95, 0.055),
        0 4px 10px -10px rgba(15, 23, 42, 0.1),
        0 10px 18px -18px rgba(220, 95, 95, 0.1);
    }
  `}
`;

/** Ícones React (ex.: react-icons) — mesma hierarquia visual que AuthInputIcon */
export const AuthFieldIconWrap = styled.span.attrs({
  className: 'auth-field-icon',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  align-self: stretch;
  color: #64748b;
  line-height: 0;
  transition: color 0.2s ease;

  svg {
    width: 1.0625rem;
    height: 1.0625rem;
    flex-shrink: 0;
  }

  @media (max-width: 639px) {
    width: 40px;

    svg {
      width: 1.125rem;
      height: 1.125rem;
    }
  }
`;

export const AuthPremiumFieldIconSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  align-self: center;

  @media (max-width: 639px) {
    width: 40px;
  }

  ${({ $login }) =>
    $login &&
    `
    width: 32px;
    align-self: center;
    position: relative;
    z-index: 1;
    opacity: 0.56;
    transition: color 0.16s ease, opacity 0.16s ease;

    @media (max-width: 639px) {
      width: 32px;
    }
  `}
`;

export const AuthPremiumFieldBody = styled.div`
  flex: 1;
  min-width: 0;
  align-self: stretch;
  position: relative;
  display: flex;
  align-items: ${({ $floating }) => ($floating ? 'stretch' : 'center')};
  min-height: 0;
`;

export const AuthPremiumFieldLabel = styled.label`
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transform-origin: left center;
  transition:
    top 0.2s ease,
    transform 0.2s ease,
    font-size 0.2s ease,
    color 0.2s ease,
    letter-spacing 0.2s ease,
    font-weight 0.2s ease;

  ${({ $floating, $invalid }) =>
    $floating
      ? `
    top: 0.58rem;
    transform: scale(0.91);
    transform-origin: left top;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.028em;
    color: ${
      $invalid ? 'rgba(220, 38, 38, 0.84)' : 'rgba(94, 86, 234, 0.88)'
    };
  `
      : `
    top: 50%;
    transform: translateY(-50%) scale(1);
    transform-origin: left center;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: -0.011em;
    color: ${
      $invalid ? 'rgba(153, 27, 27, 0.82)' : 'rgba(100, 116, 139, 0.92)'
    };
  `}

  @media (max-width: 639px) {
    ${({ $floating }) =>
      !$floating &&
      `
      font-size: 1rem;
      letter-spacing: -0.012em;
    `}
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
  }

  ${({ $login, $floating, $invalid }) =>
    $login &&
    ($floating
      ? `
    top: 0.44rem;
    transform: translateY(0) scale(0.9);
    transform-origin: left top;
    font-size: 0.65625rem;
    font-weight: 600;
    letter-spacing: 0.018em;
    color: ${$invalid ? 'rgba(194, 90, 90, 0.82)' : 'rgba(91, 84, 232, 0.72)'};
  `
      : `
    top: 50%;
    transform: translateY(calc(-50% + 0.5px)) scale(1);
    transform-origin: left center;
    font-size: 0.90625rem;
    font-weight: 500;
    letter-spacing: -0.014em;
    color: ${$invalid ? 'rgba(133, 76, 76, 0.74)' : 'rgba(100, 116, 139, 0.76)'};
  `)}
`;

export const AuthPremiumFieldControl = styled.input`
  flex: 1;
  min-width: 0;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.013em;
  color: #0f172a;
  line-height: 1.33;
  box-sizing: border-box;
  transition:
    padding 0.2s ease,
    color 0.2s ease;

  ${({ $floating }) =>
    $floating
      ? `
    padding: 1.03rem 0 0.29rem 0;
    align-self: stretch;
  `
      : `
    padding: 0;
    align-self: center;
  `}

  &::placeholder {
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:focus::placeholder {
    opacity: 1;
    color: #94a3b8;
    font-weight: 500;
    font-size: 0.875rem;
  }

  @media (max-width: 639px) {
    font-size: 1rem;
    letter-spacing: -0.015em;
    line-height: 1.35;

    ${({ $floating }) =>
      $floating
        ? `
      padding: 1.08rem 0 0.3rem 0;
    `
        : ''}

    &:focus::placeholder {
      font-size: 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
    &::placeholder {
      transition-duration: 0.12s;
    }
  }

  ${({ $login, $floating }) =>
    $login &&
    ($floating
      ? `
    padding: 0.96rem 0 0.04rem 0;
    align-self: stretch;
  `
      : `
    padding: 0.04rem 0 0;
    align-self: center;
  `)}

  ${({ $login }) =>
    $login &&
    `
    position: relative;
    z-index: 1;
    font-size: 0.9375rem;
    font-weight: 500;
    letter-spacing: -0.016em;
    line-height: 1.3;
    color: #111827;
    transition: all 0.2s ease;

    &::placeholder {
      color: #9ca3af;
      font-weight: 500;
      letter-spacing: -0.013em;
      opacity: 1;
    }

    &:focus::placeholder {
      opacity: 1;
      color: #9ca3af;
      font-size: 0.875rem;
    }
  `}
`;

export const AuthInputIcon = styled(FontAwesomeIcon).attrs({
  className: 'auth-field-icon',
})`
  color: #64748b;
  opacity: 0.6;
  font-size: 0.92rem;
  width: 0.96rem;
  flex-shrink: 0;
  display: block;
  line-height: 1;
  transition:
    color 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
`;

export const AuthInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.014em;
  color: #1e293b;
  line-height: 1.25;
  padding: 0;

  &::placeholder {
    color: #98a2b3;
    font-weight: 500;
  }
`;

export const PremiumInputWrapper = styled(AuthInputRow)``;

export const PremiumInputIcon = styled(AuthInputIcon)``;

export const PremiumFieldInput = styled(AuthInput)``;

export const AuthFieldError = styled.p`
  margin: 0.04rem 0 0;
  padding: 0 0.15rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
  color: #b91c1c;
  min-height: ${({ $show }) => ($show ? 'auto' : '0')};
  max-height: ${({ $show }) => ($show ? '3rem' : '0')};
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  overflow: hidden;
  transition:
    opacity 0.2s ease,
    max-height 0.2s ease;
`;

export const AuthPremiumFieldRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.203125rem;
  width: 100%;

  @media (max-width: 639px) {
    gap: 0.25rem;
  }
`;

/** Reserva altura para mensagens sob o campo — evita salto quando o texto aparece. */
export const AuthPremiumFieldFeedbackSlot = styled.div`
  min-height: 1.3125rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-shrink: 0;
`;

export const AuthPremiumInlineError = styled.p`
  margin: 0;
  padding: 0.125rem 0 0 0.5rem;
  margin-left: 0.1rem;
  border-left: 2px solid rgba(168, 142, 152, 0.45);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.71875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.46;
  color: rgba(105, 92, 98, 0.94);
  animation: ${authInlineFeedbackIn} 0.28s ease-out both;

  @media (max-width: 639px) {
    font-size: 0.75rem;
    line-height: 1.45;
    padding: 0.15rem 0 0 0.48rem;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  ${({ $login }) =>
    $login &&
    `
    padding: 0.14rem 0 0 0.45rem;
    border-left: 2px solid rgba(212, 118, 118, 0.3);
    font-size: 0.7109375rem;
    letter-spacing: 0.006em;
    color: rgba(126, 95, 95, 0.9);
  `}
`;

/** Feedback positivo opcional sob o campo (discreto). */
export const AuthPremiumInlineSuccess = styled.p`
  margin: 0;
  padding: 0.125rem 0 0 0.5rem;
  margin-left: 0.1rem;
  border-left: 2px solid rgba(82, 148, 118, 0.38);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.71875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.46;
  color: rgba(55, 95, 78, 0.9);
  animation: ${authInlineFeedbackIn} 0.28s ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const AuthFormAlert = styled.p`
  margin: 0;
  padding: 0.75rem 0.875rem 0.75rem 0.9375rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  text-align: left;
  line-height: 1.45;
  letter-spacing: 0.006em;
  color: #475569;
  background: rgba(248, 250, 252, 0.96);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-left: 3px solid rgba(94, 86, 234, 0.3);
  box-shadow: 0 8px 20px -18px rgba(15, 23, 42, 0.18);
  animation: ${authFormAlertEnter} 0.32s ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const AuthPrimaryButton = styled.button`
  margin-top: 0;
  width: 100%;
  min-height: 48px;
  height: 48px;
  padding: 0 1.25rem;
  box-sizing: border-box;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.9296875rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.21;
  color: #fafbfd;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  background: linear-gradient(180deg, #6d5df6 0%, #4f6ef7 100%);
  transition:
    background 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease;

  ${({ $flat }) =>
    $flat
      ? css`
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.07);

          &:hover:not(:disabled) {
            background: linear-gradient(180deg, #7565fb 0%, #5573fb 100%);
            transform: translateY(-1px);
            box-shadow:
              0 2px 4px rgba(15, 23, 42, 0.08),
              0 14px 24px -18px rgba(79, 110, 247, 0.42);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            background: linear-gradient(180deg, #5d4ee8 0%, #4665e8 100%);
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
            transition-duration: 0.12s;
          }
        `
      : css`
          box-shadow:
            0 1px 2px rgba(15, 23, 42, 0.055),
            0 10px 24px -10px rgba(79, 110, 247, 0.34),
            0 18px 30px -20px rgba(109, 93, 246, 0.24),
            0 1px 0 rgba(255, 255, 255, 0.11) inset;

          &:hover:not(:disabled) {
            background: linear-gradient(180deg, #7667fb 0%, #5674fb 100%);
            transform: translateY(-1px);
            box-shadow:
              0 2px 5px rgba(15, 23, 42, 0.065),
              0 16px 30px -18px rgba(79, 110, 247, 0.42),
              0 24px 36px -28px rgba(109, 93, 246, 0.34),
              0 1px 0 rgba(255, 255, 255, 0.13) inset;
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            background: linear-gradient(180deg, #6152ea 0%, #4867ea 100%);
            box-shadow:
              0 1px 2px rgba(15, 23, 42, 0.065),
              0 3px 12px -3px rgba(79, 110, 247, 0.34);
            transition-duration: 0.12s;
          }
        `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
    background: #a8a2e8;

    ${({ $loading }) =>
      $loading &&
      `
      opacity: 1;
      cursor: wait;
      background: #5249d8;
      transform: none;
      box-shadow:
        0 1px 2px rgba(15, 23, 42, 0.055),
        0 10px 20px -14px rgba(94, 86, 234, 0.34);
    `}
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
    &:hover:not(:disabled) {
      transform: none;
    }
    &:active:not(:disabled) {
      transform: none;
    }
  }

  @media (max-width: 639px) {
    flex-shrink: 0;
    min-height: 54px;
    height: auto;
    margin-top: 0.5rem;
    padding: 0.7rem 1.2rem;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.019em;
  border-radius: 5px;

    ${({ $flat }) =>
      $flat
        ? css`
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.07);

            &:hover:not(:disabled) {
              background: #5248d6;
              transform: translateY(-1px);
              box-shadow:
                0 2px 4px rgba(15, 23, 42, 0.08),
                0 4px 16px -2px rgba(94, 86, 234, 0.32);
            }

            &:active:not(:disabled) {
              transform: translateY(0);
              background: #4a42c5;
              box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
            }
          `
        : css`
            box-shadow:
              0 1px 2px rgba(15, 23, 42, 0.06),
              0 6px 20px -4px rgba(94, 86, 234, 0.36),
              0 1px 0 rgba(255, 255, 255, 0.12) inset;

            &:hover:not(:disabled) {
              transform: translateY(-1px);
            }
          `}
  }

  ${({ $login }) =>
    $login &&
    `
    margin-top: 0;
    min-height: 52px;
    height: 52px;
    border-radius: 5px;
    font-size: 0.96875rem;
    font-weight: 700;
    letter-spacing: -0.024em;
    background: #1c1c1e;
    box-shadow:
      0 6px 16px -10px rgba(17, 24, 39, 0.32),
      0 12px 24px -20px rgba(17, 24, 39, 0.24),
      0 1px 0 rgba(255, 255, 255, 0.14) inset;

    &:hover:not(:disabled) {
      background: #2a2a2d;
      transform: translateY(-1px);
      box-shadow:
        0 12px 24px -14px rgba(15, 23, 42, 0.32),
        0 18px 36px -28px rgba(15, 23, 42, 0.22),
        0 1px 0 rgba(255, 255, 255, 0.18) inset;
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
      background: #141417;
      box-shadow:
        0 6px 14px -12px rgba(15, 23, 42, 0.28),
        0 10px 20px -20px rgba(15, 23, 42, 0.18);
    }

    &:disabled {
      opacity: 1;
      color: rgba(250, 251, 253, 0.9);
      background: #b6bcc6;
      box-shadow:
        0 4px 10px -8px rgba(15, 23, 42, 0.12),
        0 1px 0 rgba(255, 255, 255, 0.14) inset;
    }

    @media (max-width: 639px) {
      min-height: 52px;
      height: 52px;
      margin-top: 0;
      padding: 0 1.2rem;
  border-radius: 5px;
    }
  `}
`;

export const AuthRecoverForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin: 0;
  padding: 0;
  width: 100%;
  flex-shrink: 0;
  border: none;
  background: transparent;

  & > ${AuthPrimaryButton} {
    margin-top: 0;
    flex-shrink: 0;
  }

  @media (max-width: 639px) {
    flex: 0 0 auto;
  }
`;

export const AuthRecoverLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  flex: 0 0 auto;
  width: 100%;
  padding-top: 16px;
  box-sizing: border-box;

  @media (max-width: 639px) {
    flex: 1;
    min-height: 0;
    padding-top: 0.75rem;
  }
`;

export const AuthRecoverMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-shrink: 0;
  width: 100%;
`;

export const AuthRecoverSecondary = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  margin-top: 16px;

  @media (max-width: 639px) {
    margin-top: 0.75rem;
  }
`;

export const AuthRecoverFooter = styled.footer`
  margin-top: 0.95rem;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const AuthButtonSpinner = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  border: 2.25px solid rgba(255, 255, 255, 0.28);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${authSpin} 0.7s linear infinite;
  box-sizing: border-box;
  vertical-align: middle;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.4s;
  }
`;

const authAuxLinkShared = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.32rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.36;
  color: #56606b;
  text-decoration: none;
  text-underline-offset: 0.22em;
  text-decoration-thickness: 1px;
  text-decoration-color: transparent;
  padding: 0.4rem 0.55rem;
  margin: 0 -0.15rem;
  border-radius: 8px;
  -webkit-tap-highlight-color: transparent;
  transition:
    color 0.2s ease,
    text-decoration-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    color: #3f4a54;
    text-decoration: underline;
    text-decoration-color: rgba(63, 74, 84, 0.35);
  }

  &:active {
    color: #323c45;
    text-decoration-color: rgba(50, 60, 69, 0.42);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    color: #3d4480;
    text-decoration: underline;
    text-decoration-color: rgba(61, 68, 128, 0.28);
    background: rgba(99, 102, 241, 0.07);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.22);
  }

  @media (max-width: 639px) {
    font-size: 0.90625rem;
    font-weight: 600;
    line-height: 1.38;
    padding: 0.48rem 0.62rem;
    min-height: 44px;
    border-radius: 9px;
  }
`;

const authLoginAuxLinkShared = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 50%;
  min-width: 0;
  min-height: 2.875rem;
  padding: 0.75rem 0.9rem;
  margin: 0;
  border-radius: 0;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.828125rem;
  font-weight: 500;
  letter-spacing: -0.012em;
  line-height: 1.3;
  color: #334155;
  text-decoration: none;
  background: #f8fafc;
  border: 1px solid transparent;
  box-shadow: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: #1f2937;
    background: #f1f5f9;
  }

  &:active {
    background: #eef2f7;
    transform: translateY(0);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    color: #1f2937;
    background: #f1f5f9;
    border-color: rgba(129, 140, 248, 0.18);
    box-shadow:
      0 0 0 3px rgba(99, 102, 241, 0.1),
      0 4px 12px -12px rgba(15, 23, 42, 0.12);
  }

  &:only-child {
    flex-basis: 100%;
  }

  @media (max-width: 639px) {
    flex: 1 1 0;
    min-height: 3rem;
    padding: 0.75rem 0.875rem;
    font-size: 0.90625rem;
  }
`;

export const AuthAuxLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  column-gap: 0.328125rem;
  row-gap: 0.1875rem;
  margin-top: clamp(1rem, 2.75vw, 1.3125rem);
  padding: 0.109375rem 0 0.171875rem;
  max-width: min(400px, 100%);
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 640px) {
    margin-top: clamp(1.0625rem, 2.4vw, 1.25rem);
    padding: 0.046875rem 0 0.234375rem;
    column-gap: 0.3125rem;
  }

  @media (max-width: 639px) {
    max-width: none;
    width: 100%;
    margin-top: clamp(0.65rem, 2.4vw, 0.9rem);
    padding: 0.0625rem 0 0.125rem;
    flex-shrink: 0;
    column-gap: 0.2rem;
    row-gap: 0.35rem;
    align-content: center;
  }
`;

export const AuthAuxLinksSaaS = styled(AuthAuxLinks)`
  margin-top: clamp(1.125rem, 2.8vw, 1.5rem);
  max-width: 100%;

  @media (min-width: 640px) {
    margin-top: clamp(1.1875rem, 2.5vw, 1.4375rem);
  }

  @media (max-width: 639px) {
    margin-top: clamp(0.95rem, 2.8vw, 1.2rem);
  }
`;

export const AuthLoginAuxLinks = styled(AuthAuxLinksSaaS)`
  width: 100%;
  max-width: none;
  margin-top: clamp(1rem, 2.45vw, 1.25rem);
  justify-content: space-between;
  flex-wrap: nowrap;
  column-gap: 0;
  row-gap: 0;
  padding: 0;
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 639px) {
    margin-top: 0;
    justify-content: space-between;
    column-gap: 0;
    row-gap: 0;
  }
`;

export const AuthAuxLink = styled.a`
  ${authAuxLinkShared}
`;

export const AuthAuxRouterLink = styled(Link)`
  ${authAuxLinkShared}
`;

export const AuthLoginAuxRouterLink = styled(Link)`
  ${authLoginAuxLinkShared}
`;

export const AuthAuxDivider = styled.span`
  flex-shrink: 0;
  width: 1px;
  height: 0.75rem;
  align-self: center;
  background: rgba(15, 23, 42, 0.1);
  border-radius: 1px;
  margin: 0 0.12rem;
  pointer-events: none;

  @media (max-width: 380px) {
    display: none;
  }
`;

export const AuthLoginAuxDivider = styled(AuthAuxDivider)`
  align-self: stretch;
  height: auto;
  background: rgba(148, 163, 184, 0.28);
  margin: 0;
`;

export const AuthStatusSlot = styled.div`
  margin-top: 0.38rem;
  padding-top: 0.32rem;
  display: flex;
  justify-content: center;

  ${({ $inFooter }) =>
    $inFooter &&
    `
    margin-top: 0;
    padding-top: 0.28rem;
    padding-bottom: max(0.28rem, env(safe-area-inset-bottom, 0px));
  `}

  @media (max-width: 639px) {
    margin-top: ${({ $inFooter }) => ($inFooter ? 0 : 'auto')};
    padding-top: ${({ $inFooter }) => ($inFooter ? '0.28rem' : '0.4rem')};
    padding-bottom: ${({ $inFooter }) =>
      $inFooter
        ? `max(0.28rem, env(safe-area-inset-bottom, 0px))`
        : `max(0.45rem, env(safe-area-inset-bottom, 0px))`};
    flex-shrink: 0;
  }
`;

export const AuthMenuBackdrop = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(15, 16, 32, 0.45);
  backdrop-filter: blur(4px);
  animation: ${authFadeOverlay} 0.2s ease both;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? 'block' : 'none')};
  }
`;

export const AuthMenuPanel = styled.aside`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(300px, 88vw);
  z-index: 1101;
  padding: 1.2rem 1rem;
  background: linear-gradient(185deg, #1a1b2e 0%, #12131f 100%);
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: -16px 0 40px rgba(0, 0, 0, 0.28);
  flex-direction: column;
  gap: 0.65rem;
  animation: ${authSlideDrawer} 0.2s ease both;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
  }
`;

export const AuthDrawerBtn = styled.button`
  width: 100%;
  justify-content: center;
  padding: 0.72rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #e8e9f0 !important;
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background: rgba(109, 93, 246, 0.22) !important;
    border-color: rgba(109, 93, 246, 0.3) !important;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.12s;
    &:active {
      transform: none;
    }
  }
`;

export const AuthDrawerFooter = styled.footer`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

export const AuthInstagramLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(226, 227, 245, 0.72);
  text-decoration: none;
  padding: 0.35rem 0.1rem;
  border-radius: 8px;
  transition: color 0.2s ease, background 0.2s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
  }

  svg {
    font-size: 1.05rem;
    flex-shrink: 0;
    color: rgba(167, 139, 250, 0.85);
  }
`;

import React, { useEffect, useState } from 'react';
import { FiDownload, FiMenu } from 'react-icons/fi';
import { FaInstagram } from 'react-icons/fa';
import {
  AuthPageShell,
  AuthAmbient,
  AuthLayoutColumn,
  AuthSaaSCardTopBar,
  AuthSaaSIdentityBlock,
  AuthSaaSIdentityLine,
  AuthSaaSIdentityMark,
  AuthSaaSIdentityName,
  AuthSaaSIdentityYear,
  AuthSaaSIdentityTagline,
  AuthSaaSCardTopActions,
  AuthSaaSMateriaisLink,
  AuthSaaSMenuIconBtn,
  AuthCardWrap,
  AuthCard,
  AuthCardHeader,
  AuthBrandBlock,
  AuthBrandTitle,
  AuthBrandOrdinal,
  AuthBrandName,
  AuthBrandYear,
  AuthBrandSubtitle,
  AuthHeaderActions,
  AuthMateriaisBtn,
  AuthMenuIconBtn,
  AuthCardBody,
  AuthContentInner,
  AuthPageTitle,
  AuthPageSubtitle,
  AuthMenuBackdrop,
  AuthMenuPanel,
  AuthDrawerBtn,
  AuthDrawerFooter,
  AuthInstagramLink,
} from './authStyles';

/**
 * Layout premium partilhado por login, registo, recuperação e redefinição de senha.
 *
 * @param {object} props
 * @param {React.ReactNode} props.title — Título da página (ex.: "Entrar")
 * @param {React.ReactNode} [props.subtitle] — Texto de apoio opcional
 * @param {boolean} [props.recoverSpacing] — Ritmo tipográfico para fluxos tipo recuperar senha
 * @param {'default'|'saas'} [props.variant] — `saas`: login com identidade e ações no topo do cartão
 * @param {'default'|'login'} [props.layoutPreset] — Ajustes pontuais de proporção/estrutura
 * @param {React.ReactNode} props.children — Formulário, links auxiliares, etc.
 */
const AuthLayout = ({
  title,
  subtitle,
  recoverSpacing = false,
  variant = 'default',
  layoutPreset = 'default',
  brandMode = 'default',
  spacingMode = 'default',
  showUtilityActions = true,
  children,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const withSubtitle = Boolean(subtitle);
  const isSaaS = variant === 'saas';
  const isLogin = layoutPreset === 'login';
  const isMutedBrand = brandMode === 'muted';
  const isRecoverySpacing = spacingMode === 'recovery';

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const materiaisMenuButtons = (
    <>
      {showUtilityActions ? (
        <>
          <AuthMateriaisBtn type="button" onClick={() => {}}>
            <FiDownload size={15} aria-hidden strokeWidth={2.25} />
            Materiais
          </AuthMateriaisBtn>
          <AuthMenuIconBtn
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu e materiais"
          >
            <FiMenu size={19} aria-hidden strokeWidth={2.25} />
          </AuthMenuIconBtn>
        </>
      ) : null}
    </>
  );

  const headerBrandAndActions = (
    <>
      <AuthBrandBlock $login={isLogin}>
        <AuthBrandTitle $login={isLogin} $mutedBrand={isMutedBrand}>
          <AuthBrandOrdinal $login={isLogin} $mutedBrand={isMutedBrand}>46º</AuthBrandOrdinal>
          <AuthBrandName $login={isLogin} $mutedBrand={isMutedBrand}>COMEJACA</AuthBrandName>
          <AuthBrandYear $login={isLogin}>2025</AuthBrandYear>
        </AuthBrandTitle>
        <AuthBrandSubtitle $login={isLogin}>Sistema de inscrições</AuthBrandSubtitle>
      </AuthBrandBlock>
      {showUtilityActions ? <AuthHeaderActions>{materiaisMenuButtons}</AuthHeaderActions> : null}
    </>
  );

  const saasCardTop = (
    <AuthSaaSCardTopBar>
      <AuthSaaSIdentityBlock>
        <AuthSaaSIdentityLine>
          <AuthSaaSIdentityMark>46º</AuthSaaSIdentityMark>
          <AuthSaaSIdentityName>COMEJACA</AuthSaaSIdentityName>
          <AuthSaaSIdentityYear>2025</AuthSaaSIdentityYear>
        </AuthSaaSIdentityLine>
        <AuthSaaSIdentityTagline>Sistema de inscrições</AuthSaaSIdentityTagline>
      </AuthSaaSIdentityBlock>
      {showUtilityActions ? (
        <AuthSaaSCardTopActions>
          <AuthSaaSMateriaisLink type="button" onClick={() => {}}>
            <FiDownload size={14} aria-hidden strokeWidth={2.25} />
            Materiais
          </AuthSaaSMateriaisLink>
          <AuthSaaSMenuIconBtn
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu e materiais"
          >
            <FiMenu size={18} aria-hidden strokeWidth={2.25} />
          </AuthSaaSMenuIconBtn>
        </AuthSaaSCardTopActions>
      ) : null}
    </AuthSaaSCardTopBar>
  );

  const pageBody = (
    <>
      {isSaaS ? saasCardTop : null}
      <AuthPageTitle
        $saas={isSaaS}
        $login={isLogin}
        $recoverySpacing={isRecoverySpacing}
        $withSubtitle={withSubtitle}
        $recoverSpacing={recoverSpacing}
      >
        {title}
      </AuthPageTitle>
      {subtitle != null && subtitle !== '' ? (
        <AuthPageSubtitle
          $recoverSpacing={recoverSpacing}
          $login={isLogin}
          $recoverySpacing={isRecoverySpacing}
        >
          {subtitle}
        </AuthPageSubtitle>
      ) : null}
      {children}
    </>
  );

  const card = (
    <AuthCardWrap $saas={isSaaS} $login={isLogin}>
      <AuthCard $login={isLogin}>
        {!isSaaS ? (
          <AuthCardHeader $login={isLogin}>{headerBrandAndActions}</AuthCardHeader>
        ) : null}
        <AuthCardBody $saas={isSaaS} $login={isLogin}>
          <AuthContentInner $saas={isSaaS} $login={isLogin}>
            {pageBody}
          </AuthContentInner>
        </AuthCardBody>
      </AuthCard>
    </AuthCardWrap>
  );

  return (
    <AuthPageShell $saas={isSaaS} $login={isLogin}>
      <AuthAmbient $login={isLogin} />
      {isSaaS ? (
        <AuthLayoutColumn $saas $login={isLogin}>
          {card}
        </AuthLayoutColumn>
      ) : (
        card
      )}

      {showUtilityActions ? (
        <>
          <AuthMenuBackdrop $open={menuOpen} onClick={() => setMenuOpen(false)} />
          <AuthMenuPanel
            $open={menuOpen}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <AuthDrawerBtn type="button" onClick={() => setMenuOpen(false)}>
              <FiDownload size={18} aria-hidden />
              Materiais
            </AuthDrawerBtn>
            <AuthDrawerFooter>
              <AuthInstagramLink
                href={
                  process.env.REACT_APP_INSTAGRAM_URL ||
                  'https://www.instagram.com/comejaca'
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                <FaInstagram aria-hidden />
                Instagram
              </AuthInstagramLink>
            </AuthDrawerFooter>
          </AuthMenuPanel>
        </>
      ) : null}
    </AuthPageShell>
  );
};

export default AuthLayout;

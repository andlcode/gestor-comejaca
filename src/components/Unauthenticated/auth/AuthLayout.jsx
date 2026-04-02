import React from 'react';
import {
  AuthPageShell,
  AuthCardWrap,
  AuthCard,
  AuthCardHeader,
  AuthBrandBlock,
  AuthBrandTitle,
  AuthBrandOrdinal,
  AuthBrandName,
  AuthBrandYear,
  AuthBrandSubtitle,
  AuthCardBody,
  AuthContentInner,
  AuthPageTitle,
  AuthPageSubtitle,
} from './authStyles';

const AuthLayout = ({
  title,
  subtitle,
  children,
  layoutPreset,
}) => {
  const isLogin = layoutPreset === 'login';

  return (
    <AuthPageShell $login={isLogin}>
      <AuthCardWrap $login={isLogin}>
        <AuthCard $login={isLogin}>
          <AuthCardHeader $login={isLogin}>
            <AuthBrandBlock $login={isLogin}>
              <AuthBrandTitle $login={isLogin}>
                <AuthBrandOrdinal $login={isLogin}>47º</AuthBrandOrdinal>
                <AuthBrandName $login={isLogin}>COMEJACA</AuthBrandName>
                <AuthBrandYear $login={isLogin}>2026</AuthBrandYear>
              </AuthBrandTitle>
              <AuthBrandSubtitle $login={isLogin}>Sistema de inscrições</AuthBrandSubtitle>
            </AuthBrandBlock>
          </AuthCardHeader>

          <AuthCardBody $login={isLogin}>
            <AuthContentInner $login={isLogin}>
              <AuthPageTitle $login={isLogin}>{title}</AuthPageTitle>
              {subtitle ? <AuthPageSubtitle $login={isLogin}>{subtitle}</AuthPageSubtitle> : null}
              {children}
            </AuthContentInner>
          </AuthCardBody>
        </AuthCard>
      </AuthCardWrap>
    </AuthPageShell>
  );
};

export default AuthLayout;
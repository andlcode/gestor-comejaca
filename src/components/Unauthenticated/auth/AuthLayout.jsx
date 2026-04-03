import React from 'react';
import { ThemeProvider } from 'styled-components';
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
import { authTheme } from './authTheme';

const AuthLayout = ({
  title,
  subtitle,
  children,
  layoutPreset = 'default',
}) => {
  const isLogin = layoutPreset === 'login';

  return (
    <ThemeProvider theme={authTheme}>
      <AuthPageShell $login={isLogin}>
        <AuthCardWrap $login={isLogin}>
          <AuthCard $login={isLogin}>

            {/* HEADER */}
            <AuthCardHeader $login={isLogin}>
              <AuthBrandBlock $login={isLogin}>
                <AuthBrandTitle $login={isLogin}>
                  <AuthBrandOrdinal $login={isLogin}>
                    47º
                  </AuthBrandOrdinal>

                  <AuthBrandName $login={isLogin}>
                    COMEJACA
                  </AuthBrandName>

                  <AuthBrandYear $login={isLogin}>
                    2026
                  </AuthBrandYear>
                </AuthBrandTitle>

                <AuthBrandSubtitle $login={isLogin}>
                  Sistema de inscrições
                </AuthBrandSubtitle>
              </AuthBrandBlock>
            </AuthCardHeader>

            {/* BODY */}
            <AuthCardBody $login={isLogin}>
              <AuthContentInner $login={isLogin}>
                <AuthPageTitle $login={isLogin}>
                  {title}
                </AuthPageTitle>

                {subtitle && (
                  <AuthPageSubtitle $login={isLogin}>
                    {subtitle}
                  </AuthPageSubtitle>
                )}

                {children}
              </AuthContentInner>
            </AuthCardBody>
          </AuthCard>
        </AuthCardWrap>
      </AuthPageShell>
    </ThemeProvider>
  );
};

export default AuthLayout;
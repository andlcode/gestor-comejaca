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
import { EVENT } from '../../../config/eventConfig';

const AuthLayout = ({
  title,
  subtitle,
  children,
  layoutPreset = 'default',
  mobileScrollMode = 'card',
}) => {
  const isLogin = layoutPreset === 'login';
  const usePageScroll = mobileScrollMode === 'page';
  const displayPrefix = EVENT.displayName
    .replace(EVENT.name, '')
    .replace(EVENT.year, '')
    .trim();

  return (
    <ThemeProvider theme={authTheme}>
      <AuthPageShell $login={isLogin} $pageScroll={usePageScroll}>
        <AuthCardWrap $login={isLogin} $pageScroll={usePageScroll}>
          <AuthCard $login={isLogin} $pageScroll={usePageScroll}>

            {/* HEADER */}
            <AuthCardHeader $login={isLogin}>
              <AuthBrandBlock $login={isLogin}>
                <AuthBrandTitle $login={isLogin}>
                  {displayPrefix ? (
                    <AuthBrandOrdinal $login={isLogin}>
                      {displayPrefix}
                    </AuthBrandOrdinal>
                  ) : null}

                  <AuthBrandName $login={isLogin}>
                    {EVENT.name}
                  </AuthBrandName>

                  {EVENT.year ? (
                    <AuthBrandYear $login={isLogin}>
                      {EVENT.year}
                    </AuthBrandYear>
                  ) : null}
                </AuthBrandTitle>

                <AuthBrandSubtitle $login={isLogin}>
                  {EVENT.systemName}
                </AuthBrandSubtitle>
              </AuthBrandBlock>
            </AuthCardHeader>

            {/* BODY */}
            <AuthCardBody $login={isLogin} $pageScroll={usePageScroll}>
              <AuthContentInner $login={isLogin} $pageScroll={usePageScroll}>
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
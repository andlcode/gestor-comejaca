import React from 'react';
import styled from 'styled-components';
import { FiArrowLeft } from 'react-icons/fi';

export const APP_HEADER_HEIGHT = '64px';
export const APP_HEADER_HEIGHT_MOBILE = '58px';

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${APP_HEADER_HEIGHT};
  z-index: 50;
  border-bottom: 1px solid
    ${({ $glass }) => ($glass ? 'rgba(255, 255, 255, 0.38)' : '#e5e7eb')};
  background: ${({ $glass }) =>
    $glass ? 'rgba(248, 248, 251, 0.72)' : '#ffffff'};
  backdrop-filter: ${({ $glass }) => ($glass ? 'blur(18px) saturate(160%)' : 'none')};
  -webkit-backdrop-filter: ${({ $glass }) =>
    $glass ? 'blur(18px) saturate(160%)' : 'none'};
  box-shadow: ${({ $glass }) =>
    $glass ? '0 8px 24px -20px rgba(15, 23, 42, 0.18)' : 'none'};

  @media (max-width: 768px) {
    height: ${APP_HEADER_HEIGHT_MOBILE};
  }
`;

const Inner = styled.div`
  height: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth};
  margin: 0 auto;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 0 12px;
    gap: 12px;
  }
`;

const Left = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const BackButton = styled.button`
  min-height: 40px;
  min-width: 40px;
  padding: 0 11px;
  border-radius: 11px;
  border: 1px solid ${({ theme }) => theme?.borderColor || 'var(--btn-secondary-border)'};
  background: rgba(255, 255, 255, 0.92);
  color: ${({ theme }) => theme?.secondaryText || 'var(--text-secondary)'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: #ffffff;
    color: ${({ theme }) => theme?.textColor || 'var(--text-primary)'};
    border-color: #d9d9e1;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
    border-color: ${({ theme }) => theme?.inputFocus || '#8b5cf6'};
  }

  @media (max-width: 768px) {
    min-height: 40px;
    min-width: 40px;
  }
`;

const HeaderTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme?.textColor || 'var(--text-primary)'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderTitleContent = styled.div`
  min-width: 0;
`;

const Right = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
`;

export const AppHeaderBadge = styled.span`
  min-height: 27px;
  padding: 0 9px;
  border-radius: 999px;
  border: 1px solid rgba(29, 29, 31, 0.08);
  background: rgba(255, 255, 255, 0.58);
  color: ${({ theme }) => theme?.secondaryText || '#6b7280'};
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);

  @media (min-width: 769px) {
    min-height: 28px;
    padding: 0 10px;
    font-size: 0.68rem;
  }
`;

const AppHeader = ({
  showBack = false,
  onBack,
  title,
  titleContent,
  rightContent,
  maxWidth = '980px',
  glass = false,
}) => {
  return (
    <Wrapper $glass={glass}>
      <Inner $maxWidth={maxWidth}>
        <Left>
          {showBack && (
            <BackButton type="button" onClick={onBack} aria-label="Voltar">
              <FiArrowLeft size={15} />
            </BackButton>
          )}
          {titleContent ? (
            <HeaderTitleContent>{titleContent}</HeaderTitleContent>
          ) : title ? (
            <HeaderTitle>{title}</HeaderTitle>
          ) : null}
        </Left>

        <Right>{rightContent}</Right>
      </Inner>
    </Wrapper>
  );
};

export default AppHeader;

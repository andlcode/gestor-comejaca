import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaInstagram } from 'react-icons/fa';
import {
  FiBarChart2,
  FiChevronDown,
  FiEdit,
  FiLoader,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiPrinter,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ACTIVE_REGISTRATION_YEAR,
  getInscricaoLifecycle,
} from '../../utils/subscriptionCycle';
import { getPaymentStatusVariant, getStatusPagamento } from '../../utils/paymentStatus';
import AppHeader, {
  APP_HEADER_HEIGHT,
  APP_HEADER_HEIGHT_MOBILE,
} from '../shared/AppHeader';

const PAGE_MAX_WIDTH = '980px';

const Container = styled.div`
  min-height: 100vh;
  background: var(--app-bg);
  padding: calc(28px + ${APP_HEADER_HEIGHT}) 18px 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter',
    'Segoe UI', sans-serif;
  color: var(--text-primary);

  @media (max-width: 768px) {
    padding: calc(16px + ${APP_HEADER_HEIGHT_MOBILE}) 12px 28px;
  }
`;

const Content = styled.div`
  max-width: ${PAGE_MAX_WIDTH};
  margin: 0 auto;
`;

const HeaderIdentity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const HeaderBrand = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8e8e93;
`;

const HeaderPageTitleRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
`;

const HeaderPageTitle = styled.h1`
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  font-weight: 700;
  color: var(--text-primary);
`;

const HeaderPageMeta = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const DesktopOnly = styled.div`
  @media (max-width: 768px) {
    display: none !important;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8e8e93;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 18px 0 46px;
  border: 1px solid #e8e8ed;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #1d1d1f;
  font-size: 15px;
  outline: none;
  transition: 0.2s ease;

  &::placeholder {
    color: #8e8e93;
  }

  &:focus {
    border-color: #d8d8de;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.07);
  }
`;

const PrimaryButton = styled.button`
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--btn-primary-bg);
  border-radius: 13px;
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #2a2a2d;
    border-color: #2a2a2d;
  }

  &:active {
    transform: scale(0.99);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 42px;
    min-width: 0;
    padding: 0 12px;
  }
`;

const MobileHeaderButton = styled.button`
  height: 42px;
  min-height: 42px;
  min-width: 42px;
  width: auto;
  padding: 0 12px;
  border: 1px solid var(--btn-secondary-border);
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.92);
  color: #2c2c2e;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #cfcfd8;
  }

  &:active {
    transform: scale(0.99);
  }
`;

const TopActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
`;

const DesktopActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const SecondaryActionButton = styled.button`
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--btn-secondary-border);
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.92);
  color: #3a3a3c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #d4d4dc;
  }
`;

const GhostActionButton = styled.button`
  height: 42px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #f2f2f7;
    color: var(--text-primary);
  }
`;

const StateCard = styled.div`
  min-height: 140px;
  border-radius: 5px;
  background: var(--card-bg);
  border: 1px solid var(--btn-secondary-border);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 15px;
  text-align: center;
  padding: 24px;
`;

const Section = styled.section`
  padding: 8px 0 0;

  & + & {
    margin-top: 18px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ececf1;

  @media (max-width: 768px) {
    margin-bottom: 12px;
    padding-bottom: 10px;
    align-items: center;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const SectionHeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 32px;
  line-height: 1.08;
  letter-spacing: -0.04em;
  font-weight: 700;
  color: #1d1d1f;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  background: rgba(242, 242, 247, 0.95);
  color: #5f616a;
  font-size: 11px;
  font-weight: 600;
`;

const ActiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const RegistrationCard = styled.article`
  padding: 20px;
  border-radius: 5px;
  background: var(--card-bg);
  border: 1px solid var(--btn-secondary-border);
  box-shadow: var(--card-shadow);
  transition: transform 0.18s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: #e4e4eb;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.045);
  }

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 22px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const CardIdentity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardName = styled.h3`
  margin: 0;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const StatusChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  color: ${({ $appearance }) => $appearance?.textColor || '#64748b'};
  background: ${({ $appearance }) => $appearance?.backgroundColor || 'rgba(148, 163, 184, 0.14)'};
  font-size: 12px;
  font-weight: 500;
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: ${({ $appearance }) => $appearance?.dotColor || '#94a3b8'};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

const SecondaryActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PrimaryAction = styled.div`
  display: inline-flex;
  margin-left: auto;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
  }
`;

const Button = styled.button`
  min-height: 36px;
  padding: 0 12px;
  border-radius: 5px;
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'primary' ? 'transparent' : 'var(--btn-secondary-border)'};
  background: ${({ $variant }) =>
    $variant === 'primary' ? 'var(--btn-primary-bg)' : 'var(--card-bg)'};
  color: ${({ $variant }) => ($variant === 'primary' ? '#ffffff' : 'var(--text-primary)')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'primary' ? '#2a2a2d' : '#f7f7f8'};
    border-color: ${({ $variant }) =>
      $variant === 'primary' ? 'transparent' : 'var(--btn-secondary-border)'};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    flex: 1 1 auto;
  }
`;

const InlineEmpty = styled.div`
  border-radius: 18px;
  border: 1px dashed #d6d6dc;
  padding: 18px;
  color: var(--text-secondary);
  background: #fafafa;
  font-size: 14px;
`;

const ArchiveShell = styled.div`
  border-radius: 5px;
  background: var(--card-bg);
  border: 1px solid var(--btn-secondary-border);
  overflow: hidden;
`;

const ArchiveToggle = styled.button`
  width: 100%;
  min-height: 54px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.56);
  }
`;

const ArchiveTitle = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 6px;
  color: #3a3a3c;
`;

const ArchiveTitleMain = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
`;

const ArchiveHint = styled.span`
  font-size: 12px;
  color: #8e8e93;
`;

const ArchiveCount = styled.span`
  padding: 0 8px;
  min-height: 22px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: #f2f2f7;
  color: #6e6e73;
  font-size: 12px;
  font-weight: 600;
`;

const ArchiveChevron = styled(FiChevronDown)`
  color: #8e8e93;
  transition: transform 0.2s ease;
  transform: rotate(${({ $expanded }) => ($expanded ? '180deg' : '0deg')});
`;

const ArchivePanel = styled.div`
  overflow: hidden;
  max-height: ${({ $expanded }) => ($expanded ? '1200px' : '0')};
  opacity: ${({ $expanded }) => ($expanded ? 1 : 0)};
  transition: max-height 0.28s ease, opacity 0.18s ease;
`;

const ArchiveList = styled.div`
  padding: 0 16px 8px;
`;

const ArchiveRow = styled.div`
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #f1f1f4;
`;

const ArchiveName = styled.span`
  font-size: 14px;
  color: #6e6e73;
  font-weight: 500;
  padding: 12px 0;
`;

const ArchiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  background: #f2f2f7;
  color: #8e8e93;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const ArchiveActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const ArchiveActionButton = styled.button`
  min-height: 30px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid #e0e2e8;
  background: rgba(255, 255, 255, 0.92);
  color: #4b4f5b;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #d3d7e2;
  }
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(29, 29, 31, 0.22);
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 70;
  padding: 16px;
`;

const ConfirmModal = styled.div`
  width: min(520px, calc(100vw - 24px));
  border-radius: 18px;
  border: 1px solid #ececf1;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  color: #1d1d1f;
`;

const ConfirmText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: #5f616a;
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(29, 29, 31, 0.22);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 0.2s ease;
  z-index: 40;

  @media (min-width: 769px) {
    display: none;
  }
`;

const DrawerPanel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  width: min(86vw, 320px);
  height: 100vh;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
  border-left: 1px solid rgba(236, 236, 241, 0.9);
  padding: 16px 14px;
  transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
  transition: transform 0.22s ease;
  box-shadow: -10px 0 24px rgba(0, 0, 0, 0.06);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f1f4;
`;

const DrawerTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1d1d1f;
`;

const DrawerCloseButton = styled.button`
  width: 34px;
  height: 34px;
  border: 1px solid #ececf1;
  border-radius: 12px;
  background: #fafafc;
  color: #636366;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const DrawerNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DrawerNavButton = styled.button`
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 14px;
  background: #f8f8fa;
  color: #1d1d1f;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #ececf1;
  }
`;

const DrawerFooter = styled.div`
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid #f1f1f4;
`;

const DrawerDivider = styled.div`
  height: 1px;
  background: #f1f1f4;
  margin: 10px 0 8px;
`;

const DrawerLogoutButton = styled.button`
  min-height: 44px;
  width: 100%;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid transparent;
  background: transparent;
  color: #6e6e73;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: #f8f8fa;
    border-color: #ececf1;
    color: #1d1d1f;
  }
`;

const DrawerInstagramLink = styled.a`
  min-height: 44px;
  padding: 0 14px;
  border-radius: 14px;
  background: transparent;
  color: #6e6e73;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #f8f8fa;
    color: #1d1d1f;
  }
`;

const Spinner = styled(FiLoader)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const getFirstTwoNames = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join(' ');

const getFirstName = (name = '') =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)[0] || 'participante';

const buildReenrollmentPayload = (item = {}) => {
  const pickValue = (...keys) => {
    for (const key of keys) {
      const value = item?.[key];
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return '';
  };

  const toDateOrNull = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  return {
    nomeCompleto: pickValue('nomeCompleto', 'nome_completo'),
    dataNascimento: toDateOrNull(pickValue('dataNascimento', 'data_nascimento', 'nascimento')),
    nomeCracha: pickValue('nomeCracha', 'nomeCrachá', 'nome_no_cracha', 'nomeNoCracha'),
    sexo: item.sexo || '',
    email: item.email || '',
    telefone: item.telefone || '',
    tipoParticipacao: item.tipoParticipacao || '',
    nomeCompletoResponsavel: item.nomeCompletoResponsavel || '',
    documentoResponsavel: item.documentoResponsavel || '',
    telefoneResponsavel: item.telefoneResponsavel || '',
    cep: item.cep || '',
    estado: item.estado || '',
    cidade: item.cidade || '',
    bairro: item.bairro || '',
    logradouro: item.logradouro || '',
    numero: item.numero || '',
    complemento: item.complemento || '',
    medicacao: item.medicacao || '',
    alergia: item.alergia || '',
    outrasInformacoes: item.outrasInformacoes || '',
    IE: item.IE || '',
    vegetariano: item.vegetariano || '',
    nomeSocial: item.nomeSocial || '',
    outroGenero: item.outroGenero || '',
    otherInstitution: item.otherInstitution || '',
    deficienciaAuditiva: Boolean(item.deficienciaAuditiva),
    deficienciaAutismo: Boolean(item.deficienciaAutismo),
    deficienciaIntelectual: Boolean(item.deficienciaIntelectual),
    deficienciaParalisiaCerebral: Boolean(item.deficienciaParalisiaCerebral),
    deficienciaVisual: Boolean(item.deficienciaVisual),
    deficienciaFisica: Boolean(item.deficienciaFisica),
    deficienciaOutra: Boolean(item.deficienciaOutra),
    deficienciaOutraDescricao: item.deficienciaOutraDescricao || '',
    // intentionally reset for new cycle / business validation
    primeiraComejaca: false,
    comissao: '',
  };
};

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [isArchivedExpanded, setIsArchivedExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingReenrollmentItem, setPendingReenrollmentItem] = useState(null);
  const [isReenrollmentLoading, setIsReenrollmentLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const isAdmin = useMemo(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      return storedUser?.role === 'admin' || localStorage.getItem('role') === 'admin';
    } catch {
      return localStorage.getItem('role') === 'admin';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isVerified');
    navigate('/');
  };

  const handlePagamento = async (itemId) => {
    setLoadingItemId(itemId);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/auth/pagamento/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('[MercadoPago][Dashboard] resposta do backend para pagamento:', {
        itemId,
        init_point: response.data?.init_point || null,
        fullResponse: response.data,
      });

      if (response.data?.init_point) {
        window.open(response.data.init_point, '_blank');
      } else {
        alert('Não foi possível gerar o link de pagamento.');
      }
    } catch {
      alert('Erro ao processar pagamento.');
    } finally {
      setLoadingItemId(null);
    }
  };

  useEffect(() => {
    const fetchInscricoes = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/auth/obterinscricoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(response.data?.data) ? response.data.data : [];
        setInscricoes(data);
        setError(null);
      } catch (requestError) {
        setError(requestError.response?.data?.error || 'Erro ao carregar inscrições');

        if (requestError.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInscricoes();
  }, [API_URL, navigate]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(inscricoes)) return [];

    const term = search.toLowerCase().trim();
    if (!term) return inscricoes;

    return inscricoes.filter((item) => {
      return (
        item.nomeCompleto?.toLowerCase().includes(term) ||
        item.IE?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term)
      );
    });
  }, [inscricoes, search]);

  const groupedSections = useMemo(() => {
    return filteredData.reduce(
      (groups, item) => {
        const lifecycle = getInscricaoLifecycle(item);
        groups[lifecycle.sectionKey].push({ ...item, lifecycle });
        return groups;
      },
      { active: [], archived: [] }
    );
  }, [filteredData]);

  const handleNavigateToStats = () => {
    setIsMobileMenuOpen(false);
    navigate('/pagamentos');
  };

  const handleNavigateToInstitution = () => {
    setIsMobileMenuOpen(false);
    navigate('/instituicao');
  };

  const openReenrollmentConfirm = (item) => {
    setPendingReenrollmentItem(item);
  };

  const closeReenrollmentConfirm = () => {
    setPendingReenrollmentItem(null);
  };

  const confirmReenrollment = async () => {
    if (!pendingReenrollmentItem) return;

    try {
      setIsReenrollmentLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `${API_URL}/api/auth/print/${pendingReenrollmentItem.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const sourceData = response?.data?.data || pendingReenrollmentItem;
      const firstName = getFirstName(sourceData.nomeCompleto || pendingReenrollmentItem.nomeCompleto);
      const prefillData = buildReenrollmentPayload(sourceData);

      setPendingReenrollmentItem(null);
      navigate('/inscrever', {
        state: {
          reenrollment: {
            firstName,
            prefillData,
          },
        },
      });
    } catch {
      alert('Não foi possível carregar os dados para reinscrição agora.');
    } finally {
      setIsReenrollmentLoading(false);
    }
  };

  return (
    <Container>
      <ConfirmOverlay $open={Boolean(pendingReenrollmentItem)} onClick={closeReenrollmentConfirm}>
        <ConfirmModal onClick={(event) => event.stopPropagation()}>
          <ConfirmTitle>Inscrever {ACTIVE_REGISTRATION_YEAR}?</ConfirmTitle>
          <ConfirmText>
            Deseja usar os dados de {getFirstName(pendingReenrollmentItem?.nomeCompleto)} para
            iniciar uma nova inscrição em {ACTIVE_REGISTRATION_YEAR}? Você poderá revisar e ajustar as informações
            antes de confirmar.
          </ConfirmText>
          <ConfirmActions>
            <ArchiveActionButton
              type="button"
              onClick={closeReenrollmentConfirm}
              disabled={isReenrollmentLoading}
            >
              Cancelar
            </ArchiveActionButton>
            <Button
              type="button"
              $variant="primary"
              onClick={confirmReenrollment}
              disabled={isReenrollmentLoading}
            >
              {isReenrollmentLoading ? 'Carregando...' : 'Continuar'}
            </Button>
          </ConfirmActions>
        </ConfirmModal>
      </ConfirmOverlay>

      <AppHeader
        titleContent={
          <HeaderIdentity>
            <HeaderBrand>COMEJACA</HeaderBrand>
            <HeaderPageTitleRow>
              <HeaderPageTitle>Inscrições {ACTIVE_REGISTRATION_YEAR}</HeaderPageTitle>
              <HeaderPageMeta>Total: {groupedSections.active.length}</HeaderPageMeta>
            </HeaderPageTitleRow>
          </HeaderIdentity>
        }
        rightContent={
          <MobileOnly>
            <MobileHeaderButton
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <FiMenu size={18} />
            </MobileHeaderButton>
          </MobileOnly>
        }
      />

      <DrawerOverlay $open={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />
      <DrawerPanel $open={isMobileMenuOpen}>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerCloseButton type="button" onClick={() => setIsMobileMenuOpen(false)}>
            <FiX size={18} />
          </DrawerCloseButton>
        </DrawerHeader>

        <DrawerNav>
          {isAdmin && (
            <>
              <DrawerNavButton type="button" onClick={handleNavigateToStats}>
                <FiBarChart2 size={16} />
                Estatísticas
              </DrawerNavButton>
              <DrawerNavButton type="button" onClick={handleNavigateToInstitution}>
                <FiPlus size={16} />
                Adicionar IE
              </DrawerNavButton>
            </>
          )}
        </DrawerNav>

        <DrawerFooter>
          <DrawerInstagramLink
            href={process.env.REACT_APP_INSTAGRAM_URL || 'https://www.instagram.com/comejaca'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaInstagram size={16} />
            Instagram
          </DrawerInstagramLink>

          <DrawerDivider />

          <DrawerLogoutButton type="button" onClick={handleLogout}>
            <FiLogOut size={16} />
            Sair
          </DrawerLogoutButton>
        </DrawerFooter>
      </DrawerPanel>

      <Content>
        <TopActionBar>
          <MobileOnly>
            <PrimaryButton type="button" onClick={() => navigate('/inscrever')}>
              <FiPlus size={16} />
              Nova inscrição
            </PrimaryButton>
          </MobileOnly>

          <DesktopOnly>
            <DesktopActionGroup>
              <PrimaryButton type="button" onClick={() => navigate('/inscrever')}>
                <FiPlus size={16} />
                Nova inscrição
              </PrimaryButton>

              {isAdmin && (
                <>
                  <SecondaryActionButton type="button" onClick={handleNavigateToStats}>
                    <FiBarChart2 size={16} />
                    Estatísticas
                  </SecondaryActionButton>
                  <SecondaryActionButton type="button" onClick={handleNavigateToInstitution}>
                    <FiPlus size={16} />
                    Adicionar IE
                  </SecondaryActionButton>
                </>
              )}

              <GhostActionButton type="button" onClick={handleLogout}>
                <FiLogOut size={16} />
                Sair
              </GhostActionButton>
            </DesktopActionGroup>
          </DesktopOnly>
        </TopActionBar>

        {loading ? (
          <StateCard>
            <Spinner size={18} />
            Carregando inscrições...
          </StateCard>
        ) : error ? (
          <StateCard>{error}</StateCard>
        ) : inscricoes.length === 0 ? (
          <StateCard>Estamos aguardando sua primeira inscrição</StateCard>
        ) : (
          <>
            <Section>
     {/*          <SearchWrapper>
                <SearchIcon size={18} />
                <SearchInput
                  type="text"
                  placeholder="Pesquisar por nome, IE ou e-mail"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </SearchWrapper> */}

              {filteredData.length === 0 ? (
                <StateCard>
                  <FiSearch size={18} />
                  Nenhum resultado encontrado
                </StateCard>
              ) : groupedSections.active.length > 0 ? (
                <ActiveGrid>
                  {groupedSections.active.map((item) => {
                    const statusAppearance = getStatusPagamento(item.statusPagamento, 'dashboard');
                    const statusVariant = getPaymentStatusVariant(item.statusPagamento);
                    const shortName = getFirstTwoNames(item.nomeCompleto);

                    return (
                      <RegistrationCard key={item.id}>
                        <CardHeader>
                          <CardIdentity>
                            <CardName>{shortName || item.nomeCompleto}</CardName>

                            <StatusChip $appearance={statusAppearance}>
                              <StatusDot $appearance={statusAppearance} />
                              <span>{statusAppearance.label}</span>
                            </StatusChip>
                          </CardIdentity>
                        </CardHeader>

                        <Actions>
                          <SecondaryActions>
                            <Button
                              type="button"
                              onClick={() => navigate(`/imprimir/${item.id}`)}
                            >
                              <FiPrinter size={14} />
                              Imprimir
                            </Button>

                            <Button
                              type="button"
                              onClick={() => navigate(`/atualizar/${item.id}`)}
                            >
                              <FiEdit size={14} />
                              Editar
                            </Button>
                          </SecondaryActions>

                          {item.lifecycle.actions.canPay &&
                            statusVariant !== 'pago' && (
                              <PrimaryAction>
                                <Button
                                  type="button"
                                  $variant="primary"
                                  onClick={() => handlePagamento(item.id)}
                                  disabled={loadingItemId === item.id}
                                >
                                  {loadingItemId === item.id ? (
                                    <>
                                      <Spinner size={14} />
                                      Processando
                                    </>
                                  ) : (
                                    'Pagar'
                                  )}
                                </Button>
                              </PrimaryAction>
                            )}
                        </Actions>
                      </RegistrationCard>
                    );
                  })}
                </ActiveGrid>
              ) : (
                <InlineEmpty>
                  Nenhuma inscrição de {ACTIVE_REGISTRATION_YEAR} encontrada no momento.
                </InlineEmpty>
              )}
            </Section>

            {groupedSections.archived.length > 0 && (
              <Section>
                <ArchiveShell>
                  <ArchiveToggle
                    type="button"
                    onClick={() => setIsArchivedExpanded((prev) => !prev)}
                    aria-expanded={isArchivedExpanded}
                    aria-controls="archived-registrations"
                  >
                    <ArchiveTitle>
                      <ArchiveTitleMain>
                        <span>Inscrições 2025</span>
                        <ArchiveCount>{groupedSections.archived.length}</ArchiveCount>
                      </ArchiveTitleMain>
                      <ArchiveHint>{isArchivedExpanded ? 'Toque para recolher' : 'Toque para expandir'}</ArchiveHint>
                    </ArchiveTitle>

                    <ArchiveChevron $expanded={isArchivedExpanded} />
                  </ArchiveToggle>

                  <ArchivePanel
                    id="archived-registrations"
                    $expanded={isArchivedExpanded}
                  >
                    <ArchiveList>
                      {groupedSections.archived.map((item) => (
                        <ArchiveRow key={item.id}>
                          <ArchiveName>{item.nomeCompleto}</ArchiveName>

                          <ArchiveActions>
                            {item.lifecycle.cycleYear === 2025 && (
                              <ArchiveActionButton
                                type="button"
                                onClick={() => openReenrollmentConfirm(item)}
                              >
                                Inscrever {ACTIVE_REGISTRATION_YEAR}
                              </ArchiveActionButton>
                            )}

                            {item.lifecycle.badgeLabel && (
                              <ArchiveBadge>{item.lifecycle.badgeLabel}</ArchiveBadge>
                            )}
                          </ArchiveActions>
                        </ArchiveRow>
                      ))}
                    </ArchiveList>
                  </ArchivePanel>
                </ArchiveShell>
              </Section>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default Dashboard;
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  FiChevronDown,
  FiEdit,
  FiLoader,
  FiPlus,
  FiPrinter,
  FiSearch,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ACTIVE_REGISTRATION_YEAR,
  getInscricaoLifecycle,
} from '../../utils/subscriptionCycle';

const PAGE_MAX_WIDTH = '980px';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f7;
  padding: 28px 18px 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter',
    'Segoe UI', sans-serif;
  color: #1d1d1f;

  @media (max-width: 768px) {
    padding: 16px 12px 28px;
  }
`;

const Content = styled.div`
  max-width: ${PAGE_MAX_WIDTH};
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 18px;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
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
  height: 44px;
  padding: 0 16px;
  border: none;
  border-radius: 14px;
  background: #111111;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #1c1c1e;
  }

  &:active {
    transform: scale(0.99);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 46px;
  }
`;

const StateCard = styled.div`
  min-height: 140px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(229, 229, 234, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #6e6e73;
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
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
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
  min-width: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: #f2f2f7;
  color: #6e6e73;
  font-size: 12px;
  font-weight: 600;
`;

const ActiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const RegistrationCard = styled.article`
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #ececf1;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.025);

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
  color: #1d1d1f;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const StatusRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6e6e73;
  font-size: 14px;
  font-weight: 500;
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: ${({ $status }) => {
    switch (($status || '').toLowerCase()) {
      case 'pago':
        return '#34c759';
      case 'falhou':
        return '#ff3b30';
      default:
        return '#ff9f0a';
    }
  }};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'primary' ? 'transparent' : '#e5e5ea'};
  background: ${({ $variant }) =>
    $variant === 'primary' ? '#1c1c1e' : 'rgba(255, 255, 255, 0.92)'};
  color: ${({ $variant }) => ($variant === 'primary' ? '#ffffff' : '#3a3a3c')};
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
      $variant === 'primary' ? '#2c2c2e' : '#f7f7f8'};
    border-color: ${({ $variant }) =>
      $variant === 'primary' ? 'transparent' : '#ddddE3'};
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
  color: #6e6e73;
  background: #fafafa;
  font-size: 14px;
`;

const ArchiveShell = styled.div`
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid #ececf1;
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
  align-items: center;
  gap: 10px;
  color: #3a3a3c;
  font-size: 15px;
  font-weight: 600;
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

const getDisplayStatus = (status) => {
  const normalized = String(status || '').trim().toLowerCase();

  switch (normalized) {
    case 'approved':
    case 'aprovado':
    case 'pago':
      return 'Pago';
    case 'rejeitado':
    case 'rejected':
    case 'falhou':
      return 'Falhou';
    case 'pendente':
    case 'pending':
    case '':
      return 'Pendente';
    default:
      return status;
  }
};

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [isArchivedExpanded, setIsArchivedExpanded] = useState(false);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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

  return (
    <Container>
      <Content>
        <TopBar>
          <SearchWrapper>
            <SearchIcon size={18} />
            <SearchInput
              type="text"
              placeholder="Pesquisar por nome, IE ou e-mail"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchWrapper>

          <PrimaryButton type="button" onClick={() => navigate('/inscrever')}>
            <FiPlus size={16} />
            Nova Inscrição
          </PrimaryButton>
        </TopBar>

        {loading ? (
          <StateCard>
            <Spinner size={18} />
            Carregando inscrições...
          </StateCard>
        ) : error ? (
          <StateCard>{error}</StateCard>
        ) : inscricoes.length === 0 ? (
          <StateCard>Estamos aguardando sua primeira inscrição</StateCard>
        ) : filteredData.length === 0 ? (
          <StateCard>
            <FiSearch size={18} />
            Nenhum resultado encontrado
          </StateCard>
        ) : (
          <>
            <Section>
              <SectionHeader>
                <TitleRow>
                  <Title>Inscrições {ACTIVE_REGISTRATION_YEAR}</Title>
                  <CountBadge>{groupedSections.active.length}</CountBadge>
                </TitleRow>
              </SectionHeader>

              {groupedSections.active.length > 0 ? (
                <ActiveGrid>
                  {groupedSections.active.map((item) => {
                    const statusPagamento = getDisplayStatus(item.statusPagamento);
                    const shortName = getFirstTwoNames(item.nomeCompleto);

                    return (
                      <RegistrationCard key={item.id}>
                        <CardHeader>
                          <CardIdentity>
                            <CardName>{shortName || item.nomeCompleto}</CardName>

                            <StatusRow>
                              <StatusDot $status={statusPagamento} />
                              <span>{statusPagamento}</span>
                            </StatusRow>
                          </CardIdentity>
                        </CardHeader>

                        <Actions>
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

                          {item.lifecycle.actions.canPay &&
                            statusPagamento.toLowerCase() !== 'pago' && (
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
                      <span>Inscrições 2025</span>
                      <ArchiveCount>{groupedSections.archived.length}</ArchiveCount>
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

                          {item.lifecycle.badgeLabel && (
                            <ArchiveBadge>{item.lifecycle.badgeLabel}</ArchiveBadge>
                          )}
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
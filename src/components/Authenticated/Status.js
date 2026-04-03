import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiActivity, FiAlertCircle } from 'react-icons/fi';
import { FaLeaf, FaWheelchair } from 'react-icons/fa';
import { getPaymentStatusVariant, getStatusPagamento } from '../../utils/paymentStatus';
import GraficoTrabalhadoresPorComissao from './GraficoTrabalhadoresPorComissao';
import AppHeader, {
  APP_HEADER_HEIGHT,
  APP_HEADER_HEIGHT_MOBILE,
  AppHeaderBadge,
} from '../shared/AppHeader';

const stableSortByCountDesc = (items, getCount) =>
  items
    .map((item, index) => ({ item, index, count: getCount(item) }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.index - b.index;
    })
    .map(({ item }) => item);

const formatInstitutionName = (value = '') => {
  const normalizedValue = (value || '').trim();
  return normalizedValue || 'N/A';
};

const CARE_FIELDS = [
  'alergia',
  'medicacao',
  'outrasInformacoes',
  'vegetariano',
  'deficienciaAuditiva',
  'deficienciaAutismo',
  'deficienciaIntelectual',
  'deficienciaParalisiaCerebral',
  'deficienciaVisual',
  'deficienciaFisica',
  'deficienciaOutra',
  'deficienciaOutraDescricao',
];

const hasCareDetails = (participant) =>
  CARE_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(participant || {}, field));

const formatDetailValue = (value) => {
  if (value === null || value === undefined) return 'Não informado';

  const normalizedValue = String(value).trim();
  if (!normalizedValue || normalizedValue.toLowerCase() === 'n/a') {
    return 'Não informado';
  }

  return normalizedValue;
};

const normalizeComparableText = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const hasRelevantTextValue = (value) => {
  if (value === null || value === undefined) return false;

  const normalizedValue = normalizeComparableText(value);
  return (
    normalizedValue !== '' &&
    normalizedValue !== 'nao informado' &&
    normalizedValue !== 'n/a'
  );
};

const isTruthyFlag = (value) => {
  if (value === true) return true;
  if (value === false || value === null || value === undefined) return false;

  const normalizedValue = normalizeComparableText(value);
  return ['true', '1', 'sim', 'yes'].includes(normalizedValue);
};

const hasRelevantVegetarianValue = (value) => {
  if (!hasRelevantTextValue(value)) return false;

  const normalizedValue = normalizeComparableText(value);
  return normalizedValue !== 'não' && normalizedValue !== 'nao';
};

const getCareConditions = (participant) => {
  const conditions = [];

  if (participant?.deficienciaAuditiva) conditions.push('Auditiva');
  if (participant?.deficienciaAutismo) conditions.push('Autismo');
  if (participant?.deficienciaIntelectual) conditions.push('Intelectual');
  if (participant?.deficienciaParalisiaCerebral) conditions.push('Paralisia cerebral');
  if (participant?.deficienciaVisual) conditions.push('Visual');
  if (participant?.deficienciaFisica) conditions.push('Física');
  if (participant?.deficienciaOutra) conditions.push('Outra');

  return conditions.length > 0 ? conditions : ['Não informado'];
};

const getParticipantIndicators = (participant) => {
  const hasCondicoes = [
    participant?.deficienciaAuditiva,
    participant?.deficienciaAutismo,
    participant?.deficienciaIntelectual,
    participant?.deficienciaParalisiaCerebral,
    participant?.deficienciaVisual,
    participant?.deficienciaFisica,
    participant?.deficienciaOutra,
  ].some(isTruthyFlag);

  return {
    hasAlergia: hasRelevantTextValue(participant?.alergia),
    hasMedicacao: hasRelevantTextValue(participant?.medicacao),
    hasCondicoes,
    hasAlimentacao: hasRelevantVegetarianValue(participant?.vegetariano),
  };
};

const PARTICIPANT_INDICATOR_CONFIG = [
  {
    key: 'hasAlergia',
    icon: FiAlertCircle,
    label: 'Possui alergias ou restrições',
  },
  {
    key: 'hasMedicacao',
    icon: FiActivity,
    label: 'Faz uso de medicação',
  },
  {
    key: 'hasCondicoes',
    icon: FaWheelchair,
    label: 'Possui condições informadas',
  },
  {
    key: 'hasAlimentacao',
    icon: FaLeaf,
    label: 'Possui alimentação específica',
  },
];

const getParticipantIndicatorItems = (participant) => {
  const indicatorFlags = getParticipantIndicators(participant);

  return PARTICIPANT_INDICATOR_CONFIG.filter((indicator) => indicatorFlags[indicator.key]);
};

const appHeaderTheme = {
  borderColor: '#e5e7eb',
  secondaryText: '#6b7280',
  textColor: '#111827',
  inputFocus: '#2563eb',
};

const ListaParticipantes = () => {
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroIE, setFiltroIE] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('lista');
  const [filtro, setFiltro] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedParticipantBase, setSelectedParticipantBase] = useState(null);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [isParticipantModalLoading, setIsParticipantModalLoading] = useState(false);
  const [participantModalError, setParticipantModalError] = useState('');
  const [participantDetailsCache, setParticipantDetailsCache] = useState({});
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const navigate = useNavigate();
  const isAdmin = useMemo(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      return storedUser?.role === 'admin' || localStorage.getItem('role') === 'admin';
    } catch {
      return localStorage.getItem('role') === 'admin';
    }
  }, []);

  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/pagamentos/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.success) {
          setParticipantes(response.data.data);
        }
      } catch (error) {
        console.error('Erro ao buscar participantes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantes();
  }, [API_URL]);

  useEffect(() => {
    if (!isParticipantModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsParticipantModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isParticipantModalOpen]);

  const calcularIdadeEmData = (nascimentoStr, dataRef = '2025-07-19') => {
    const nascimento = new Date(nascimentoStr);
    const ref = new Date(dataRef);
    let idade = ref.getFullYear() - nascimento.getFullYear();

    if (
      ref.getMonth() < nascimento.getMonth() ||
      (ref.getMonth() === nascimento.getMonth() && ref.getDate() < nascimento.getDate())
    ) {
      idade--;
    }

    return idade;
  };

  const classificarGFE = (idade) => {
    if (idade < 11) return 'Pequenos Companheiros';
    if (idade <= 12) return 'Polén de Esperança';
    if (idade <= 14) return 'Semente de Amor';
    if (idade <= 17) return 'Flores de Amor';
    if (idade <= 20) return 'Colheita de Amor';
    if (idade <= 26) return 'Tafereiros do Bem';
    return 'Pais';
  };

  const handleStatusChange = async (participanteId, novoStatus) => {
    try {
      await axios.put(
        `${API_URL}/api/auth/pagamentos/${participanteId}/status`,
        { statusPagamento: novoStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setParticipantes((prev) =>
        prev.map((p) =>
          p.id === participanteId ? { ...p, statusPagamento: novoStatus } : p
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar o status do pagamento.');
    }
  };

  const handleOpenParticipantModal = async (participant) => {
    setSelectedParticipantBase(participant);
    setSelectedParticipant(hasCareDetails(participant) ? participant : null);
    setParticipantModalError('');
    setIsParticipantModalOpen(true);

    if (hasCareDetails(participant)) {
      setIsParticipantModalLoading(false);
      return;
    }

    const cachedParticipant = participantDetailsCache[participant.id];
    if (cachedParticipant) {
      setSelectedParticipant(cachedParticipant);
      setIsParticipantModalLoading(false);
      return;
    }

    setIsParticipantModalLoading(true);

    try {
      const response = await axios.get(`${API_URL}/api/auth/print/${participant.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const participantDetails = response.data?.data || null;

      if (!participantDetails) {
        throw new Error('Dados do participante não encontrados.');
      }

      setParticipantDetailsCache((prev) => ({
        ...prev,
        [participant.id]: participantDetails,
      }));
      setSelectedParticipant(participantDetails);
    } catch (error) {
      console.error('Erro ao buscar detalhes do participante:', error);
      setParticipantModalError('Não foi possível carregar os dados do participante.');
    } finally {
      setIsParticipantModalLoading(false);
    }
  };

  const handleCloseParticipantModal = () => {
    setIsParticipantModalOpen(false);
    setIsParticipantModalLoading(false);
    setParticipantModalError('');
  };

  const participantesFiltrados = useMemo(
    () =>
      participantes.filter((p) =>
        formatInstitutionName(p.IE).toLowerCase().includes(filtroIE.toLowerCase())
      ),
    [participantes, filtroIE]
  );

  const trabalhadoresPorComissao = useMemo(() => {
    const grupos = {};

    participantes.forEach((p) => {
      if (p.tipoParticipacao === 'Trabalhador') {
        const comissao = p.comissao || 'Sem Comissão';
        if (!grupos[comissao]) {
          grupos[comissao] = [];
        }
        grupos[comissao].push(p.nomeCompleto);
      }
    });

    return grupos;
  }, [participantes]);

  const comissoesFiltradas = useMemo(
    () =>
      stableSortByCountDesc(
        Object.entries(trabalhadoresPorComissao).filter(([comissao]) =>
          comissao.toLowerCase().includes(filtro.toLowerCase())
        ),
        ([, nomes]) => nomes.length
      ),
    [trabalhadoresPorComissao, filtro]
  );

  const contagemPorIE = useMemo(() => {
    const contagem = {};

    participantes.forEach((p) => {
      const instituicao = p.IE || 'N/A';
      contagem[instituicao] = (contagem[instituicao] || 0) + 1;
    });

    return contagem;
  }, [participantes]);

  const contagemPorIEOrdenada = useMemo(
    () => stableSortByCountDesc(Object.entries(contagemPorIE), ([, quantidade]) => quantidade),
    [contagemPorIE]
  );

  const { pago, pendente, N_A } = useMemo(() => {
    let pago = 0;
    let pendente = 0;
    let N_A = 0;

    participantes.forEach((p) => {
      const statusVariant = getPaymentStatusVariant(p.statusPagamento);

      if (statusVariant === 'pago') pago++;
      else if (statusVariant === 'pendente') pendente++;
      else N_A++;
    });

    return { pago, pendente, N_A };
  }, [participantes]);

  const { confraternistas, trabalhadores } = useMemo(() => {
    let confraternistas = 0;
    let trabalhadores = 0;

    participantes.forEach((p) => {
      if (p.tipoParticipacao === 'Confraternista') confraternistas++;
      else if (p.tipoParticipacao === 'Trabalhador') trabalhadores++;
    });

    return { confraternistas, trabalhadores };
  }, [participantes]);

  const dadosGrafico = useMemo(
    () =>
      stableSortByCountDesc(
        Object.entries(trabalhadoresPorComissao).map(([comissao, nomes]) => ({
          comissao,
          quantidade: nomes.length,
        })),
        (item) => item.quantidade
      ),
    [trabalhadoresPorComissao]
  );

  const listaGFE = useMemo(
    () =>
      participantes
        .filter((p) => p.tipoParticipacao === 'Confraternista')
        .map((p) => {
          const idade = calcularIdadeEmData(p.dataNascimento);
          const gfe = classificarGFE(idade);
          return { ...p, idade, gfe };
        }),
    [participantes]
  );

  const gruposGFE = useMemo(
    () =>
      stableSortByCountDesc(
        Object.entries(
          listaGFE.reduce((acc, participante) => {
            const gfe = participante.gfe || 'Não Informado';
            if (!acc[gfe]) acc[gfe] = [];
            acc[gfe].push(participante);
            return acc;
          }, {})
        ).map(([gfe, participantesDoGrupo]) => [
          gfe,
          [...participantesDoGrupo].sort((a, b) => a.idade - b.idade),
        ]),
        ([, participantesDoGrupo]) => participantesDoGrupo.length
      ),
    [listaGFE]
  );

  useEffect(() => {
    if (abaAtiva !== 'gfe' || gruposGFE.length === 0) return undefined;

    let isCancelled = false;

    const fetchParticipantDetailsForIndicators = async () => {
      const participantsToFetch = gruposGFE
        .flatMap(([, participantesDoGrupo]) => participantesDoGrupo)
        .filter((participant) => !hasCareDetails(participant) && !participantDetailsCache[participant.id]);

      if (participantsToFetch.length === 0) return;

      const token = localStorage.getItem('token');

      await Promise.all(
        participantsToFetch.map(async (participant) => {
          try {
            const response = await axios.get(`${API_URL}/api/auth/print/${participant.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const participantDetails = response.data?.data;
            if (!participantDetails || isCancelled) return;

            setParticipantDetailsCache((prev) => {
              if (prev[participant.id]) return prev;

              return {
                ...prev,
                [participant.id]: participantDetails,
              };
            });
          } catch (error) {
            console.error('Erro ao buscar indicadores do participante:', error);
          }
        })
      );
    };

    fetchParticipantDetailsForIndicators();

    return () => {
      isCancelled = true;
    };
  }, [abaAtiva, gruposGFE, participantDetailsCache, API_URL]);

  const kpis = useMemo(
    () =>
      stableSortByCountDesc(
        [
          { label: 'Total de inscritos', value: participantes.length },
          { label: 'Confraternistas', value: confraternistas },
          { label: 'Trabalhadores', value: trabalhadores },
          { label: 'Pagos', value: pago, tone: 'success' },
          { label: 'Pendentes', value: pendente, tone: 'warning' },
          { label: 'N/A', value: N_A, tone: 'neutral' },
        ],
        (item) => item.value
      ),
    [participantes.length, confraternistas, trabalhadores, pago, pendente, N_A]
  );

  const participantModalData = selectedParticipant || selectedParticipantBase;
  const participantModalAge =
    selectedParticipantBase?.idade ??
    (participantModalData?.dataNascimento
      ? calcularIdadeEmData(participantModalData.dataNascimento)
      : null);
  const participantCareConditions = getCareConditions(selectedParticipant);

  return (
    <ThemeProvider theme={appHeaderTheme}>
      <Container>
        <AppHeader
          showBack
          onBack={() => navigate(-1)}
          rightContent={<AppHeaderBadge>COMEJACA 2026</AppHeaderBadge>}
          maxWidth="1560px"
        />

        <ContentWrapper>
          <FormCard>
          <PageHeader>
            <TitleBlock>
              <PageTitle>Gestão de inscritos</PageTitle>
              <PageSubtitle>
                Acompanhe pagamentos, instituições, comissões e classificação.
              </PageSubtitle>
            </TitleBlock>
          </PageHeader>

          <Tabs>
            <TabButton
              $active={abaAtiva === 'lista'}
              onClick={() => setAbaAtiva('lista')}
            >
              Lista completa
            </TabButton>
            <TabButton
              $active={abaAtiva === 'trabalhadores'}
              onClick={() => setAbaAtiva('trabalhadores')}
            >
              Trabalhadores por comissão
            </TabButton>
            <TabButton
              $active={abaAtiva === 'instituicoes'}
              onClick={() => setAbaAtiva('instituicoes')}
            >
              Quantidade por instituição
            </TabButton>
            <TabButton
              $active={abaAtiva === 'gfe'}
              onClick={() => setAbaAtiva('gfe')}
            >
              Classificação por GFE
            </TabButton>
          </Tabs>

          {loading ? (
            <StateMessage>Carregando participantes...</StateMessage>
          ) : abaAtiva === 'lista' ? (
            <>
              <KpiGrid>
                {kpis.map((item) => (
                  <KpiCard key={item.label}>
                    <KpiLabel>{item.label}</KpiLabel>
                    <KpiValue $tone={item.tone}>{item.value}</KpiValue>
                  </KpiCard>
                ))}
              </KpiGrid>

              <FilterBar>
                <FilterGroup>
                  <FilterLabel htmlFor="filtro-ie">
                    Filtrar por instituição espírita
                  </FilterLabel>
                  <FilterInput
                    id="filtro-ie"
                    type="text"
                    placeholder="Digite o nome da instituição..."
                    value={filtroIE}
                    onChange={(e) => setFiltroIE(e.target.value)}
                  />
                </FilterGroup>
              </FilterBar>

              <TableCard>
                <TableContainer>
                  <MainTable>
                    <colgroup>
                      <col style={{ width: '22%' }} />
                      <col style={{ width: '24%' }} />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '16%' }} />
                    </colgroup>
                    <TableHead>
                      <tr>
                        <TableHeaderCell>Nome</TableHeaderCell>
                        <TableHeaderCell>Instituição Espírita</TableHeaderCell>
                        <TableHeaderCell>Comissão</TableHeaderCell>
                        <TableHeaderCell $nowrap>Status Pagamento</TableHeaderCell>
                        <TableHeaderCell $nowrap>Link</TableHeaderCell>
                        <TableHeaderCell $nowrap>Ações</TableHeaderCell>
                      </tr>
                    </TableHead>
                    <tbody>
                      {participantesFiltrados.map((p) => {
                        const statusAppearance = getStatusPagamento(
                          p.statusPagamento,
                          'estatisticas'
                        );

                        return (
                          <BodyRow key={p.id}>
                            <TableCell>{p.nomeCompleto}</TableCell>
                            <TableCell>
                              <InstitutionNameText>
                                {formatInstitutionName(p.IE)}
                              </InstitutionNameText>
                            </TableCell>
                            <TableCell>
                              {p.tipoParticipacao === 'Trabalhador'
                                ? p.comissao || 'Sem Comissão'
                                : p.tipoParticipacao}
                            </TableCell>
                            <TableCell $nowrap>
                              <StatusSelect
                                value={p.statusPagamento}
                                $appearance={statusAppearance}
                                onChange={(e) =>
                                  handleStatusChange(p.id, e.target.value)
                                }
                              >
                                <option value="pendente">
                                  {getStatusPagamento('pendente', 'estatisticas').label}
                                </option>
                                <option value="pago">
                                  {getStatusPagamento('pago', 'estatisticas').label}
                                </option>
                                <option value="N/A">N/A</option>
                              </StatusSelect>
                            </TableCell>
                            <TableCell $nowrap>
                              {p.linkPagamento ? (
                                <TableLink
                                  href={p.linkPagamento}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Acessar
                                </TableLink>
                              ) : (
                                'N/A'
                              )}
                            </TableCell>
                            <TableCell $nowrap>
                              <ActionButtonGroup>
                                <ActionButton
                                  type="button"
                                  onClick={() => navigate(`/imprimir/${p.id}`)}
                                >
                                  Imprimir
                                </ActionButton>
                                {isAdmin && (
                                  <ActionButton
                                    type="button"
                                    onClick={() => navigate(`/atualizar/${p.id}`)}
                                  >
                                    Editar
                                  </ActionButton>
                                )}
                              </ActionButtonGroup>
                            </TableCell>
                          </BodyRow>
                        );
                      })}
                    </tbody>
                  </MainTable>
                </TableContainer>
              </TableCard>
            </>
          ) : abaAtiva === 'gfe' ? (
            <SectionStack>
              {gruposGFE.map(([gfe, participantesDoGrupo]) => (
                <SectionCard key={gfe}>
                  <SectionHeader>
                    <SectionTitle>{gfe}</SectionTitle>
                    <SectionMeta>Total: {participantesDoGrupo.length}</SectionMeta>
                  </SectionHeader>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <tr>
                          <TableHeaderCell>Nome</TableHeaderCell>
                          <TableHeaderCell>Data de Nascimento</TableHeaderCell>
                          <TableHeaderCell>Idade</TableHeaderCell>
                          <TableHeaderCell>Instituição Espírita</TableHeaderCell>
                        </tr>
                      </TableHead>
                      <tbody>
                        {participantesDoGrupo.map((p) => (
                          <BodyRow key={p.id}>
                            <TableCell>
                              <ParticipantCellContent>
                                <ParticipantNameButton
                                  type="button"
                                  onClick={() => handleOpenParticipantModal(p)}
                                >
                                  {p.nomeCompleto}
                                </ParticipantNameButton>
                                <ParticipantIndicators>
                                  {getParticipantIndicatorItems(
                                    participantDetailsCache[p.id] || p
                                  ).map((indicator) => {
                                    const Icon = indicator.icon;

                                    return (
                                      <IndicatorIcon
                                        key={indicator.key}
                                        title={indicator.label}
                                        aria-label={indicator.label}
                                      >
                                        <Icon size={14} />
                                      </IndicatorIcon>
                                    );
                                  })}
                                </ParticipantIndicators>
                              </ParticipantCellContent>
                            </TableCell>
                            <TableCell>
                              {new Date(p.dataNascimento).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{p.idade} anos</TableCell>
                            <TableCell>
                              <InstitutionNameText>
                                {formatInstitutionName(p.IE)}
                              </InstitutionNameText>
                            </TableCell>
                          </BodyRow>
                        ))}
                        <SummaryRow>
                          <SummaryCell colSpan={4}>
                            Total: {participantesDoGrupo.length}
                          </SummaryCell>
                        </SummaryRow>
                      </tbody>
                    </Table>
                  </TableContainer>
                </SectionCard>
              ))}
            </SectionStack>
          ) : abaAtiva === 'trabalhadores' ? (
            <SectionStack>
              <SectionCard>
                <SectionHeader>
                  <SectionTitle>Distribuição por comissão</SectionTitle>
                  <SectionMeta>Total de comissões: {dadosGrafico.length}</SectionMeta>
                </SectionHeader>
                <GraficoTrabalhadoresPorComissao dados={dadosGrafico} />
              </SectionCard>

              <FilterBar>
                <FilterGroup>
                  <FilterLabel htmlFor="filtro-comissao">
                    Filtrar por comissão
                  </FilterLabel>
                  <FilterInput
                    id="filtro-comissao"
                    type="text"
                    placeholder="Filtrar comissões..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                </FilterGroup>
              </FilterBar>

              {comissoesFiltradas.length === 0 ? (
                <StateMessage>
                  Nenhuma comissão encontrada para esse filtro.
                </StateMessage>
              ) : null}

              {comissoesFiltradas.map(([comissao, nomes]) => (
                <SectionCard key={comissao}>
                  <SectionHeader>
                    <SectionTitle>{comissao}</SectionTitle>
                    <SectionMeta>Total: {nomes.length}</SectionMeta>
                  </SectionHeader>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <tr>
                          <TableHeaderCell>Nome do Trabalhador</TableHeaderCell>
                        </tr>
                      </TableHead>
                      <tbody>
                        {nomes.map((nome, idx) => (
                          <BodyRow key={`${comissao}-${idx}`}>
                            <TableCell>{nome}</TableCell>
                          </BodyRow>
                        ))}
                        <SummaryRow>
                          <SummaryCell colSpan={1}>
                            Total de trabalhadores nesta comissão: {nomes.length}
                          </SummaryCell>
                        </SummaryRow>
                      </tbody>
                    </Table>
                  </TableContainer>
                </SectionCard>
              ))}
            </SectionStack>
          ) : (
            <SectionCard>
              <SectionHeader>
                <SectionTitle>Quantidade por instituição</SectionTitle>
                <SectionMeta>Total de instituições: {Object.keys(contagemPorIE).length}</SectionMeta>
              </SectionHeader>
              <TableContainer>
                <Table>
                  <TableHead>
                    <tr>
                      <TableHeaderCell>Instituição Espírita</TableHeaderCell>
                      <TableHeaderCell>Quantidade</TableHeaderCell>
                    </tr>
                  </TableHead>
                  <tbody>
                    {contagemPorIEOrdenada.map(([ie, qtd]) => (
                      <BodyRow key={ie}>
                        <TableCell>
                          <InstitutionNameText>
                            {formatInstitutionName(ie)}
                          </InstitutionNameText>
                        </TableCell>
                        <TableCell>{qtd}</TableCell>
                      </BodyRow>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </SectionCard>
          )}
          </FormCard>

          {isParticipantModalOpen ? (
            <ModalOverlay onClick={handleCloseParticipantModal}>
              <ModalCard onClick={(event) => event.stopPropagation()}>
                <ModalCloseButton type="button" onClick={handleCloseParticipantModal}>
                  Fechar
                </ModalCloseButton>

                <ModalTitle>
                  {participantModalData?.nomeCompleto || 'Detalhes do participante'}
                </ModalTitle>

                {isParticipantModalLoading ? (
                  <ModalStateMessage>Carregando dados do participante...</ModalStateMessage>
                ) : participantModalError ? (
                  <ModalStateMessage>{participantModalError}</ModalStateMessage>
                ) : (
                  <ModalContent>
                    <ModalSection>
                      <ModalSectionTitle>Dados principais</ModalSectionTitle>
                      <ModalInfoGrid>
                        <ModalInfoItem>
                          <ModalInfoLabel>Nome completo</ModalInfoLabel>
                          <ModalInfoValue>
                            {formatDetailValue(participantModalData?.nomeCompleto)}
                          </ModalInfoValue>
                        </ModalInfoItem>
                        <ModalInfoItem>
                          <ModalInfoLabel>Idade</ModalInfoLabel>
                          <ModalInfoValue>
                            {participantModalAge !== null ? `${participantModalAge} anos` : 'Não informado'}
                          </ModalInfoValue>
                        </ModalInfoItem>
                        <ModalInfoItem>
                          <ModalInfoLabel>Casa espírita / Instituição espírita</ModalInfoLabel>
                          <ModalInfoValue>
                            {formatDetailValue(participantModalData?.IE)}
                          </ModalInfoValue>
                        </ModalInfoItem>
                      </ModalInfoGrid>
                    </ModalSection>

                    <ModalSection>
                      <ModalSectionTitle>Acolhimento</ModalSectionTitle>
                      <ModalInfoGrid>
                        <ModalInfoItem>
                          <ModalInfoLabel>Alergias ou restrições alimentares</ModalInfoLabel>
                          <ModalInfoValue>
                            {formatDetailValue(selectedParticipant?.alergia)}
                          </ModalInfoValue>
                        </ModalInfoItem>
                        <ModalInfoItem>
                          <ModalInfoLabel>Uso de medicação</ModalInfoLabel>
                          <ModalInfoValue>
                            {formatDetailValue(selectedParticipant?.medicacao)}
                          </ModalInfoValue>
                        </ModalInfoItem>
                        <ModalInfoItem>
                          <ModalInfoLabel>Outras informações / observações</ModalInfoLabel>
                          <ModalInfoValue>
                            {formatDetailValue(selectedParticipant?.outrasInformacoes)}
                          </ModalInfoValue>
                        </ModalInfoItem>
                        <ModalInfoItem>
                          <ModalInfoLabel>Alimentação</ModalInfoLabel>
                          <ModalInfoValue>
                            {formatDetailValue(selectedParticipant?.vegetariano)}
                          </ModalInfoValue>
                        </ModalInfoItem>
                        <ModalInfoItem>
                          <ModalInfoLabel>Condições informadas</ModalInfoLabel>
                          <ModalConditionList>
                            {participantCareConditions.map((condition) => (
                              <ModalConditionTag key={condition}>{condition}</ModalConditionTag>
                            ))}
                          </ModalConditionList>
                        </ModalInfoItem>
                        {selectedParticipant?.deficienciaOutra ? (
                          <ModalInfoItem>
                            <ModalInfoLabel>Descrição de outra condição</ModalInfoLabel>
                            <ModalInfoValue>
                              {formatDetailValue(selectedParticipant?.deficienciaOutraDescricao)}
                            </ModalInfoValue>
                          </ModalInfoItem>
                        ) : null}
                      </ModalInfoGrid>
                    </ModalSection>
                  </ModalContent>
                )}
              </ModalCard>
            </ModalOverlay>
          ) : null}
        </ContentWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default ListaParticipantes;

const Container = styled.div`
  min-height: 100vh;
  background: #f5f7fb;
  padding: calc(24px + ${APP_HEADER_HEIGHT}) 24px 24px;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 767px) {
    padding: calc(16px + ${APP_HEADER_HEIGHT_MOBILE}) 16px 16px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1560px;
`;

const FormCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.06);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 767px) {
    padding: 18px;
    border-radius:5px;
    gap: 18px;
  }
`;

const PageHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.75rem, 3.2vw, 2.125rem);
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #111827;
`;

const PageSubtitle = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;

  @media (min-width: 1280px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;

const KpiCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  box-shadow: 0 10px 24px -22px rgba(17, 24, 39, 0.16);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const KpiLabel = styled.span`
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #6b7280;
  font-weight: 500;
`;

const KpiValue = styled.strong`
  font-size: 1.875rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: ${({ $tone }) => {
    if ($tone === 'success') return '#15803d';
    if ($tone === 'warning') return '#b45309';
    return '#111827';
  }};
`;

const Tabs = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 2px;

  @media (max-width: 767px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }
`;

const TabButton = styled.button`
  border: none;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  cursor: pointer;
  flex: 0 0 auto;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: -0.014em;
  background: ${({ $active }) => ($active ? '#1f2133' : '#f3f4f6')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#374151')};
  box-shadow: ${({ $active }) =>
    $active
      ? '0 10px 20px -18px rgba(17, 24, 39, 0.28)'
      : 'inset 0 0 0 1px rgba(229, 231, 235, 0.9)'};
  transition:
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const FilterBar = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 460px);
  gap: 14px;
  align-items: flex-end;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: min(100%, 320px);
  flex: 1 1 320px;
`;

const FilterLabel = styled.label`
  font-size: 0.85rem;
  line-height: 1.4;
  font-weight: 600;
  color: #374151;
`;

const FilterInput = styled.input`
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  color: #111827;
  font-size: 0.9375rem;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`;

const TableCard = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 12px 28px -24px rgba(17, 24, 39, 0.18);
  overflow: hidden;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
`;

const MainTable = styled(Table)`
  min-width: 1180px;
  table-layout: fixed;
`;

const TableHead = styled.thead`
  background: #f8fafc;
`;

const TableHeaderCell = styled.th`
  padding: 14px 16px;
  text-align: left;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  white-space: ${({ $nowrap }) => ($nowrap ? 'nowrap' : 'normal')};
`;

const BodyRow = styled.tr`
  &:nth-child(even) {
    background: #fbfcfe;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const SummaryRow = styled.tr`
  background: #f8fafc;
`;

const TableCell = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #eef2f7;
  font-size: 0.875rem;
  line-height: 1.45;
  color: #475569;
  white-space: ${({ $nowrap }) => ($nowrap ? 'nowrap' : 'normal')};
  word-break: break-word;
  vertical-align: middle;
`;

const InstitutionNameText = styled.span`
  display: inline-block;
  text-transform: uppercase;
`;

const SummaryCell = styled.td`
  padding: 14px 16px;
  border-bottom: none;
  text-align: right;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
`;

const TableLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.18s ease;

  &:hover {
    color: #1d4ed8;
  }
`;

const ParticipantNameButton = styled.button`
  padding: 0;
  border: none;
  background: transparent;
  color: #0f172a;
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: color 0.18s ease;

  &:hover {
    color: #2563eb;
  }
`;

const ParticipantCellContent = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ParticipantIndicators = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const IndicatorIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: color 0.18s ease;

  &:hover {
    color: #334155;
  }
`;

const StatusSelect = styled.select`
  width: 100%;
  min-width: 118px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid ${({ $appearance }) => $appearance?.borderColor || 'rgba(148, 163, 184, 0.28)'};
  background: ${({ $appearance }) => $appearance?.backgroundColor || 'rgba(248, 250, 252, 0.96)'};
  color: ${({ $appearance }) => $appearance?.textColor || '#475569'};
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: none;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`;

const ActionButton = styled.button`
  width: 100%;
  min-width: 96px;
  min-height: 34px;
  padding: 0 12px;
  border: none;
  border-radius: 10px;
  background: #1f2133;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 600;
  transition:
    background 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
  box-shadow: 0 10px 18px -18px rgba(17, 24, 39, 0.35);

  &:hover {
    background: #2b2d42;
    transform: translateY(-1px);
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SectionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const SectionCard = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  box-shadow: 0 12px 28px -24px rgba(17, 24, 39, 0.18);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 767px) {
    padding: 14px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
`;

const SectionMeta = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
`;

const StateMessage = styled.p`
  margin: 0;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.32);

  @media (max-width: 767px) {
    padding: 16px;
    align-items: flex-start;
  }
`;

const ModalCard = styled.div`
  width: min(760px, 100%);
  max-height: min(88vh, 820px);
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.16);
  padding: 24px;
  position: relative;

  @media (max-width: 767px) {
    width: 100%;
    max-height: calc(100vh - 32px);
    padding: 18px;
    margin-top: 8px;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.18s ease;

  &:hover {
    color: #0f172a;
  }
`;

const ModalTitle = styled.h2`
  margin: 0 48px 20px 0;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.35;
  color: #111827;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ModalSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  background: #fbfcfe;
`;

const ModalSectionTitle = styled.h3`
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
  color: #111827;
`;

const ModalInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const ModalInfoItem = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ModalInfoLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #64748b;
`;

const ModalInfoValue = styled.span`
  font-size: 0.95rem;
  line-height: 1.55;
  color: #1f2937;
  word-break: break-word;
`;

const ModalConditionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ModalConditionTag = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  font-size: 0.85rem;
  font-weight: 600;
`;

const ModalStateMessage = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
`;


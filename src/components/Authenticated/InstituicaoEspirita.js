import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { FiEdit, FiHome, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppHeader, {
  APP_HEADER_HEIGHT,
  APP_HEADER_HEIGHT_MOBILE,
  AppHeaderBadge,
} from '../shared/AppHeader';

const appHeaderTheme = {
  borderColor: '#e5e7eb',
  secondaryText: '#6b7280',
  textColor: '#111827',
  inputFocus: '#2563eb',
};

const FIELD_LABELS = {
  sigla: 'Sigla',
  nome: 'Nome da instituição',
  CNPJ: 'CNPJ',
  estado: 'Estado',
  cidade: 'Cidade',
  bairro: 'Bairro',
  logradouro: 'Logradouro',
  numero: 'Número',
  complemento: 'Complemento',
  telefone: 'Telefone',
  dia: 'Dia',
  email: 'E-mail',
};

const Container = styled.div`
  min-height: 100vh;
  background: #f5f7fb;
  padding: calc(24px + ${APP_HEADER_HEIGHT}) 24px 24px;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: calc(16px + ${APP_HEADER_HEIGHT_MOBILE}) 16px 16px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
`;

const FormCard = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.06);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 18px;
    gap: 16px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.125rem);
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #111827;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 760px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ActionButton = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 13px;
  border: 1px solid ${({ $active }) => ($active ? '#1f2133' : '#d1d5db')};
  background: ${({ $active }) => ($active ? '#1f2133' : 'rgba(255, 255, 255, 0.92)')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#374151')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? '#2b2d42' : '#ffffff')};
    border-color: ${({ $active }) => ($active ? '#2b2d42' : '#cbd5e1')};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    flex: 1 1 180px;
  }
`;

const ModeNotice = styled.p`
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.55;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 460px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  line-height: 1.4;
  font-weight: 600;
  color: #374151;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const StyledSelect = styled.select`
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  font-size: 0.95rem;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
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
  min-width: 720px;
`;

const TableHead = styled.thead`
  background: #f8fafc;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #fbfcfe;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const TableHeaderCell = styled.th`
  padding: 14px 16px;
  text-align: left;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const TableCell = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #eef2f7;
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.5;
  vertical-align: middle;
`;

const FieldName = styled.span`
  font-weight: 600;
  color: #111827;
`;

const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  color: #111827;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  &:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(
    180deg,
    rgba(255, 249, 249, 0.98) 0%,
    rgba(254, 242, 242, 0.98) 100%
  );
  border: 1px solid rgba(248, 113, 113, 0.18);
  border-left: 3px solid rgba(239, 68, 68, 0.38);
  color: #7f1d1d;
  box-shadow: 0 10px 22px -20px rgba(239, 68, 68, 0.3);
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SubmitButton = styled.button`
  flex: 1;
  min-height: 44px;
  padding: 0 16px;
  border: none;
  border-radius: 13px;
  background: #1f2133;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
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

const SecondaryButton = styled.button`
  flex: 1;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 13px;
  border: 1px solid #d1d5db;
  background: rgba(255, 255, 255, 0.92);
  color: #374151;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    background: #ffffff;
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
`;





const IePage = () => {
  const navigate = useNavigate();
  const [formMode, setFormMode] = useState('');
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [formData, setFormData] = useState({
    sigla: '',
    nome: '',
    CEU: '',
    CNPJ: '',
    estado: '',
    cidade: '',
    bairro: '',
    logradouro: '',
    numero: '',
    complemento: '',
    telefone: '',
    dia: '',
    horario: '',
    email: '',
  });
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  useEffect(() => {
    if (!API_URL) {
      console.error('API_URL não definida!');
      return;
    }

    const fetchInstitutions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token não encontrado!');
          alert('Você precisa estar autenticado!');
          return;
        }

        const response = await axios.get(`${API_URL}/api/auth/instituicoes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Dados recebidos da API:', response.data);
        setInstitutions(response.data);
      } catch (error) {
        console.error('Erro ao carregar instituições:', error);
        alert('Erro ao carregar lista de instituições');
      }
    };

    fetchInstitutions();
  }, [API_URL]);

  useEffect(() => {
    if (selectedInstitution) {
      setFormData(selectedInstitution);
    } else {
      setFormData({
        sigla: '',
        nome: '',
        CEU: '',
        CNPJ: '',
        estado: '',
        cidade: '',
        bairro: '',
        logradouro: '',
        numero: '',
        complemento: '',
        telefone: '',
        dia: '',
        horario: '',
        email: '',
      });
    }
  }, [selectedInstitution]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Validação simples para garantir que o CNPJ está preenchido
    if (!formData.CNPJ || formData.CNPJ.trim() === '') {
      setError('O CNPJ é obrigatório.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação do formulário
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      const normalizedFormData = {
        ...formData,
        email: String(formData.email || '').trim().toLowerCase(),
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (formMode === 'adicionar') {
        console.log('Tentando adicionar nova instituição');
        await axios.post(`${API_URL}/api/auth/novainstituicao`, normalizedFormData, config);
        alert('Instituição adicionada com sucesso!');

        // Limpar o formulário após a adição
        setFormData({
          sigla: '',
          nome: '',
          CNPJ: '',
          CEU: '',
          
          estado: '',
          cidade: '',
          bairro: '',
          logradouro: '',
          numero: '',
          complemento: '',
          telefone: '',
          dia: '',
          horario: '',
          email: '',
        });

      } else if (formMode === 'alterar' && selectedInstitution) {
        console.log('Tentando alterar instituição com id:', selectedInstitution.id);
        await axios.put(
          `${API_URL}/api/auth/editarinstituicao/${selectedInstitution.id}`,
          normalizedFormData,
          config
        );
        alert('Instituição atualizada com sucesso!');
      } else {
        console.log('Modo inválido ou instituição não selecionada');
        alert('Selecione uma instituição para editar ou alterne para o modo de adição.');
        return;
      }

      setFormMode('');
      setSelectedInstitution(null);

      // Recarregar a lista de instituições após adição/edição
      const response = await axios.get(`${API_URL}/api/auth/listarinstituicoes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setInstitutions(response.data);
    } catch (error) {
      console.error('Erro ao salvar instituição:', error);
      alert('Erro ao salvar instituição.');
    }
  };

  const handleModeChange = (mode) => {
    setFormMode(mode);
    setSelectedInstitution(null);
    setError('');
  };

  return (
    <ThemeProvider theme={appHeaderTheme}>
      <Container>
        <AppHeader
          showBack
          onBack={() => navigate(-1)}
          rightContent={<AppHeaderBadge>COMEJACA 2026</AppHeaderBadge>}
          maxWidth="1480px"
        />

        <ContentWrapper>
          <FormCard>
            <PageHeader>
              <TitleBlock>
                <Title>Instituições Espíritas</Title>
                <Subtitle>
                  Cadastre e atualize instituições com o mesmo padrão visual do restante do sistema.
                </Subtitle>
              </TitleBlock>

              <ButtonContainer>
                <ActionButton
                  type="button"
                  $active={formMode === 'adicionar'}
                  onClick={() => handleModeChange('adicionar')}
                >
                  <FiPlus size={16} />
                  Adicionar
                </ActionButton>
                <ActionButton
                  type="button"
                  $active={formMode === 'alterar'}
                  onClick={() => handleModeChange('alterar')}
                >
                  <FiEdit size={16} />
                  Alterar
                </ActionButton>
              </ButtonContainer>
            </PageHeader>

            {formMode === 'adicionar' ? (
              <ModeNotice>
                Você está no modo de adicionar instituição espírita.
              </ModeNotice>
            ) : null}

            {formMode === 'alterar' ? (
              <ModeNotice>
                Você está no modo de alterar instituição espírita.
              </ModeNotice>
            ) : null}

            {formMode === 'alterar' && (
              <SearchContainer>
                <Label>
                  <FiHome size={16} />
                  Banco de Instituições Espíritas
                </Label>
                <StyledSelect
                  value={selectedInstitution?.id || ''}
                  onChange={(e) => {
                    const institution = institutions.find(
                      (inst) => inst.id === parseInt(e.target.value, 10)
                    );
                    setSelectedInstitution(institution);
                  }}
                >
                  <option value="">Selecione uma instituição</option>
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.nome}
                    </option>
                  ))}
                </StyledSelect>
              </SearchContainer>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <tr>
                    <TableHeaderCell>Campo</TableHeaderCell>
                    <TableHeaderCell>Valor</TableHeaderCell>
                  </tr>
                </TableHead>
                <tbody>
                  {Object.entries(formData).map(([key, value]) =>
                    key !== 'CEU' && key !== 'horario' ? (
                      <TableRow key={key}>
                        <TableCell>
                          <FieldName>{FIELD_LABELS[key] || key}</FieldName>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            name={key}
                            value={value}
                            onChange={handleChange}
                            disabled={formMode === 'alterar' && !selectedInstitution}
                          />
                        </TableCell>
                      </TableRow>
                    ) : null
                  )}
                </tbody>
              </Table>
            </TableContainer>

            {error ? <ErrorMessage>{error}</ErrorMessage> : null}

            <FormActions>
              <SubmitButton onClick={handleSubmit} type="button">
                Salvar
              </SubmitButton>
              <SecondaryButton type="button" onClick={() => navigate(-1)}>
                Voltar
              </SecondaryButton>
            </FormActions>
          </FormCard>
        </ContentWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default IePage;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSave, FiArrowLeft, FiEdit, FiPlus, FiChevronLeft, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Estilos
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #22223b, #40434e, #22223b);
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0rem;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 5px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem;

  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
 
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #22223b;
  font-weight: 600;
  margin: 0;
text-align: center;
  @media (max-width: 768px) {
    font-size: 1.5rem;
    text-align: center;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #4a4e69, #22223b);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s, opacity 0.3s;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
    padding: 0.8rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.8rem;
  background: #f9f9f9;
  color: #22223b;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  appearance: none; /* Remove estilo padrão do navegador */

  &:focus {
    outline: none;
    border-color: #4a4e69;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 5px;
  margin-top: 1rem;
border:#ccc solid 1px;
  @media (max-width: 768px) {
    overflow-x: unset;
    margin-top: 5px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TableHead = styled.thead`
  background: #4a4e69;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #f1f3f5;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1.2rem 1.5rem;
  font-weight: 600;
  


  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;

  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const BackLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  transition: opacity 0.3s;
  cursor: pointer;
  width: fit-content;

  &:hover {
    opacity: 0.8;
  }
  @media (max-width: 768px) {
 padding-top: 1rem;

  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #4a4e69, #22223b);
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: #f9f9f9;
  color: #22223b;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a4e69;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  padding-left: 3rem;
  border: 1px solid #ddd;
  border-radius: 0.8rem;
  background: #f9f9f9;
  color: #22223b;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a4e69;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: #888;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 1.2rem;
`;

const SuggestionsList = styled.ul`
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 0.8rem;
  margin-top: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const SuggestionItem = styled.li`
  padding: 1rem;
  cursor: pointer;
  color: #22223b;
  font-family: 'Poppins', sans-serif;
  transition: background 0.3s ease;

  &:hover {
    background: #f1f3f5;
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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (formMode === 'adicionar') {
        console.log('Tentando adicionar nova instituição');
        await axios.post(`${API_URL}/api/auth/novainstituicao`, formData, config);
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
          formData,
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
    <Container>
      <ContentWrapper>
        <BackLink onClick={() => navigate(-1)}>
          <FiChevronLeft /> Voltar
        </BackLink>
        <FormCard>
          <Header>
            <Title>INSTITUIÇÃO ESPÍRITA</Title>
            <ButtonContainer>
              <ActionButton onClick={() => handleModeChange('adicionar')}>
                <FiPlus size={18} /> Adicionar
              </ActionButton>
              <ActionButton onClick={() => handleModeChange('alterar')}>
                <FiEdit size={18} /> Alterar
              </ActionButton>
            </ButtonContainer>
          </Header>

          {formMode === 'alterar' && (
            <SearchContainer>
              <Select
                value={selectedInstitution?.id || ''}
                onChange={(e) => {
                  const institution = institutions.find(
                    (inst) => inst.id === parseInt(e.target.value)
                  );
                  setSelectedInstitution(institution);
                }}
              >
                <option value="">Selecione uma instituição</option>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.nome}
                  </option>
                ))}
              </Select>
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
                      <TableCell>{key}</TableCell>
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

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '25px' }}>
            <SubmitButton onClick={handleSubmit} type="submit">
              Salvar
            </SubmitButton>
            <SubmitButton
              type="button"
              onClick={() => navigate(-1)}
              style={{ background: '#888' }}
            >
              Voltar
            </SubmitButton>
          </div>
        </FormCard>
      </ContentWrapper>
    </Container>
  );
};

export default IePage;

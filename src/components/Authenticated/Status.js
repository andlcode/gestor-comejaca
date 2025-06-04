import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ListaParticipantes = () => {
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroIE, setFiltroIE] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
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
  }, []);
  const handleStatusChange = async (participanteId, novoStatus) => {
    try {
      const response = await axios.put(`${API_URL}/api/auth/pagamentos/${participanteId}/status`, {
        statusPagamento: novoStatus,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Dados recebidos da API:', response.data);

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
  const participantesFiltrados = participantes.filter((p) =>
    p.IE.toLowerCase().includes(filtroIE.toLowerCase())
  );
const getContagemPorIE = () => {
  const contagem = {};

  participantes.forEach((p) => {
    const instituicao = p.IE || 'N/A';
    contagem[instituicao] = (contagem[instituicao] || 0) + 1;
  });

  return contagem;
};

const contagemPorIE = getContagemPorIE();

  const getStatusCounts = () => {
    let pago = 0;
    let pendente = 0;
    let N_A = 0;

    participantes.forEach((p) => {
      if (p.statusPagamento === 'pago') {
        pago++;
      } else if (p.statusPagamento === 'pendente') {
        pendente++;
      } else {
        N_A++;
      }
    });

    return { pago, pendente, N_A };
  };
  const { pago, pendente, N_A } = getStatusCounts();
const getTipoParticipacaoCounts = () => {
  let confraternistas = 0;
  let trabalhadores = 0;

  participantes.forEach((p) => {
    if (p.tipoParticipacao === 'Confraternista') {
      confraternistas++;
    } else if (p.tipoParticipacao === 'Trabalhador') {
      trabalhadores++;
    }
  });

  return { confraternistas, trabalhadores };
};

const { confraternistas, trabalhadores } = getTipoParticipacaoCounts();

  
  return (
    <Container>
      <ContentWrapper>
        <FormCard>
          <Header>
            <Title>HISTORICO DE PAGAMENTOS</Title>
          </Header>
          <FilterWrapper>
            <label>Filtrar por Instituição Espírita:</label>
            <input
              type="text"
              placeholder="Digite o nome da instituição..."
              value={filtroIE}
              onChange={(e) => setFiltroIE(e.target.value)} // Atualiza o filtro
            />
          </FilterWrapper>
          {loading ? (
            <p>Carregando participantes...</p>
          ) : (

            <>
          <SummaryTable>
  <thead>
    <tr>
      <TableHeader>Total</TableHeader>
      <TableHeader>Quantidade</TableHeader>
    </tr>
  </thead>
  <tbody>
    <tr>
      <TableCell>Total de Inscritos</TableCell>
      <TableCell>{participantes.length}</TableCell>
    </tr>
     <tr>
      <TableCell>Total de Confraternistas</TableCell>
      <TableCell>{confraternistas}</TableCell>
    </tr>
    <tr>
      <TableCell>Total de Trabalhadores</TableCell>
      <TableCell>{trabalhadores}</TableCell>
    </tr>
    <tr>
      <TableCell>Total Pagos</TableCell>
      <TableCell>{pago}</TableCell>
    </tr>
    <tr>
      <TableCell>Total Pendentes</TableCell>
      <TableCell>{pendente}</TableCell>
    </tr>
    <tr>
      <TableCell>Total N/A</TableCell>
      <TableCell>{N_A}</TableCell>
    </tr>
   
  </tbody>
</SummaryTable>

         
  {/* Espaçamento */}
  <div style={{ height: '2rem' }} />

  {/* Tabela por IE */}
  <SummaryTable>
    <thead>
      <tr>
        <TableHeader>Instituição Espírita</TableHeader>
        <TableHeader>Quantidade</TableHeader>
      </tr>
    </thead>
    <tbody>
      {Object.entries(contagemPorIE).map(([ie, qtd], index) => (
        <tr key={index}>
          <TableCell>{ie}</TableCell>
          <TableCell>{qtd}</TableCell>
        </tr>
      ))}
    </tbody>
  </SummaryTable>   
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Nome</TableHeaderCell>
                    <TableHeaderCell>Instituição Espirita</TableHeaderCell>
                    <TableHeaderCell>Comissão</TableHeaderCell>
                    <TableHeaderCell>Status Pagamento</TableHeaderCell>
                    <TableHeaderCell>Link</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <tbody>
  {participantesFiltrados.map((p, index) => (
    <TableRow key={index}>
      <TableCell>{p.nomeCompleto}</TableCell>
      <TableCell>{p.IE}</TableCell>
            <TableCell>{p.tipoParticipacao}</TableCell>

      <TableCell>
        <select
          value={p.statusPagamento }
          onChange={(e) => handleStatusChange(p.id, e.target.value)}
        >
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
          <option value="N/A">N/A</option>
        </select>
      </TableCell>
      <TableCell>
        {p.linkPagamento ? (
          <a href={p.linkPagamento} target="_blank" rel="noopener noreferrer">
            Acessar
          </a>
        ) : (
          'N/A'
        )}
      </TableCell>
    </TableRow>
  ))}
</tbody>

              </Table>
            </TableContainer>
          
            </>
          )}

        </FormCard>
      </ContentWrapper>
    </Container>
    
  );
};

export default ListaParticipantes;

// ==========================
// Styled Components abaixo
// ==========================

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e7ecef, #e7ecef, #e7ecef);
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
  background: #e7ecef;
  padding: 2.5rem;
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
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 5px;
  margin-top: 1rem;
  border: #ccc solid 1px;

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
  background: #0d1b2a;
  color: white;
`;

const TableRow = styled.tr`
width: 800px;
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



const FilterWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
  }

  input {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
`;

const StatusCounts = styled.div`
  margin-bottom: 1rem;
  p {
    font-size: 1.2rem;
    color: #333;
    font-weight: 500;
  }
`;
const SummaryTable = styled.table`
  width: 100%;
  max-width: 400px;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background: white;
  border-radius: 6px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  background-color: #0d1b2a;
  color: white;
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 1rem;
`;
const TableCell = styled.td`
  border-bottom: 1px solid #e9ecef;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #333;
  white-space: nowrap; /* 👈 evita quebra de linha */
  overflow: hidden;
  text-overflow: ellipsis; /* opcional: adiciona "..." se o texto for muito longo */
  max-width: 250px; /* opcional: limite de largura */
`;

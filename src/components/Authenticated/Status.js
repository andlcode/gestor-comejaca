import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import styled from "styled-components";

const ListaParticipantes = () => {
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroIE, setFiltroIE] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("lista"); // 'lista', 'trabalhadores', 'instituicoes'
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/pagamentos/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setParticipantes(response.data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar participantes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipantes();
  }, [API_URL]);

    const calcularIdadeEmData = (nascimentoStr, dataRef = "2025-07-19") => {
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
    if (idade < 11) return "Pequenos Companheiros";
    if (idade <= 12) return "Polén de Esperança";
    if (idade <= 14) return "Semente de Amor";
    if (idade <= 17) return "Flores de Amor";
    if (idade <= 20) return "Colheita de Amor";
    if (idade <= 26) return "Tafereiros do Bem";
    return "Pais";
  };
  const handleStatusChange = async (participanteId, novoStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/auth/pagamentos/${participanteId}/status`,
        { statusPagamento: novoStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Dados recebidos da API:", response.data);

      setParticipantes((prev) =>
        prev.map((p) =>
          p.id === participanteId ? { ...p, statusPagamento: novoStatus } : p
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar o status do pagamento.");
    }
  };

  // Filtros e memos
  const participantesFiltrados = useMemo(
    () =>
      participantes.filter((p) =>
        p.IE.toLowerCase().includes(filtroIE.toLowerCase())
      ),
    [participantes, filtroIE]
  );

  const contagemPorIE = useMemo(() => {
    const contagem = {};
    participantes.forEach((p) => {
      const instituicao = p.IE || "N/A";
      contagem[instituicao] = (contagem[instituicao] || 0) + 1;
    });
    return contagem;
  }, [participantes]);

  const { pago, pendente, N_A } = useMemo(() => {
    let pago = 0,
      pendente = 0,
      N_A = 0;
    participantes.forEach((p) => {
      if (p.statusPagamento === "pago") pago++;
      else if (p.statusPagamento === "pendente") pendente++;
      else N_A++;
    });
    return { pago, pendente, N_A };
  }, [participantes]);

  const { confraternistas, trabalhadores } = useMemo(() => {
    let confraternistas = 0,
      trabalhadores = 0;
    participantes.forEach((p) => {
      if (p.tipoParticipacao === "Confraternista") confraternistas++;
      else if (p.tipoParticipacao === "Trabalhador") trabalhadores++;
    });
    return { confraternistas, trabalhadores };
  }, [participantes]);

  const trabalhadoresPorComissao = useMemo(() => {
    const grupos = {};
    participantes.forEach((p) => {
      if (p.tipoParticipacao === "Trabalhador") {
        const comissao = p.comissao || "Sem Comissão";
        if (!grupos[comissao]) {
          grupos[comissao] = [];
        }
        grupos[comissao].push(p.nomeCompleto);
      }
    });
    return grupos;
  }, [participantes]);
const listaGFE = useMemo(() => {
  return participantes
    .filter((p) => p.tipoParticipacao === "Confraternista")
    .map((p) => {
      const idade = calcularIdadeEmData(p.dataNascimento);
      const gfe = classificarGFE(idade);
      return { ...p, idade, gfe };
    });
}, [participantes]);
  return (
    <Container>
      <ContentWrapper>
        <FormCard>
          <Header>
            <Title>GESTÃO DE INSCRITOS</Title>
          </Header>

      

          <Tabs>
            <TabButton
              active={abaAtiva === "lista"}
              onClick={() => setAbaAtiva("lista")}
            >
              Lista Completa
            </TabButton>
            <TabButton
              active={abaAtiva === "trabalhadores"}
              onClick={() => setAbaAtiva("trabalhadores")}
            >
              Trabalhadores por Comissão
            </TabButton>
            <TabButton
              active={abaAtiva === "instituicoes"}
              onClick={() => setAbaAtiva("instituicoes")}
            >
              Quantidade por Instituição
            </TabButton>
               <TabButton
              active={abaAtiva === "gfe"}
              onClick={() => setAbaAtiva("gfe")}
            >
              Classificação por GFE
            </TabButton>
            
          </Tabs>

          {loading ? (
            <p>Carregando participantes...</p>
          ) : abaAtiva === "lista" ? (
            <>
              <ResumoTable>
                <tbody>
                  <ResumoLinha titulo="Total de Inscritos" valor={participantes.length} />
                  <ResumoLinha titulo="Total de Confraternistas" valor={confraternistas} />
                  <ResumoLinha titulo="Total de Trabalhadores" valor={trabalhadores} />
                  <ResumoLinha titulo="Total Pagos" valor={pago} />
                  <ResumoLinha titulo="Total Pendentes" valor={pendente} />
                  <ResumoLinha titulo="Total N/A" valor={N_A} />
                </tbody>
              </ResumoTable>
    <FilterWrapper>
            <label>Filtrar por Instituição Espírita:</label>
            <input
              type="text"
              placeholder="Digite o nome da instituição..."
              value={filtroIE}
              onChange={(e) => setFiltroIE(e.target.value)}
            />
          </FilterWrapper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Nome</TableHeaderCell>
                      <TableHeaderCell>Instituição Espírita</TableHeaderCell>
                      <TableHeaderCell>Comissão</TableHeaderCell>
                      <TableHeaderCell>Status Pagamento</TableHeaderCell>
                      <TableHeaderCell>Link</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <tbody>
                    {participantesFiltrados.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.nomeCompleto}</TableCell>
                        <TableCell>{p.IE}</TableCell>
                        <TableCell>
                          {p.tipoParticipacao === "Trabalhador"
                            ? p.comissao || "Sem Comissão"
                            : p.tipoParticipacao}
                        </TableCell>
                        <TableCell>
                          <select
                            value={p.statusPagamento}
                            onChange={(e) =>
                              handleStatusChange(p.id, e.target.value)
                            }
                          >
                            <option value="pendente">Pendente</option>
                            <option value="pago">Pago</option>
                            <option value="N/A">N/A</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          {p.linkPagamento ? (
                            <a
                              href={p.linkPagamento}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Acessar
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </>
      ) : abaAtiva === "gfe" ? (
  <>
    {Object.entries(
      listaGFE.reduce((acc, participante) => {
        const gfe = participante.gfe || "Não Informado";
        if (!acc[gfe]) acc[gfe] = [];
        acc[gfe].push(participante);
        return acc;
      }, {})
    ).map(([gfe, participantes]) => {
      const participantesOrdenados = participantes.sort((a, b) => a.idade - b.idade);

      return (
        <div key={gfe}>
          <h3>{gfe}</h3>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Nome</TableHeaderCell>
                  <TableHeaderCell>Data de Nascimento</TableHeaderCell>
                  <TableHeaderCell>Idade</TableHeaderCell>
                  <TableHeaderCell>GFE</TableHeaderCell>
                </TableRow>
              </TableHead>
              <tbody>
                {participantesOrdenados.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.nomeCompleto}</TableCell>
                    <TableCell>{new Date(p.dataNascimento).toLocaleDateString()}</TableCell>
                    <TableCell>{p.idade} anos</TableCell>
                    <TableCell>{p.gfe}</TableCell>
                  </TableRow>
                ))}

                   <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>
                    Total: {participantes.length}
                  </TableCell>
                </TableRow>
              </tbody>

              
            </Table>
          </TableContainer>
          <br />
        </div>
      );
    })}
  </>
) :
  abaAtiva === "trabalhadores" ? (
            // Aba Trabalhadores por Comissão
            <>
              {Object.entries(trabalhadoresPorComissao).map(
                ([comissao, nomes]) => (
                  <ComissaoGroup key={comissao}>
                    <ComissaoTitle>{comissao}</ComissaoTitle>
                    <ul>
                      {nomes.map((nome, idx) => (
                        <li key={idx}>{nome}</li>
                      ))}
                    </ul>
                    <ComissaoCount>
                      Total de trabalhadores nesta comissão: {nomes.length}
                    </ComissaoCount>
                  </ComissaoGroup>
                )
              )}
            </>
          ) : (
            // Aba Quantidade por Instituição Espírita
            <ResumoTable>
              <thead>
                <tr>
                  <TableHeader>Instituição Espírita</TableHeader>
                  <TableHeader>Quantidade</TableHeader>
                </tr>
              </thead>
              <tbody>
                {Object.entries(contagemPorIE).map(([ie, qtd]) => (
                  <tr key={ie}>
                    <TableCell>{ie}</TableCell>
                    <TableCell>{qtd}</TableCell>
                  </tr>
                ))}
              </tbody>
            </ResumoTable>
          )}
        </FormCard>
      </ContentWrapper>
    </Container>
  );
};

const ResumoLinha = ({ titulo, valor }) => (
  <tr>
    <TableCell>{titulo}</TableCell>
    <TableCell>{valor}</TableCell>
  </tr>
);

export default ListaParticipantes;

// ==========================
// Styled Components
// ==========================

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e7ecef, #e7ecef);
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const FormCard = styled.div`
  background: #e7ecef;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #22223b;
  font-weight: 600;
  text-align: center;
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

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-bottom: 3px solid
    ${({ active }) => (active ? "#0d1b2a" : "transparent")};
  background: transparent;
  font-weight: ${({ active }) => (active ? "700" : "400")};
  color: ${({ active }) => (active ? "#0d1b2a" : "#666")};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #0d1b2a;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 5px;
  border: #ccc solid 1px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 5px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background: #0d1b2a;
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
`;

const TableHeader = styled.th`
  background-color: #0d1b2a;
  color: white;
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 600;
`;

const TableCell = styled.td`
  border-bottom: 1px solid #e9ecef;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
`;

const ResumoTable = styled.table`
  width: 100%;
  max-width: 400px;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: white;
  border-radius: 6px;
  overflow: hidden;
`;

const ComissaoGroup = styled.div`
  margin-bottom: 2rem;

  ul {
    list-style: disc inside;
    padding-left: 1rem;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    background: #fafafa;
  }
`;

const ComissaoTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: #22223b;
  border-bottom: 2px solid #0d1b2a;
  padding-bottom: 0.2rem;
`;

const ComissaoCount = styled.p`
  font-weight: 600;
  color: #444;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;


// Container para centralizar tudo
const Centralizado = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

// Botões de filtro
const BotaoFiltro = styled.button`
  margin: 0 5px;
  padding: 8px 12px;
  background-color: #6a0dad; // roxo
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #854cc7;
  }

  &.ativo {
    background-color: #3d0066;
  }
`;

const Titulo = styled.h2`
  margin-bottom: 10px;
  color: #333;
`;
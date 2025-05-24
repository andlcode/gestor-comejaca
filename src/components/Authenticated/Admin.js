import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListaInscricoes = () => {
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const carregarInscricoes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/inscricoes');
      setInscricoes(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
      setMensagem('Erro ao carregar inscrições.');
    } finally {
      setLoading(false);
    }
  };

  const gerarNovoLink = async (id) => {
    try {
      setMensagem('');
      const response = await axios.post(`/api/gerar-novo-link/${id}`);
      if (response.data.success) {
        setMensagem(`Novo link gerado com sucesso para ${id}`);
        carregarInscricoes(); // Atualiza a lista após gerar novo link
      } else {
        setMensagem(`Erro: ${response.data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao gerar novo link de pagamento.');
    }
  };

  useEffect(() => {
    carregarInscricoes();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Lista de Inscrições</h2>
      {mensagem && <p>{mensagem}</p>}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Data de Nascimento</th>
              <th>Status</th>
              <th>Link</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {inscricoes.map((p) => (
              <tr key={p.id}>
                <td>{p.nomeCompleto}</td>
                <td>{p.email}</td>
                <td>{new Date(p.dataNascimento).toLocaleDateString()}</td>
                <td>{p.statusPagamento}</td>
                <td>
                  {p.linkPagamento ? (
                    <a href={p.linkPagamento} target="_blank" rel="noopener noreferrer">
                      Acessar
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <button onClick={() => gerarNovoLink(p.id)}>
                    Gerar Novo Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaInscricoes;

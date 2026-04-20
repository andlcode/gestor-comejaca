import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Container estilizado (mobile first)
const SessaoContainer = styled.div`
  background-color: #0d1b2a;
  color: white;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  justify-content: center;
  text-align: left;

  @media(min-width: 600px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  
  }
`;

const Texto = styled.span`
  font-size: 0.8rem;
  line-height: 1.4;
  word-break: break-word;



  @media(min-width: 600px) {
    font-size: 0.8rem;
  }
`;

const SessaoInfo = () => {
  const [tempoRestante, setTempoRestante] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const nomeArmazenado = localStorage.getItem('nome');
    const emailArmazenado = localStorage.getItem('email');

    setNome(nomeArmazenado || 'Usuário Desconectado');
    setEmail(emailArmazenado || 'Usuário desconectado');

    const deadline = new Date('2026-06-07T23:59:59');
    const intervalo = setInterval(() => {
      const agora = new Date();
      const diferenca = deadline - agora;

      if (diferenca <= 0) {
        clearInterval(intervalo);
        setTempoRestante('Tempo encerrado');
        return;
      }

      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diferenca / 1000 / 60) % 60);
      const segundos = Math.floor((diferenca / 1000) % 60);

      setTempoRestante(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <SessaoContainer>
    {nome && email && (
      <>
        <Texto><strong>Sessão iniciada por</strong> {nome}</Texto>
        <Texto><strong>Email:</strong> {email}</Texto>
      </>
    )} 
    <Texto><strong>Inscrições terminam em</strong> {tempoRestante}</Texto>
  </SessaoContainer>
  
  );
};

export default SessaoInfo;

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import axios from "axios";
import { jsPDF } from "jspdf";

import { EVENT } from "../../config/eventConfig";
import { labelCamisaTipo, labelCamisaCor } from "../../config/camisaParticipante";

function formatCamisaResumoForPrint(participant) {
  if (!participant?.camisa) return "Nao";
  const bits = [];
  if (participant.camisaTipo) {
    bits.push(`Tipo: ${labelCamisaTipo(participant.camisaTipo)}`);
  }
  if (participant.camisaCor) {
    bits.push(`Cor: ${labelCamisaCor(participant.camisaCor)}`);
  }
  if (participant.tamanhoCamisa) {
    bits.push(`Tamanho: ${participant.tamanhoCamisa}`);
  }
  if (bits.length) return `Sim (${bits.join("; ")})`;
  return participant.tamanhoCamisa
    ? `Sim (Tamanho: ${participant.tamanhoCamisa})`
    : "Sim";
}

const Container = styled.div`
  font-family: "Inter", Arial, sans-serif;
  font-size: 11.5px;
  width: 210mm;
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 7mm 8mm;
  background: #ffffff;
  box-sizing: border-box;
  line-height: 1.36;
  overflow: visible;

  @media print {
    width: 210mm;
    min-height: 297mm;
    margin: 0;
    padding: 7mm 8mm;
    overflow: visible;
  }
`;

const DocumentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 10px 8px;
  box-sizing: border-box;
  overflow: visible;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.035);
  animation: ${keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `} 0.35s ease;

  @media print {
    border: none;
    border-radius: 0;
    padding: 8px;
    overflow: visible;
    page-break-inside: avoid;
    box-shadow: none;
  }
`;

const PrintPageStyle = createGlobalStyle`
  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    html,
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      overflow: visible;
    }

    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;

  img {
    width: 42px;
    object-fit: contain;
    flex-shrink: 0;
  }
`;

const HeaderText = styled.div`
  flex: 1;
  min-width: 0;

  h1 {
    margin: 0 0 2px;
    color: #111827;
    font-size: 18px;
    line-height: 1.08;
    font-weight: 700;
  }

  h2 {
    margin: 0;
    color: #6b7280;
    font-size: 11px;
    line-height: 1.28;
    font-weight: 400;
  }
`;

const Section = styled.section`
  margin-top: 0px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 5px;
  padding: 4px 7px;
  color: #1f2937;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-left: 3px solid #e5e7eb;
  border-radius: 8px;
`;

const CompactSection = styled.section`
  margin-top: 5px;
`;

const CompactSectionTitle = styled.h3`
  margin: 0 0 3px;
  color: #1f2937;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 7px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-left: 3px solid #e5e7eb;
  border-radius: 8px;
`;

const PremiumHeaderCard = styled.div`
  margin-top: 4px;
  padding: 7px 8px;
  border-radius: 8px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid #e5e7eb;

  @media print {
    box-shadow: none;
  }
`;

const PremiumHeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e5e7eb;

  img {
    width: 34px;
    object-fit: contain;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const PremiumHeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

const PremiumHeaderTitle = styled.h1`
  margin: 0;
  color: #111827;
  font-size: 18.5px;
  line-height: 1.05;
  letter-spacing: -0.025em;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const PremiumHeaderSubtitle = styled.p`
  margin: 2px 0 0;
  color: #6b7280;
  font-size: 10px;
  line-height: 1.32;
  font-weight: 400;
`;

const ResponsiveGrid = styled.div`
  margin-bottom: 0;
`;

const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  padding: 2px 0;
`;

const FieldLabel = styled.span`
  color: #4b5563;
  font-size: 0.73rem;
  font-weight: 500;
  min-width: 250px;
`;

const FieldValue = styled.span`
  color: #111827;
  font-size: 0.72rem;
  font-weight: 500;
  text-align: left;
  flex-grow: 1;
  min-width: 0;
`;

const CompactIntro = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px 10px;
  margin-top: 6px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const ParticipantIdentity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Eyebrow = styled.span`
  font-size: 9px;
  color: #6b7280;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const ParticipantName = styled.h3`
  margin: 0;
  font-size: 18px;
  line-height: 1.04;
  color: #111827;
  font-weight: 700;
`;

const ParticipantMeta = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 10px;
  line-height: 1.3;
`;

const EventInfoCards = styled.div`
  display: none;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const EventInfoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  min-height: 0;
  padding: 7px 9px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  grid-column: ${({ $fullWidth }) => ($fullWidth ? "1 / -1" : "auto")};
`;

const SummaryLabel = styled.span`
  font-size: 10px;
  color: #4b5563;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const SummaryValue = styled.span`
  font-size: 11.5px;
  line-height: 1.42;
  color: #1f2937;
  font-weight: 600;
  white-space: pre-line;
`;

const SummaryInline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
  line-height: 1.35;
`;

const SummaryInlineValue = styled.span`
  font-size: 11.5px;
  line-height: 1.4;
  color: #1f2937;
  font-weight: 600;
  min-width: 0;
  white-space: ${({ $nowrap }) => ($nowrap ? "nowrap" : "normal")};
`;

const CompactSectionCard = styled.div`
  background: #ffffff;
  padding: 5px 6px 4px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  page-break-inside: avoid;
  break-inside: avoid;
`;

const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 16px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HealthGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 16px;
  margin-top: 1px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PersonalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 16px;
  margin-top: 1px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ParticipationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 16px;
  margin-top: 1px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthItem = styled.div`
  grid-column: span 2;

  @media (max-width: 600px) {
    grid-column: auto;
  }
`;

const CompactLine = styled.div`
  display: grid;
  grid-template-columns: ${({ $inline }) =>
    $inline ? "148px minmax(0, 1fr)" : "minmax(0, 1fr)"};
  align-items: start;
  gap: ${({ $inline }) => ($inline ? "8px" : "0")};
  min-width: 0;
  padding: 2px 0 3px;
  border-bottom: 1px solid #e5e7eb;
  grid-column: ${({ $fullWidth }) => ($fullWidth ? "1 / -1" : "auto")};

  @media (max-width: 600px) {
    grid-template-columns: ${({ $inline }) =>
      $inline ? "132px minmax(0, 1fr)" : "minmax(0, 1fr)"};
    gap: ${({ $inline }) => ($inline ? "6px" : "0")};
  }
`;

const InlineLabel = styled.span`
  color: #4b5563;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  min-width: 0;
`;

const InlineValue = styled.span`
  color: #111827;
  font-size: 10.6px;
  line-height: 1.32;
  font-weight: 600;
  white-space: pre-line;
  min-width: 0;
`;

const CompactItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  min-width: 0;
  grid-column: ${({ $fullWidth }) => ($fullWidth ? "1 / -1" : "auto")};
`;

const CompactLink = styled.a`
  color: #4b5563;
  text-decoration: none;
  transition: color 0.2s ease, opacity 0.2s ease;

  &:hover {
    color: #111827;
    opacity: 0.86;
  }
`;

const BadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px 4px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 16px;
  padding: 0 6px;
  border-radius: 999px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  font-size: 9.5px;
  font-weight: 600;
`;

const AuthorizationBox = styled.div`
  background: #f9fafb;
  padding: 7px 8px;
  border: 1px solid #e5e7eb;
  border-left: 3px solid #e5e7eb;
  border-radius: 7px;
  page-break-inside: avoid;
  break-inside: avoid;

  p {
    margin: 0;
    color: #1f2937;
    font-size: 10.35px;
    line-height: 1.38;
    text-align: justify;
  }
`;

const AuthorizationFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 16px;
  margin-top: 6px;
  page-break-inside: avoid;
  break-inside: avoid;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media print {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 6px 16px !important;
    align-items: start;
    width: 100%;
  }
`;

const LinePlaceholder = styled.span`
  display: inline-block;
  min-height: 14px;
  min-width: 0;
  width: 100%;
  border-bottom: 1px solid #9ca3af;
`;

const LoaderWrapper = styled.div`
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;

  @media print {
    display: none;
  }
`;

const Button = styled.button`
  background-color: #f3f4f6;
  color: #4b5563;
  font-size: 10.5px;
  font-weight: 600;
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
    border-color: #d1d5db;
  }

  &:active {
    transform: scale(0.99);
  }
`;

const Footer = styled.div`
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
  color: #9ca3af;
  font-size: 9px;
  text-align: center;
  line-height: 1.3;
`;

const FinalSignatureSection = styled.section`
  margin-top: 6px;
`;

const FinalSignatureCard = styled.div`
  background: #ffffff;
  padding: 5px 6px 4px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const FinalSignatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 16px;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media print {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 6px 16px !important;
    align-items: end !important;
    width: 100%;
  }
`;

const SignatureBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const SignatureIdentityBlock = styled(SignatureBlock)`
  grid-column: 1 / -1;
  gap: 1px;
  padding-bottom: 2px;
`;

const SignatureLine = styled.div`
  min-height: 14px;
  border-bottom: 1px solid #9ca3af;
`;

const SignatureCaption = styled.span`
  font-size: 9px;
  color: #4b5563;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
`;

const getToken = () => localStorage.getItem("token");

const fetchUserData = async (id) => {
  const token = getToken();
  if (!token) return null;

  try {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";
    const response = await axios.get(`${API_URL}/api/auth/print/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch {
    return null;
  }
};

function calculateAgeAtDate(birthDate, referenceDate) {
  const birth = new Date(birthDate);
  const ref = new Date(referenceDate);

  if (Number.isNaN(birth.getTime()) || Number.isNaN(ref.getTime())) {
    return null;
  }

  let age = ref.getFullYear() - birth.getFullYear();
  const monthDiff = ref.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
}

const calculateAge = (dateString) => {
  if (!dateString) return null;

  const birthDate = new Date(dateString);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
};

const formatDate = (value) => {
  if (!value) return "____________________________";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "____________________________";
  return parsed.toLocaleDateString("pt-BR");
};

const formatPhone = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return value || "Nao informado";
};

const formatCep = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 8) {
    return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
  }
  return value || "";
};

const formatGender = (participant) =>
  participant?.sexo === "outro" ? participant?.outroGenero || "Outro" : participant?.sexo || "Nao informado";

const formatParticipation = (participant) => {
  if (participant?.tipoParticipacao === "Confraternista") {
    return "Confraternista";
  }

  if (participant?.tipoParticipacao === "Trabalhador") {
    const label = "Membro de Equipe / Tarefeiro do Bem";
    return participant?.comissao ? `${label} (${participant.comissao})` : label;
  }

  return participant?.tipoParticipacao || "Nao informado";
};

const buildAddress = (participant) => {
  const parts = [
    [participant?.logradouro, participant?.numero].filter(Boolean).join(", "),
    participant?.complemento ? `- ${participant.complemento}` : "",
    participant?.bairro ? `, ${participant.bairro}` : "",
    participant?.cidade ? ` - ${participant.cidade}` : "",
    participant?.estado ? `/${participant.estado}` : "",
    participant?.cep ? ` - ${formatCep(participant.cep)}` : "",
  ].filter(Boolean);

  return parts.join(" ").trim() || "Nao informado";
};

const getRegistrationYear = (participant) => {
  const createdAt = participant?.createdAt ? new Date(participant.createdAt) : null;
  if (!createdAt || Number.isNaN(createdAt.getTime())) return null;
  return createdAt.getFullYear();
};

const getHealthItems = (participant) => {
  const items = [];

  if (participant?.vegetariano && participant.vegetariano !== "N/A") {
    items.push({ label: "Tipo de alimentação", value: participant.vegetariano });
  }
  if (participant?.alergia) {
    items.push({ label: "Possui alergia a", value: participant.alergia });
  }
  if (participant?.medicacao) {
    items.push({ label: "Medicação que faz uso", value: participant.medicacao });
  }
  if (participant?.outrasInformacoes) {
    items.push({ label: "Informações adicionais", value: participant.outrasInformacoes });
  }

  return items;
};

const getDeficiencyItems = (participant) => {
  const items = [];

  if (participant?.deficienciaAuditiva) items.push("Deficiencia auditiva");
  if (participant?.deficienciaAutismo) items.push("Autismo");
  if (participant?.deficienciaIntelectual) items.push("Deficiencia intelectual");
  if (participant?.deficienciaParalisiaCerebral) items.push("Paralisia cerebral");
  if (participant?.deficienciaVisual) items.push("Deficiencia visual");
  if (participant?.deficienciaFisica) items.push("Deficiencia fisica");
  if (participant?.deficienciaOutra) {
    items.push(participant?.deficienciaOutraDescricao || "Outra necessidade");
  }

  return items;
};

const getInstitutionName = (participant) =>
  participant?.IE || participant?.otherInstitution || "________________________________________";

const hasValue = (value) =>
  value !== null &&
  value !== undefined &&
  String(value).trim() !== "" &&
  String(value).trim().toLowerCase() !== "nao informado";

const InlineField = ({ label, value, fullWidth = false, inline = false }) => {
  if (!hasValue(value)) return null;

  return (
    <CompactLine $fullWidth={fullWidth} $inline={inline}>
      <InlineLabel>{label}: </InlineLabel>
      <InlineValue>{value}</InlineValue>
    </CompactLine>
  );
};

const LegacyPrintLayout = ({ participant, age }) => {
  const fullDisplayName = [EVENT.displayName, EVENT.fullName].filter(Boolean).join(" - ");

  return (
    <>
      <Header>
        <img src="/favicon.png" alt={`Logo ${EVENT.name}`} />
        <HeaderText>
          <h1>{EVENT.displayName}</h1>
          <h2>{EVENT.fullName}</h2>
        </HeaderText>
      </Header>

      <Section>
        <SectionTitle>Dados Pessoais do Participante</SectionTitle>
        <ResponsiveGrid>
          <FieldRow>
            <FieldLabel>Nome Completo:</FieldLabel>
            <FieldValue>{participant.nomeCompleto}</FieldValue>
          </FieldRow>

          {participant.nomeSocial ? (
            <FieldRow>
              <FieldLabel>Nome Social</FieldLabel>
              <FieldValue>{participant.nomeSocial}</FieldValue>
            </FieldRow>
          ) : null}

          <FieldRow>
            <FieldLabel>Data de nascimento:</FieldLabel>
            <FieldValue>
              {formatDate(participant.dataNascimento)}{" "}
              {age != null ? <span style={{ color: "#999" }}>({age} anos)</span> : null}
            </FieldValue>
          </FieldRow>

          <FieldRow>
            <FieldLabel>Genero:</FieldLabel>
            <FieldValue>{formatGender(participant)}</FieldValue>
          </FieldRow>
        </ResponsiveGrid>
      </Section>

      <Section>
        <ResponsiveGrid>
          <FieldRow>
            <FieldLabel>E-mail:</FieldLabel>
            <FieldValue>{participant.email}</FieldValue>
          </FieldRow>
          <FieldRow>
            <FieldLabel>Telefone:</FieldLabel>
            <FieldValue>{formatPhone(participant.telefone)}</FieldValue>
          </FieldRow>
        </ResponsiveGrid>
      </Section>

      <Section>
        <ResponsiveGrid>
          <FieldRow>
            <FieldLabel>Endereco</FieldLabel>
            <FieldValue>{buildAddress(participant)}</FieldValue>
          </FieldRow>
        </ResponsiveGrid>
      </Section>

      <Section>
        <SectionTitle>Dados para o evento</SectionTitle>
        <ResponsiveGrid>
          <FieldRow>
            <FieldLabel>Participacao</FieldLabel>
            <FieldValue>{formatParticipation(participant)}</FieldValue>
          </FieldRow>
          <FieldRow>
            <FieldLabel>Camisa</FieldLabel>
            <FieldValue>{formatCamisaResumoForPrint(participant)}</FieldValue>
          </FieldRow>
        </ResponsiveGrid>
      </Section>

      <Section>
        <SectionTitle>Informacoes de Saude</SectionTitle>
        <ResponsiveGrid>
          <FieldRow>
            <FieldLabel>Faz uso de alimentacao vegetariana?</FieldLabel>
            <FieldValue>{participant.vegetariano}</FieldValue>
          </FieldRow>
          <FieldRow>
            <FieldLabel>Alergias ou alimentos que possui restricao:</FieldLabel>
            <FieldValue>{participant.alergia || "Nenhuma"}</FieldValue>
          </FieldRow>
          <FieldRow>
            <FieldLabel>Faz uso de medicacoes?</FieldLabel>
            <FieldValue>{participant.medicacao || "Nenhuma"}</FieldValue>
          </FieldRow>
        </ResponsiveGrid>
      </Section>

      <Section>
        <SectionTitle>Necessidades Especiais</SectionTitle>
        <ResponsiveGrid>
          {getDeficiencyItems(participant).map((item) => (
            <FieldRow key={item}>
              <FieldLabel>{item}</FieldLabel>
              <FieldValue>Sim</FieldValue>
            </FieldRow>
          ))}
          <FieldRow>
            <FieldLabel>Voce possui alguma necessidade especifica?</FieldLabel>
            <FieldValue>{participant.medicacao || "Nenhuma"}</FieldValue>
          </FieldRow>
        </ResponsiveGrid>
      </Section>

      <Section>
        <SectionTitle>Instituicao Espirita</SectionTitle>
        <ResponsiveGrid>
          <FieldRow>
            <FieldLabel>Nome</FieldLabel>
            <FieldValue>{participant.IE}</FieldValue>
          </FieldRow>
        </ResponsiveGrid>

        <SectionTitle>Ficha de autorizacao para menores de idade</SectionTitle>
        <ResponsiveGrid>
          <FieldRow>
            <FieldLabel>Autorizacao para menor de idade</FieldLabel>
            <FieldValue>
              <span style={{ display: "block", textAlign: "justify", fontSize: "12px", color: "#666" }}>
                Eu, __________________________________________, portador(a) do documento n° ______________________, responsavel legal pelo(a) menor
                __________________________________________, autorizo sua participacao na{" "}
                {fullDisplayName || EVENT.displayName}, a ser realizada nos dias 04 e 05 de
                julho de 2026.
              </span>
            </FieldValue>
          </FieldRow>

          <FieldRow>
            <FieldLabel>Telefone do responsavel</FieldLabel>
            <FieldValue>{participant.telefoneResponsavel || "Nenhuma"}</FieldValue>
          </FieldRow>

          <FieldRow>
            <FieldLabel>Assinatura e data</FieldLabel>
            <FieldValue>______________________________</FieldValue>
          </FieldRow>
        </ResponsiveGrid>
      </Section>
    </>
  );
};

const CompactPrintLayout = ({ participant, eventInfo, ageAtEvent, isMinor }) => {
  const healthItems = getHealthItems(participant);
  const deficiencyItems = getDeficiencyItems(participant);
  const hasSocialName = hasValue(participant.nomeSocial);
  const participationFields = [
    { label: "Participacao", value: formatParticipation(participant) },
    {
      label: "Camisa",
      value: formatCamisaResumoForPrint(participant),
    },
    {
      label: "Instituicao",
      value: participant.IE || participant.otherInstitution,
    },
    {
      label: "Primeira participacao",
      value: participant.primeiraComejaca ? "Sim" : "",
    },
  ];

  return (
    <>
      <PremiumHeaderCard>
        <PremiumHeaderTop>
          <img src="/favicon.png" alt={`Logo ${EVENT.name}`} />
          <PremiumHeaderText>
            <PremiumHeaderTitle>{eventInfo.eventName}</PremiumHeaderTitle>
            <PremiumHeaderSubtitle>{eventInfo.eventSubtitle}</PremiumHeaderSubtitle>
          </PremiumHeaderText>
        </PremiumHeaderTop>

        <CompactIntro>
          <ParticipantIdentity>
            <Eyebrow>Ficha de inscricao</Eyebrow>
            <ParticipantName>{participant.nomeCompleto}</ParticipantName>
            <ParticipantMeta>
              {formatDate(participant.dataNascimento)}
              {ageAtEvent != null ? ` • ${ageAtEvent} anos no evento` : ""}
            </ParticipantMeta>
          </ParticipantIdentity>

          <EventInfoCards>
            <EventInfoCard>
              <SummaryInline>
                <SummaryLabel>Periodo do encontro</SummaryLabel>
                <SummaryInlineValue $nowrap>{eventInfo.periodLabel}</SummaryInlineValue>
              </SummaryInline>
            </EventInfoCard>
            <EventInfoCard $fullWidth>
              <SummaryInline>
                <SummaryLabel>Local do encontro</SummaryLabel>
                <SummaryInlineValue>
                  {eventInfo.locationLabel}
                  {eventInfo.addressLabel ? " — " : ""}
                  {eventInfo.addressLabel ? (
                    <CompactLink
                      href={eventInfo.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {eventInfo.addressLabel}
                    </CompactLink>
                  ) : null}
                </SummaryInlineValue>
              </SummaryInline>
            </EventInfoCard>
          </EventInfoCards>
        </CompactIntro>
      </PremiumHeaderCard>

      <CompactSection>
        <CompactSectionTitle>DADOS PESSOAIS E CONTATO</CompactSectionTitle>
        <CompactSectionCard>
          <PersonalGrid>
            <InlineField label="E-mail" value={participant.email} inline />
            <InlineField label="Telefone" value={formatPhone(participant.telefone)} inline />
            <InlineField label="Genero" value={formatGender(participant)} inline />
            {hasSocialName ? (
              <InlineField label="Nome social" value={participant.nomeSocial} inline />
            ) : null}
            <FullWidthItem>
              <InlineField label="Endereco residencial" value={buildAddress(participant)} />
            </FullWidthItem>
          </PersonalGrid>
        </CompactSectionCard>
      </CompactSection>

      <CompactSection>
        <CompactSectionTitle>Participacao e instituicao</CompactSectionTitle>
        <CompactSectionCard>
          <ParticipationGrid>
            <InlineField
              label="Participacao"
              value={participationFields.find((item) => item.label === "Participacao")?.value}
              inline
            />
            <InlineField
              label="Camisa"
              value={participationFields.find((item) => item.label === "Camisa")?.value}
              inline
            />
            <InlineField
              label="Primeira participacao"
              value={
                participationFields.find((item) => item.label === "Primeira participacao")?.value
              }
              inline
            />
            <div />
            <FullWidthItem>
              <InlineField
                label="Instituicao"
                value={participationFields.find((item) => item.label === "Instituicao")?.value}
              />
            </FullWidthItem>
          </ParticipationGrid>
        </CompactSectionCard>
      </CompactSection>

      {healthItems.length > 0 ? (
        <CompactSection>
          <CompactSectionTitle>Saude</CompactSectionTitle>
          <CompactSectionCard>
            <HealthGrid>
              <InlineField
                label="Tipo de alimentação"
                value={healthItems.find((item) => item.label === "Tipo de alimentação")?.value}
                inline
              />
              <InlineField
                label="Possui alergia a"
                value={healthItems.find((item) => item.label === "Possui alergia a")?.value}
                inline
              />
              <InlineField
                label="Medicação que faz uso"
                value={healthItems.find((item) => item.label === "Medicação que faz uso")?.value}
                inline
              />
              <InlineField
                label="Informações adicionais"
                value={healthItems.find((item) => item.label === "Informações adicionais")?.value}
                inline
              />
            </HealthGrid>
          </CompactSectionCard>
        </CompactSection>
      ) : null}

      {deficiencyItems.length > 0 ? (
        <CompactSection>
          <CompactSectionTitle>Necessidades especificas</CompactSectionTitle>
          <CompactSectionCard>
            <BadgeList>
              {deficiencyItems.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </BadgeList>
          </CompactSectionCard>
        </CompactSection>
      ) : null}

      {!eventInfo.isLegacy && isMinor ? (
        <CompactSection>
          <CompactSectionTitle>Autorizacao para menor de idade</CompactSectionTitle>
          <CompactSectionCard>
            <AuthorizationBox>
              <p>
                Eu, {participant.nomeCompletoResponsavel || "________________________________________"},
                portador(a) do documento n°{" "}
                {participant.documentoResponsavel || "________________________________________"},
                telefone{" "}
                {participant.telefoneResponsavel
                  ? formatPhone(participant.telefoneResponsavel)
                  : "________________________________________"}
                , responsavel legal por {participant.nomeCompleto}, autorizo sua participacao em{" "}
                {eventInfo.eventName}, a ser realizado de {formatDate(eventInfo.eventStart)} a{" "}
                {formatDate(eventInfo.eventEnd)}, em {eventInfo.eventLocation || "____________________________"}.
              </p>
            </AuthorizationBox>

            <AuthorizationFields>
              <CompactItem>
                <SummaryLabel>Assinatura</SummaryLabel>
                <SummaryValue><LinePlaceholder /></SummaryValue>
              </CompactItem>
              <CompactItem>
                <SummaryLabel>Data</SummaryLabel>
                <SummaryValue><LinePlaceholder /></SummaryValue>
              </CompactItem>
            </AuthorizationFields>
          </CompactSectionCard>
        </CompactSection>
      ) : null}
    </>
  );
};

const FichaInscricao = () => {
  const { id } = useParams();
  const [participant, setParticipant] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUserData(id);
        setParticipant(response?.data || null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const ficha = document.getElementById("ficha-inscricao");
    const botao = document.getElementById("botao-pdf");

    if (!ficha || !botao) return;

    botao.style.display = "none";

    const doc = new jsPDF("p", "mm", "a4");
    doc.html(ficha, {
      callback: (document) => {
        document.save("ficha_inscricao.pdf");
        botao.style.display = "block";
      },
      x: 15,
      width: 180,
      windowWidth: 650,
    });
  };

  const registrationYear = useMemo(() => getRegistrationYear(participant), [participant]);
  const isLegacy = registrationYear === 2025;

  const eventInfo = useMemo(() => {
    const evento = participant?.evento;
    const eventName =
      evento?.nomeExibicao || evento?.nomeCompleto || EVENT.displayName || EVENT.name;
    const eventSubtitle =
      evento?.nomeCompleto || EVENT.fullName || "Ficha de inscricao do participante";
    const eventStart = evento?.dataInicio || null;
    const eventEnd = evento?.dataFim || null;
    const eventLocation = evento?.localNome || "";
    const addressLabel = evento?.localEndereco || "";
    const query = encodeURIComponent(addressLabel || eventLocation || eventName || "");
    const mapUrl = query
      ? `https://www.google.com/maps/search/?api=1&query=${query}`
      : "#";

    return {
      isLegacy,
      eventName,
      eventSubtitle,
      eventStart,
      eventEnd,
      eventLocation,
      addressLabel,
      mapUrl,
      periodLabel:
        eventStart || eventEnd
          ? `${formatDate(eventStart)}${eventEnd ? ` — ${formatDate(eventEnd)}` : ""}`
          : "Nao informado",
      locationLabel: eventLocation || "Nao informado",
    };
  }, [isLegacy, participant]);

  const age = calculateAge(participant?.dataNascimento);
  const ageAtEvent = calculateAgeAtDate(
    participant?.dataNascimento,
    eventInfo?.eventStart || participant?.createdAt || new Date().toISOString()
  );
  const isMinor = ageAtEvent != null ? ageAtEvent < 18 : false;

  if (loading) {
    return (
      <Container>
        <LoaderWrapper>Carregando documento...</LoaderWrapper>
      </Container>
    );
  }

  if (!participant) {
    return (
      <Container>
        <LoaderWrapper>Erro ao carregar usuario.</LoaderWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <PrintPageStyle />
      <DocumentWrapper id="ficha-inscricao">
        {isLegacy ? (
          <LegacyPrintLayout participant={participant} age={age} />
        ) : (
          <CompactPrintLayout
            participant={participant}
            eventInfo={eventInfo}
            ageAtEvent={ageAtEvent}
            isMinor={isMinor}
          />
        )}
        <FinalSignatureSection>
          <CompactSectionTitle>Assinatura da Instituicao Espirita</CompactSectionTitle>
          <FinalSignatureCard>
            <FinalSignatureGrid>
              <SignatureIdentityBlock>
                <InlineLabel>Instituicao Espirita:</InlineLabel>
                <InlineValue>{getInstitutionName(participant)}</InlineValue>
              </SignatureIdentityBlock>

              <SignatureBlock>
                <SignatureLine />
                <SignatureCaption>Assinatura (presidente IE)</SignatureCaption>
              </SignatureBlock>

              <SignatureBlock>
                <SignatureLine />
                <SignatureCaption>Data</SignatureCaption>
              </SignatureBlock>
            </FinalSignatureGrid>
          </FinalSignatureCard>
        </FinalSignatureSection>

        <Footer>
          Documento gerado eletronicamente em {new Date().toLocaleDateString("pt-BR")}
          <br />
          Valido mediante confirmacao pela coordenacao geral
        </Footer>

        <ButtonContainer>
          {isMobile ? (
            <Button id="botao-pdf" onClick={handleDownloadPDF}>
              Baixar PDF
            </Button>
          ) : (
            <Button onClick={handlePrint}>Imprimir</Button>
          )}
        </ButtonContainer>
      </DocumentWrapper>
    </Container>
  );
};

export default FichaInscricao;

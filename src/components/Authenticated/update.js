import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiInfo,
  FiLoader,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import AppHeader, {
  APP_HEADER_HEIGHT,
  APP_HEADER_HEIGHT_MOBILE,
  AppHeaderBadge,
} from "../shared/AppHeader";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const INITIAL_FORM = {
  id: "",
  nomeCompleto: "",
  nomeSocial: "",
  nomeCracha: "",
  dataNascimento: null,
  sexo: "",
  outroGenero: "",
  email: "",
  telefone: "",
  tipoParticipacao: "",
  comissao: "",
  nomeCompletoResponsavel: "",
  documentoResponsavel: "",
  telefoneResponsavel: "",
  cep: "",
  estado: "",
  cidade: "",
  bairro: "",
  logradouro: "",
  numero: "",
  complemento: "",
  IE: "",
  otherInstitution: "",
  primeiraComejaca: false,
  vegetariano: "",
  camisa: false,
  tamanhoCamisa: "",
  medicacao: "",
  alergia: "",
  outrasInformacoes: "",
  deficienciaAuditiva: false,
  deficienciaAutismo: false,
  deficienciaIntelectual: false,
  deficienciaParalisiaCerebral: false,
  deficienciaVisual: false,
  deficienciaFisica: false,
  deficienciaOutra: false,
  deficienciaOutraDescricao: "",
  valor: 0,
  linkPagamento: "",
  statusPagamento: "",
};

const PARTICIPATION_OPTIONS = [
  { value: "Confraternista", label: "Confraternista" },
  { value: "Trabalhador", label: "Trabalhador" },
];

const COMISSOES = [
  "Alimentação",
  "Atendimento Fraterno",
  "Coordenação Geral",
  "Divulgação",
  "Estudos Doutrinários",
  "Multimeios",
  "Secretaria",
  "Serviços Gerais",
  "Recepção",
];

const DEFICIENCIAS = [
  { name: "deficienciaAuditiva", label: "Auditiva" },
  { name: "deficienciaAutismo", label: "Autismo" },
  { name: "deficienciaIntelectual", label: "Intelectual" },
  { name: "deficienciaParalisiaCerebral", label: "Paralisia cerebral" },
  { name: "deficienciaVisual", label: "Visual" },
  { name: "deficienciaFisica", label: "Física" },
  { name: "deficienciaOutra", label: "Outra" },
];

const Atualizar = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [institutions, setInstitutions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMinor, setIsMinor] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const loadPage = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      setIsLoadingPage(true);

      try {
        const [participantResponse, institutionsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/auth/print/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/auth/instituicoes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const data = participantResponse?.data?.data || {};
        const formattedBirthDate = data.dataNascimento
          ? new Date(data.dataNascimento)
          : null;

        setFormData((prev) => ({
          ...prev,
          ...data,
          dataNascimento: formattedBirthDate,
        }));

        setInstitutions(institutionsResponse.data || []);

        if (formattedBirthDate) {
          setIsMinor(calculateAge(formattedBirthDate) < 18);
        }
      } catch (error) {
        setErrors([{ message: "Erro ao carregar os dados da inscrição." }]);
      } finally {
        setIsLoadingPage(false);
      }
    };

    loadPage();
  }, [id]);

  const hasResponsavel = useMemo(() => isMinor, [isMinor]);

  const visibleSteps = useMemo(() => {
    return [
      { id: 1, title: "Dados pessoais" },
      ...(hasResponsavel ? [{ id: 2, title: "Responsável" }] : []),
      { id: hasResponsavel ? 3 : 2, title: "Endereço e instituição" },
      { id: hasResponsavel ? 4 : 3, title: "Acolhimento e cuidados" },
      { id: hasResponsavel ? 5 : 4, title: "Revisão" },
    ];
  }, [hasResponsavel]);

  const totalSteps = visibleSteps.length;
  const participantName = formData.nomeCompleto?.trim();

  function calculateAge(date) {
    if (!date) return 0;
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  function formatPhone(value) {
    const cleaned = (value || "").replace(/\D/g, "").slice(0, 11);

    if (cleaned.length > 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }

    if (cleaned.length > 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    }

    if (cleaned.length > 2) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }

    return cleaned;
  }

  function formatDocumentoResponsavel(value) {
    const cleaned = (value || "").replace(/\D/g, "").slice(0, 11);

    if (cleaned.length <= 11) {
      return cleaned
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
    }

    return cleaned;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let finalValue = type === "checkbox" ? checked : value;

    if (name === "telefone" || name === "telefoneResponsavel") {
      finalValue = formatPhone(value);
    }

    if (name === "documentoResponsavel") {
      finalValue = formatDocumentoResponsavel(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleDateChange = (date) => {
    const minor = calculateAge(date) < 18;

    setIsMinor(minor);
    setFormData((prev) => ({
      ...prev,
      dataNascimento: date,
      ...(minor
        ? {}
        : {
            nomeCompletoResponsavel: "",
            documentoResponsavel: "",
            telefoneResponsavel: "",
          }),
    }));
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, "").slice(0, 8);

    setFormData((prev) => ({
      ...prev,
      cep,
    }));

    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          cep,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch {
      // silencioso
    }
  };

  const validateStep = (step) => {
    const validationErrors = [];

    const responsavelStep = hasResponsavel ? 2 : null;
    const enderecoStep = hasResponsavel ? 3 : 2;
    const acolhimentoStep = hasResponsavel ? 4 : 3;

    if (step === 1) {
      if (!formData.nomeCompleto?.trim()) {
        validationErrors.push({ message: "Informe o nome completo." });
      }

      if (!formData.nomeCracha?.trim()) {
        validationErrors.push({ message: "Informe o nome no crachá." });
      }

      if (
        !formData.dataNascimento ||
        isNaN(new Date(formData.dataNascimento).getTime())
      ) {
        validationErrors.push({
          message: "Informe uma data de nascimento válida.",
        });
      }

      if (!formData.email?.trim()) {
        validationErrors.push({ message: "Informe o e-mail." });
      }

      if (!formData.telefone?.trim()) {
        validationErrors.push({ message: "Informe o telefone." });
      }

      if (!formData.tipoParticipacao) {
        validationErrors.push({
          message: "Selecione o tipo de participação.",
        });
      }

      if (
        formData.tipoParticipacao === "Trabalhador" &&
        !formData.comissao
      ) {
        validationErrors.push({ message: "Selecione a comissão." });
      }
    }

    if (step === responsavelStep) {
      if (!formData.nomeCompletoResponsavel?.trim()) {
        validationErrors.push({ message: "Informe o nome do responsável." });
      }

      if (!formData.telefoneResponsavel?.trim()) {
        validationErrors.push({
          message: "Informe o telefone do responsável.",
        });
      }
    }

    if (step === enderecoStep) {
      if (!formData.cep?.trim()) {
        validationErrors.push({ message: "Informe o CEP." });
      }

      if (!formData.numero?.trim()) {
        validationErrors.push({
          message: "Informe o número do endereço.",
        });
      }

      if (!formData.IE?.trim()) {
        validationErrors.push({
          message: "Selecione a instituição espírita.",
        });
      }

      if (formData.IE === "outro" && !formData.otherInstitution?.trim()) {
        validationErrors.push({
          message: "Informe o nome da instituição.",
        });
      }
    }

    if (step === acolhimentoStep) {
      if (!formData.vegetariano) {
        validationErrors.push({ message: "Informe a alimentação." });
      }
    }

    return validationErrors;
  };

  const validateForm = () => {
    const validationErrors = [];
    for (let step = 1; step <= totalSteps; step += 1) {
      validationErrors.push(...validateStep(step));
    }
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const goToNextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors([]);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const goToPreviousStep = () => {
    setErrors([]);
    if (currentStep === 1) {
      navigate(-1);
      return;
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors([]);
  
    try {
      const token = localStorage.getItem("token");
  
      const payload = {
        id: formData.id,
        nomeCompleto: formData.nomeCompleto?.trim() || "",
        nomeSocial: formData.nomeSocial?.trim() || "",
        nomeCracha: formData.nomeCracha?.trim() || "",
        dataNascimento: new Date(formData.dataNascimento).toISOString(),
        sexo: formData.sexo || "",
        outroGenero: formData.outroGenero?.trim() || "",
        email: formData.email?.trim() || "",
        telefone: (formData.telefone || "").replace(/\D/g, ""),
        tipoParticipacao: formData.tipoParticipacao || "",
        nomeCompletoResponsavel:
          formData.nomeCompletoResponsavel?.trim() || "",
        documentoResponsavel:
          (formData.documentoResponsavel || "").replace(/\D/g, "") || "",
        telefoneResponsavel:
          (formData.telefoneResponsavel || "").replace(/\D/g, "") || "",
        comissao: String(formData.comissao || ""),
        camisa: formData.camisa === true || formData.camisa === "true",
        tamanhoCamisa: formData.tamanhoCamisa || "",
        cep: (formData.cep || "").replace(/\D/g, ""),
        estado: formData.estado?.trim() || "",
        cidade: formData.cidade?.trim() || "",
        bairro: formData.bairro?.trim() || "",
        logradouro: formData.logradouro?.trim() || "",
        numero: formData.numero?.trim() || "",
        complemento: formData.complemento?.trim() || "",
        IE: formData.IE || "",
        otherInstitution: formData.otherInstitution?.trim() || "",
        primeiraComejaca: !!formData.primeiraComejaca,
        vegetariano: formData.vegetariano || "",
        medicacao: formData.medicacao?.trim() || "",
        alergia: formData.alergia?.trim() || "",
        outrasInformacoes: formData.outrasInformacoes?.trim() || "",
        deficienciaAuditiva: !!formData.deficienciaAuditiva,
        deficienciaAutismo: !!formData.deficienciaAutismo,
        deficienciaIntelectual: !!formData.deficienciaIntelectual,
        deficienciaParalisiaCerebral: !!formData.deficienciaParalisiaCerebral,
        deficienciaVisual: !!formData.deficienciaVisual,
        deficienciaFisica: !!formData.deficienciaFisica,
        deficienciaOutra: !!formData.deficienciaOutra,
        deficienciaOutraDescricao:
          formData.deficienciaOutraDescricao?.trim() || "",
        valor: formData.valor || 0,
      };

      console.log("PAYLOAD INSCRIÇÃO:", payload);

      const response = await axios.put(
        `${API_URL}/api/auth/participante/${formData.id}`,
        payload,
        {
        headers: {
          Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        navigate("/painel");
      } else {
        setErrors([{ message: "Erro ao atualizar inscrição." }]);
      }
    } catch (error) {
      const details = error?.response?.data?.details;
      if (Array.isArray(details)) {
        setErrors(details);
      } else {
        setErrors([
          { message: details || "Erro ao atualizar inscrição." },
        ]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingPage) {
    return (
      <PageShell>
        <AppHeader
          showBack
          onBack={() => navigate(-1)}
          rightContent={<AppHeaderBadge>COMEJACA 2026</AppHeaderBadge>}
        />
        <LoadingWrap>
          <LoadingCard>
            <FiLoader className="spin" />
            <span>Carregando inscrição...</span>
          </LoadingCard>
        </LoadingWrap>
      </PageShell>
    );
  }

  const currentStepTitle = visibleSteps[currentStep - 1]?.title || "";

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <PageShell>
        <AppHeader
          showBack
          onBack={() => navigate(-1)}
          rightContent={<AppHeaderBadge>COMEJACA 2026</AppHeaderBadge>}
        />

        <PageContent>
          <FormCard onSubmit={handleUpdate}>
            <PageHeader>
              <Hero>
                <HeroTitle>Atualização de inscrição</HeroTitle>
                <HeroSubtitle>
                  {participantName
                    ? `Revise e atualize os dados de ${participantName}.`
                    : "Revise e atualize suas informações."}
                </HeroSubtitle>
              </Hero>

              <StepHeader>
                <StepMeta>
                  <StepEyebrow>
                    Etapa {currentStep} de {totalSteps}
                  </StepEyebrow>
                  <StepTitle>{currentStepTitle}</StepTitle>
                </StepMeta>

                <StepDots>
                  {visibleSteps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isDone = stepNumber < currentStep;

                    return (
                      <StepDot
                        key={step.id}
                        $active={isActive}
                        $done={isDone}
                      />
                    );
                  })}
                </StepDots>
              </StepHeader>

              {errors.length > 0 && (
                <AlertBox>
                  {errors.map((err, index) => (
                    <AlertItem key={index}>⚠ {err.message}</AlertItem>
                  ))}
                </AlertBox>
              )}
            </PageHeader>

            {currentStep === 1 && (
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <FiUser />
                  </SectionIcon>
                  <div>
                    <SectionTitle>Dados pessoais</SectionTitle>
                    <SectionSubtitle>
                      Informações principais do participante.
                    </SectionSubtitle>
                  </div>
                </SectionHeader>

            <FormGrid>
                  <Field>
                    <Label><FiUser /> Nome completo *</Label>
                    <Input
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                      placeholder="Digite seu nome completo"
                  required
                />
                  </Field>

                  <Field>
                    <Label><FiUser /> Nome social</Label>
                    <Input
                  name="nomeSocial"
                  value={formData.nomeSocial}
                  onChange={handleChange}
                      placeholder="Digite seu nome social"
                    />
                  </Field>

                  <Field>
                    <Label><FiUser /> Nome no crachá *</Label>
                    <Input
                  name="nomeCracha"
                  value={formData.nomeCracha}
                  onChange={handleChange}
                      placeholder="Digite o nome que aparecerá no crachá"
                      required
                    />
                  </Field>

                  <Field>
                    <Label><FiCalendar /> Data de nascimento *</Label>
                    <DateFieldWrap>
                <StyledDatePicker
                  value={formData.dataNascimento}
                  onChange={handleDateChange}
                  format="dd/MM/yyyy"
                        maxDate={new Date()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            placeholder: "DD/MM/AAAA",
                          },
                        }}
                      />
                    </DateFieldWrap>
                  </Field>

                  <Field>
                    <Label><FiUser /> Gênero *</Label>
                <Select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                      <option value="prefironaoresponder">
                        Prefiro não responder
                      </option>
                  <option value="outro">Outro</option>
                </Select>
                  </Field>

     {formData.sexo === "outro" && (
                    <Field>
                      <Label><FiInfo /> Especifique</Label>
                      <Input
            name="outroGenero"
            value={formData.outroGenero}
            onChange={handleChange}
                        placeholder="Digite seu gênero"
                      />
                    </Field>
                  )}

                  <Field>
                    <Label><FaWhatsapp /> WhatsApp *</Label>
                    <Input
         name="telefone"
         value={formData.telefone}
         onChange={handleChange}
         placeholder="Digite seu telefone"
         required
                    />
                  </Field>

                  <Field>
                    <Label><FiMail /> E-mail *</Label>
                    <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                      placeholder="nome@dominio.com"
                  required
                />
                  </Field>

                  <Field>
                    <Label><FiInfo /> Tipo de participação *</Label>
                <Select
                  name="tipoParticipacao"
                  value={formData.tipoParticipacao}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                      {PARTICIPATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                </Select>
                  </Field>

                  {formData.tipoParticipacao === "Trabalhador" && (
                    <Field>
                      <Label><FiInfo /> Comissão *</Label>
                  <Select
                    name="comissao"
                    value={formData.comissao}
                    onChange={handleChange}
                        required
                  >
                    <option value="">Selecione</option>
                        {COMISSOES.map((comissao) => (
                          <option key={comissao} value={comissao}>
                            {comissao}
                          </option>
                        ))}
                  </Select>
                    </Field>
                  )}
                </FormGrid>
              </Section>
            )}

            {hasResponsavel && currentStep === 2 && (
              <Section $highlight>
                <SectionHeader>
                  <SectionIcon>
                    <FiFileText />
                  </SectionIcon>
                  <div>
                    <SectionTitle>Responsável</SectionTitle>
                    <SectionSubtitle>
                      Dados obrigatórios para participantes menores de idade.
                    </SectionSubtitle>
                  </div>
                </SectionHeader>

                <FormGrid>
                  <Field>
                    <Label><FiUser /> Nome do responsável *</Label>
                    <Input
                      name="nomeCompletoResponsavel"
                      value={formData.nomeCompletoResponsavel}
                      onChange={handleChange}
                      placeholder="Digite o nome do responsável"
                    />
                  </Field>

                  <Field>
                    <Label><FiFileText /> Documento do responsável</Label>
                    <Input
                      name="documentoResponsavel"
                      value={formData.documentoResponsavel}
                      onChange={handleChange}
                      placeholder="Digite o documento do responsável"
                      maxLength={14}
                    />
                  </Field>

                  <Field>
                    <Label><FiPhone /> Telefone do responsável *</Label>
                    <Input
                      name="telefoneResponsavel"
                      value={formData.telefoneResponsavel}
                      onChange={handleChange}
                      placeholder="Digite o telefone do responsável"
                    />
                  </Field>
                </FormGrid>
              </Section>
            )}

            {currentStep === (hasResponsavel ? 3 : 2) && (
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <FiMapPin />
                  </SectionIcon>
                  <div>
                    <SectionTitle>Endereço e instituição</SectionTitle>
                    <SectionSubtitle>
                      Confirme seus dados de localização e vínculo espírita.
                    </SectionSubtitle>
                  </div>
                </SectionHeader>

                <FormGrid>
                  <Field>
                    <Label><FiMapPin /> CEP *</Label>
                    <Input
                  name="cep"
                  value={formData.cep}
                  onChange={handleCepChange}
                      placeholder="Digite seu CEP"
                  required
                />
                  </Field>

                  <Field>
                    <Label><FiMapPin /> Estado *</Label>
                    <Input
                  name="estado"
                  value={formData.estado}
              onChange={handleChange}
                      disabled
                    />
                  </Field>

                  <Field>
                    <Label><FiMapPin /> Cidade *</Label>
                    <Input
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                      disabled
                    />
                  </Field>

                  <Field>
                    <Label><FiMapPin /> Bairro *</Label>
                    <Input
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                      disabled
                    />
                  </Field>

                  <Field>
                    <Label><FiMapPin /> Logradouro *</Label>
                    <Input
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleChange}
                      disabled
                    />
                  </Field>

                  <Field>
                    <Label><FiMapPin /> Número *</Label>
                    <Input
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                      placeholder="Digite o número"
                  required
                />
                  </Field>

                  <Field>
                    <Label><FiMapPin /> Complemento</Label>
                    <Input
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                      placeholder="Apartamento, bloco, referência..."
                />
                  </Field>

                  <Field>
                    <Label><FiMapPin /> Instituição espírita *</Label>
                <Select
                  name="IE"
                  value={formData.IE}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                      {institutions.map((inst) => (
                        <option key={inst.id} value={inst.nome}>
                          {inst.nome}
                        </option>
                  ))}
                      <option value="outro">Outro</option>
                </Select>
                  </Field>

                  {formData.IE === "outro" && (
                    <Field fullWidth>
                      <Label><FiMapPin /> Nome da instituição</Label>
                      <Input
            name="otherInstitution"
            value={formData.otherInstitution}
            onChange={handleChange}
            placeholder="Digite o nome da instituição"
                      />
                    </Field>
                  )}
                </FormGrid>
              </Section>
            )}

            {currentStep === (hasResponsavel ? 4 : 3) && (
              <Section $highlight>
                <SectionHeader>
                  <SectionIcon>
                    <FiClock />
                  </SectionIcon>
                  <div>
                    <SectionTitle>Acolhimento e cuidados</SectionTitle>
                    <SectionSubtitle>
                      Essas informações ajudam no acolhimento durante o evento.
                    </SectionSubtitle>
                  </div>
                </SectionHeader>

                <FormGrid>
                  <Field>
                    <Label><FiClock /> É sua primeira COMEJACA? *</Label>
                    <CheckRow>
                      <CheckInput
      type="checkbox"
      name="primeiraComejaca"
      checked={formData.primeiraComejaca}
      onChange={handleChange}
    />
                      <CheckText>
                        Sim, esta é minha primeira COMEJACA.
                      </CheckText>
                    </CheckRow>
                  </Field>

                  <Field>
                    <Label><FiInfo /> Alimentação *</Label>
                    <Select
                      name="vegetariano"
                  value={formData.vegetariano}
                  onChange={handleChange}
                      required
                    >
                      <option value="">Como é sua alimentação?</option>
                  <option value="Não">Não</option>
                  <option value="Vegetariano">Vegetariano</option>
                  <option value="Vegano">Vegano</option>
                </Select>
                  </Field>

                  <Field>
                    <Label><FiInfo /> Alergias ou restrições alimentares</Label>
                <TextArea
                  name="alergia"
                  value={formData.alergia}
                  onChange={handleChange}
                      placeholder="Se houver algo que a equipe precise considerar, conte aqui."
                />
                  </Field>

                  <Field>
                    <Label><FiInfo /> Uso de medicação</Label>
                <TextArea
                  name="medicacao"
                  value={formData.medicacao}
                  onChange={handleChange}
                      placeholder="Você faz uso de algum medicamento? Descreva aqui."
                    />
                  </Field>

                  <Field fullWidth>
                    <Label>
                      <FiInfo /> Existe alguma condição que gostaria que soubéssemos?
                    </Label>
                    <CheckGrid>
                      {DEFICIENCIAS.map((item) => (
                        <CheckPill
                          key={item.name}
                          $active={!!formData[item.name]}
                        >
                          <CheckInput
                            $srOnly
          type="checkbox"
                            name={item.name}
                            checked={!!formData[item.name]}
          onChange={handleChange}
        />
                          <span>{item.label}</span>
                        </CheckPill>
                      ))}
                    </CheckGrid>

                    {formData.deficienciaOutra && (
                      <InlineInputWrap>
                        <Input
                          name="deficienciaOutraDescricao"
                          value={formData.deficienciaOutraDescricao}
          onChange={handleChange}
                          placeholder="Informe a condição"
                        />
                      </InlineInputWrap>
                    )}
                  </Field>

                  <Field fullWidth>
                    <Label><FiInfo /> Observações</Label>
                    <TextArea
                      name="outrasInformacoes"
                      value={formData.outrasInformacoes}
          onChange={handleChange}
                      placeholder="Caso queira compartilhar alguma informação importante, registre aqui."
                      rows={5}
                    />
                  </Field>
                </FormGrid>
              </Section>
            )}

            {currentStep === totalSteps && (
              <Section>
                <SectionHeader>
                  <SectionIcon>
                    <FiInfo />
                  </SectionIcon>
                  <div>
                    <SectionTitle>Revisão</SectionTitle>
                    <SectionSubtitle>
                      Confira as informações antes de salvar.
                    </SectionSubtitle>
                  </div>
                </SectionHeader>

                <ReviewGrid>
                  <ReviewItem>
                    <ReviewLabel>Nome completo</ReviewLabel>
                    <ReviewValue>
                      {formData.nomeCompleto || "Não informado"}
                    </ReviewValue>
                  </ReviewItem>

                  <ReviewItem>
                    <ReviewLabel>Nome no crachá</ReviewLabel>
                    <ReviewValue>
                      {formData.nomeCracha || "Não informado"}
                    </ReviewValue>
                  </ReviewItem>

                  <ReviewItem>
                    <ReviewLabel>Data de nascimento</ReviewLabel>
                    <ReviewValue>
                      {formData.dataNascimento
                        ? new Date(formData.dataNascimento).toLocaleDateString("pt-BR")
                        : "Não informado"}
                    </ReviewValue>
                  </ReviewItem>

                  <ReviewItem>
                    <ReviewLabel>WhatsApp</ReviewLabel>
                    <ReviewValue>
                      {formData.telefone || "Não informado"}
                    </ReviewValue>
                  </ReviewItem>

                  <ReviewItem>
                    <ReviewLabel>E-mail</ReviewLabel>
                    <ReviewValue>
                      {formData.email || "Não informado"}
                    </ReviewValue>
                  </ReviewItem>

                  <ReviewItem>
                    <ReviewLabel>Tipo de participação</ReviewLabel>
                    <ReviewValue>
                      {formData.tipoParticipacao || "Não informado"}
                    </ReviewValue>
                  </ReviewItem>

                  {formData.tipoParticipacao === "Trabalhador" && (
                    <ReviewItem>
                      <ReviewLabel>Comissão</ReviewLabel>
                      <ReviewValue>
                        {formData.comissao || "Não informado"}
                      </ReviewValue>
                    </ReviewItem>
                  )}

                  {hasResponsavel && (
                    <>
                      <ReviewItem>
                        <ReviewLabel>Nome do responsável</ReviewLabel>
                        <ReviewValue>
                          {formData.nomeCompletoResponsavel || "Não informado"}
                        </ReviewValue>
                      </ReviewItem>

                      <ReviewItem>
                        <ReviewLabel>Telefone do responsável</ReviewLabel>
                        <ReviewValue>
                          {formData.telefoneResponsavel || "Não informado"}
                        </ReviewValue>
                      </ReviewItem>
                    </>
                  )}

                  <ReviewItem>
                    <ReviewLabel>Instituição espírita</ReviewLabel>
                    <ReviewValue>
                      {formData.IE === "outro"
                        ? formData.otherInstitution || "Não informado"
                        : formData.IE || "Não informado"}
                    </ReviewValue>
                  </ReviewItem>

                  <ReviewItem>
                    <ReviewLabel>CEP</ReviewLabel>
                    <ReviewValue>{formData.cep || "Não informado"}</ReviewValue>
                  </ReviewItem>

                  <ReviewItem>
                    <ReviewLabel>Endereço</ReviewLabel>
                    <ReviewValue>
                      {[formData.logradouro, formData.numero, formData.bairro, formData.cidade, formData.estado]
                        .filter(Boolean)
                        .join(", ") || "Não informado"}
                    </ReviewValue>
                  </ReviewItem>

                  <ReviewItem>
                    <ReviewLabel>Primeira COMEJACA</ReviewLabel>
                    <ReviewValue>
                      {formData.primeiraComejaca ? "Sim" : "Não"}
                    </ReviewValue>
                  </ReviewItem>

                  <ReviewItem>
                    <ReviewLabel>Alimentação</ReviewLabel>
                    <ReviewValue>
                      {formData.vegetariano || "Não informado"}
                    </ReviewValue>
                  </ReviewItem>

                  <ReviewItem fullWidth>
                    <ReviewLabel>Alergias / restrições</ReviewLabel>
                    <ReviewValue>
                      {formData.alergia || "Não informado"}
                    </ReviewValue>
                  </ReviewItem>

                  <ReviewItem fullWidth>
                    <ReviewLabel>Uso de medicação</ReviewLabel>
                    <ReviewValue>
                      {formData.medicacao || "Não informado"}
                    </ReviewValue>
                  </ReviewItem>

                  <ReviewItem fullWidth>
                    <ReviewLabel>Observações</ReviewLabel>
                    <ReviewValue>
                      {formData.outrasInformacoes || "Não informado"}
                    </ReviewValue>
                  </ReviewItem>
                </ReviewGrid>
              </Section>
            )}

            <FooterActions>
              <SecondaryButton type="button" onClick={goToPreviousStep}>
                {currentStep === 1 ? (
                  <>
                    <FiChevronLeft />
                    Voltar
                  </>
                ) : (
                  <>
                    <FiChevronLeft />
                    Anterior
                  </>
                )}
              </SecondaryButton>

              {currentStep < totalSteps ? (
                <PrimaryButton type="button" onClick={goToNextStep}>
                  Próximo
                  <FiChevronRight />
                </PrimaryButton>
              ) : (
                <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                    <FiLoader className="spin" />
                    Salvando...
                    </>
                ) : (
                    <>
                    <FiFileText />
                    Salvar informações
                    </>
                )}
                </PrimaryButton>
              )}
            </FooterActions>
          </FormCard>
        </PageContent>
      </PageShell>
    </LocalizationProvider>
  );
};

export default Atualizar;

/* =========================
   Styled Components
========================= */

const PageShell = styled.div`
  min-height: 100vh;
  background: #f5f7fb;
  color: #0f172a;
  padding-top: calc(${APP_HEADER_HEIGHT} + 24px);

  @media (max-width: 768px) {
    padding-top: calc(${APP_HEADER_HEIGHT_MOBILE} + 16px);
  }
`;

const PageContent = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 1.5rem 2.5rem;

  @media (max-width: 768px) {
    padding: 0 0 1.5rem;
  }
`;

const FormCard = styled.form`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  box-shadow:
    0 24px 54px rgba(15, 23, 42, 0.08),
    0 8px 18px rgba(15, 23, 42, 0.04);
  overflow: hidden;
`;

const PageHeader = styled.div`
  margin-bottom: 0;

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const Hero = styled.div`
  padding: 1.75rem 2.25rem 0;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 1.15rem 1rem 0;
  }
`;

const HeroTitle = styled.h1`
  margin: 0;
  color: #111827;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.25;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const HeroSubtitle = styled.p`
  margin: 0.55rem 0 0;
  max-width: 760px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
`;

const StepHeader = styled.div`
  padding: 1.2rem 2rem 1.15rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1rem 1rem 1rem;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StepMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const StepEyebrow = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const StepTitle = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
`;

const StepDots = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

const StepDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ $active, $done }) =>
    $active ? "#1d4ed8" : $done ? "#94a3b8" : "#dbe2ea"};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 4px rgba(29, 78, 216, 0.12)" : "none"};
  transition: all 0.2s ease;
`;

const AlertBox = styled.div`
  margin: 0 2rem 1.2rem;
  border: 1px solid rgba(239, 68, 68, 0.18);
  border-left: 3px solid rgba(239, 68, 68, 0.4);
  background: linear-gradient(180deg, #fff9f9 0%, #fef2f2 100%);
  border-radius: 5px;
  padding: 0.9rem 1rem;
  box-shadow: 0 10px 24px rgba(239, 68, 68, 0.06);

  @media (max-width: 768px) {
    margin: 0 1rem 1rem;
  }
`;

const AlertItem = styled.div`
  color: #7f1d1d;
  font-size: 0.92rem;
  line-height: 1.5;

  & + & {
    margin-top: 0.35rem;
  }
`;

const Section = styled.section`
  padding: 2.15rem 2rem;
  border-top: 1px solid #eef2f7;
  background: ${({ $highlight }) =>
    $highlight
      ? "linear-gradient(180deg, #fcfdff 0%, #f5f9ff 100%)"
      : "#ffffff"};
  box-shadow: ${({ $highlight }) =>
    $highlight
      ? "inset 0 1px 0 rgba(255, 255, 255, 0.85), inset 0 0 0 1px rgba(37, 99, 235, 0.03)"
      : "none"};

  @media (max-width: 768px) {
    padding: 1.7rem 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  margin-bottom: 1.65rem;
  padding: 0.9rem 1rem;
  border: 1px solid #e7edf4;
  border-radius: 12px;
  background: linear-gradient(180deg, #fafcff 0%, #f7f9fc 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);

  @media (max-width: 768px) {
    padding: 0.85rem 0.9rem;
    margin-bottom: 1.3rem;
  }
`;

const SectionIcon = styled.div`
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #dbe4ee;
  color: #475569;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.12rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled.p`
  margin: 0.35rem 0 0;
  color: #6b7280;
  font-size: 0.92rem;
  line-height: 1.6;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.3rem 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.05rem;
  }
`;

const Field = styled.div`
  min-width: 0;
  grid-column: ${({ fullWidth }) => (fullWidth ? "1 / -1" : "auto")};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
  font-size: 0.9rem;
  font-weight: 600;
`;

const baseFieldStyles = `
  width: 100%;
  min-height: 52px;
  padding: 0.95rem 1rem;
  border: 1px solid #dde5ee;
  border-radius: 12px;
  background: #fbfcfe;
  color: #0f172a;
  font-family: 'Poppins', sans-serif;
  font-size: 0.96rem;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;
  box-sizing: border-box;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.03);

  &::placeholder {
    color: #9ca3af;
  }

  &:hover {
    border-color: #ccd6e2;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow:
      0 0 0 3px rgba(37, 99, 235, 0.1),
      inset 0 1px 2px rgba(15, 23, 42, 0.03);
    background: #ffffff;
  }

  &:disabled {
    background: #f3f4f6;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  ${baseFieldStyles}
`;

const Select = styled.select`
  ${baseFieldStyles}
  appearance: none;
`;

const TextArea = styled.textarea`
  ${baseFieldStyles}
  min-height: 138px;
  padding: 1rem 1rem 1.05rem;
  line-height: 1.65;
  resize: vertical;
`;

const DateFieldWrap = styled.div`
  .MuiFormControl-root {
    width: 100%;
  }

  .MuiInputBase-root {
    ${baseFieldStyles}
    padding: 0.15rem 0.2rem 0.15rem 0.75rem;
  }

  .MuiInputBase-input {
    padding: 0.8rem 0.5rem;
    font-family: "Poppins", sans-serif;
  }

  fieldset {
    border: none;
  }
`;

const StyledDatePicker = styled(DatePicker)``;

const CheckRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
  padding: 0.95rem 1rem;
  border: 1px solid ${({ $emphasis }) => ($emphasis ? "#d7e3f0" : "#e2e8f0")};
  border-radius: 14px;
  background: ${({ $emphasis }) =>
    $emphasis
      ? "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)"
      : "#ffffff"};
  box-shadow: ${({ $emphasis }) =>
    $emphasis
      ? "0 14px 28px rgba(37, 99, 235, 0.06)"
      : "0 10px 20px rgba(15, 23, 42, 0.03)"};
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;

  &:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
`;

const CheckInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #1f2937;
  cursor: pointer;

  ${({ $srOnly }) =>
    $srOnly &&
    `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `}
`;

const CheckText = styled.span`
  color: #334155;
  font-size: 0.95rem;
  line-height: 1.5;
  font-weight: 500;
`;

const CheckGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const CheckPill = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.82rem 1rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "#c7d2fe" : "#dbe5ef")};
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(180deg, #eef4ff 0%, #e3edff 100%)"
      : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"};
  color: ${({ $active }) => ($active ? "#1e40af" : "#334155")};
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ $active }) =>
    $active
      ? "0 14px 26px rgba(37, 99, 235, 0.1)"
      : "0 8px 18px rgba(15, 23, 42, 0.04)"};
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: ${({ $active }) => ($active ? "#2563eb" : "#cbd5e1")};
    box-shadow: ${({ $active }) =>
      $active ? "0 0 0 4px rgba(37, 99, 235, 0.12)" : "none"};
    transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
    flex-shrink: 0;
  }

  &:hover {
    border-color: ${({ $active }) => ($active ? "#93c5fd" : "#cbd5e1")};
    transform: translateY(-1px);
  }
`;

const InlineInputWrap = styled.div`
  margin-top: 0.8rem;
  max-width: 420px;
`;

const FooterActions = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.9rem 2rem 2.3rem;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%);
  border-top: 1px solid #eef2f7;

  @media (max-width: 768px) {
    padding: 1.35rem 1rem 1.75rem;
    flex-direction: column;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ButtonBase = styled.button`
  min-height: 52px;
  border-radius: 12px;
  padding: 0.98rem 1.25rem;
  border: none;
  font-family: "Poppins", sans-serif;
  font-size: 0.96rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(ButtonBase)`
  flex: 1;
  background: linear-gradient(180deg, #2b2d42 0%, #24263a 52%, #1f2133 100%);
  color: #f8fafc;
  box-shadow:
    0 18px 34px rgba(31, 33, 51, 0.22),
    0 8px 16px rgba(15, 23, 42, 0.12);

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, #31334a 0%, #2a2c43 52%, #23253a 100%);
    box-shadow:
      0 22px 38px rgba(31, 33, 51, 0.24),
      0 10px 18px rgba(15, 23, 42, 0.14);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  min-width: 160px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  color: #1f2937;
  border: 1px solid #d7e0ea;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);

  &:hover:not(:disabled) {
    background: #ffffff;
    border-color: #c3cedb;
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
  }
`;

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewItem = styled.div`
  grid-column: ${({ fullWidth }) => (fullWidth ? "1 / -1" : "auto")};
  border: 1px solid #e5e7eb;
  background: #fbfcfe;
  border-radius: 12px;
  padding: 1rem;
`;

const ReviewLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.35rem;
`;

const ReviewValue = styled.div`
  font-size: 0.96rem;
  color: #0f172a;
  font-weight: 500;
  line-height: 1.5;
  word-break: break-word;
`;

const LoadingWrap = styled.div`
  padding: 2rem;
`;

const LoadingCard = styled.div`
  max-width: 480px;
  margin: 2rem auto 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  box-shadow:
    0 20px 40px rgba(15, 23, 42, 0.08),
    0 6px 14px rgba(15, 23, 42, 0.04);
  padding: 1.35rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  color: #1f2937;

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import {
  FiFileText,
  FiHeart,
  FiInfo,
  FiLoader,
  FiMapPin,
  FiUser,
  FiArrowLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  faUser,
  faUserTag,
  faIdBadge,
  faShieldHalved,
  faIdCard,
  faPhone,
  faVenusMars,
  faPen,
  faEnvelope,
  faPeopleGroup,
  faSitemap,
  faMapLocationDot,
  faSeedling,
  faCircleInfo,
  faShirt,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import AppHeader, { AppHeaderBadge } from "../shared/AppHeader";
import CamisaModeloGalleryTrigger from "../shared/CamisaModeloGallery";
import { EVENT } from "../../config/eventConfig";
import {
  CAMISA_TAMANHOS,
  CAMISA_TIPO_OPCOES,
  CAMISA_COR_OPCOES,
  labelCamisaTipo,
  labelCamisaCor,
} from "../../config/camisaParticipante";
import PremiumAuthField, {
  PremiumAuthSelect,
  PremiumAuthTextarea,
} from "../Unauthenticated/auth/PremiumAuthField";
import {
  mergeUpdateFormTheme,
  InscriptionBirthDateField,
  UpdatePageContainer,
  UpdatePageContent,
  UpdateFormCard,
  UpdateFormHeader,
  UpdateFormTitle,
  UpdateFormSubtitle,
  UpdateErrorBox,
  UpdateFormFieldScope,
  UpdateStepProgressLabel,
  UpdateFormCalloutLabel,
  UpdateCamisaSubsection,
  UpdateSection,
  UpdateSectionHeader,
  UpdateSectionIcon,
  UpdateSectionTitleWrap,
  UpdateSectionTitle,
  UpdateSectionDescription,
  UpdateFormGrid,
  UpdateInputGroup,
  UpdateFullWidthGroup,
  UpdateStepMetaRow,
  UpdateStepDots,
  UpdateStepDot,
  UpdateFooterActions,
  UpdateStepBackButton,
  UpdateFooterPrimaryButton,
  UpdateReviewGrid,
  UpdateReviewItem,
  UpdateReviewLabel,
  UpdateReviewValue,
  UpdateLoadingWrap,
  UpdateLoadingCard,
  UpdateFirstComejacaBox,
  UpdateFirstComejacaCheckbox,
  UpdateFirstComejacaText,
  UpdateChipsGroup,
  UpdateChipLabel,
} from "./inscriptionUpdateVisual";

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
  camisaTipo: "",
  camisaCor: "",
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
  { value: "Trabalhador", label: "Membro de Equipe / Tarefeiro do Bem" },
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
  const [theme] = useState(() => mergeUpdateFormTheme());
  const today = new Date();

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

        const camisaSim = data.camisa === true;
        setFormData((prev) => ({
          ...prev,
          ...data,
          dataNascimento: formattedBirthDate,
          camisa: camisaSim,
          tamanhoCamisa: camisaSim ? (data.tamanhoCamisa || "").trim() : "",
          camisaTipo: camisaSim ? String(data.camisaTipo || "").trim() : "",
          camisaCor: camisaSim ? String(data.camisaCor || "").trim() : "",
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

  const isPagamentoPago = useMemo(() => {
    const s = String(formData.statusPagamento || "").trim().toLowerCase();
    return s === "pago";
  }, [formData.statusPagamento]);

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

  const handleCamisaDesejoChange = (e) => {
    const v = e.target.value;
    setFormData((prev) => ({
      ...prev,
      camisa: v === "sim",
      tamanhoCamisa: v === "sim" ? prev.tamanhoCamisa : "",
      camisaTipo: v === "sim" ? prev.camisaTipo : "",
      camisaCor: v === "sim" ? prev.camisaCor : "",
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

      if (!isPagamentoPago && formData.camisa === true) {
        if (!String(formData.camisaTipo || "").trim()) {
          validationErrors.push({
            message: "Selecione o tipo da camisa.",
          });
        }
        if (!String(formData.camisaCor || "").trim()) {
          validationErrors.push({
            message: "Selecione a cor da camisa.",
          });
        }
        if (!String(formData.tamanhoCamisa || "").trim()) {
          validationErrors.push({
            message: "Selecione o tamanho da camisa.",
          });
        }
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
        email: formData.email?.trim().toLowerCase() || "",
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
        tamanhoCamisa: (() => {
          const quer =
            formData.camisa === true || formData.camisa === "true";
          if (!quer) return null;
          return String(formData.tamanhoCamisa || "").trim() || null;
        })(),
        camisaTipo: (() => {
          const quer =
            formData.camisa === true || formData.camisa === "true";
          if (!quer) return null;
          return String(formData.camisaTipo || "").trim() || null;
        })(),
        camisaCor: (() => {
          const quer =
            formData.camisa === true || formData.camisa === "true";
          if (!quer) return null;
          return String(formData.camisaCor || "").trim() || null;
        })(),
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

      console.log("[nomeCracha][front] antes do submit", {
        formDataNomeCracha: formData.nomeCracha,
        payloadNomeCracha: payload.nomeCracha,
      });
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
      <ThemeProvider theme={theme}>
        <UpdatePageContainer>
          <AppHeader
            showBack
            onBack={() => navigate(-1)}
            rightContent={<AppHeaderBadge>{EVENT.displayName}</AppHeaderBadge>}
          />
          <UpdateLoadingWrap>
            <UpdateLoadingCard>
              <FiLoader className="spin" />
              <span>Carregando inscrição...</span>
            </UpdateLoadingCard>
          </UpdateLoadingWrap>
        </UpdatePageContainer>
      </ThemeProvider>
    );
  }

  const currentStepTitle = visibleSteps[currentStep - 1]?.title || "";

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <ThemeProvider theme={theme}>
        <UpdatePageContainer>
          <AppHeader
            showBack
            onBack={() => navigate(-1)}
            rightContent={<AppHeaderBadge>{EVENT.displayName}</AppHeaderBadge>}
          />

          <UpdatePageContent>
            <UpdateFormCard onSubmit={handleUpdate}>
              <UpdateFormHeader>
                <UpdateFormTitle>Atualização de inscrição</UpdateFormTitle>
                <UpdateFormSubtitle>
                  {participantName
                    ? `Revise e atualize os dados de ${participantName}.`
                    : "Revise e atualize suas informações."}
                </UpdateFormSubtitle>

                <UpdateStepMetaRow>
                  <UpdateSectionTitleWrap>
                    <UpdateStepProgressLabel>
                      Passo {currentStep} de {totalSteps} — {currentStepTitle}
                    </UpdateStepProgressLabel>
                  </UpdateSectionTitleWrap>
                  <UpdateStepDots>
                    {visibleSteps.map((step, index) => {
                      const stepNumber = index + 1;
                      const isActive = stepNumber === currentStep;
                      const isDone = stepNumber < currentStep;

                      return (
                        <UpdateStepDot
                          key={step.id}
                          $active={isActive}
                          $done={isDone}
                          aria-hidden
                        />
                      );
                    })}
                  </UpdateStepDots>
                </UpdateStepMetaRow>

                {errors.length > 0 ? (
                  <UpdateErrorBox>
                    {errors.map((err, index) => (
                      <div key={index}>⚠️ {err.message}</div>
                    ))}
                  </UpdateErrorBox>
                ) : null}
              </UpdateFormHeader>

              <UpdateFormFieldScope>
            {currentStep === 1 && (
              <UpdateSection>
                <UpdateSectionHeader>
                  <UpdateSectionIcon>
                    <FiUser />
                  </UpdateSectionIcon>
                  <UpdateSectionTitleWrap>
                    <UpdateSectionTitle>Dados pessoais</UpdateSectionTitle>
                    <UpdateSectionDescription>
                      Informações principais do participante.
                    </UpdateSectionDescription>
                  </UpdateSectionTitleWrap>
                </UpdateSectionHeader>

                <UpdateFormGrid>
                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-nomeCompleto"
                      name="nomeCompleto"
                      label="Nome completo *"
                      icon={faUser}
                      value={formData.nomeCompleto}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-nomeSocial"
                      name="nomeSocial"
                      label="Nome social"
                      icon={faUserTag}
                      value={formData.nomeSocial}
                      onChange={handleChange}
                      autoComplete="nickname"
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-nomeCracha"
                      name="nomeCracha"
                      label="Nome no crachá *"
                      icon={faIdBadge}
                      value={formData.nomeCracha}
                      onChange={handleChange}
                      required
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <InscriptionBirthDateField
                      id="upd-dataNascimento"
                      label="Data de nascimento *"
                      value={formData.dataNascimento}
                      onChange={handleDateChange}
                      maxDate={today}
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthSelect
                      id="upd-sexo"
                      name="sexo"
                      label="Gênero *"
                      icon={faVenusMars}
                      value={formData.sexo}
                      onChange={handleChange}
                      required
                    >
                      <option value=""> </option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="prefironaoresponder">Prefiro não responder</option>
                      <option value="outro">Outro</option>
                    </PremiumAuthSelect>
                  </UpdateInputGroup>

                  {formData.sexo === "outro" ? (
                    <UpdateInputGroup>
                      <PremiumAuthField
                        id="upd-outroGenero"
                        type="text"
                        name="outroGenero"
                        label="Especifique *"
                        icon={faPen}
                        value={formData.outroGenero}
                        onChange={handleChange}
                        placeholder="Digite seu gênero"
                        required
                      />
                    </UpdateInputGroup>
                  ) : null}

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-telefone"
                      name="telefone"
                      label="WhatsApp *"
                      icon={faWhatsapp}
                      value={formData.telefone}
                      onChange={handleChange}
                      inputMode="tel"
                      autoComplete="tel"
                      required
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-email"
                      type="email"
                      name="email"
                      label="E-mail *"
                      icon={faEnvelope}
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      inputMode="email"
                      required
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthSelect
                      id="upd-tipoParticipacao"
                      name="tipoParticipacao"
                      label="Tipo de participação *"
                      icon={faPeopleGroup}
                      value={formData.tipoParticipacao}
                      onChange={handleChange}
                      required
                    >
                      <option value=""> </option>
                      {PARTICIPATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </PremiumAuthSelect>
                  </UpdateInputGroup>

                  {formData.tipoParticipacao === "Trabalhador" ? (
                    <UpdateInputGroup>
                      <PremiumAuthSelect
                        id="upd-comissao"
                        name="comissao"
                        label="Comissão *"
                        icon={faSitemap}
                        value={formData.comissao}
                        onChange={handleChange}
                        required
                      >
                        <option value=""> </option>
                        {COMISSOES.map((comissao) => (
                          <option key={comissao} value={comissao}>
                            {comissao}
                          </option>
                        ))}
                      </PremiumAuthSelect>
                    </UpdateInputGroup>
                  ) : null}
                </UpdateFormGrid>
              </UpdateSection>
            )}

            {hasResponsavel && currentStep === 2 && (
              <UpdateSection>
                <UpdateSectionHeader>
                  <UpdateSectionIcon>
                    <FiFileText />
                  </UpdateSectionIcon>
                  <UpdateSectionTitleWrap>
                    <UpdateSectionTitle>Responsável</UpdateSectionTitle>
                    <UpdateSectionDescription>
                      Dados obrigatórios para participantes menores de idade.
                    </UpdateSectionDescription>
                  </UpdateSectionTitleWrap>
                </UpdateSectionHeader>

                <UpdateFormGrid>
                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-nomeCompletoResponsavel"
                      name="nomeCompletoResponsavel"
                      label="Nome do responsável *"
                      icon={faShieldHalved}
                      value={formData.nomeCompletoResponsavel}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-documentoResponsavel"
                      name="documentoResponsavel"
                      label="Documento do responsável"
                      icon={faIdCard}
                      value={formData.documentoResponsavel}
                      onChange={handleChange}
                      maxLength={14}
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-telefoneResponsavel"
                      name="telefoneResponsavel"
                      label="Telefone do responsável *"
                      icon={faPhone}
                      value={formData.telefoneResponsavel}
                      onChange={handleChange}
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </UpdateInputGroup>
                </UpdateFormGrid>
              </UpdateSection>
            )}

            {currentStep === (hasResponsavel ? 3 : 2) && (
              <UpdateSection>
                <UpdateSectionHeader>
                  <UpdateSectionIcon>
                    <FiMapPin />
                  </UpdateSectionIcon>
                  <UpdateSectionTitleWrap>
                    <UpdateSectionTitle>Endereço e instituição</UpdateSectionTitle>
                    <UpdateSectionDescription>
                      Confirme seus dados de localização e vínculo espírita.
                    </UpdateSectionDescription>
                  </UpdateSectionTitleWrap>
                </UpdateSectionHeader>

                <UpdateFormGrid>
                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-cep"
                      name="cep"
                      label="CEP *"
                      icon={faMapLocationDot}
                      value={formData.cep}
                      onChange={handleCepChange}
                      inputMode="numeric"
                      required
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-estado"
                      name="estado"
                      label="Estado *"
                      icon={faMapLocationDot}
                      value={formData.estado}
                      onChange={handleChange}
                      disabled
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-cidade"
                      name="cidade"
                      label="Cidade *"
                      icon={faMapLocationDot}
                      value={formData.cidade}
                      onChange={handleChange}
                      disabled
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-bairro"
                      name="bairro"
                      label="Bairro *"
                      icon={faMapLocationDot}
                      value={formData.bairro}
                      onChange={handleChange}
                      disabled
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-logradouro"
                      name="logradouro"
                      label="Logradouro *"
                      icon={faMapLocationDot}
                      value={formData.logradouro}
                      onChange={handleChange}
                      disabled
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-numero"
                      name="numero"
                      label="Número *"
                      icon={faMapLocationDot}
                      value={formData.numero}
                      onChange={handleChange}
                      required
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthField
                      id="upd-complemento"
                      name="complemento"
                      label="Complemento"
                      icon={faMapLocationDot}
                      value={formData.complemento}
                      onChange={handleChange}
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthSelect
                      id="upd-IE"
                      name="IE"
                      label="Instituição espírita *"
                      icon={faSitemap}
                      value={formData.IE}
                      onChange={handleChange}
                      required
                    >
                      <option value=""> </option>
                      {institutions.map((inst) => (
                        <option key={inst.id} value={inst.nome}>
                          {inst.nome}
                        </option>
                      ))}
                      <option value="outro">Outro</option>
                    </PremiumAuthSelect>
                  </UpdateInputGroup>

                  {formData.IE === "outro" ? (
                    <UpdateFullWidthGroup>
                      <PremiumAuthField
                        id="upd-otherInstitution"
                        name="otherInstitution"
                        label="Nome da instituição"
                        icon={faMapLocationDot}
                        value={formData.otherInstitution}
                        onChange={handleChange}
                      />
                    </UpdateFullWidthGroup>
                  ) : null}
                </UpdateFormGrid>
              </UpdateSection>
            )}

            {currentStep === (hasResponsavel ? 4 : 3) && (
              <UpdateSection>
                <UpdateSectionHeader>
                  <UpdateSectionIcon>
                    <FiHeart />
                  </UpdateSectionIcon>
                  <UpdateSectionTitleWrap>
                    <UpdateSectionTitle>Acolhimento e cuidados</UpdateSectionTitle>
                    <UpdateSectionDescription>
                      Essas informações ajudam no acolhimento durante o evento.
                    </UpdateSectionDescription>
                  </UpdateSectionTitleWrap>
                </UpdateSectionHeader>

                <UpdateFormGrid>
                  <UpdateFullWidthGroup>
                    <UpdateFormCalloutLabel>
                      <FiInfo aria-hidden />
                      É sua primeira {EVENT.name}? *
                    </UpdateFormCalloutLabel>
                    <UpdateFirstComejacaBox>
                      <UpdateFirstComejacaCheckbox
                        type="checkbox"
                        name="primeiraComejaca"
                        checked={formData.primeiraComejaca}
                        onChange={handleChange}
                      />
                      <UpdateFirstComejacaText>
                        Sim, esta é minha primeira {EVENT.name}.
                      </UpdateFirstComejacaText>
                    </UpdateFirstComejacaBox>
                  </UpdateFullWidthGroup>

                  <UpdateInputGroup>
                    <PremiumAuthSelect
                      id="upd-vegetariano"
                      name="vegetariano"
                      label="Alimentação *"
                      icon={faSeedling}
                      value={formData.vegetariano}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Como é sua alimentação?</option>
                      <option value="Não">Não</option>
                      <option value="Vegetariano">Vegetariano</option>
                      <option value="Vegano">Vegano</option>
                    </PremiumAuthSelect>
                  </UpdateInputGroup>

                  <UpdateFullWidthGroup>
                    <UpdateCamisaSubsection>
                      <CamisaModeloGalleryTrigger apiBaseUrl={API_URL} />
                      {isPagamentoPago ? (
                        <UpdateCamisaPagoNotice role="status">
                          Inscrição com pagamento confirmado: a opção de camisa aparece apenas para
                          consulta. Alterações podem não ser consideradas na logística do evento —
                          em caso de dúvida, fale com a organização.
                        </UpdateCamisaPagoNotice>
                      ) : null}
                      <UpdateInputGroup>
                        <PremiumAuthSelect
                          id="upd-desejaCamisa"
                          name="desejaCamisa"
                          label="Deseja adquirir camisa? *"
                          icon={faShirt}
                          value={
                            formData.camisa === true
                              ? "sim"
                              : formData.camisa === false
                                ? "nao"
                                : ""
                          }
                          onChange={handleCamisaDesejoChange}
                          disabled={isPagamentoPago}
                          required={!isPagamentoPago}
                        >
                          <option value=""> </option>
                          <option value="nao">Não</option>
                          <option value="sim">Sim</option>
                        </PremiumAuthSelect>
                      </UpdateInputGroup>

                      <UpdateCamisaSizeReveal $open={formData.camisa === true}>
                        <UpdateCamisaSizeRevealInner>
                          {formData.camisa === true ? (
                            <>
                              <UpdateCamisaTipoCorRow>
                                <UpdateInputGroup>
                                  <PremiumAuthSelect
                                    id="upd-camisaTipo"
                                    name="camisaTipo"
                                    label="Tipo da camisa *"
                                    icon={faShirt}
                                    value={formData.camisaTipo}
                                    onChange={handleChange}
                                    disabled={isPagamentoPago}
                                    required={!isPagamentoPago}
                                  >
                                    <option value=""> </option>
                                    {CAMISA_TIPO_OPCOES.map((o) => (
                                      <option key={o.value} value={o.value}>
                                        {o.label} — {o.precoLabel}
                                      </option>
                                    ))}
                                  </PremiumAuthSelect>
                                </UpdateInputGroup>
                                <UpdateInputGroup>
                                  <PremiumAuthSelect
                                    id="upd-camisaCor"
                                    name="camisaCor"
                                    label="Cor da camisa *"
                                    icon={faShirt}
                                    value={formData.camisaCor}
                                    onChange={handleChange}
                                    disabled={isPagamentoPago}
                                    required={!isPagamentoPago}
                                  >
                                    <option value=""> </option>
                                    {CAMISA_COR_OPCOES.map((o) => (
                                      <option key={o.value} value={o.value}>
                                        {o.label}
                                      </option>
                                    ))}
                                  </PremiumAuthSelect>
                                </UpdateInputGroup>
                              </UpdateCamisaTipoCorRow>
                              <UpdateInputGroup>
                                <PremiumAuthSelect
                                  id="upd-tamanhoCamisa"
                                  name="tamanhoCamisa"
                                  label="Tamanho da camisa *"
                                  icon={faShirt}
                                  value={formData.tamanhoCamisa}
                                  onChange={handleChange}
                                  disabled={isPagamentoPago}
                                  required={!isPagamentoPago}
                                >
                                  <option value=""> </option>
                                  {CAMISA_TAMANHOS.map((t) => (
                                    <option key={t} value={t}>
                                      {t}
                                    </option>
                                  ))}
                                </PremiumAuthSelect>
                              </UpdateInputGroup>
                            </>
                          ) : null}
                        </UpdateCamisaSizeRevealInner>
                      </UpdateCamisaSizeReveal>
                    </UpdateCamisaSubsection>
                  </UpdateFullWidthGroup>

                  <UpdateInputGroup>
                    <PremiumAuthTextarea
                      id="upd-alergia"
                      name="alergia"
                      label="Alergias ou restrições alimentares"
                      icon={faCircleInfo}
                      value={formData.alergia}
                      onChange={handleChange}
                      rows={4}
                    />
                  </UpdateInputGroup>

                  <UpdateInputGroup>
                    <PremiumAuthTextarea
                      id="upd-medicacao"
                      name="medicacao"
                      label="Uso de medicação"
                      icon={faCircleInfo}
                      value={formData.medicacao}
                      onChange={handleChange}
                      rows={4}
                    />
                  </UpdateInputGroup>

                  <UpdateFullWidthGroup>
                    <UpdateFormCalloutLabel>
                      <FiInfo aria-hidden />
                      Existe alguma condição que gostaria que soubéssemos?
                    </UpdateFormCalloutLabel>
                    <UpdateChipsGroup>
                      {DEFICIENCIAS.map((item) => (
                        <UpdateChipLabel
                          key={item.name}
                          $selected={!!formData[item.name]}
                        >
                          <input
                            type="checkbox"
                            name={item.name}
                            checked={!!formData[item.name]}
                            onChange={handleChange}
                          />
                          {item.label}
                        </UpdateChipLabel>
                      ))}
                    </UpdateChipsGroup>

                    {formData.deficienciaOutra ? (
                      <InlineInputWrap>
                        <PremiumAuthField
                          id="upd-deficienciaOutraDescricao"
                          type="text"
                          name="deficienciaOutraDescricao"
                          label="Informe a condição"
                          icon={faPen}
                          value={formData.deficienciaOutraDescricao}
                          onChange={handleChange}
                        />
                      </InlineInputWrap>
                    ) : null}
                  </UpdateFullWidthGroup>

                  <UpdateFullWidthGroup>
                    <PremiumAuthTextarea
                      id="upd-outrasInformacoes"
                      name="outrasInformacoes"
                      label="Observações"
                      icon={faCircleInfo}
                      value={formData.outrasInformacoes}
                      onChange={handleChange}
                      rows={5}
                    />
                  </UpdateFullWidthGroup>
                </UpdateFormGrid>
              </UpdateSection>
            )}

            {currentStep === totalSteps && (
              <UpdateSection>
                <UpdateSectionHeader>
                  <UpdateSectionIcon>
                    <FiInfo />
                  </UpdateSectionIcon>
                  <UpdateSectionTitleWrap>
                    <UpdateSectionTitle>Revisão</UpdateSectionTitle>
                    <UpdateSectionDescription>
                      Confira as informações antes de salvar.
                    </UpdateSectionDescription>
                  </UpdateSectionTitleWrap>
                </UpdateSectionHeader>

                <UpdateReviewGrid>
                  <UpdateReviewItem>
                    <UpdateReviewLabel>Nome completo</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.nomeCompleto || "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem>
                    <UpdateReviewLabel>Nome no crachá</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.nomeCracha || "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem>
                    <UpdateReviewLabel>Data de nascimento</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.dataNascimento
                        ? new Date(formData.dataNascimento).toLocaleDateString("pt-BR")
                        : "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem>
                    <UpdateReviewLabel>WhatsApp</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.telefone || "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem>
                    <UpdateReviewLabel>E-mail</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.email || "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem>
                    <UpdateReviewLabel>Tipo de participação</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.tipoParticipacao || "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  {formData.tipoParticipacao === "Trabalhador" && (
                    <UpdateReviewItem>
                      <UpdateReviewLabel>Comissão</UpdateReviewLabel>
                      <UpdateReviewValue>
                        {formData.comissao || "Não informado"}
                      </UpdateReviewValue>
                    </UpdateReviewItem>
                  )}

                  {hasResponsavel && (
                    <>
                      <UpdateReviewItem>
                        <UpdateReviewLabel>Nome do responsável</UpdateReviewLabel>
                        <UpdateReviewValue>
                          {formData.nomeCompletoResponsavel || "Não informado"}
                        </UpdateReviewValue>
                      </UpdateReviewItem>

                      <UpdateReviewItem>
                        <UpdateReviewLabel>Telefone do responsável</UpdateReviewLabel>
                        <UpdateReviewValue>
                          {formData.telefoneResponsavel || "Não informado"}
                        </UpdateReviewValue>
                      </UpdateReviewItem>
                    </>
                  )}

                  <UpdateReviewItem>
                    <UpdateReviewLabel>Instituição espírita</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.IE === "outro"
                        ? formData.otherInstitution || "Não informado"
                        : formData.IE || "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem>
                    <UpdateReviewLabel>CEP</UpdateReviewLabel>
                    <UpdateReviewValue>{formData.cep || "Não informado"}</UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem>
                    <UpdateReviewLabel>Endereço</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {[formData.logradouro, formData.numero, formData.bairro, formData.cidade, formData.estado]
                        .filter(Boolean)
                        .join(", ") || "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem>
                    <UpdateReviewLabel>Primeira {EVENT.name}</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.primeiraComejaca ? "Sim" : "Não"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem>
                    <UpdateReviewLabel>Alimentação</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.vegetariano || "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem>
                    <UpdateReviewLabel>Camisa</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.camisa === true
                        ? (() => {
                            const parts = [];
                            if (formData.camisaTipo)
                              parts.push(labelCamisaTipo(formData.camisaTipo));
                            if (formData.camisaCor)
                              parts.push(labelCamisaCor(formData.camisaCor));
                            if (formData.tamanhoCamisa)
                              parts.push(`Tam. ${formData.tamanhoCamisa}`);
                            return parts.length
                              ? `Sim (${parts.join(" · ")})`
                              : "Sim";
                          })()
                        : "Não"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem fullWidth>
                    <UpdateReviewLabel>Alergias / restrições</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.alergia || "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem fullWidth>
                    <UpdateReviewLabel>Uso de medicação</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.medicacao || "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>

                  <UpdateReviewItem fullWidth>
                    <UpdateReviewLabel>Observações</UpdateReviewLabel>
                    <UpdateReviewValue>
                      {formData.outrasInformacoes || "Não informado"}
                    </UpdateReviewValue>
                  </UpdateReviewItem>
                </UpdateReviewGrid>
              </UpdateSection>
            )}

            <UpdateFooterActions>
              <UpdateStepBackButton type="button" onClick={goToPreviousStep}>
                <FiArrowLeft size={15} />
                {currentStep === 1 ? "Voltar" : "Anterior"}
              </UpdateStepBackButton>

              {currentStep < totalSteps ? (
                <UpdateFooterPrimaryButton type="button" $hasBack onClick={goToNextStep}>
                  Próximo
                  <FiChevronRight />
                </UpdateFooterPrimaryButton>
              ) : (
                <UpdateFooterPrimaryButton
                  type="submit"
                  disabled={isSubmitting}
                  $hasBack
                  aria-busy={isSubmitting ? "true" : undefined}
                >
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
                </UpdateFooterPrimaryButton>
              )}
            </UpdateFooterActions>
              </UpdateFormFieldScope>
            </UpdateFormCard>
          </UpdatePageContent>
        </UpdatePageContainer>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default Atualizar;

const InlineInputWrap = styled.div`
  margin-top: 0.8rem;
  max-width: 420px;
`;

const UpdateCamisaPagoNotice = styled.p`
  margin: 0;
  padding: 10px 12px;
  font-size: 12.5px;
  line-height: 1.45;
  color: #92400e;
  background: rgba(254, 252, 232, 0.65);
  border: 1px solid rgba(253, 230, 138, 0.55);
  border-radius: 10px;
`;

const UpdateCamisaSizeReveal = styled.div`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
  transition: grid-template-rows 0.32s ease;
`;

const UpdateCamisaSizeRevealInner = styled.div`
  overflow: hidden;
  min-height: 0;
`;

const UpdateCamisaTipoCorRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 8px;
  }
`;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import  styled, { ThemeProvider } from "styled-components";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FiClock, FiUser, FiMail, FiMapPin, FiCalendar, FiInfo, FiPhone , FiChevronLeft, FiFileText, FiShoppingBag, FiLoader } from "react-icons/fi";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import axios from 'axios';
import HeaderMain from './Header'
import { FaWhatsapp } from "react-icons/fa";

const Container = styled.div`
  background: ${({ theme }) => theme.background};
    display: flex;
  justify-content: center;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 0;
    border-radius: 0;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 800px;
`;

const FormCard = styled.form`
  background:#e7ecef;
  border-radius: 5px;
  padding: 2.5rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 0rem;
  }
`;
const StyledInput = styled.input`

width: 100%;
    padding: 1rem;
    border: 1px solid #ddd;

    background: #f9f9f9;
    color: #22223b;
    font-family: 'Poppins', sans-serif;
    transition: all 0.3sease;
`;


const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #22223b;
  font-weight: 600;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  color: #22223b;
  margin-bottom: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.8rem;
  background: #f9f9f9;
  color: #22223b;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a4e69;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  
  .MuiInputBase-root {

    color: #22223b;
    background: #f9f9f9;
    border-radius: 0.8rem;
   
    border: 1px solid #ddd;
    font-family: 'Poppins', sans-serif;
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
  appearance: none;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.8rem;
  background: #f9f9f9;
  color: #22223b;
  resize: vertical;
  min-height: 100px;
  font-family: 'Poppins', sans-serif;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
  justify-content: flex-start; 
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #4a4e69;
`;

/* const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #22223b;
`; */
const CheckboxWrapper = styled.div`
  display: inline-block;
 
  padding: 3px;
  margin: 5px;
  border-radius: 8px;
  width: auto;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #000;
  }

  input[type="checkbox"] {
    margin-right: 10px;
    cursor: pointer;
  }
`;
export const themes = {
  professional: {
    background: 'linear-gradient(135deg, #e7ecef, #e7ecef, #e7ecef)',
    cardBackground: '#e7ecef',
    textColor: '#22223b',
    buttonBackground: 'linear-gradient(135deg, #22223b, #22223b)',
    tableHeaderBackground: '#003049',
    tableHeaderColor: 'white',
    tableRowEvenBackground: '#f8f9fa',
    tableRowHoverBackground: '#f1f3f5',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    mobileHeaderHeight: '80px'
  },
  minimalista: {
    background: '#f5f5f5',
    cardBackground: 'white',
    textColor: '#333',
    buttonBackground: '#333',
    tableHeaderBackground: '#f5f5f5',
    tableHeaderColor: '#333',
    tableRowEvenBackground: '#fafafa',
    tableRowHoverBackground: '#e0e0e0',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    mobileHeaderHeight: '80px'
  },
};

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #555;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;

  &:hover {
    color: #0d1b2a;
  }

  input:checked {
    background-color: #0d1b2a;
    border-color: #0d1b2a;
  }
`;const CheckboxesContainer = styled.div`
border: 1px solid #ddd;

border-radius: 5px;
background-color: #fff;

min-height: 100px;
flex-wrap: wrap;

`;
const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: #0d1b2a;
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
const Atualizar = () => {

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    tipoParticipacao: '',
    nomeCompletoResponsavel: '',
    documentoResponsavel: '',
    telefoneResponsavel: '',
    comissao: '',
    camisa: false,
    tamanhoCamisa: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    logradouro: '',
    numero: '',
    complemento: '',
    medicacao: '',
    alergia: '',
    outrasInformacoes: '',
    IE: '',
    vegetariano: '',
    nomeSocial: '',
    outroGenero: '',
    otherInstitution: '',
    primeiraComejaca: false,
  
    // ✅ Campos de Deficiência
    deficienciaAuditiva: false,
    deficienciaAutismo: false,
    deficienciaIntelectual: false,
    deficienciaParalisiaCerebral: false,
    deficienciaVisual: false,
    deficienciaFisica: false,
    deficienciaOutra: false,
    deficienciaOutraDescricao: '',
  });
  
  useEffect(() => {
    const fetchDadosParticipante = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/auth/print/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  

        const dataNascimentoFormatada = response.data.data.dataNascimento 
        ? new Date(response.data.data.dataNascimento) 
        : null;
  
        // Preenche o formData com os dados recebidos
        setFormData(prev => ({
          ...prev,
          ...response.data.data, // Agora estamos acessando o 'data' da resposta
          dataNascimento: dataNascimentoFormatada,
        }));
      } catch (error) {
      
        setErrors([{ message: "Erro ao carregar dados do participante." }]);
      }
    };
  
    if (id) {
      fetchDadosParticipante();
    }
  }, [id]);
  

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [isMinor, setIsMinor] = useState(false);
  const [theme, setTheme] = useState(themes.professional);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchInstitutions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/instituicoes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInstitutions(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/entrar");
        }
      }
    };

    fetchInstitutions();
  }, [navigate, API_URL]);
  useEffect(() => {

  }, [formData]);
  const calculateAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
   
  
    let formattedValue = value;
  
    if (name === "documentoResponsavel" || name === "telefone" || name === "telefoneResponsavel") {

      formattedValue = value.replace(/\D/g, "");
    }
  
  
    if (name === "telefone" || name === "telefoneResponsavel") {
      formattedValue = formatPhone(value); 
    }
  
    if (name === "documentoResponsavel") {
      if (formattedValue.length === 11) {
        formattedValue = formattedValue.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          "$1.$2.$3-$4"
        );
      } else if (formattedValue.length >= 9 && formattedValue.length <= 10) {
        formattedValue = formattedValue.replace(
          /(\d{2})(\d{3})(\d{3})(\d{2})?/,
          (match, p1, p2, p3, p4) => {
            return p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`;
          }
        );
      }
  
     
      if (formattedValue.replace(/\D/g, "").length > 11) {
        formattedValue = formattedValue.substring(0, 14); 
      }
    }
  

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : formattedValue,
    }));
  };
  
  const today = new Date();
  

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dataNascimento: date,
      ...(calculateAge(date) >= 18 && {
        nomeCompletoResponsavel: '',
        documentoResponsavel: '',
        telefoneResponsavel: ''
      })
    }));
    setIsMinor(calculateAge(date) < 18);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
  
    try {
      const token = localStorage.getItem("token");
  
      const dataNascimento = new Date(formData.dataNascimento);
      if (isNaN(dataNascimento.getTime())) {
        setErrors([{ message: "Data de nascimento inválida." }]);
        setIsSubmitting(false);
        return;
      }
  
      const payload = {
        id: formData.id,
        nomeCompleto: formData.nomeCompleto || "",
        nomeSocial: formData.nomeSocial || "",
        nomeCracha: formData.nomeCracha || "",
        dataNascimento: new Date(formData.dataNascimento).toISOString(),
        sexo: formData.sexo || "",
        email: formData.email || "",
        telefone: formData.telefone.replace(/\D/g, ""),
        tipoParticipacao: formData.tipoParticipacao || "",
        nomeCompletoResponsavel: formData.nomeCompletoResponsavel || "",
        documentoResponsavel: formData.documentoResponsavel?.replace(/\D/g, "") || "",
        telefoneResponsavel: formData.telefoneResponsavel?.replace(/\D/g, "") || "",
        cep: formData.cep.replace(/\D/g, ""),
        estado: formData.estado || "",
        cidade: formData.cidade || "",
        IE: formData.IE || "",
        bairro: formData.bairro || "",
        logradouro: formData.logradouro || "",
        numero: formData.numero || "",
        complemento: formData.complemento || "",
        vegetariano: formData.vegetariano || false,
        camisa: formData.camisa === "true" || formData.camisa === true,
        tamanhoCamisa: formData.tamanhoCamisa || "",
        primeiraComejaca: formData.primeiraComejaca || false,
        deficienciaAuditiva: formData.deficienciaAuditiva || false,
        deficienciaAutismo: formData.deficienciaAutismo || false,
        deficienciaIntelectual: formData.deficienciaIntelectual || false,
        deficienciaParalisiaCerebral: formData.deficienciaParalisiaCerebral || false,
        deficienciaVisual: formData.deficienciaVisual || false,
        deficienciaFisica: formData.deficienciaFisica || false,
        deficienciaOutra: formData.deficienciaOutra || false,
        deficienciaOutraDescricao: formData.deficienciaOutraDescricao || "",
        medicacao: formData.medicacao || "",
        alergia: formData.alergia || "",
        outrasInformacoes: formData.outrasInformacoes || "",
        outroGenero: formData.outroGenero || "",
        valor: formData.valor || 0,
        linkPagamento: formData.linkPagamento || "",
        statusPagamento: formData.statusPagamento || "",
        otherInstitution: formData.otherInstitution || "",
        comissao: String(formData.comissao || "")
      };
  
      const response = await axios.put(`${API_URL}/api/auth/participante/${formData.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200) {
        navigate('/painel');
      } else {
        setErrors([{ message: 'Erro ao atualizar inscrição.' }]);
      }
    } catch (error) {
      const detalhes = error.response?.data?.details;
  
      if (Array.isArray(detalhes)) {
        setErrors(detalhes);
      } else {
        setErrors([{ message: detalhes || 'Erro ao atualizar inscrição' }]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const formatPhone = (value) => {
    if (!value) return "";
    
    // Remove tudo que não for número
    const cleaned = value.replace(/\D/g, "");
  
    // Formata como telefone (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (cleaned.length > 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    } else if (cleaned.length > 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length > 2) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else {
      return cleaned;
    }
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    setFormData((prevState) => ({ ...prevState, cep }));
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prevState) => ({
            ...prevState,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          }));
        } else {
          alert("CEP não encontrado");
        }
      } catch (error) {
      }
    }
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
         
    <ThemeProvider theme={theme}>      <Container>
     
        <FormWrapper>
   

          <FormCard onSubmit={handleUpdate}>
            
            <Header>
              <Title>FORMULÁRIO DE ATUALIZAR INSCRIÇÃO 2025</Title>
              <p style={{ color: '#666' }}>Todos os campos marcados com * são obrigatórios</p>
              {errors.length > 0 && (
                <div style={{ color: 'red', marginTop: '1rem' }}>
                  {errors.map((err, index) => (
                    <div key={index}>⚠️ {err.message}</div>
                  ))}
                </div>
              )}
            </Header>

            <FormGrid>
              {/* Campos Pessoais */}
              <InputGroup>
                <InputLabel><FiUser /> Nome Completo *</InputLabel>
                <InputField
                  name="nomeCompleto"
                  placeholder="Digite seu nome completo"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  required
                />
              </InputGroup>


              <InputGroup>
                <InputLabel><FiUser /> Nome social</InputLabel>
                <InputField
                  name="nomeSocial"
                  placeholder="Digite seu nome social"
                  value={formData.nomeSocial}
                  onChange={handleChange}
                  requird
                />
              </InputGroup>

  <InputGroup>
                <InputLabel><FiUser /> Nome no crachá *</InputLabel>
                <InputField
                  name="nomeCracha"
                  placeholder="Digite o nome que aparecerá no crachá"
                  value={formData.nomeCracha}
                  onChange={handleChange}
                  requird
                />
              </InputGroup>
              <InputGroup>
                <InputLabel><FiCalendar /> Data de Nascimento *</InputLabel>
                <StyledDatePicker
                  value={formData.dataNascimento}
                  onChange={handleDateChange}
                  format="dd/MM/yyyy"
                  maxDate={today}
                  required
                  style={{
                    border: '1px solid black',  // Borda preta de 1px
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '4px',  }}// Borda arredondada, caso queira
                />
              </InputGroup>

              {isMinor && (
                <>
                  <InputGroup>
                    <InputLabel><FiUser /> Nome do Responsável *</InputLabel>
                    <InputField
                      name="nomeCompletoResponsavel"
                      value={formData.nomeCompletoResponsavel}
                      onChange={handleChange}
                      placeholder="Digite seu nome completo do responsável"
                      
                    />
                  </InputGroup>

                  <InputGroup>
  <InputLabel><FiFileText /> Documento do Responsável *</InputLabel>
  <InputField
    name="documentoResponsavel"
    value={formData.documentoResponsavel || ""}
    onChange={handleChange}
    placeholder="Digite o documento do responsável"
    maxLength={14} 
  />
</InputGroup>


                  <InputGroup>
                    <InputLabel><FiPhone /> Telefone do Responsável *</InputLabel>
                    <InputField
                      name="telefoneResponsavel"
                      value={formData.telefoneResponsavel}
                      onChange={handleChange}
                      placeholder="Digite o telefone do responsável"
               
             
                      
                      
                    />
                  </InputGroup>
                </>
              )}

              <InputGroup>
                <InputLabel><FiUser /> Gênero *</InputLabel>
                <Select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="prefironaoresponder">Prefiro não responder</option>
                  <option value="outro">Outro</option>
              
                </Select>
              </InputGroup>
     {formData.sexo === "outro" && (
        <InputGroup>
          <InputLabel>Especifique:</InputLabel>
          <InputField
            type="text"
            name="outroGenero"
            value={formData.outroGenero}
            placeholder="Digite seu gênero"
            onChange={handleChange}
            required
          />
        </InputGroup>
      )}
              <InputGroup>
                <InputLabel><FaWhatsapp /> Telefone (Whats App) *</InputLabel>
                <InputField
         name="telefone"
         value={formData.telefone}
         onChange={handleChange}
         placeholder="Digite seu telefone"
         required

                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMail /> E-mail *</InputLabel>
                <InputField
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@dominio.com"
                  required
                />
              </InputGroup>

           {/*    <InputGroup>
                <InputLabel><FiShoppingBag /> Deseja camisa? </InputLabel>
                <CheckboxContainer>
                  <CheckboxInput
                    type="checkbox"
                    name="camisa"
                    checked={formData.camisa}
                    onChange={handleChange}
                  />
                  <CheckboxLabel>Sim, desejo comprar a camisa - R$ 20,00</CheckboxLabel>
                </CheckboxContainer>
              </InputGroup> */}

              {formData.camisa && (
                <InputGroup>
                  <InputLabel>Tamanho da Camisa *</InputLabel>
                  <Select
                    name="tamanhoCamisa"
                    value={formData.tamanhoCamisa}
                    onChange={handleChange}
                    
                  >
                    <option value="">Selecione</option>
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                  </Select>
                </InputGroup>
              )}

              <InputGroup>
                <InputLabel>Tipo de Participação *</InputLabel>
                <Select
                  name="tipoParticipacao"
                  value={formData.tipoParticipacao}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Confraternista">Confraternista</option>
                  <option value="Trabalhador">Trabalhador</option>
                </Select>
              </InputGroup>

              {formData.tipoParticipacao === 'Trabalhador' && (
                <InputGroup>
                  <InputLabel>Comissão *</InputLabel>
                  <Select
                    name="comissao"
                    value={formData.comissao}
                    onChange={handleChange}
                    
                  >
                    <option value="">Selecione</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Atendimento Fraterno">Atendimento Fraterno</option>
                    <option value="Coordenação Geral">Coordenação Geral</option>
                    <option value="Divulgação">Divulgação</option>
                    <option value="Estudos Doutrinários">Estudos Doutrinários</option>
                    <option value="Multimeios">Multimeios</option>
                    <option value="Secretaria">Secretaria</option>
                    <option value="Serviços Gerais">Serviços Gerais</option>
                    <option value="Recepção">Recepção</option>
                  </Select>
                </InputGroup>
              )}
              {/* Endereço */}
              <InputGroup>
                <InputLabel><FiMapPin /> CEP *</InputLabel>
                <InputField
                  name="cep"
                  value={formData.cep}
                  placeholder="Digite seu CEP"
                  onChange={handleCepChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Estado *</InputLabel>
                <InputField
                  name="estado"
       
                  disabled
                  value={formData.estado}
              onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Cidade *</InputLabel>
                <InputField
                  name="cidade"
                  disabled
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Bairro *</InputLabel>
                <InputField
                  name="bairro"
                  disabled
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Logradouro *</InputLabel>
                <InputField
                  name="logradouro"
                  disabled
                  value={formData.logradouro}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Número *</InputLabel>
                <InputField
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Complemento</InputLabel>
                <InputField
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiMapPin /> Instituição Espírita *</InputLabel>
                <Select
                  name="IE"
                  value={formData.IE}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.nome}>{inst.nome}</option>
                    
                  ))}
                      <option value="outro">Outro</option>
                </Select>
              </InputGroup>

              {formData.IE === 'outro' && (
        <InputGroup>
          <InputLabel>Nome da Instituição</InputLabel>
          <InputField
            type="text"
            name="otherInstitution"
            value={formData.otherInstitution}
            onChange={handleChange}
            placeholder="Digite o nome da instituição"
            required
          />
        </InputGroup>
      )}
              <InputGroup>
  <InputLabel><FiClock /> É sua primeira COMEJACA? *</InputLabel>
  <CheckboxContainer>
    <CheckboxInput
      type="checkbox"
      name="primeiraComejaca"
      checked={formData.primeiraComejaca}
      onChange={handleChange}
    />
    <CheckboxLabel>Sim, esta é minha primeira COMEJACA.</CheckboxLabel>
  </CheckboxContainer>
</InputGroup>

              <InputGroup>
                <InputLabel>
                  <FiInfo /> Vegetarianismo *
                </InputLabel>
                <Select         name="vegetariano"
        
                  value={formData.vegetariano}
                  onChange={handleChange}
                  required>
                  <option value="">Faz dieta vegetariana?</option>
                  <option value="Não">Não</option>
                  <option value="Vegetariano">Vegetariano</option>
                  <option value="Vegano">Vegano</option>
                 
                </Select>
              </InputGroup>
              {/* Informações Adicionais */}
              <InputGroup>
                <InputLabel><FiInfo /> Possui alguma alergia ou restrições alimentares?</InputLabel>
                <TextArea
                  name="alergia"
                  placeholder="Descreva se há alergias ou restrições alimentares."
                  value={formData.alergia}
                  onChange={handleChange}
                />
              </InputGroup>

              <InputGroup>
                <InputLabel><FiInfo /> Medicação</InputLabel>
                <TextArea
                  name="medicacao"
                  placeholder="Descreva medicações em uso."
                  value={formData.medicacao}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup>
  <InputLabel><FiInfo /> Possui alguma deficiência?</InputLabel>
  <CheckboxesContainer>
    <CheckboxWrapper>
      <CheckboxLabel>
        <input
          type="checkbox"
          name="deficienciaAuditiva"
          checked={formData.deficienciaAuditiva}
          onChange={handleChange}
        />
        Auditiva
      </CheckboxLabel>
    </CheckboxWrapper>

    <CheckboxWrapper>
      <CheckboxLabel>
        <input
          type="checkbox"
          name="deficienciaAutismo"
          checked={formData.deficienciaAutismo}
          onChange={handleChange}
        />
        Autismo
      </CheckboxLabel>
    </CheckboxWrapper>

    <CheckboxWrapper>
      <CheckboxLabel>
        <input
          type="checkbox"
          name="deficienciaIntelectual"
          checked={formData.deficienciaIntelectual}
          onChange={handleChange}
        />
        Intelectual
      </CheckboxLabel>
    </CheckboxWrapper>

    <CheckboxWrapper>
      <CheckboxLabel>
        <input
          type="checkbox"
          name="deficienciaParalisiaCerebral"
          checked={formData.deficienciaParalisiaCerebral}
          onChange={handleChange}
        />
        Paralisia Cerebral
      </CheckboxLabel>
    </CheckboxWrapper>

    <CheckboxWrapper>
      <CheckboxLabel>
        <input
          type="checkbox"
          name="deficienciaVisual"
          checked={formData.deficienciaVisual}
          onChange={handleChange}
        />
        Visual
      </CheckboxLabel>
    </CheckboxWrapper>

    <CheckboxWrapper>
      <CheckboxLabel>
        <input
          type="checkbox"
          name="deficienciaFisica"
          checked={formData.deficienciaFisica}
          onChange={handleChange}
        />
        Física
      </CheckboxLabel>
    </CheckboxWrapper>

    {/* Opção "Outra" */}
    <CheckboxWrapper>
      <CheckboxLabel>
        <input
          type="checkbox"
          name="deficienciaOutra"
          checked={formData.deficienciaOutra}
          onChange={handleChange}
        />
        Outra
      </CheckboxLabel>
    </CheckboxWrapper>

    {/* Input aparece se "Outra" for selecionada */}
    {formData.deficienciaOutra && (
      <InputGroup>
<StyledInput
  type="text"
  name="deficienciaOutraDescricao"
  value={formData.deficienciaOutraDescricao}
  onChange={handleChange}
  placeholder="Informe a deficiência"

/>
      </InputGroup>
    )}
  </CheckboxesContainer>
</InputGroup>


              <InputGroup>
                <InputLabel><FiInfo /> Observações</InputLabel>
                <TextArea
                  name="outrasInformacoes"
                  placeholder="Deseja registrar alguma informação a
relacionada a sua saúde física,
mental, emocional?"
                  value={formData.outrasInformacoes}
                  onChange={handleChange}
                />
              </InputGroup>

        
            </FormGrid>
            <CheckboxContainer>
                <CheckboxInput
                  type="checkbox"
   
                  required
                />
                <CheckboxLabel>
                Declaro que li o plano geral e aceito o plano geral da XLVI COMEJACA. *

                </CheckboxLabel>
              </CheckboxContainer>
              
            <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <FiLoader className="spin" />
                    Salvando...
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <FiFileText />
                    Salvar informações
                  </div>
                )}
              </SubmitButton>
          </FormCard>
        </FormWrapper>
      </Container>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default Atualizar;
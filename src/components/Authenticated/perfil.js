import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { ThemeProvider } from 'styled-components';
import { FiUser, FiMail, FiPhone, FiLock, FiChevronLeft } from "react-icons/fi";
import InputMask from "react-input-mask";
import { useEffect } from "react";
import axios from 'axios';

// Estilos
const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 1rem;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden; // Novo
  @media (max-width: 768px) {
    padding: 0;
   
  }`;
  const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-right: 30px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  border-radius: 5px;

`;

const ActionButton = styled.button`
  background: ${({ theme }) => theme.buttonBackground};
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  justify-content: center;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.8rem;
  }
`;
const FormCard = styled.div`
  background: ${({ theme }) => theme.cardBackground};


  padding: 1rem;

  position: relative;
  width: 100%;
  max-width: calc(100vw - 2rem);
  margin: 0 auto;

  padding-left: 10rem;
  padding-right: 10rem;
  @media (max-width: 768px) {
    
    grid-template-columns: 1fr;
    border-radius: 0;
    box-shadow: none;
    padding: 1rem;
    max-width: 100vw;
    width:100vw;
    
  }
`;





const HeaderDuo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.textColor};
  font-weight: 600;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;
const TitleDuo = styled.h1`
  font-size: 1.5;
  color: ${({ theme }) => theme.textColor};
  font-weight: 600;

margin-left: 40px;
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-left: 30px;
  }
`;

const FormGrid = styled.div`

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 0 auto;
  margin-bottom: 40px;
    max-width: 1200px; /* ou o tamanho máximo que deseja para o grid */
  justify-content: center;
  min-width: 200px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
margin: 10px auto ;
justify-content: center;
align-items: center;
  }
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;


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
  width: 100%; /* Faz com que o input ocupe todo o espaço disponível do container */
  max-width: 400px; /* Define um limite máximo para a largura */
  min-width: 200px; 
  &:focus {
    outline: none;
    border-color: #4a4e69;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: ${({ theme }) => theme.buttonBackground};
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;

  }  @media (max-width: 768px) {
  margin-bottom: 110px;
    
  }
`;
const MobileMenu = styled.div`
  position: fixed;
  top: 60px;
  margin-bottom: 20px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.cardBackground};
  padding: 1rem;
  z-index: 1001;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
 height: 100%;

 height: 100vh; /* Alterado para 100vh */
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  animation: ${({ $isOpen }) => 
    $isOpen ? 'slideDown 0.3s ease' : 'slideUp 0.2s ease'};

  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-20px); opacity: 0; }
  }

  @media (min-width: 769px) {
    display: none;
  }
`;
const MobileMenuItem = styled(ActionButton)`
  font-size: 0.9rem;
  padding: 0.8rem;
  margin-bottom: 1px;
  height: 60px;
`;


const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: ${({ theme }) => theme.mobileHeaderHeight};

  @media (max-width: 768px) {
    padding-top: 80px;
    
  }
`;

const themes = {
  professional: {
    background: 'linear-gradient(135deg, #e7ecef, #e7ecef, #e7ecef)',
    cardBackground: '#e7ecef',
    textColor: '#22223b',
    buttonBackground: 'linear-gradient(135deg, #0d1b2a, #0d1b2a)',
    tableHeaderBackground: '#0d1b2a',
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
    tableRowHoverBackground: '#C0C0C0   ',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    mobileHeaderHeight: '80px'
  },
};
const FloatingActions = styled.div`
  position: fixed;
  top: 100px;
  right: 36px;
  display: flex;
  gap: 0.5rem;
  z-index: 999;
  transition: all 0.3s ease;

  button {
    background: ${({ theme }) => theme.cardBackground};
    color: ${({ theme }) => theme.textColor};
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 12px rgba(0,0,0,0.15);
      
    }
  }

  @media (max-width: 768px) {
    top: ${({ $isMenuOpen }) => $isMenuOpen ? 'auto' : '80px'};
    bottom: ${({ $isMenuOpen }) => $isMenuOpen ? '20px' : 'auto'};
    right: 15px;
    flex-direction: row;
    
    button {
      width: 36px;
      height: 36px;
    }
  }
`;const MobileMenuWrapper = styled.div`
position: relative;
z-index: 1001;


`;
const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  padding: 0.5rem;
  border-radius: 5px;

  @media (max-width: 768px) {
    display: block;
  }
`;
const CheckboxGroup = styled.div`
  margin-top: 1.5rem; 
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 66px;

`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #22223b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Profile = () => {
  const navigate = useNavigate();
  const [nomeCompleto, setNomeCompleto] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const [telefone, setTelefone] = useState("");  // Definindo o estado para o telefone
  const [email, setEmail] = useState("usuario@exemplo.com"); 
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [communication1, setCommunication1] = useState(false);
  const [communication2, setCommunication2] = useState(false);
  const [theme, setTheme] = useState('professional');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleSave = (e) => {
    e.preventDefault();
    // Lógica para salvar os dados alterados
  };
  
  useEffect(() => {
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');
  
    if (nome) {
      setNomeCompleto(nome);
    }
  
    if (email) {
      setEmail(email);
    }
  }, []);
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      return alert('A nova senha e a confirmação não coincidem.');
    }
  
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
  console.log(userId)
      if (!userId || !token) {
        return alert('Usuário não autenticado.');
      }
  
      console.log('Usuário logado com ID:', userId);
      console.log('Token:', token);
      console.log('ID do usuário:', userId, 'Tipo do ID:', typeof userId);
      const userIdInt = parseInt(userId, 10);

      const response = await axios.put(
        `${API_URL}/api/auth/atualizarPerfil`,
        {
          userIdInt,
          nome: nomeCompleto,
          email: String(email || '').trim().toLowerCase(),
          telefone,
    
          senha: newPassword || null, // só envia se tiver nova senha
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Atualiza localStorage com o novo nome (se quiser refletir no sistema)
      localStorage.setItem('nome', nomeCompleto);
  
      alert('Perfil atualizado com sucesso!');
  
      // Opcional: resetar os campos de senha
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert(error.response?.data?.error || 'Erro ao atualizar perfil.');
    }
  };
  
  
  const CustomMaskedInput = React.forwardRef((props, ref) => (
    <InputMask {...props} ref={ref}>
      {(inputProps) => <input {...inputProps} />}
    </InputMask>
  ));
  
  localStorage.setItem('isVerified', 'true');

  return (
 

  <ThemeProvider theme={themes[theme]}>
      <Container>
  
        


      <FormWrapper>
    

        <FormCard onSubmit={handleSave}>
        <form onSubmit={handleUpdateProfile}>
          <HeaderDuo>
            <Title>Perfil</Title>
            <p>Atualize suas informações</p>
          </HeaderDuo>

          <FormGrid>
            {/* Campos de Perfil */}
            <InputGroup>
      <InputLabel htmlFor="nomeCompleto">
        <FiUser /> Nome Completo *
      </InputLabel>
      <InputField
        id="nomeCompleto"
        type="text"
        placeholder="Nome completo"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
        required
      />
    </InputGroup>

    <InputGroup>
  <InputLabel>
    <FiMail /> E-mail *
  </InputLabel>
  <InputField
    type="email"
    disabled
    placeholder="E-mail"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
</InputGroup>
            <InputGroup>
              <InputLabel>
                <FiPhone /> Telefone
              </InputLabel>
              <InputMask
                mask="(99) 99999-9999"
                value={telefone}
                placeholder="Informe seu telefone"
                onChange={(e) => setTelefone(e.target.value)}
              >
                {(inputProps) => <InputField {...inputProps} />}
              </InputMask>
            </InputGroup>

            {/* Alteração de Senha */}
            <InputGroup>
              <InputLabel>
                <FiLock /> Senha Atual *
              </InputLabel>
              <InputField 
                type="password" 
                placeholder="Digite sua senha atual" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required 
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>
                <FiLock /> Nova Senha *
              </InputLabel>
              <InputField 
                type="password" 
                placeholder="Digite sua nova senha" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>
                <FiLock /> Confirmar Nova Senha *
              </InputLabel>
              <InputField 
                type="password" 
                placeholder="Confirme sua nova senha" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </InputGroup>
          </FormGrid>

          {/* Checkboxes */}
  {/*         <CheckboxGroup>
            <CheckboxLabel>
              <input 
                type="checkbox" 
                checked={communication1} 
                onChange={() => setCommunication1(!communication1)} 
              />
              Aceito receber comunicações oficiais sobre a Confraternização das Mocidades Espíritas de Jacarepaguá.
            </CheckboxLabel>

            <CheckboxLabel>
              <input 
                type="checkbox" 
                checked={communication2} 
                onChange={() => setCommunication2(!communication2)} 
              />
              Aceito receber divulgações do movimento espírita jovem e artistico na região do Rio de Janeiro.
            </CheckboxLabel>
          </CheckboxGroup> */}

          <div style={{ display: "flex", gap: "1rem", marginTop: "25px" }}>
  <SubmitButton onClick={handleUpdateProfile}>Salvar informações</SubmitButton>
  <SubmitButton 
    type="button" 
    onClick={() => navigate(-1)} 
    style={{ background: "#888" }}
  >
    Voltar
  </SubmitButton>
</div>
</form>
</FormCard>

        </FormWrapper>

  
      </Container>
    </ThemeProvider>
  );
};

export default Profile;

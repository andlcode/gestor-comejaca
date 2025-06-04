import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import styled, { ThemeProvider } from 'styled-components';
import { FiUser, FiLogOut, FiMoon,FiDownload, FiMenu, FiPlus, FiUpload } from "react-icons/fi";

// Temas otimizados
export const themes = {
  professional: {
    background: 'linear-gradient(135deg, #0d1b2a, #0d1b2a, #0d1b2a)',
    cardBackground: '#e7ecef',
    textColor: '#22223b',
    buttonBackground: 'linear-gradient(135deg, #0d1b2a, #0d1b2a)',
    tableHeaderBackground: '#003049',
    tableHeaderColor: 'white',
    tableRowEvenBackground: '#f8f9fa',
    tableRowHoverBackground: '#f1f3f5',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    mobileHeaderHeight: '5rem'
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

// Componentes Estilizados Otimizados
const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
  font-family: 'Poppins', sans-serif;
  padding: 0;
  position: relative;
  overflow-x: hidden;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;


`;
const ImagemResponsiva = styled.img`
width: 40px;   /* ou 32px, depende do que você achar visualmente melhor */
height: auto;
@media (max-width: 768px) {
    display: none;
  }`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.cardBackground};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  border-bottom: 1px solid ${({ theme }) => theme.textColor}20;
  backdrop-filter: blur(10px);
  margin: 0;

  @media (max-width: 768px) {
    padding: 1rem;
    
    position: block;
    width: 100%;
    top: -10;
    left: 0;
    right: 0;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  color: ${({ theme }) => theme.textColor};
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
  transition: transform 0.2s;

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.mobileHeaderHeight};
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.cardBackground};
  z-index: 999;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transform: translateX(${({ $isOpen }) => $isOpen ? '0' : '-100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.buttonBackground};
  color: white;
  border: none;
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  font-weight: 500;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);


  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.1);
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);

    &::after {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 1rem;
    > *:first-child {
  gap: 20px;
  }
  }
`;



const FloatingActions = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 1000;

  button {
    background: ${({ theme }) => theme.buttonBackground};
    color: white;
    border: none;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.1);
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);

      &::after {
        opacity: 1;
      }
    }

    &:active {
      transform: scale(0.95);
    }
  }

  @media (max-width: 768px) {
    bottom:5.5rem;
    right: 1.25rem;
    
    button {
      width: 48px;
      height: 48px;
    }
  }
`;

const HeaderMain = ({className }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(themes.professional);
  const location = useLocation();
  const pathname = location.pathname;
  const esconderBotao = location.pathname === '/' || location.pathname === '/registrar';
  const estaNaInscricao = pathname === '/inscrever';
  const estaNoPerfil = pathname === '/perfil';
  const estaNaHomeOuGestor = pathname === '/' || pathname === '/painel';
  const estaNaInstituicao = pathname === '/instituicao';
  const estaNaVerificar = pathname === '/verificar';

  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const storedRole = localStorage.getItem('role');
  
    if (storedRole === 'admin') {
      setIsAdmin(true);
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isVerified');
    localStorage.removeItem('nome');
    localStorage.removeItem('email');
   
    navigate('/');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "professional";
    setTheme(savedTheme === "professional" ? themes.professional : themes.minimalista);
  }, []);
  const estaNaHomeOuRegistrar = pathname === '/' || pathname === '/registrar' || pathname === '/recuperarsenha' || pathname === '/verificar';
  return (
    <ThemeProvider theme={theme}>
      
      <Container>
        <Header className={className}>
          <Wrapper><ImagemResponsiva src="/favicon.png" alt="Banner do evento" />
          <Title>46º COMEJACA 2025</Title>
    </Wrapper>          <Nav>


      {/* Os demais botões são exibidos apenas se não estiver em '/' ou '/registrar' */}
      {!estaNaHomeOuRegistrar && (
        <>
          {pathname !== '/painel' && (
            <Button onClick={() => navigate('/painel')}>
              <FiPlus size={20} /> Home
            </Button>
          )}

          {pathname !== '/inscrever' && (
            <Button onClick={() => navigate('/inscrever')}>
              <FiPlus size={20} /> Inscrever
            </Button>
          )}

          {pathname !== '/perfil' && (
            <Button onClick={() => navigate('/perfil')}>
              <FiUser size={20} /> Perfil
            </Button>
          )}

          
{pathname !== '/instituicao' && isAdmin && (
            <Button onClick={() => navigate('/instituicao')}>
              <FiUpload size={20} /> IE
            </Button>
          )}
         {pathname !== '/status' && isAdmin && (
            <Button onClick={() => navigate('/pagamentos')}>
              <FiUpload size={20} /> Gerenciar
            </Button>
          )}
        </>
      )}
 
            <Button>
        <FiDownload size={18} /> Materiais
      </Button>
    </Nav>

          <MobileMenuButton 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <FiMenu size={24} />
          </MobileMenuButton>
        </Header>

        <MobileMenu $isOpen={isMenuOpen}>

        {!estaNaHomeOuRegistrar && (
        <>
          {pathname !== '/painel' && (
    
          <Button onClick={() => { navigate('/painel'); setIsMenuOpen(false) }}>
            <FiPlus size={20} /> Home
          </Button>
            )}
  {pathname !== '/inscrever' && (

          <Button onClick={() => { navigate('/inscrever'); setIsMenuOpen(false) }}>
            <FiPlus size={20} /> Inscrever
          </Button>
             )}
           

  {pathname !== '/perfil' && (
          <Button onClick={() => { navigate('/perfil'); setIsMenuOpen(false) }}>
            <FiUser size={20} /> Perfil
          </Button>

          
               )}

{pathname !== '/instituicao' && isAdmin && (
            <Button onClick={() => navigate('/instituicao')}>
              <FiUpload size={20} /> IE
            </Button>
          )}
         {pathname !== '/status' && isAdmin && (
            <Button onClick={() => navigate('/pagamentos')}>
              <FiUpload size={20} /> Gerenciar
            </Button>
          )}
                       </>
      )}
         <Button>
                            <FiDownload size={18} /> Materiais
                          </Button>
        </MobileMenu>

      

        <FloatingActions>
  
          <button  className={className} onClick={handleLogout} aria-label="Sair">
            <FiLogOut size={24} />
          </button>
        </FloatingActions>
      </Container>
    </ThemeProvider>
  );
};

export default HeaderMain;
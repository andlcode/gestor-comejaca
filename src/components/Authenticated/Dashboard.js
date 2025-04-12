import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { 
  FiEdit, 
  FiPrinter, 
  FiPlus, 
  FiUpload, 
  FiDownload, 
  FiUser, 
  FiLogOut, 
  FiSearch, 
  FiMenu,
  FiMoon,
  FiLoader,
  FiAlertTriangle
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoadingSpinner = styled.div`
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  width: 10px;
  height: 14px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
`;
const themes = {
  professional: {
    background: 'linear-gradient(135deg, #0d1b2a, #0d1b2a, #0d1b2a)',
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
    tableRowHoverBackground: '#edede9   ',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    mobileHeaderHeight: '80px'
  },
};

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
  overflow: hidden; 

  @media (max-width: 768px) {
    padding: 0;
    background: #e7ecef;
   
  }
`;

 

const EmptyStateMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.textColor};
  font-size: 1.1rem;
  font-weight: 400;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid #e0e0e0;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: ${({ theme }) => theme.mobileHeaderHeight};

  @media (max-width: 768px) {

    
  }
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 5px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  position: relative;
  width: 100%;
  max-width: calc(100vw - 2rem);
  margin: 0 auto;

  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
    padding: 1rem;
    max-width: 100vw;
    width:100vw;
  margin-bottom: 100px;
  }
`;







const SearchBoxContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 2rem;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  background: #f9f9f9;
  color: #333;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #666;
    background: white;
  }
`;
const TableContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 5px;
  margin: 1rem 0;
  background: ${({ theme }) => theme.cardBackground};
  border: 2px solid #ced4da;
  @media (max-width: 768px) {
   border: none;
    margin: 1rem -1rem;
    width: calc(100% + 2rem);
    width: 98%;
    margin: 0 auto;
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  position: relative;
  border: 2px solid rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    border: none;
    background: transparent;
    box-shadow: none;
  }
`;

const TableHead = styled.thead`
  background: ${({ theme }) => theme.tableHeaderBackground};
  color: ${({ theme }) => theme.tableHeaderColor};

  @media (max-width: 768px) {
    display: none;  /* Esconde o cabeçalho da tabela no mobile */
  }
`;

const TableRow = styled.tr`
  transition: all 0.2s ease;
  position: relative;

  &:nth-child(even) {
    background-color: ${({ theme }) => theme.tableRowEvenBackground};
  }

  &:hover {
    background-color: ${({ theme }) => theme.tableRowHoverBackground};
  }

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 1rem;
    background: ${({ theme }) => theme.cardBackground};
    border-radius: 0.5rem;
    border: 1px solid #0d1b2a;
    box-shadow: 8px 4px 8px rgba(0, 0, 0, 0.1);
  
  }
`;

const TableHeaderCell = styled.th`
  padding: 1.25rem 1.5rem;
  font-weight: 600;
  text-align: center;
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.tableHeaderBackground};
  color: ${({ theme }) => theme.tableHeaderColor};
  z-index: 2;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  font-size: 0.9em;
  letter-spacing: 0.5px;

  &:first-child {
    border-radius: 0.5rem 0 0 0;
  }

  &:last-child {
    border-radius: 0 0.5rem 0 0;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.92em;
  color: #444;
  line-height: 1.4;

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    &::before {
      content: attr(data-label);
      font-weight: 600;
      color: ${({ theme }) => theme.textColor};
      font-size: 0.85em;
      min-width: 100px;
      opacity: 0.9;
    }
  }
`;


const SmallButton = styled.button`
  background: ${({ theme }) => theme.buttonBackground};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5PX;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;const Spin = styled.div`
@keyframes spin {
  to { transform: rotate(360deg); }
}
animation: spin 1s linear infinite;
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px;
  border-radius: 1rem;
  font-size: 0.85em;
  font-weight: 500;
  background: ${({ $status }) => {
    switch ($status) {
      case 'Aprovado': return '#e6f4ea';
      case 'Pendente': return '#fff3e6';
      case 'Rejeitado': return '#fde8e8';
      default: return '#f0f0f0';
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case 'Aprovado': return '#0a5c36';
      case 'Pendente': return '#8a6500';
      case 'Rejeitado': return '#c22126';
      default: return '#666';
    }
  }};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.3rem;
    width: 100%;

    button {
      width: 100%;
      justify-content: center;
      padding: 0.4rem;
      font-size: 0.85em;
    }
  }
`;

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [inscricoes, setInscricoes] = useState([]);
  const [theme, setTheme] = useState('professional');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const [loadingItemId, setLoadingItemId] = useState(null);
 const [isAdmin, setIsAdmin] = useState(false);
 const storedUser = JSON.parse(localStorage.getItem('user'));
 console.log(localStorage.getItem('user'));


 useEffect(() => {


  if (storedUser) {
    console.log('Role do usuário:', storedUser.role); // 👈 Aqui está o console.log
  }

  if (storedUser?.role === 'admin') {
    setIsAdmin(true);
  }
}, []);
const handlePagamento = async (item) => {
  setLoadingItemId(item);
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/api/auth/pagamento/${item}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = response.data;

    if (data && data.init_point) {
      window.open(data.init_point, '_blank');
    } else {
      alert('Não foi possível gerar o link de pagamento.');
    }

  } catch (error) {
    console.error('Erro ao gerar link de pagamento:', error);
    alert('Erro ao processar pagamento.');
  } finally {
    setLoadingItemId(null); // encerra o loading
  }
};


  
  useEffect(() => {
    const fetchInscricoes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log(token)
        const response = await axios.get(`${API_URL}/api/auth/obterinscricoes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        console.log("Resposta da API:", response.data); // Depuração
        const role =  localStorage.getItem('role');
        if (role === 'admin') {
          setIsAdmin(true);
        }
        // Verifique se a resposta tem a propriedade "data" que é um array
        if (!Array.isArray(response.data.data)) {
          throw new Error('Resposta da API não contém um array válido');
        }
    
        setInscricoes(response.data.data); // Atualiza o estado com o array correto
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar inscrições:', error);
        setError(error.response?.data?.error || 'Erro ao carregar inscrições');
        
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    

    fetchInscricoes();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'professional' ? 'minimalista' : 'professional'));
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isVerified');
    navigate('/');
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredData = Array.isArray(inscricoes) 
  ? inscricoes.filter(item => {
      const searchTerm = search.toLowerCase();
      return (
        item.nomeCompleto?.toLowerCase().includes(searchTerm) ||
        (item.numeroCMEJacas && item.numeroCMEJacas.includes(searchTerm)) ||
        (item.email && item.email.toLowerCase().includes(searchTerm))
      );
    })
  : [];

  const menu = document.querySelector('.mobile-menu');
  const button = document.querySelector('.menu-button');
  // Adicione este useEffect no componente Dashboard
useEffect(() => {
  const handleClickOutside = (e) => {
 
    
    if (isMenuOpen && !menu.contains(e.target) && !button.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isMenuOpen]);
  return (
    <ThemeProvider theme={themes[theme]}>
      <Container>
       {/*  <FloatingActions $isMenuOpen={isMenuOpen}>
          <button onClick={toggleTheme} title="Alternar tema">
            <FiMoon size={20} />  
          </button>
          <button onClick={handleLogout} title="Sair">
            <FiLogOut size={20} />
          </button>
        </FloatingActions> */}

        <ContentWrapper>
          <FormCard>
          {/*   <Header>
              <Title>INSCRIÇÕES 2025</Title>
              
              <MobileMenuWrapper>
                <MobileMenuButton onClick={toggleMenu}   className="menu-button">
                  <FiMenu size={24} />
                </MobileMenuButton>
              </MobileMenuWrapper>

              <ButtonContainer>
                <ActionButton onClick={() => navigate('/inscrever')}>
                  <FiPlus size={18} /> Inscrever
                </ActionButton>
                {isAdmin && (
                <ActionButton onClick={() => navigate('/instituicao')}>
                  <FiUpload size={18} /> IE
                </ActionButton>
                     )}
                <ActionButton>
                  <FiDownload size={18} /> Materiais
                </ActionButton>
                <ActionButton onClick={() => navigate('/perfil')}>
                  <FiUser size={18} /> Perfil
                </ActionButton>
              </ButtonContainer>
            </Header>

            <MobileMenu $isOpen={isMenuOpen}   className="mobile-menu" >
              <MobileMenuItem onClick={() => { navigate('/inscrever'); closeMenu(); }}>
                <FiPlus size={18} /> Inscrever
              </MobileMenuItem>
              <MobileMenuItem onClick={() => { navigate('/perfil'); closeMenu(); }}>
                <FiUser size={18} /> Perfil
              </MobileMenuItem>
              <MobileMenuItem>
                <FiDownload size={18} /> Materiais
              </MobileMenuItem>
                   {isAdmin && (
                
             

              <MobileMenuItem onClick={() => { navigate('/instituicao'); closeMenu(); }}>
                <FiUpload size={18} /> IE
              </MobileMenuItem>
                   )}
            </MobileMenu> */}

            <SearchBoxContainer>
              <SearchIcon size={20} />
              <SearchBox
                type="text"
                placeholder="Pesquisar por nome ou IE"
                value={search}
                onChange={handleSearch}
              />
            </SearchBoxContainer>
            {
  loading ? (
    <EmptyStateMessage>
      <Spin><FiLoader size={24} /></Spin>
      Carregando inscrições...
    </EmptyStateMessage>
  ) :  inscricoes.length === 0 ? (
    <EmptyStateMessage>
      <FiPlus size={24} />
      Estamos aguardando sua primeira inscrição
    </EmptyStateMessage>
  ) : filteredData.length === 0 ? (
    <EmptyStateMessage>
      <FiSearch size={24} />
      Nenhum resultado encontrado
    </EmptyStateMessage>
  ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <tr>
                      <TableHeaderCell>#</TableHeaderCell>
                      <TableHeaderCell>NOME COMPLETO</TableHeaderCell>
                 
                      <TableHeaderCell>STATUS</TableHeaderCell>
                      <TableHeaderCell>DATA</TableHeaderCell>
                      <TableHeaderCell>AÇÕES</TableHeaderCell>
                    </tr>
                  </TableHead>
                  <tbody>
                  {filteredData.map((item, index) => (
 <TableRow key={item.id}>
 <TableCell data-label="#">{index + 1}</TableCell>
 <TableCell data-label="Nome Completo">{item.nomeCompleto}</TableCell>

 <TableCell data-label="Status">
   <StatusPill $status={item.status}>{item.status || 'Pendente'}</StatusPill>
 </TableCell>
 <TableCell data-label="Data">
   {new Date(item.createdAt).toLocaleDateString('pt-BR')}
 </TableCell>
 <TableCell data-label="Ações">
   <ButtonGroup>
     <SmallButton onClick={() => navigate(`/edit/${item.id}`)}>
       <FiEdit size={14} /> Editar
     </SmallButton>
     <SmallButton onClick={() => navigate(`/imprimir/${item.id}`)}>
       <FiPrinter size={14} /> Imprimir
     </SmallButton>
     {item.status !== 'Pago' && (
  <SmallButton
    onClick={() => handlePagamento(item.id)}
    disabled={loadingItemId === item.id}
  >
    {loadingItemId === item.id ? (
      <span className="flex items-center gap-2">
        <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
        Carregando 
        <LoadingSpinner />
      </span>
    ) : (
      <>
        💳 Pagar
      </>
    )}
  </SmallButton>
)}

   </ButtonGroup>
 </TableCell>
</TableRow>

))}
                  </tbody>
                </Table>
              </TableContainer>
            )}
          </FormCard>
        </ContentWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
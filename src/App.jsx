import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Unauthenticated/Login';
import Register from './components/Unauthenticated/Register';
import Verify from './components/Authenticated/VerificationCode';
import InstituicaoEspirita from './components/Authenticated/InstituicaoEspirita';
import Atualizar from './components/Authenticated/update';
import Perfil from './components/Authenticated/perfil';
import Dashboard from './components/Authenticated/Dashboard';
import GlobalStyle from './styles/globalStyles';
import FormularioInscricao from './components/Authenticated/subscription';
import FichaInscricao from './components/Authenticated/Print';
import ForgotPassword from './components/Unauthenticated/ForgotPassword';
import NotFound from './components/Unauthenticated/NotFound';
import ProtectedRoute from './routes/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext';
import ServerStatus from './components/Unauthenticated/ServerStatus';
import SessaoInfo from './components/Unauthenticated/SessaoInfo';
import HeaderMain from './components/Authenticated/Header';
import ChangePassword from './components/Unauthenticated/ChangePassword';
import {toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/globalStyles.css'; 
import PendingPage from './components/Authenticated/PendingPage';
import FailurePage from './components/Authenticated/FailurePage';
import SuccessPage from './components/Authenticated/SuccessPage';
import ListaParticipantes from './components/Authenticated/Status.js';

function App() {
  return (
    <>
      <GlobalStyle />
      <ToastContainer
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      
        style={{
          zIndex: 9999, 
          position: "fixed", 
          bottom: "35px", 
          left: "50%", 
          transform: "translateX(-50%)", 
          zIndex: 9999   
        }}
      />

      <div className="container">
    {/*     <SessaoInfo /> */}
        <HeaderMain  className="no-print-header"/>

        <AuthProvider>
          <AppContent />
        </AuthProvider>

     <ServerStatus lassName="no-print-footer" /> 

      </div>
    </>
  );
}

function AppContent() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/registrar" element={<Register />} />
      <Route path="/recuperarsenha" element={<ForgotPassword />} />
      <Route path="/recuperarsenha/route" element={<ChangePassword />} />

      <Route path="*" element={<NotFound />} />

      {/* Rotas Privadas */}
      <Route path="/verificar" element={<Verify />} />
      <Route path="/instituicao" element={<ProtectedRoute><InstituicaoEspirita /></ProtectedRoute>} />
      <Route path="/atualizar/:id" element={<ProtectedRoute><Atualizar /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/painel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/inscrever" element={<ProtectedRoute><FormularioInscricao /></ProtectedRoute>} />
      <Route path="/falha" element={<ProtectedRoute><FailurePage /></ProtectedRoute>} />
      <Route path="/sucesso" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
      <Route path="/pendente" element={<ProtectedRoute><PendingPage /></ProtectedRoute>} />
      <Route path="/imprimir/:id" element={<ProtectedRoute><FichaInscricao /></ProtectedRoute>} />
      <Route path="/pagamentos" element={<ProtectedRoute><ListaParticipantes /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;

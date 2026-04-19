import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  faCalendarDays,
  faLocationDot,
  faMoneyBillWave,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import PremiumAuthField, {
  FieldTrack,
  FloatingLabel,
  InputInner,
  InputShell,
} from '../Unauthenticated/auth/PremiumAuthField';
import {
  AuthButtonSpinner,
  AuthFlowButtonLabel,
  AuthFormAlert,
  AuthLoginActions,
  AuthLoginForm,
  AuthPrimaryButton,
} from '../Unauthenticated/auth/authStyles';
import { authTheme } from '../Unauthenticated/auth/authTheme';
import { getApiBaseUrl } from '../../utils/apiBaseUrl';
import AppHeader, {
  APP_HEADER_HEIGHT,
  APP_HEADER_HEIGHT_MOBILE,
  AppHeaderBadge,
} from '../shared/AppHeader';

const INITIAL_FORM = {
  nome: '',
  nomeExibicao: '',
  nomeCompleto: '',
  tema: '',
  ano: '',
  dataInicio: '',
  dataFim: '',
  localNome: '',
  localEndereco: '',
  valorTrabalhador: '',
  valorConfraternista: '',
  valorPequenoCompanheiro: '',
  ativo: true,
  isNew: true,
};

const FORM_SECTIONS = [
  {
    id: 'geral',
    title: 'Informações gerais',
    description: 'Defina como o evento será identificado e exibido no sistema.',
    fields: [
      {
        name: 'nome',
        label: 'Nome do evento',
        type: 'text',
        icon: faPenToSquare,
        placeholder: 'Ex.: COMEJACA',
        required: true,
      },
      {
        name: 'nomeExibicao',
        label: 'Nome de exibição',
        type: 'text',
        icon: faPenToSquare,
        placeholder: 'Ex.: 47º COMEJACA 2026',
      },
      {
        name: 'nomeCompleto',
        label: 'Nome completo',
        type: 'text',
        icon: faPenToSquare,
        placeholder: 'Nome completo do encontro',
        fullWidth: true,
      },
      {
        name: 'tema',
        label: 'Tema',
        type: 'text',
        icon: faPenToSquare,
        placeholder: 'Tema do ano',
        fullWidth: true,
      },
    ],
  },
  {
    id: 'datas',
    title: 'Datas',
    description: 'Configure o período principal do evento.',
    fields: [
      {
        name: 'ano',
        label: 'Ano',
        type: 'number',
        icon: faCalendarDays,
        placeholder: '2026',
        inputMode: 'numeric',
        required: true,
      },
      {
        name: 'dataInicio',
        label: 'Data início',
        type: 'date',
        icon: faCalendarDays,
        required: true,
      },
      {
        name: 'dataFim',
        label: 'Data fim',
        type: 'date',
        icon: faCalendarDays,
      },
    ],
  },
  {
    id: 'local',
    title: 'Local',
    description: 'Informe o nome do espaço e o endereço completo.',
    fields: [
      {
        name: 'localNome',
        label: 'Local nome',
        type: 'text',
        icon: faLocationDot,
        placeholder: 'Nome do local',
        required: true,
      },
      {
        name: 'localEndereco',
        label: 'Local endereço',
        type: 'textarea',
        placeholder: 'Rua, número, bairro, cidade...',
        fullWidth: true,
      },
    ],
  },
  {
    id: 'valores',
    title: 'Valores',
    description: 'Ajuste os valores utilizados para cada tipo de participante.',
    fields: [
      {
        name: 'valorTrabalhador',
        label: 'Valor trabalhador',
        type: 'number',
        icon: faMoneyBillWave,
        placeholder: '0,00',
        step: '0.01',
        inputMode: 'decimal',
      },
      {
        name: 'valorConfraternista',
        label: 'Valor confraternista',
        type: 'number',
        icon: faMoneyBillWave,
        placeholder: '0,00',
        step: '0.01',
        inputMode: 'decimal',
      },
      {
        name: 'valorPequenoCompanheiro',
        label: 'Valor pequeno companheiro',
        type: 'number',
        icon: faMoneyBillWave,
        placeholder: '0,00',
        step: '0.01',
        inputMode: 'decimal',
      },
    ],
  },
];

const PAGE_MAX_WIDTH = '1040px';

const Container = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.88) 0%, rgba(242, 242, 247, 0) 36%),
    linear-gradient(180deg, #fbfcfe 0%, #f2f5f9 46%, #e9eef5 100%);
  padding: calc(28px + ${APP_HEADER_HEIGHT}) 18px 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter',
    'Segoe UI', sans-serif;
  color: var(--text-primary);
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  @media (max-width: 768px) {
    padding: calc(16px + ${APP_HEADER_HEIGHT_MOBILE}) 12px 28px;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: ${PAGE_MAX_WIDTH};
  margin: 0 auto;
`;

const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;

  @media (max-width: 768px) {
    gap: 28px;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 0;
  border-bottom: none;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  color: #1d1d1f;
`;

const SectionText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: #64748b;
`;

const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FieldSpan = styled.div`
  grid-column: ${({ $fullWidth }) => ($fullWidth ? '1 / -1' : 'auto')};
`;

const TextAreaShell = styled(InputShell)`
  min-height: 132px;
`;

const TextAreaInner = styled(InputInner)`
  align-items: flex-start;
  min-height: 132px;
  padding-top: 14px;
  padding-bottom: 14px;
`;

const TextAreaFieldTrack = styled(FieldTrack)`
  justify-content: flex-start;
  min-height: 100px;
  padding-bottom: 0;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 92px;
  border: none;
  outline: none;
  resize: vertical;
  background: transparent;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.014em;
  color: #111827;
  line-height: 1.5;
  padding: ${({ $active }) => ($active ? '18px 0 0' : '28px 0 0')};
  margin: 0;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const AlertError = styled(AuthFormAlert)`
  color: #7f1d1d;
  background: #fef2f2;
  border: 1px solid rgba(248, 113, 113, 0.18);
  border-left: 3px solid rgba(239, 68, 68, 0.34);
`;

const AlertSuccess = styled(AuthFormAlert)`
  color: #166534;
  background: #f0fdf4;
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-left: 3px solid rgba(34, 197, 94, 0.38);
`;

const AlertInfo = styled(AuthFormAlert)`
  color: #1e3a8a;
  background: #eff6ff;
  border: 1px solid rgba(96, 165, 250, 0.22);
  border-left: 3px solid rgba(59, 130, 246, 0.38);
`;

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px solid rgba(15, 23, 42, 0.06);

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 12px;
  }
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 120;
  animation: fadeIn 0.18s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ConfirmDialog = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 22px;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.98);
  box-shadow:
    0 24px 60px -28px rgba(15, 23, 42, 0.26),
    0 6px 16px -10px rgba(15, 23, 42, 0.12);
  animation: scaleIn 0.2s ease;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.97);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 20px;
  }
`;

const ConfirmTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 18px;
  line-height: 1.35;
  letter-spacing: -0.02em;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
`;

const ConfirmText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const SecondaryButton = styled.button`
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--btn-secondary-border);
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.92);
  color: #3a3a3c;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #d4d4dc;
  }
`;

const PrimaryButtonWrap = styled(AuthLoginActions)`
  width: auto;
  margin-top: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PrimaryButton = styled(AuthPrimaryButton)`
  min-height: 42px;
  height: 42px;
  min-width: 220px;
  border-radius: 13px;
  margin-top: 0;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const parseErrorMessage = (error) =>
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  'Não foi possível salvar as configurações do evento.';

const AddressField = ({ value, onChange, disabled }) => {
  const active = Boolean(value);

  return (
    <TextAreaShell>
      <TextAreaInner>
        <TextAreaFieldTrack>
          <FloatingLabel htmlFor="evento-local-endereco" $active={active}>
            Local endereço
          </FloatingLabel>
          <StyledTextArea
            id="evento-local-endereco"
            name="localEndereco"
            value={value}
            onChange={onChange}
            disabled={disabled}
            $active={active}
            placeholder="Rua, número, bairro, cidade..."
          />
        </TextAreaFieldTrack>
      </TextAreaInner>
    </TextAreaShell>
  );
};

const AdminEvento = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isNewEvent, setIsNewEvent] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const navigate = useNavigate();
  const API_URL = getApiBaseUrl();

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(`${API_URL}/api/evento`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setFormData({
          ...INITIAL_FORM,
          ...(response.data?.data || {}),
        });
        setIsNewEvent(Boolean(response.data?.data?.isNew));
      } catch (requestError) {
        if ([401, 403].includes(requestError?.response?.status)) {
          navigate('/painel', { replace: true });
          return;
        }

        setError(parseErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    fetchEvento();
  }, [API_URL, navigate]);

  const isDisabled = loading || saving;

  const hasRequiredValues = useMemo(
    () =>
      Boolean(
        formData.nome.trim() &&
          formData.ano.trim() &&
          formData.dataInicio.trim() &&
          formData.localNome.trim()
      ),
    [formData]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setError('');
    setSuccessMessage('');
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const executeSave = async () => {
    if (!hasRequiredValues) {
      setError('Preencha nome, ano, data de início e local.');
      return;
    }

    const requestPayload = {
      nome: formData.nome.trim(),
      nomeExibicao: formData.nomeExibicao.trim(),
      nomeCompleto: formData.nomeCompleto.trim(),
      tema: formData.tema.trim(),
      ano: formData.ano.trim(),
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
      localNome: formData.localNome.trim(),
      localEndereco: formData.localEndereco.trim(),
      valorTrabalhador: formData.valorTrabalhador,
      valorConfraternista: formData.valorConfraternista,
      valorPequenoCompanheiro: formData.valorPequenoCompanheiro,
      ativo: true,
    };
    const requestUrl = `${API_URL}/api/evento`;
    const hasToken = Boolean(localStorage.getItem('token'));

    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');

      console.log('[AdminEvento] salvando evento', {
        method: 'PUT',
        url: requestUrl,
        payload: requestPayload,
        hasAuthorizationToken: hasToken,
        isNewEvent,
      });

      const response = await axios.put(requestUrl, requestPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('[AdminEvento] resposta ao salvar evento', {
        status: response.status,
        data: response.data,
      });

      setFormData({
        ...INITIAL_FORM,
        ...(response.data?.data || requestPayload),
      });
      setIsNewEvent(Boolean(response.data?.data?.isNew));
      setSuccessMessage(response.data?.message || 'Evento salvo com sucesso.');
    } catch (requestError) {
      console.log('[AdminEvento] erro ao salvar evento', {
        status: requestError?.response?.status || null,
        data: requestError?.response?.data || null,
        message: requestError?.message || 'Erro desconhecido ao salvar evento',
      });

      if ([401, 403].includes(requestError?.response?.status)) {
        navigate('/painel', { replace: true });
        return;
      }

      setError(parseErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasRequiredValues) {
      setError('Preencha nome, ano, data de início e local.');
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsConfirmOpen(false);
    await executeSave();
  };

  return (
    <ThemeProvider theme={authTheme}>
      <AppHeader
        showBack
        glass
        onBack={() => navigate('/painel')}
        title="Configurações"
        rightContent={<AppHeaderBadge>Evento</AppHeaderBadge>}
        maxWidth={PAGE_MAX_WIDTH}
      />

      <Container>
        <Content>
          <AuthLoginForm onSubmit={handleSubmit}>
            <FormStack>
              {FORM_SECTIONS.map((section) => (
                <Section key={section.id}>
                  <SectionHeader>
                    <SectionTitle>{section.title}</SectionTitle>
                    <SectionText>{section.description}</SectionText>
                  </SectionHeader>

                  <FieldsGrid>
                    {section.fields.map((field) => (
                      <FieldSpan key={field.name} $fullWidth={field.fullWidth}>
                        {field.type === 'textarea' ? (
                          <AddressField
                            value={formData[field.name]}
                            onChange={handleChange}
                            disabled={isDisabled}
                          />
                        ) : (
                          <PremiumAuthField
                            id={`evento-${field.name}`}
                            name={field.name}
                            label={field.label}
                            type={field.type}
                            icon={field.icon}
                            value={formData[field.name]}
                            onChange={handleChange}
                            disabled={isDisabled}
                            required={Boolean(field.required)}
                            placeholder={field.placeholder || ' '}
                            inputMode={field.inputMode}
                            step={field.step}
                            autoComplete="off"
                          />
                        )}
                      </FieldSpan>
                    ))}
                  </FieldsGrid>
                </Section>
              ))}

              {loading ? <AlertSuccess>Carregando dados do evento...</AlertSuccess> : null}
              {!loading && !error && isNewEvent ? (
                <AlertInfo role="status">
                  Nenhum evento cadastrado ainda. Preencha os dados para criar o primeiro.
                </AlertInfo>
              ) : null}
              {error ? <AlertError role="alert">{error}</AlertError> : null}
              {successMessage ? <AlertSuccess role="status">{successMessage}</AlertSuccess> : null}

              <FooterActions>
                <SecondaryButton type="button" onClick={() => navigate('/painel')}>
                  Voltar ao dashboard
                </SecondaryButton>

                <PrimaryButtonWrap>
                  <PrimaryButton
                    type="submit"
                    disabled={isDisabled || !hasRequiredValues}
                    aria-busy={saving ? 'true' : 'false'}
                  >
                    {saving ? <AuthButtonSpinner /> : null}
                    <AuthFlowButtonLabel>
                      {saving ? 'Salvando...' : 'Salvar alterações'}
                    </AuthFlowButtonLabel>
                  </PrimaryButton>
                </PrimaryButtonWrap>
              </FooterActions>
            </FormStack>
          </AuthLoginForm>
        </Content>
      </Container>

      {isConfirmOpen ? (
        <ConfirmOverlay onClick={() => setIsConfirmOpen(false)}>
          <ConfirmDialog onClick={(event) => event.stopPropagation()}>
            <ConfirmTitle>
              TEM CERTEZA QUE DESEJA ALTERAR AS CONFIGURAÇÕES DO EVENTO?
            </ConfirmTitle>
            <ConfirmText>
              Essas alterações impactam todo o sistema de inscrições.
            </ConfirmText>

            <ConfirmActions>
              <SecondaryButton
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={saving}
              >
                Cancelar
              </SecondaryButton>

              <PrimaryButton
                type="button"
                onClick={handleConfirmSave}
                disabled={saving}
                aria-busy={saving ? 'true' : 'false'}
              >
                {saving ? <AuthButtonSpinner /> : null}
                <AuthFlowButtonLabel>
                  {saving ? 'Salvando...' : 'Confirmar'}
                </AuthFlowButtonLabel>
              </PrimaryButton>
            </ConfirmActions>
          </ConfirmDialog>
        </ConfirmOverlay>
      ) : null}
    </ThemeProvider>
  );
};

export default AdminEvento;

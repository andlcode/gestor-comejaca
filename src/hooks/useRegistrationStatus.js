import { useEffect, useState } from 'react';
import axios from 'axios';

import { getApiBaseUrl } from '../utils/apiBaseUrl';
import { REGISTRATION } from '../config/registrationConfig';

const API_URL = getApiBaseUrl();

export function useRegistrationStatus() {
  const [loading, setLoading] = useState(true);
  const [registrationsOpen, setRegistrationsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/evento/public/inscricoes`);
        if (cancelled) return;

        setRegistrationsOpen(response.data?.data?.registrationsOpen === true);
      } catch (error) {
        console.error('[useRegistrationStatus] erro ao buscar status das inscrições:', error);
        if (!cancelled) {
          setRegistrationsOpen(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    loading,
    registrationsOpen,
    closed: !registrationsOpen,
    closedButtonLabel: REGISTRATION.closedButtonLabel,
    closedUserMessage: REGISTRATION.closedUserMessage,
  };
}

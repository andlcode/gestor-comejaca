export function getSafeMessage(value, fallback = 'Ocorreu um erro inesperado.') {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    const normalizedItems = value
      .map((item) => getSafeMessage(item, ''))
      .filter(Boolean);

    if (normalizedItems.length > 0) {
      return normalizedItems.join(', ');
    }
  }

  if (value && typeof value === 'object') {
    if ('message' in value) {
      const nestedMessage = getSafeMessage(value.message, '');
      if (nestedMessage) return nestedMessage;
    }

    if ('error' in value) {
      const nestedError = getSafeMessage(value.error, '');
      if (nestedError) return nestedError;
    }
  }

  return fallback;
}

export function getSafeApiErrorMessage(error, fallback = 'Ocorreu um erro inesperado.') {
  if (error?.code === 'ECONNABORTED') {
    return 'A solicitação demorou mais do que o esperado. Tente novamente.';
  }

  if (!error?.response) {
    return 'Não foi possível conectar ao servidor. Tente novamente.';
  }

  return getSafeMessage(
    error.response?.data?.message ?? error.response?.data?.error ?? error.response?.data,
    fallback
  );
}

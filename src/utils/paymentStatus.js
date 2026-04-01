const STATUS_STYLES = {
  pago: {
    variant: 'pago',
    textColor: '#166534',
    backgroundColor: 'rgba(240, 253, 244, 0.95)',
    borderColor: 'rgba(22, 163, 74, 0.2)',
    dotColor: '#34c759',
  },
  pendente: {
    variant: 'pendente',
    textColor: '#b45309',
    backgroundColor: 'rgba(255, 251, 235, 0.96)',
    borderColor: 'rgba(217, 119, 6, 0.22)',
    dotColor: '#ff9f0a',
  },
  falhou: {
    variant: 'falhou',
    textColor: '#b42318',
    backgroundColor: 'rgba(254, 242, 242, 0.96)',
    borderColor: 'rgba(220, 38, 38, 0.18)',
    dotColor: '#ff3b30',
  },
  na: {
    variant: 'na',
    textColor: '#64748b',
    backgroundColor: 'rgba(248, 250, 252, 0.96)',
    borderColor: 'rgba(148, 163, 184, 0.28)',
    dotColor: '#94a3b8',
  },
};

const STATUS_LABELS = {
  dashboard: {
    pago: 'Pagamento concluído',
    pendente: 'Aguardando pagamento',
    falhou: 'Falhou',
    na: 'N/A',
  },
  estatisticas: {
    pago: 'Pago',
    pendente: 'Pendente',
    falhou: 'Falhou',
    na: 'N/A',
  },
};

export const getPaymentStatusVariant = (status) => {
  const normalized = String(status || '').trim().toLowerCase();

  switch (normalized) {
    case 'approved':
    case 'aprovado':
    case 'pago':
      return 'pago';
    case 'rejeitado':
    case 'rejected':
    case 'falhou':
      return 'falhou';
    case 'pendente':
    case 'pending':
      return 'pendente';
    case 'n/a':
    case 'na':
    case '':
    default:
      return 'na';
  }
};

export const getStatusPagamento = (status, context = 'dashboard') => {
  const variant = getPaymentStatusVariant(status);
  const labels = STATUS_LABELS[context] || STATUS_LABELS.dashboard;

  return {
    ...STATUS_STYLES[variant],
    label: labels[variant] || STATUS_LABELS.dashboard[variant],
  };
};

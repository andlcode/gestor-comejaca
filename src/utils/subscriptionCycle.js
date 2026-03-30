export const ACTIVE_REGISTRATION_YEAR = 2026;
export const ARCHIVED_REGISTRATION_YEARS = [2025];

const POSSIBLE_YEAR_FIELDS = [
  "cycleYear",
  "registrationYear",
  "anoInscricao",
  "ano",
  "eventYear",
];

const toValidYear = (value) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 2000 || parsed > 3000) {
    return null;
  }

  return parsed;
};

export const getInscricaoCycleYear = (inscricao) => {
  for (const field of POSSIBLE_YEAR_FIELDS) {
    const year = toValidYear(inscricao?.[field]);

    if (year) {
      return year;
    }
  }

  const createdAt = inscricao?.createdAt ? new Date(inscricao.createdAt) : null;

  if (createdAt && !Number.isNaN(createdAt.getTime())) {
    return createdAt.getFullYear();
  }

  return null;
};

export const getInscricaoLifecycle = (inscricao) => {
  const cycleYear = getInscricaoCycleYear(inscricao);
  const isArchived = ARCHIVED_REGISTRATION_YEARS.includes(cycleYear);
  const isActive = cycleYear === ACTIVE_REGISTRATION_YEAR;

  return {
    cycleYear,
    isArchived,
    isActive,
    sectionKey: isArchived ? "archived" : "active",
    badgeLabel: isArchived ? "Arquivada" : null,
    actions: isArchived
      ? {
          canEdit: false,
          canPrint: false,
          canPay: false,
          canReenroll: true,
        }
      : {
          canEdit: true,
          canPrint: true,
          canPay: true,
          canReenroll: false,
        },
  };
};

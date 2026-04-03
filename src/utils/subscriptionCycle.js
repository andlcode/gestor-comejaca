export const ACTIVE_REGISTRATION_YEAR = 2026;
export const ARCHIVED_REGISTRATION_YEARS = [2025];

const POSSIBLE_YEAR_FIELDS = [
  "cycleYear",
  "registrationYear",
  "anoInscricao",
  "ano",
  "eventYear",
  "anoEvento",
  "editionYear",
  "eventEditionYear",
];

const toValidYear = (value) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 2000 || parsed > 3000) {
    return null;
  }

  return parsed;
};

export const getInscricaoCycleYear = (inscricao) => {
  const yearFieldsSnapshot = Object.fromEntries(
    POSSIBLE_YEAR_FIELDS.map((field) => [field, inscricao?.[field] ?? null])
  );

  for (const field of POSSIBLE_YEAR_FIELDS) {
    const year = toValidYear(inscricao?.[field]);

    if (year) {
      console.log("[subscriptionCycle] campo de ano identificado", {
        id: inscricao?.id ?? null,
        nomeCompleto: inscricao?.nomeCompleto ?? null,
        cycleYear: year,
        createdAt: inscricao?.createdAt ?? null,
        matchedField: field,
        yearFields: yearFieldsSnapshot,
      });
      return year;
    }
  }

  const createdAt = inscricao?.createdAt ? new Date(inscricao.createdAt) : null;

  if (createdAt && !Number.isNaN(createdAt.getTime())) {
    const inferredYear = createdAt.getFullYear();

    console.log("[subscriptionCycle] ano inferido via createdAt", {
      id: inscricao?.id ?? null,
      nomeCompleto: inscricao?.nomeCompleto ?? null,
      cycleYear: inferredYear,
      createdAt: inscricao?.createdAt ?? null,
      yearFields: yearFieldsSnapshot,
    });

    return inferredYear;
  }

  console.warn("[subscriptionCycle] não foi possível identificar o ano da inscrição", {
    id: inscricao?.id ?? null,
    nomeCompleto: inscricao?.nomeCompleto ?? null,
    cycleYear: null,
    createdAt: inscricao?.createdAt ?? null,
    yearFields: yearFieldsSnapshot,
  });

  return null;
};

export const getInscricaoLifecycle = (inscricao) => {
  const cycleYear = getInscricaoCycleYear(inscricao);
  const isArchived = ARCHIVED_REGISTRATION_YEARS.includes(cycleYear);
  const isActive = cycleYear === ACTIVE_REGISTRATION_YEAR;
  const hasRecognizedYear = isActive || isArchived;
  const sectionKey = isActive ? "active" : "archived";
  const badgeLabel = isArchived
    ? "Arquivada"
    : hasRecognizedYear
      ? null
      : "Ciclo não identificado";

  console.log("[subscriptionCycle] classificação calculada", {
    id: inscricao?.id ?? null,
    nomeCompleto: inscricao?.nomeCompleto ?? null,
    cycleYear,
    createdAt: inscricao?.createdAt ?? null,
    yearFields: Object.fromEntries(
      POSSIBLE_YEAR_FIELDS.map((field) => [field, inscricao?.[field] ?? null])
    ),
    isActive,
    isArchived,
    sectionKey,
  });

  return {
    cycleYear,
    isArchived,
    isActive,
    sectionKey,
    badgeLabel,
    actions: isActive
      ? {
          canEdit: true,
          canPrint: true,
          canPay: true,
          canReenroll: false,
        }
      : isArchived
      ? {
          canEdit: false,
          canPrint: false,
          canPay: false,
          canReenroll: true,
        }
      : {
          canEdit: false,
          canPrint: false,
          canPay: false,
          canReenroll: false,
        },
  };
};

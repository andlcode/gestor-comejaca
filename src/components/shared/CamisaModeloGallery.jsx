import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { EVENT } from "../../config/eventConfig";

export function normalizeCamisaImagensUrlList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((u) => String(u || "").trim()).filter(Boolean);
  }
  return [];
}

function isCamisaPdfUrl(url) {
  if (!url || typeof url !== "string") return false;
  const base = url.split(/[?#]/)[0];
  return /\.pdf$/i.test(base);
}

const CamisaModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(12, 12, 18, 0.58);
  backdrop-filter: blur(5px);
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? "visible" : "hidden")};
  transition: opacity 0.22s ease, visibility 0.22s ease;

  @media (max-width: 768px) {
    padding: 12px;
    align-items: flex-end;
  }
`;

const CamisaModalPanel = styled.div`
  position: relative;
  width: ${({ $wide }) => ($wide ? "min(900px, 100%)" : "min(520px, 100%)")};
  max-height: min(88vh, 900px);
  overflow: auto;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid #ececf1;
  border-radius: 20px;
  padding: 20px 18px 22px;
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.22);
  transform: ${({ $show }) => ($show ? "scale(1)" : "scale(0.94)")};
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition:
    opacity 0.22s ease,
    transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 768px) {
    width: 100%;
    max-height: 90vh;
    border-radius: 18px 18px 0 0;
    padding: 16px 14px 20px;
  }
`;

const CamisaModalTitle = styled.h2`
  margin: 0 40px 14px 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #1d1d1f;
`;

const CamisaModalImage = styled.img`
  display: block;
  width: 100%;
  max-height: min(62vh, 580px);
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  background: #f4f4f6;

  @media (max-width: 768px) {
    max-height: min(52vh, 480px);
  }
`;

const CamisaModalPdfFrame = styled.iframe`
  display: block;
  width: 100%;
  min-height: min(58vh, 520px);
  height: min(58vh, 520px);
  border: none;
  border-radius: 12px;
  background: #f4f4f6;

  @media (max-width: 768px) {
    min-height: min(48vh, 420px);
    height: min(48vh, 420px);
  }
`;

const CamisaPdfOpenLink = styled.a`
  display: inline-block;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #0a84ff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CamisaModalClose = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid #ececf1;
  background: #fafafc;
  color: #636366;
  font-size: 1rem;
  cursor: pointer;
`;

const CamisaNavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  flex-wrap: wrap;
`;

const CamisaNavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #ececf1;
  background: #f8f9fc;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #e2e8f0;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const CamisaIndicator = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.02em;
`;

const CamisaPreviewLink = styled.button`
  align-self: flex-start;
  margin-top: 2px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #0a84ff;
  text-align: left;
  text-underline-offset: 3px;
  transition: color 0.2s ease;

  &:hover {
    text-decoration: underline;
    color: #0668c7;
  }

  &:focus-visible {
    outline: none;
    text-decoration: underline;
    border-radius: 4px;
    box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.22);
  }
`;

function CamisaGaleriaModal({ isOpen, onClose, urls }) {
  const [rendered, setRendered] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [index, setIndex] = useState(0);

  const total = urls.length;
  const current = total > 0 ? urls[Math.min(index, total - 1)] : "";
  const isPdf = isCamisaPdfUrl(current);
  const showNav = total > 1;

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      setIndex(0);
      const id = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(id);
    }
    setAnimateIn(false);
    const t = setTimeout(() => setRendered(false), 240);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (index >= total && total > 0) {
      setIndex(total - 1);
    }
  }, [index, total]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  if (!rendered || total === 0) return null;

  const titleLabel = isPdf ? "Modelo da camisa (PDF)" : "Modelo da camisa";

  return (
    <CamisaModalBackdrop
      role="presentation"
      $show={animateIn}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <CamisaModalPanel
        role="dialog"
        aria-modal="true"
        aria-labelledby="camisa-galeria-titulo"
        $show={animateIn}
        $wide={isPdf || total > 1}
        onClick={(e) => e.stopPropagation()}
      >
        <CamisaModalClose type="button" onClick={onClose} aria-label="Fechar">
          ✕
        </CamisaModalClose>
        <CamisaModalTitle id="camisa-galeria-titulo">{titleLabel}</CamisaModalTitle>

        {isPdf ? (
          <>
            <CamisaModalPdfFrame
              key={current}
              src={current}
              title={`Modelo da camisa em PDF — ${EVENT.displayName}`}
            />
            <CamisaPdfOpenLink href={current} target="_blank" rel="noopener noreferrer">
              Abrir o PDF em nova aba
            </CamisaPdfOpenLink>
          </>
        ) : (
          <CamisaModalImage
            key={current}
            src={current}
            alt={`Modelo da camisa ${index + 1} de ${total} — ${EVENT.displayName}`}
            loading="lazy"
            decoding="async"
          />
        )}

        {showNav ? (
          <CamisaNavRow>
            <CamisaNavButton type="button" onClick={goPrev} aria-label="Imagem anterior">
              <FiChevronLeft size={20} />
              Anterior
            </CamisaNavButton>
            <CamisaIndicator>
              {index + 1} / {total}
            </CamisaIndicator>
            <CamisaNavButton type="button" onClick={goNext} aria-label="Próxima imagem">
              Próximo
              <FiChevronRight size={20} />
            </CamisaNavButton>
          </CamisaNavRow>
        ) : null}
      </CamisaModalPanel>
    </CamisaModalBackdrop>
  );
}

/**
 * Busca dados públicos do evento (`camisaImagens`, `camisaImagemUrl` = primeira URL)
 * e exibe o link + modal. Fallback: `EVENT.camisaImagemUrl` (.env).
 * Não altera formulário de inscrição — apenas UI.
 */
export default function CamisaModeloGalleryTrigger({ apiBaseUrl }) {
  const [urls, setUrls] = useState([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const base = String(apiBaseUrl || "").replace(/\/$/, "");

    (async () => {
      let list = [];
      try {
        const r = await axios.get(`${base}/api/evento/public/camisa`);
        const d = r.data?.data;
        list = normalizeCamisaImagensUrlList(d?.camisaImagens);
        if (list.length === 0 && d?.camisaImagemUrl) {
          const one = String(d.camisaImagemUrl).trim();
          if (one) list = [one];
        }
      } catch {
        list = [];
      }
      if (cancelled) return;
      if (list.length === 0 && EVENT.camisaImagemUrl) {
        list = [EVENT.camisaImagemUrl];
      }
      setUrls(list);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl]);

  if (!ready || urls.length === 0) return null;

  return (
    <>
      <CamisaPreviewLink type="button" onClick={() => setOpen(true)}>
        👁 Ver modelo da camisa
      </CamisaPreviewLink>
      <CamisaGaleriaModal isOpen={open} onClose={() => setOpen(false)} urls={urls} />
    </>
  );
}

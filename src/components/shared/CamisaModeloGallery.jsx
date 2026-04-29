import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { EVENT } from "../../config/eventConfig";

function dedupeCamisaUrls(urls) {
  const seen = new Set();
  const out = [];
  for (const u of urls) {
    if (!u || seen.has(u)) continue;
    seen.add(u);
    out.push(u);
  }
  return out;
}

/**
 * Normaliza a lista vinda da API (`camisaImagens` do evento ativo).
 * Aceita array de strings; ignora entradas vazias e remove duplicatas preservando a ordem.
 */
export function normalizeCamisaImagensUrlList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return dedupeCamisaUrls(
      raw.map((u) => String(u || "").trim()).filter(Boolean)
    );
  }
  return [];
}

/** Aceita `{ success, data: { camisaImagens } }` ou objeto plano com os mesmos campos. */
function extractCamisaPayloadFromResponse(responseData) {
  if (!responseData || typeof responseData !== "object") return null;
  const inner = responseData.data;
  if (
    inner &&
    typeof inner === "object" &&
    (Object.prototype.hasOwnProperty.call(inner, "camisasImagens") ||
      Object.prototype.hasOwnProperty.call(inner, "camisaImagens") ||
      Object.prototype.hasOwnProperty.call(inner, "camisaImagemUrl"))
  ) {
    return inner;
  }
  if (
    Object.prototype.hasOwnProperty.call(responseData, "camisasImagens") ||
    Object.prototype.hasOwnProperty.call(responseData, "camisaImagens") ||
    Object.prototype.hasOwnProperty.call(responseData, "camisaImagemUrl")
  ) {
    return responseData;
  }
  return null;
}

/** Itens da galeria `{ url, legenda }` a partir da resposta da API (com fallback para só URLs). */
export function buildCamisaGaleriaItemsFromPayload(d) {
  if (!d || typeof d !== "object") return [];

  if (Array.isArray(d.camisasImagens) && d.camisasImagens.length > 0) {
    const seen = new Set();
    const out = [];
    for (const row of d.camisasImagens) {
      if (!row || typeof row !== "object") continue;
      const url = String(row.url || "").trim();
      if (!url || seen.has(url)) continue;
      seen.add(url);
      out.push({
        url,
        legenda: String(row.legenda || "").trim(),
      });
    }
    if (out.length > 0) return out;
  }

  const rawList = Array.isArray(d.camisaImagens) ? d.camisaImagens : [];
  const seen = new Set();
  const out = [];

  for (const raw of rawList) {
    const s = String(raw || "").trim();
    if (!s) continue;

    if (s.startsWith("{")) {
      try {
        const o = JSON.parse(s);
        const url = String(o.url || o.href || "").trim();
        if (!url || seen.has(url)) continue;
        seen.add(url);
        out.push({
          url,
          legenda: String(o.legenda || o.caption || "").trim(),
        });
        continue;
      } catch {
        // segue como URL ou linha com pipe
      }
    }

    const pipeIdx = s.indexOf("|");
    if (pipeIdx !== -1) {
      const url = s.slice(0, pipeIdx).trim();
      const legenda = s.slice(pipeIdx + 1).trim();
      if (url && !seen.has(url)) {
        seen.add(url);
        out.push({ url, legenda });
      }
      continue;
    }

    if (seen.has(s)) continue;
    seen.add(s);
    out.push({ url: s, legenda: "" });
  }

  return out;
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
  background: rgba(8, 9, 14, 0.66);
  backdrop-filter: blur(5px);
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? "visible" : "hidden")};
  transition: opacity 0.22s ease, visibility 0.22s ease;

  @media (max-width: 768px) {
    padding: 10px;
    align-items: center;
  }
`;

const CamisaModalPanel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(92vw, 960px);
  max-height: min(90dvh, 90vh);
  overflow: hidden;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 20px;
  padding: 20px 24px;
  box-shadow:
    0 32px 90px rgba(0, 0, 0, 0.22),
    0 12px 36px rgba(15, 23, 42, 0.08);
  transform: ${({ $show }) => ($show ? "scale(1)" : "scale(0.97)")};
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition:
    opacity 0.22s ease,
    transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 768px) {
    width: min(94vw, 960px);
    max-height: min(90dvh, calc(100svh - 16px));
    border-radius: 18px;
    padding: 14px 16px 18px;
  }
`;

const CamisaModalMediaWrap = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const CamisaModalTitle = styled.h2`
  flex-shrink: 0;
  margin: 0 44px 14px 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #1d1d1f;
`;

const camisaHeroFade = keyframes`
  from {
    opacity: 0.35;
    transform: scale(0.985);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

/** Área da galeria: centraliza o bloco e reserva faixa lateral para setas (fora da imagem, dentro do modal). */
const CamisaFocusViewport = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;

  @media (min-width: 769px) {
    /* 44px seta + folga — evita clip com overflow: hidden do painel */
    padding: 0 max(58px, min(4.5vw, 72px));
  }

  @media (max-width: 768px) {
    padding: 0 6px;
  }
`;

/** Ancora das setas: só a mídia; setas ficam fora da caixa da imagem/PDF. */
const CamisaHeroMediaFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CamisaHeroArrowAbs = styled.button`
  position: absolute;
  top: 50%;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  color: #1e293b;
  cursor: pointer;
  box-shadow:
    0 2px 12px rgba(15, 23, 42, 0.1),
    0 0 0 1px rgba(15, 23, 42, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;

  ${({ $side }) =>
    $side === "left"
      ? `
    left: 0;
    transform: translate(calc(-100% - 12px), -50%);
  `
      : `
    left: 100%;
    transform: translate(12px, -50%);
  `}

  svg {
    width: 22px;
    height: 22px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.98);
    color: #0f172a;
    box-shadow:
      0 6px 20px rgba(15, 23, 42, 0.14),
      0 0 0 1px rgba(100, 128, 247, 0.2);
  }

  &:active {
    ${({ $side }) =>
      $side === "left"
        ? `transform: translate(calc(-100% - 12px), -50%) scale(0.96);`
        : `transform: translate(12px, -50%) scale(0.96);`}
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(100, 128, 247, 0.3);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.82);
    opacity: 0.95;
    ${({ $side }) =>
      $side === "left"
        ? `
      left: 4px;
      right: auto;
      transform: translateY(-50%);
    `
        : `
      left: auto;
      right: 4px;
      transform: translateY(-50%);
    `}

    &:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.94);
    }

    &:active {
      ${({ $side }) =>
        $side === "left"
          ? `transform: translateY(-50%) scale(0.96);`
          : `transform: translateY(-50%) scale(0.96);`}
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const CamisaHeroStage = styled.div`
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  touch-action: pan-y;
`;

const CamisaHeroSlide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  gap: 0;
  animation: ${camisaHeroFade} 0.32s ease;
`;

const CamisaHeroImg = styled.img`
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  max-height: 65vh;
  margin: 0 auto;
  object-fit: contain;
  object-position: center;
  border: none;
  border-radius: 14px;
  background: transparent;
  box-shadow: none;

  @media (max-width: 768px) {
    max-height: 58vh;
  }
`;

const CamisaHeroPdf = styled.iframe`
  display: block;
  width: 100%;
  max-width: 100%;
  min-height: 240px;
  height: 65vh;
  max-height: 65vh;
  margin: 0 auto;
  border: none;
  border-radius: 14px;
  background: transparent;
  box-shadow: none;

  @media (max-width: 768px) {
    min-height: 200px;
    height: 58vh;
    max-height: 58vh;
  }
`;

const CamisaHeroCaption = styled.p`
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: #334155;
  text-align: center;
  font-weight: 500;
  letter-spacing: -0.015em;
  max-width: 720px;
  padding: 0 12px;
`;

const CamisaHeroMetaRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  width: 100%;
`;

const CamisaHeroCounter = styled.span`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
`;

const CamisaHeroDots = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin: 0;
`;

const CamisaHeroDot = styled.button`
  width: 6px;
  height: 6px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? "rgba(100, 128, 247, 0.9)" : "rgba(148, 163, 184, 0.35)"};
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.18s ease;

  &:hover {
    transform: scale(1.2);
    background: ${({ $active }) =>
      $active ? "rgba(100, 128, 247, 1)" : "rgba(100, 116, 139, 0.55)"};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(100, 128, 247, 0.28);
  }
`;

const CamisaPdfOpenLink = styled.a`
  display: inline-block;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #0a84ff;
  text-decoration: none;
  align-self: center;

  &:hover {
    text-decoration: underline;
  }
`;

const CamisaModalClose = styled.button`
  position: absolute;
  top: 16px;
  right: 18px;
  z-index: 5;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  color: #636366;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: #fff;
    border-color: rgba(100, 128, 247, 0.3);
  }

  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
  }
`;

const CamisaPreviewLink = styled.button`
  align-self: flex-start;
  margin: ${({ $placement }) =>
    $placement === "below" ? "10px 0 0" : "0 0 8px"};
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  color: #64748b;
  text-align: left;
  text-decoration: none;
  text-underline-offset: 2px;
  letter-spacing: -0.01em;
  transition: color 0.18s ease;

  &:hover {
    color: #475569;
    text-decoration: underline;
  }

  &:focus-visible {
    outline: none;
    color: #334155;
    text-decoration: underline;
    border-radius: 4px;
    box-shadow: 0 0 0 2px rgba(100, 128, 247, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 12px;
    margin: ${({ $placement }) =>
      $placement === "below" ? "8px 0 0" : "0 0 6px"};
  }
`;

function CamisaGaleriaModal({ isOpen, onClose, items }) {
  const [rendered, setRendered] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  const total = Array.isArray(items) ? items.length : 0;
  const safeIndex = total > 0 ? Math.min(currentIndex, total - 1) : 0;
  const current = total > 0 ? items[safeIndex] : null;
  const currentUrl = current ? String(current.url || "").trim() : "";
  const cap = current ? String(current.legenda || "").trim() : "";
  const pdf = currentUrl ? isCamisaPdfUrl(currentUrl) : false;
  const showNav = total > 1;

  const nextImage = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % total);
  }, [total]);

  const prevImage = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      setCurrentIndex(0);
      const id = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(id);
    }
    setAnimateIn(false);
    const t = setTimeout(() => setRendered(false), 240);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (total > 0 && currentIndex >= total) {
      setCurrentIndex(0);
    }
  }, [total, currentIndex]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (total <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevImage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImage();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, total, prevImage, nextImage]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null || total <= 1) {
      touchStartX.current = null;
      return;
    }
    const x = e.changedTouches[0]?.clientX;
    if (x == null) {
      touchStartX.current = null;
      return;
    }
    const dx = x - touchStartX.current;
    touchStartX.current = null;
    if (dx < -48) nextImage();
    else if (dx > 48) prevImage();
  };

  if (!rendered || total === 0 || !current) return null;

  const titleLabel =
    total > 1
      ? "Modelos da camisa"
      : pdf
        ? "Modelo da camisa (PDF)"
        : "Modelo da camisa";

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
        onClick={(e) => e.stopPropagation()}
      >
        <CamisaModalClose type="button" onClick={onClose} aria-label="Fechar">
          ✕
        </CamisaModalClose>
        <CamisaModalTitle id="camisa-galeria-titulo">{titleLabel}</CamisaModalTitle>

        <CamisaModalMediaWrap>
          <CamisaFocusViewport>
            <CamisaHeroStage
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <CamisaHeroSlide key={safeIndex}>
                <CamisaHeroMediaFrame>
                  {showNav ? (
                    <CamisaHeroArrowAbs
                      type="button"
                      $side="left"
                      onClick={prevImage}
                      aria-label="Imagem anterior"
                    >
                      <FiChevronLeft aria-hidden />
                    </CamisaHeroArrowAbs>
                  ) : null}
                  {pdf ? (
                    <CamisaHeroPdf
                      src={currentUrl}
                      title={cap || `Modelo PDF — ${EVENT.displayName}`}
                    />
                  ) : (
                    <CamisaHeroImg
                      src={currentUrl}
                      alt={cap || `Modelo ${safeIndex + 1} — ${EVENT.displayName}`}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  {showNav ? (
                    <CamisaHeroArrowAbs
                      type="button"
                      $side="right"
                      onClick={nextImage}
                      aria-label="Próxima imagem"
                    >
                      <FiChevronRight aria-hidden />
                    </CamisaHeroArrowAbs>
                  ) : null}
                </CamisaHeroMediaFrame>
                {cap ? <CamisaHeroCaption>{cap}</CamisaHeroCaption> : null}
                <CamisaHeroMetaRow>
                  <CamisaHeroCounter aria-live="polite">
                    {safeIndex + 1} de {total}
                  </CamisaHeroCounter>
                  {showNav ? (
                    <CamisaHeroDots>
                      {items.map((_, i) => (
                        <CamisaHeroDot
                          key={i}
                          type="button"
                          $active={i === safeIndex}
                          onClick={() => setCurrentIndex(i)}
                          aria-label={`Ir para imagem ${i + 1}`}
                          aria-current={i === safeIndex ? "true" : undefined}
                        />
                      ))}
                    </CamisaHeroDots>
                  ) : null}
                </CamisaHeroMetaRow>
                {pdf ? (
                  <CamisaPdfOpenLink
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir PDF em nova aba
                  </CamisaPdfOpenLink>
                ) : null}
              </CamisaHeroSlide>
            </CamisaHeroStage>
          </CamisaFocusViewport>
        </CamisaModalMediaWrap>
      </CamisaModalPanel>
    </CamisaModalBackdrop>
  );
}

/**
 * Busca `GET .../api/evento/public/camisa` → `camisasImagens` (`{ url, legenda }[]`) e/ou `camisaImagens` (URLs).
 * Galeria em slides (uma imagem por vez, setas, swipe e teclado) com legenda abaixo da mídia.
 * Fallbacks: `EVENT.camisaImagemUrl`, `EVENT.camisaImagemFallbackUrl`.
 */
export default function CamisaModeloGalleryTrigger({
  apiBaseUrl,
  linkLabel = "Ver modelo da camisa",
  /** `below` = margem acima (ex.: logo abaixo do select "Deseja camisa?"). */
  linkPlacement = "above",
}) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const base = String(apiBaseUrl || "").replace(/\/$/, "");

    (async () => {
      let nextItems = [];
      try {
        const r = await axios.get(`${base}/api/evento/public/camisa`);
        const d = extractCamisaPayloadFromResponse(r.data);
        nextItems = buildCamisaGaleriaItemsFromPayload(d || {});
        if (nextItems.length === 0 && d?.camisaImagemUrl) {
          const one = String(d.camisaImagemUrl).trim();
          if (one) nextItems = [{ url: one, legenda: "" }];
        }
      } catch {
        nextItems = [];
      }
      if (cancelled) return;
      if (nextItems.length === 0 && EVENT.camisaImagemUrl) {
        nextItems = [{ url: EVENT.camisaImagemUrl, legenda: "" }];
      }
      if (nextItems.length === 0 && EVENT.camisaImagemFallbackUrl) {
        nextItems = [{ url: EVENT.camisaImagemFallbackUrl, legenda: "" }];
      }
      setItems(nextItems);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl]);

  if (!ready || items.length === 0) return null;

  return (
    <>
      <CamisaPreviewLink
        type="button"
        onClick={() => setOpen(true)}
        $placement={linkPlacement}
      >
        {linkLabel}
      </CamisaPreviewLink>
      <CamisaGaleriaModal isOpen={open} onClose={() => setOpen(false)} items={items} />
    </>
  );
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { FlipCard } from "@/components/ui/FlipCard";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

interface Card {
  front: string;
  items: string[];
  about: string;
}

/**
 * Image map: when hovering card N, the OTHER 3 cards show these 3 images.
 * Each entry is an array of 3 image paths (one for each of the other cards).
 */
const CASE_IMAGES: string[][] = [
  // Card 0 ("Desarrollos Urbanos") → 3 project photos
  [
    "/images/cases/Desarrollos-urbano-1.webp",
    "/images/cases/Desarrollos-urbano-2.webp",
    "/images/cases/Desarrollos-urbano-3.webp",
  ],
  // Card 1 ("Infraestructura Vial") → 3 project photos
  [
    "/images/cases/Infraestructura-vial-1.webp",
    "/images/cases/Infraestructura-vial-2.webp",
    "/images/cases/Infraestructura-vial-3.webp",
  ],
  // Card 2 ("Obras Públicas") → 3 project photos
  [
    "/images/cases/obras-publicas-1.webp",
    "/images/cases/obras-publicas-2.webp",
    "/images/cases/obras-publicas-3.webp",
  ],
  // Card 3 ("Construcción Privada") → 3 project photos
  [
    "/images/cases/Construccion-privada-1.webp",
    "/images/cases/Construccion-privada-2.webp",
    "/images/cases/Construccion-privada-3.webp",
  ],
];

/**
 * Given which card is hovered and which card we're rendering,
 * return the image path that card should show on its back.
 */
function getImageForCard(hoveredIndex: number, cardIndex: number): string {
  const images = CASE_IMAGES[hoveredIndex];
  // The 3 images go to the 3 non-hovered cards in order
  const otherIndices = [0, 1, 2, 3].filter((i) => i !== hoveredIndex);
  const slot = otherIndices.indexOf(cardIndex);
  return images[slot];
}

/**
 * Front background images for the idle/normal state of the cards.
 */
const FRONT_IMAGES: string[] = [
  "/images/cases/front-desarrollos-urbanos.webp",
  "/images/cases/front-infraestructura-vial.webp",
  "/images/cases/front-obras-publicas.webp",
  "/images/cases/front-construccion-privada.webp",
];

/**
 * SECTION — Casos de aplicación (Application Cases).
 * Dual layout:
 * - Desktop: 4 synchronized flip cards on hover with cross-card galleries.
 * - Mobile: Interactive category pill tabs + active case card + swipeable 3-photo project gallery.
 */
export function SectionApplicationCases() {
  const t = useTranslations("whereWeStart");
  const cards = t.raw("cards") as Card[];
  const aboutLabel = t("aboutLabel");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  /** Refs for pill tab auto-centering (mobile) */
  const pillContainerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /** Scroll the active pill tab into center view */
  const scrollPillIntoView = useCallback((index: number) => {
    const btn = pillRefs.current[index];
    if (btn) {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, []);

  /** Auto-center pill when mobileIndex changes */
  useEffect(() => {
    scrollPillIntoView(mobileIndex);
  }, [mobileIndex, scrollPillIntoView]);

  const activeCard = cards[mobileIndex];

  const handlePrevCase = () => {
    setMobileIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
    setActiveImageIndex(0);
  };

  const handleNextCase = () => {
    setMobileIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
    setActiveImageIndex(0);
  };

  return (
    <section
      id="cases"
      className="relative overflow-hidden pt-10 pb-12 sm:pt-8 sm:pb-16 lg:pt-8 lg:pb-18 scroll-mt-28 sm:scroll-mt-24 lg:scroll-mt-24"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-6 sm:mb-8 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em]"
        >
          <span className="h-px w-6 bg-accent-primary/60" />
          <span className="keyword-gradient">{t("cardsEyebrow")}</span>
        </motion.p>

        {/* ── MOBILE VIEW: Interactive Tabs + Active Card + 3-Photo Gallery ── */}
        <div className="block sm:hidden">
          {/* Pill selector */}
          <div ref={pillContainerRef} className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {cards.map((c, i) => {
              const active = mobileIndex === i;
              return (
                <button
                  ref={(el) => { pillRefs.current[i] = el; }}
                  key={c.front}
                  type="button"
                  onClick={() => {
                    setMobileIndex(i);
                    setActiveImageIndex(0);
                  }}
                  className={cn(
                    "relative shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300",
                    active
                      ? "bg-accent-primary text-black font-semibold shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.4)]"
                      : "glass text-ink-muted hover:text-ink",
                  )}
                >
                  {c.front}
                </button>
              );
            })}
          </div>

          {/* Active Case Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease }}
              className="flex flex-col gap-4"
            >
              {/* Technical Overview Card */}
              <div
                className="relative overflow-hidden rounded-3xl border border-[rgba(var(--accent-primary-rgb),0.35)] p-6 shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.15)]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(var(--accent-primary-rgb),0.22) 0%, rgba(var(--accent-primary-rgb),0.08) 45%, var(--glass-bg-strong) 100%)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                {/* Header with Case Index & Navigation Arrows */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold tracking-[0.2em] text-accent-primary">
                    {mobileIndex + 1} / {cards.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevCase}
                      aria-label="Caso anterior"
                      className="glass flex h-8 w-8 items-center justify-center rounded-full text-ink-muted active:text-ink active:scale-95 transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextCase}
                      aria-label="Siguiente caso"
                      className="glass flex h-8 w-8 items-center justify-center rounded-full text-ink-muted active:text-ink active:scale-95 transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="mb-4 text-xl font-bold tracking-tight text-ink">
                  {activeCard.front}
                </h3>

                {/* Items bullet points */}
                <div className="flex flex-col gap-2">
                  {activeCard.items.map((it) => (
                    <span
                      key={it}
                      className="flex items-center gap-2.5 text-sm text-ink/90"
                    >
                      <span className="h-px w-3 shrink-0 bg-accent-primary" />
                      {it}
                    </span>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-4 h-px w-full bg-accent-primary/20" />

                {/* About Section */}
                <div>
                  <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent-primary/80">
                    {aboutLabel}
                  </span>
                  <p className="text-xs leading-relaxed text-ink-muted">
                    {activeCard.about}
                  </p>
                </div>
              </div>

              {/* Integrated 3-Photo Gallery for this case */}
              <div className="glass rounded-3xl p-4 border border-white/10">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent-primary">
                    <Camera className="h-3.5 w-3.5" />
                    {t("projects")}
                  </span>
                  <span className="text-[10px] text-ink-faint">
                    {t("swipeToSeePhotos")}
                  </span>
                </div>

                {/* Horizontal Swipe Carousel */}
                <div
                  className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none rounded-2xl"
                  onScroll={(e) => {
                    const scrollLeft = e.currentTarget.scrollLeft;
                    const width = e.currentTarget.offsetWidth;
                    const newIndex = Math.round(scrollLeft / width);
                    if (
                      newIndex !== activeImageIndex &&
                      newIndex >= 0 &&
                      newIndex < 3
                    ) {
                      setActiveImageIndex(newIndex);
                    }
                  }}
                >
                  {CASE_IMAGES[mobileIndex].map((imgSrc, imgIdx) => (
                    <div
                      key={imgSrc}
                      className="relative aspect-[16/10] w-full shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                    >
                      <Image
                        src={imgSrc}
                        alt={`${activeCard.front} - ${imgIdx + 1}`}
                        fill
                        priority={imgIdx === 0}
                        sizes="(max-width: 640px) 100vw, 400px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="text-[11px] font-medium drop-shadow-sm line-clamp-1">
                          {activeCard.front}
                        </span>
                        <span className="rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-mono backdrop-blur-sm">
                          {imgIdx + 1} / 3
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Dots */}
                <div className="mt-3 flex justify-center gap-1.5">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        activeImageIndex === dot
                          ? "w-6 bg-accent-primary"
                          : "w-1.5 bg-white/20",
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── DESKTOP & TABLET VIEW: 4 Synchronized Flip Cards ── */}
        <div
          className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {cards.map((c, i) => {
            const isHoveredCard = hoveredIndex === i;
            const anotherIsHovered =
              hoveredIndex !== null && hoveredIndex !== i;
            return (
              <FlipCard
                key={c.front}
                front={c.front}
                items={c.items}
                about={c.about}
                aboutLabel={aboutLabel}
                index={i}
                isFlipped={isHoveredCard || anotherIsHovered}
                showImage={anotherIsHovered}
                frontImageSrc={FRONT_IMAGES[i]}
                imageSrc={
                  anotherIsHovered && hoveredIndex !== null
                    ? getImageForCard(hoveredIndex, i)
                    : undefined
                }
                imageLabel={
                  hoveredIndex !== null ? cards[hoveredIndex].front : undefined
                }
                onHoverStart={() => setHoveredIndex(i)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

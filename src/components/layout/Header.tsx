"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mail } from "lucide-react";
import { Logo } from "./Logo";

import { LocaleSwitcher } from "./LocaleSwitcher";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

export function Header() {
  const tNav = useTranslations("nav");
  const tCta = useTranslations("cta");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_ITEMS = [
    { key: "intro", id: "intro" },
    { key: "product", id: "product" },
    { key: "cases", id: "cases" },
    { key: "digitalTwin", id: "digital-twin" },
    { key: "difference", id: "difference" },
    { key: "vision", id: "vision" },
    { key: "team", id: "team" },
    { key: "contact", id: "contact" },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  const scrollToContact = () => {
    scrollToSection("contact");
  };

  return (
    <>
      <header className="fixed inset-x-4 top-4 z-50 md:inset-x-6 lg:inset-x-10">
        <div
          className={cn(
            "animated-border glass flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 md:px-5",
            scrolled && "shadow-[0_8px_40px_rgba(0,0,0,0.32)]"
          )}
          style={{
            background: "var(--header-bg)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            fontFamily: "var(--font-inter), Inter, sans-serif",
          }}
        >
          {/* ── Logo ──────────────────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            <Logo />
          </button>

          {/* ── Right controls (desktop) ───────────────────────────────────── */}
          <div className="hidden sm:flex items-center gap-1.5">
            {/* Language switcher */}
            <div className="nav-item-wrap">
              <LocaleSwitcher />
            </div>



            {/* CTA */}
            <MagneticButton
              onClick={scrollToContact}
              ariaLabel={tCta("talkToUs")}
              className="nav-cta-btn"
            >
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-accent-primary" />
                <span>{tCta("talkToUs")}</span>
              </span>
            </MagneticButton>
          </div>

          {/* ── Mobile action controls ────────────────────────────────────────── */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Quick Mail Action to hello@lynce.world */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=hello@lynce.world"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={tCta("talkToUs")}
              className="animated-border glass relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-ink transition-all duration-300 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              <Mail className="h-4 w-4 text-accent-primary" />
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="glass flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[4.5rem] z-40 max-h-[calc(100dvh-5.5rem)] overflow-y-auto glass-strong rounded-2xl p-5 shadow-2xl sm:hidden border border-border/80"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            <div className="flex flex-col gap-4">
              {/* Navigation links */}
              <nav aria-label="Navegación móvil" className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-white/5 active:bg-white/10"
                  >
                    <span>{tNav(item.key)}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-primary/60" />
                  </button>
                ))}
              </nav>

              {/* Bottom controls */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <LocaleSwitcher />
                <MagneticButton onClick={scrollToContact} ariaLabel={tCta("talkToUs")}>
                  <span className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-accent-primary" />
                    <span>{tCta("talkToUs")}</span>
                  </span>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

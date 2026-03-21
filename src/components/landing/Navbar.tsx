"use client";

import { useState, useEffect } from "react";
import { Menu, X, Compass } from "lucide-react";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Mission", href: "#mission" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
        <a
          href="#hero"
          className={`flex items-center gap-2 font-heading font-bold text-lg transition-colors ${
            scrolled ? "text-primary" : "text-white"
          }`}
        >
          <Compass className={`h-6 w-6 transition-colors ${scrolled ? "text-secondary" : "text-secondary"}`} />
          Meridian
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-heading text-sm font-medium transition-colors hover:text-secondary ${
                scrolled ? "text-charcoal" : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-heading text-sm font-medium transition-all min-h-[44px] ${
              scrolled
                ? "bg-secondary text-white hover:bg-secondary/90"
                : "bg-white/15 text-white border border-white/20 hover:bg-white/25 backdrop-blur-sm"
            }`}
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden flex items-center justify-center h-11 w-11 rounded-lg transition-colors ${
            scrolled
              ? "text-charcoal hover:bg-cloud"
              : "text-white hover:bg-white/10"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className={`md:hidden border-t ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-silver"
            : "bg-primary/95 backdrop-blur-md border-white/10"
        }`}>
          <div className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-heading text-base font-medium px-3 py-3 rounded-lg transition-colors min-h-[44px] flex items-center ${
                  scrolled
                    ? "text-charcoal hover:text-secondary hover:bg-cloud"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-secondary px-5 py-3 font-heading text-base font-medium text-white hover:bg-secondary/90 transition-colors min-h-[44px]"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

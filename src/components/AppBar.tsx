"use client";

import { FileText, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const AppBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full sticky top-0 z-50 bg-(--appbar-bg) border-b border-(--appbar-border) shadow-(--appbar-shadow) transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between py-3">

        {/* ── Brand ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-accent" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            PDF{" "}
            <span className="text-accent">Lab</span>
            <span className="ml-2 text-xs font-normal text-foreground-muted">by Hanz</span>
          </span>
        </div>

        {/* ── Theme toggle ────────────────────────────────────────────── */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          className="rounded-full p-2 cursor-pointer transition-colors duration-200 bg-surface-elevated border border-border text-foreground-muted hover:text-foreground"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

      </div>
    </header>
  );
};

export default AppBar;

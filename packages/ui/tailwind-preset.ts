import type { Config } from "tailwindcss";

/** Shared Tailwind preset for every TemuNiaga app — consume via `presets: [require("@temuniaga/ui/tailwind-preset")]`. */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9f0",
          100: "#dcf0dc",
          500: "#2e7d32",
          600: "#256628",
          700: "#1b4d1e",
          900: "#0f2e11",
        },
      },
    },
  },
};

export default preset;

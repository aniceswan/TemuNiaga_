import type { Config } from "tailwindcss";

/**
 * Shared Tailwind preset for every TemuNiaga app — consume via
 * `presets: [require("@temuniaga/ui/tailwind-preset")]`.
 *
 * Palette: deep moss green (trust, cooperative/agriculture) paired with a
 * warm harvest amber accent (CTAs, highlights), on warm "stone" neutrals
 * rather than cool grays — meant to read as grounded/agricultural rather
 * than generic SaaS.
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f7f2",
          100: "#dcebde",
          200: "#b9d7bf",
          300: "#8fbd99",
          400: "#5f9d70",
          500: "#3d7f50",
          600: "#2b6640",
          700: "#225235",
          800: "#1c422b",
          900: "#173624",
          950: "#0c1e14",
        },
        harvest: {
          50: "#fdf6ec",
          100: "#faeaca",
          200: "#f4d391",
          300: "#edb658",
          400: "#e69c33",
          500: "#d9821e",
          600: "#bd6518",
          700: "#984a18",
          800: "#7c3b19",
          900: "#663118",
          950: "#3a190b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)",
      },
    },
  },
};

export default preset;

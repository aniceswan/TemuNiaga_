import {
  COMMODITY_TERMS,
  NUMBER_WORDS,
  QUANTITY_PHRASES,
  UNIT_TO_KG,
  type QuantityPhrase,
} from "./dictionary";

export type { QuantityPhrase };
export { QUANTITY_PHRASES, COMMODITY_TERMS, NUMBER_WORDS, UNIT_TO_KG };

/**
 * Normalizes a local-dialect commodity/grade term to its canonical Bahasa
 * Indonesia name, e.g. "sampeu" -> "singkong". Returns the input unchanged
 * if no mapping exists (plan.md §16.4 rule 5: never guess).
 */
export function normalizeCommodityTerm(text: string): string {
  const key = text.trim().toLowerCase();
  return COMMODITY_TERMS[key] ?? text;
}

/**
 * Parses a quantity phrase (numeric or local-dialect) into the internal
 * {quantity, unit} shape from plan.md §15, always normalized to kilograms.
 * Returns null when the phrase can't be confidently parsed — callers must
 * not fabricate a value (plan.md §16.4 anti-hallucination rule 5).
 */
export function normalizeQuantity(text: string): QuantityPhrase | null {
  const raw = text.trim().toLowerCase();
  if (!raw) return null;

  const literal = QUANTITY_PHRASES[raw];
  if (literal) return { ...literal };

  // "<digits> <unit>", e.g. "200 kg", "2 kuintal", "1.5 ton"
  const numericMatch = raw.match(/^([\d.,]+)\s*([a-z]+)$/);
  if (numericMatch) {
    const amount = Number.parseFloat(numericMatch[1]!.replace(",", "."));
    const unitWord = numericMatch[2]!;
    const factor = UNIT_TO_KG[unitWord];
    if (!Number.isNaN(amount) && factor !== undefined) {
      return { quantity: amount * factor, unit: "kg" };
    }
  }

  // "<number word> <unit word>", e.g. "dua kuintal", "lima kilo"
  const wordMatch = raw.match(/^([a-z]+)\s+([a-z]+)$/);
  if (wordMatch) {
    const numberWord = wordMatch[1]!;
    const unitWord = wordMatch[2]!;
    const number = NUMBER_WORDS[numberWord];
    const factor = UNIT_TO_KG[unitWord];
    if (number !== undefined && factor !== undefined) {
      return { quantity: number * factor, unit: "kg" };
    }
  }

  return null;
}

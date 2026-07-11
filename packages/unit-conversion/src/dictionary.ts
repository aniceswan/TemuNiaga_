// Local-dialect lexicon transcribed from plan.md §15 "Kamus lokal".
// Extend this table as new pilot regions / dialects are added (plan.md §15 phases).

export interface QuantityPhrase {
  quantity: number;
  unit: string;
}

/** Literal local-dialect quantity phrases -> canonical {quantity, unit} in kg. */
export const QUANTITY_PHRASES: Record<string, QuantityPhrase> = {
  sakintal: { quantity: 100, unit: "kg" },
  "dua kuintal": { quantity: 200, unit: "kg" },
};

/** Local-dialect commodity/grade terms -> canonical Bahasa Indonesia term. */
export const COMMODITY_TERMS: Record<string, string> = {
  sampeu: "singkong",
  pare: "padi",
  "gabah garing": "gabah kering",
};

/** Indonesian cardinal number words, 1-10 (extend as needed). */
export const NUMBER_WORDS: Record<string, number> = {
  satu: 1,
  dua: 2,
  tiga: 3,
  empat: 4,
  lima: 5,
  enam: 6,
  tujuh: 7,
  delapan: 8,
  sembilan: 9,
  sepuluh: 10,
};

/** Unit words and their conversion factor into kilograms. */
export const UNIT_TO_KG: Record<string, number> = {
  kg: 1,
  kilo: 1,
  kilogram: 1,
  kuintal: 100,
  ton: 1000,
};

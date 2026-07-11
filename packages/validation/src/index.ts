import { z } from "zod";

/** 16-digit Indonesian NIK. Source data may mask digits with "*" for privacy. */
export const nikSchema = z
  .string()
  .regex(/^[0-9*]{16}$/, "NIK must be 16 digits (or masked with *)");

/** kode_wilayah format observed across db_export, e.g. "11.01.03.2016". */
export const kodeWilayahSchema = z
  .string()
  .regex(/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/, "kode_wilayah must match NN.NN.NN.NNNN");

/** Indonesian phone number, with or without country code / leading 0. */
export const phoneSchema = z
  .string()
  .regex(/^(\+62|62|0)8[0-9]{7,12}$/, "must be a valid Indonesian phone number");

export type Nik = z.infer<typeof nikSchema>;
export type KodeWilayah = z.infer<typeof kodeWilayahSchema>;
export type Phone = z.infer<typeof phoneSchema>;

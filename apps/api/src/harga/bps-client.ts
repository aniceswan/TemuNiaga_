import { BadRequestException, ServiceUnavailableException } from "@nestjs/common";

// webapi.bps.go.id URL pattern confirmed via search (direct doc fetch was
// blocked in the dev environment): /v1/api/list/model/data/lang/{lang}/
// domain/{domain}/var/{var}/key/{key}. `domain` and `var` are BPS-specific
// dataset IDs the user picks per commodity/region from their BPS account --
// they are NOT hardcoded here, they're passed in per call.
const BPS_BASE_URL = "https://webapi.bps.go.id/v1/api/list/model/data/lang/ind";

interface BpsDataResponse {
  status: string;
  "data-availability"?: string;
  datacontent?: Record<string, number>;
  [key: string]: unknown;
}

export interface BpsFetchParams {
  domain: string;
  varId: string;
  /** BPS year-id ("th"), required by webapi for model=data queries -- e.g. "123" = 2023. */
  th: string;
}

// webapi.bps.go.id sits behind a WAF that blocks requests without a
// browser-like User-Agent (returns an HTML "Perimeter WAF Block" page
// instead of JSON) -- found by testing with a real key and comparing a
// bare fetch() against curl with -A set.
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

export async function fetchBpsSeries({ domain, varId, th }: BpsFetchParams): Promise<number[]> {
  const apiKey = process.env.BPS_API_KEY;
  if (!apiKey) {
    throw new BadRequestException(
      "BPS_API_KEY belum dikonfigurasi -- isi di apps/api/.env (lihat .env.example)",
    );
  }

  const url = `${BPS_BASE_URL}/domain/${domain}/var/${varId}/th/${th}/key/${apiKey}`;
  let response: Response;
  try {
    response = await fetch(url, { headers: { "User-Agent": BROWSER_USER_AGENT } });
  } catch (err) {
    throw new ServiceUnavailableException(`Gagal menghubungi BPS webapi: ${(err as Error).message}`);
  }
  if (!response.ok) {
    throw new ServiceUnavailableException(`BPS webapi mengembalikan status ${response.status}`);
  }

  let body: BpsDataResponse;
  try {
    body = (await response.json()) as BpsDataResponse;
  } catch {
    throw new ServiceUnavailableException(
      "BPS webapi mengembalikan respons non-JSON (kemungkinan diblokir WAF atau domain/var/th salah)",
    );
  }
  if (body.status !== "OK" || !body.datacontent) {
    throw new ServiceUnavailableException(
      `BPS webapi: data tidak tersedia (status=${body.status}, availability=${body["data-availability"]})`,
    );
  }

  const values = Object.values(body.datacontent).filter(
    (v): v is number => typeof v === "number" && Number.isFinite(v),
  );
  if (values.length === 0) {
    throw new ServiceUnavailableException("BPS webapi: datacontent kosong untuk domain/var ini");
  }
  return values;
}

export function summarize(values: number[]): { min: number; median: number; max: number } {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
  return { min: sorted[0]!, median, max: sorted[sorted.length - 1]! };
}

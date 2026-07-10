import { AppShell, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";
import { MOCK_RFQS } from "@temuniaga/contracts";

export default function BuyerPortalHomePage() {
  return (
    <AppShell appName="Buyer Portal">
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">RFQ &amp; Procurement</h1>
      <p className="mb-6 max-w-2xl text-sm text-neutral-500">
        Fase 4+ — RFQ, supplier discovery, kontrak, dan pembayaran belum terhubung ke data transaksi nyata. Daftar di
        bawah adalah contoh statis untuk keperluan demo.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_RFQS.map((rfq) => (
          <Card key={rfq.id}>
            <CardHeader>
              <CardTitle className="text-base">{rfq.commodity}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-neutral-500">
              <p>
                {rfq.quantity.toLocaleString("id-ID")} {rfq.unit} &middot; MOQ {rfq.moq.toLocaleString("id-ID")}{" "}
                {rfq.unit}
              </p>
              <p>Target: Rp{rfq.targetPrice.toLocaleString("id-ID")}/{rfq.unit}</p>
              <p>{rfq.region}</p>
              <span className="mt-2 inline-block rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                {rfq.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

import { Badge, AppShell, Card, CardContent, CardHeader, CardTitle } from "@temuniaga/ui";
import { MOCK_RFQS } from "@temuniaga/contracts";
import { SiteNav } from "../../components/site-nav";

export default function BuyerPortalHomePage() {
  return (
    <AppShell appName="Buyer Portal" nav={<SiteNav />}>
      <h1 className="mb-1 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
        RFQ &amp; Procurement
      </h1>
      <p className="mb-6 max-w-2xl text-sm text-stone-500 dark:text-stone-400">
        Fase 4+ — RFQ, supplier discovery, kontrak, dan pembayaran belum terhubung ke data transaksi nyata. Daftar
        di bawah adalah contoh statis untuk keperluan demo.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_RFQS.map((rfq) => (
          <Card key={rfq.id}>
            <CardHeader>
              <CardTitle className="text-base normal-case tracking-normal text-stone-900 dark:text-stone-100">
                {rfq.commodity}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm text-stone-500 dark:text-stone-400">
              <p>
                {rfq.quantity.toLocaleString("id-ID")} {rfq.unit} &middot; MOQ {rfq.moq.toLocaleString("id-ID")}{" "}
                {rfq.unit}
              </p>
              <p>
                Target: Rp{rfq.targetPrice.toLocaleString("id-ID")}/{rfq.unit}
              </p>
              <p>{rfq.region}</p>
              <Badge tone="harvest" className="mt-1">
                {rfq.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

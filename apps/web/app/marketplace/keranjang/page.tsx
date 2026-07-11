import { AppShell } from "@temuniaga/ui";
import { SiteNav } from "../../../components/site-nav";
import { CartCheckout } from "./cart-checkout";

export default function KeranjangPage() {
  return (
    <AppShell appName="Keranjang" nav={<SiteNav />}>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">Keranjang Belanja</h1>
      <CartCheckout />
    </AppShell>
  );
}

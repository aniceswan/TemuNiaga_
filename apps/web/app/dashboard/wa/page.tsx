import { AppShell } from "@temuniaga/ui";
import { SiteNav } from "../../../components/site-nav";
import { getKoperasiList } from "../../../lib/api";
import { WaRegisterForm } from "./wa-register-form";

const WA_BOT_PHONE = process.env.NEXT_PUBLIC_WA_BOT_PHONE ?? "62895631549040";

export default async function WaRegistrationPage() {
  const { items: koperasiList } = await getKoperasiList(100);

  return (
    <AppShell appName="Registrasi WhatsApp" nav={<SiteNav />}>
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
        Registrasi Nomor WhatsApp
      </h1>

      <div className="mb-6 rounded-xl2 border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
          Chat langsung bot TemuNiaga:
        </p>
        <a
          href={`https://wa.me/${WA_BOT_PHONE}?text=${encodeURIComponent("Halo TemuNiaga")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          {WA_BOT_PHONE} →
        </a>
      </div>

      <div className="max-w-lg">
        <WaRegisterForm koperasiList={koperasiList} />
      </div>
    </AppShell>
  );
}

export const dynamic = "force-dynamic";

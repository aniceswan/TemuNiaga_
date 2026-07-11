import { AppShell } from "@temuniaga/ui";
import { SiteNav } from "../../../components/site-nav";
import { getKoperasiList } from "../../../lib/api";
import { WaRegisterForm } from "./wa-register-form";

export default async function WaRegistrationPage() {
  const { items: koperasiList } = await getKoperasiList(100);

  return (
    <AppShell appName="Registrasi WhatsApp" nav={<SiteNav />}>
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
        Registrasi Nomor WhatsApp
      </h1>
      <div className="max-w-lg">
        <WaRegisterForm koperasiList={koperasiList} />
      </div>
    </AppShell>
  );
}

export const dynamic = "force-dynamic";

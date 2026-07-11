import { Suspense } from "react";
import { AppShell } from "@temuniaga/ui";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <AppShell appName="Masuk">
      <div className="mx-auto max-w-sm">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </AppShell>
  );
}

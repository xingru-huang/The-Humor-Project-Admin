"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AmbientCanvas } from "@/components/editorial-ui";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleLogin = async () => {
    const supabase = createBrowserClient(
      `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <AmbientCanvas>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="relative w-full max-w-[32rem]">
          <div className="login-glow login-glow-a" />
          <div className="login-glow login-glow-b" />
          <div className="login-shell login-card-enter relative overflow-hidden rounded-[2rem] px-7 py-8 sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute inset-x-12 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_72%)]" />
            <div className="relative max-w-[25rem]">
              <p className="login-enter login-enter-1 text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[var(--ink-faint)] sm:text-[0.72rem]">
                Private workspace
              </p>
              <h1 className="display-title login-enter login-enter-2 mt-6 text-[3.4rem] leading-[0.92] sm:text-[4.6rem]">
                The Humor Project
              </h1>
              <p className="login-enter login-enter-3 mt-3 text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[var(--ink-faint)] sm:text-[0.78rem]">
                Admin
              </p>
            </div>
            <p className="body-copy login-enter login-enter-4 mt-5 max-w-sm text-base leading-7">
              Sign in to manage images, captions, and accounts.
            </p>

            {error === "unauthorized" && (
              <div className="alert-error mt-6">
                Access denied. Superadmin privileges required.
              </div>
            )}

            {error === "auth_failed" && (
              <div className="alert-error mt-6">
                Authentication failed. Please try again.
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              className="login-enter login-enter-5 mt-10 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-[var(--line)] bg-white px-6 py-4 text-base font-medium text-[var(--ink)] shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--line-strong)]"
            >
              <svg className="h-[20px] w-[20px]" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </AmbientCanvas>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AmbientCanvas>
          <div className="flex min-h-screen items-center justify-center">
            <div className="login-shell rounded-[1.5rem] px-8 py-6">
              <p className="body-copy text-sm">Loading...</p>
            </div>
          </div>
        </AmbientCanvas>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

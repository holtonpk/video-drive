"use client";

import * as React from "react";
import localFont from "next/font/local";
import {
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
  type User,
} from "firebase/auth";
import {auth, sendEmailCode, verifyEmailCode} from "@/lib/firebase-auth-gate";
import {getFunctions, httpsCallable} from "firebase/functions";

type AuthGateContextValue = {
  locked: boolean;
};

const AuthGateContext = React.createContext<AuthGateContextValue>({
  locked: true,
});

export const useAuthGate = () => React.useContext(AuthGateContext);

const h1Font = localFont({
  src: "../../fonts/HeadingNow-56Bold.ttf",
});

const bigFontTest = localFont({
  src: "../../fonts/HeadingNow-57Extrabold.ttf",
});

const bodyFont = localFont({
  src: "../../fonts/proximanova_light.otf",
});

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function callableErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as {message?: string}).message;
    if (typeof m === "string" && m.length > 0) return m;
  }
  return "Something went wrong. Please try again.";
}

type Step = "email" | "code";

export function AuthGate({children}: {children: React.ReactNode}) {
  const [mounted, setMounted] = React.useState(false);
  const [authResolved, setAuthResolved] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  const [step, setStep] = React.useState<Step>("email");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    setMounted(true);

    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthResolved(true);
    });

    return () => unsub();
  }, []);

  const locked = authResolved && !user;

  React.useEffect(() => {
    if (!mounted || !authResolved) return;

    if (locked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [locked, mounted, authResolved]);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const normalized = email.trim().toLowerCase();

    if (!isValidEmail(normalized)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await sendEmailCode({email: normalized});
      setStep("code");
      setEmail(normalized);
      setMessage("Code sent. Check your email.");
    } catch (err: unknown) {
      setError(callableErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const digits = code.replace(/\D/g, "");
    if (digits.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    try {
      setLoading(true);
      const result = await verifyEmailCode({
        email,
        code: digits,
      });

      const token = result.data.token;
      await signInWithCustomToken(auth, token);
    } catch (err: unknown) {
      setError(callableErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (!mounted || !authResolved) {
    return <div className="min-h-screen bg-[#121212]" />;
  }

  return (
    <AuthGateContext.Provider value={{locked}}>
      <div className="relative min-h-screen">
        <div
          aria-hidden={locked}
          className={
            locked
              ? "pointer-events-none select-none blur-md transition duration-200"
              : "transition duration-200"
          }
        >
          {children}
        </div>

        {locked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171717] p-6 shadow-2xl">
            <div className="mb-2">
              <h2
                className={`${h1Font.className} text-2xl font-semibold text-white`}
              >
                View Launch Library
              </h2>
              <p className={`${bodyFont.className} text-sm text-white/70`}>
                Enter your email and we&apos;ll send you a verification code.
              </p>
            </div>

            {step === "email" ? (
              <form onSubmit={handleSendCode} className="mt-4 space-y-4">
                <div>
                  <input
                    id="launch-library-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/35 focus:border-white/25"
                  />
                </div>

                {error ? <p className="text-sm text-red-400">{error}</p> : null}
                {message ? (
                  <p className="text-sm text-green-400">{message}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className={`${bigFontTest.className} w-full bg-theme-color1 text-background text-2xl rounded-[8px] py-1.5 px-4 font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:bg-primary hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background disabled:opacity-50`}
                >
                  {loading ? "Sending..." : "Send code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="launch-library-code"
                    className={`${bodyFont.className} mb-2 block text-sm text-white/80`}
                  >
                    Verification code
                  </label>
                  <input
                    id="launch-library-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="123456"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-center font-mono text-lg tracking-[0.35em] text-white outline-none placeholder:text-white/35 focus:border-white/25"
                  />
                </div>

                <p className={`${bodyFont.className} text-sm text-white/55`}>
                  Sent to <span className="text-white/85">{email}</span>
                </p>

                {error ? <p className="text-sm text-red-400">{error}</p> : null}
                {message ? (
                  <p className="text-sm text-green-400">{message}</p>
                ) : null}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setCode("");
                      setError("");
                      setMessage("");
                    }}
                    className={`${bodyFont.className} flex-1 rounded-xl border border-white/10 px-4 py-3 text-white transition hover:bg-white/5`}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`${bigFontTest.className} flex-1 bg-theme-color1 text-background text-xl rounded-[8px] py-2 px-4 font-medium transition-all duration-200 hover:bg-primary hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background disabled:opacity-50`}
                  >
                    {loading ? "Verifying..." : "Continue"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        )}
      </div>
    </AuthGateContext.Provider>
  );
}

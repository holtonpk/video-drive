"use client";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "./otp";

import * as React from "react";
import localFont from "next/font/local";
import {
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
  type User,
} from "firebase/auth";
import {auth, sendEmailCode, verifyEmailCode} from "@/lib/firebase-auth-gate";
import {FirebaseError} from "firebase/app";
import axios from "axios";

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
function getErrorDetails(err: unknown) {
  if (err instanceof FirebaseError) {
    return {
      name: err.name,
      code: err.code,
      message: err.message,
      customData: err.customData,
      stack: err.stack,
    };
  }

  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }

  if (err && typeof err === "object") {
    return JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
  }

  return {
    message: String(err),
  };
}

async function notifyNewSignIn(userEmail: string) {
  try {
    await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: "service_w1ofllp",
        template_id: "template_nzs9kug",
        user_id: "_xxtFZFU5RPJivl-9",
        template_params: {user_email: userEmail},
        accessToken: "rIezh-MOZPAh3KEMZWpa_",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: unknown) {
    logCallableError("Launch Library sign-in notification failed", err);
  }
}

function logCallableError(label: string, err: unknown) {
  const details = getErrorDetails(err);

  console.group(`🚨 ${label}`);
  console.error("Raw error:", err);
  console.log("Parsed error:", details);

  try {
    console.log("JSON:", JSON.stringify(details, null, 2));
  } catch {
    console.log("Could not stringify error details.");
  }

  console.groupEnd();
}

type Step = "email" | "code";

const RESEND_SECONDS = 60;

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
  const [resendSecondsLeft, setResendSecondsLeft] = React.useState(0);

  React.useEffect(() => {
    setMounted(true);

    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthResolved(true);
    });

    return () => unsub();
  }, []);

  React.useEffect(() => {
    if (resendSecondsLeft <= 0) return;

    const timer = window.setTimeout(() => {
      setResendSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendSecondsLeft]);

  const locked = authResolved && !user;

  const logout = React.useCallback(async () => {
    try {
      await signOut(auth);
      setError("");
      setMessage("");
      setStep("email");
      setCode("");
      setResendSecondsLeft(0);
    } catch (err: unknown) {
      logCallableError("Launch Library sign out failed", err);
    }
  }, []);

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
      setResendSecondsLeft(RESEND_SECONDS);
    } catch (err: unknown) {
      setError(callableErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (loading || resendSecondsLeft > 0) return;

    setError("");
    setMessage("");

    const normalized = email.trim().toLowerCase();

    if (!isValidEmail(normalized)) {
      setError("Please enter a valid email address.");
      setStep("email");
      return;
    }

    try {
      setLoading(true);

      console.log("Resending verification code:", {
        email: normalized,
      });

      const result = await sendEmailCode({email: normalized});

      console.log("resend sendEmailCode result:", result.data);

      setEmail(normalized);
      setCode("");
      setMessage("New code sent. Check your email.");
      setResendSecondsLeft(RESEND_SECONDS);
    } catch (err: unknown) {
      logCallableError("Launch Library resend code failed", err);
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
      void notifyNewSignIn(email);
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
            <div
              className={`w-full max-w-md rounded-2xl border border-white/10 bg-[#1A1A1A] p-6 shadow-2xl overflow-hidden relative
              ${step === "email" ? "pt-[250px] h-[450px]" : "pt-6 h-fit"}
              `}
            >
              {step === "email" ? (
                <>
                  <video
                    src="https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/locked%20(auth%20video).webm?alt=media&token=a54d5860-a6a6-46f8-8100-698aedd103d8"
                    className="w-[500px] max-w-none aspect-video z-10 absolute -top-[20px] left-1/2 -translate-x-1/2"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />

                  <div className="mb-2 relative z-20 text-center">
                    <h2
                      className={`${h1Font.className} text-2xl font-semibold text-white`}
                    >
                      Enter your email for unlimited access
                    </h2>
                    <p
                      className={`${bodyFont.className} text-sm text-white/70`}
                    >
                      Don&apos;t worry it&apos;s free
                    </p>
                  </div>
                  <form onSubmit={handleSendCode} className="mt-4 space-y-4">
                    <div>
                      <input
                        id="launch-library-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white caret-white outline-none ring-0 placeholder:text-white/35 focus:border-white/25"
                      />
                    </div>

                    {error ? (
                      <p className="text-sm text-red-400">{error}</p>
                    ) : null}
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
                </>
              ) : (
                <form onSubmit={handleVerifyCode} className="mt-4 space-y-4">
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <h1
                        className={`${h1Font.className} text-center block text-3xl text-white`}
                      >
                        Enter Verification code
                      </h1>

                      <p
                        className={`${bodyFont.className} text-center text-sm text-white/55`}
                      >
                        We emailed a verification code to{" "}
                        <span className="text-white/85">{email}</span>
                      </p>
                    </div>
                    {/* <input
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
                  /> */}
                    <div className="w-fit">
                      <InputOTP
                        maxLength={6}
                        pattern={"^[a-zA-Z0-9]+$"}
                        value={code}
                        onChange={(value: string) => {
                          setCode(value.replace(/\D/g, "").slice(0, 6));
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>

                        <InputOTPSeparator />

                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  <p
                    className={`${bodyFont.className} text-center text-sm text-white/55`}
                  >
                    Didn&apos;t receive the code?{" "}
                    {resendSecondsLeft > 0 ? (
                      <span className="text-white/55">
                        Resend available in {resendSecondsLeft}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={loading}
                        className="text-white/85 underline underline-offset-4 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? "Sending..." : "Resend"}
                      </button>
                    )}
                  </p>

                  {error ? (
                    <p className="text-sm text-red-400 w-fit mx-auto text-center">
                      {error}
                    </p>
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

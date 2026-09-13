import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createAccount, login } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "usCard — Create Account or Sign In to Buy Top Up Cards" },
      {
        name: "description",
        content:
          "Create your usCard account first, then sign in to buy Free Fire, BGMI and other game top up cards for $5 or $10.",
      },
      { property: "og:title", content: "usCard — Secure Account Access" },
      {
        property: "og:description",
        content: "Create an account and buy game top up cards from $5 to $10 with Binance or UPI.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [suggestSignup, setSuggestSignup] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const passwordOk = password.length >= 4 && password.length <= 8;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSuggestSignup(false);

    if (!passwordOk) {
      setError("Password must be between 4 and 8 characters.");
      return;
    }

    if (mode === "signup") {
      const res = createAccount({ name: name.trim(), email: email.trim(), password });
      if (!res.ok) {
        setError(res.error ?? "Could not create the account.");
        return;
      }
      setMode("login");
      setPassword("");
      setInfo("Account created. Now sign in with the same email and password.");
      return;
    }

    const res = login(email.trim(), password);
    if (!res.ok) {
      if (res.error === "no-account") {
        setError("No account found with this email.");
        setSuggestSignup(true);
      } else {
        setError(res.error ?? "Sign in failed.");
      }
      return;
    }
    navigate({ to: "/cards" });
  }

  return (
    <div className="min-h-screen">
      <div className="fixed left-[5%] top-7 text-2xl font-extrabold tracking-tight">
        us<span className="text-primary">Card</span>
      </div>

      <main className="mx-auto grid min-h-screen w-[92%] max-w-[1050px] items-center gap-16 py-28 md:grid-cols-2">
        <section>
          <h1 className="text-4xl font-bold md:text-5xl">
            {mode === "signup" ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {mode === "signup"
              ? "New users must create an account before signing in."
              : "Sign in to buy game top up cards."}
          </p>

          <div className="glass-card mt-8 rounded-3xl p-8">
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-border p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setSuggestSignup(false);
                }}
                className={
                  mode === "signup"
                    ? "gold-gradient rounded-lg py-2 text-sm font-bold text-primary-foreground"
                    : "rounded-lg py-2 text-sm font-bold text-muted-foreground"
                }
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={
                  mode === "login"
                    ? "gold-gradient rounded-lg py-2 text-sm font-bold text-primary-foreground"
                    : "rounded-lg py-2 text-sm font-bold text-muted-foreground"
                }
              >
                Sign In
              </button>
            </div>

            <form onSubmit={submit}>
              {mode === "signup" && (
                <>
                  <label className="mb-2 block text-xs text-muted-foreground">Full name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={60}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-border bg-input px-4 py-3.5 outline-none focus:border-primary"
                  />
                </>
              )}

              <label className="mb-2 mt-5 block text-xs text-muted-foreground">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                autoComplete="username"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-input px-4 py-3.5 outline-none focus:border-primary"
              />

              <label className="mb-2 mt-5 block text-xs text-muted-foreground">
                Password (4–8 characters)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                maxLength={8}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="Min 4, max 8"
                className="w-full rounded-xl border border-border bg-input px-4 py-3.5 outline-none focus:border-primary"
              />

              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
              {suggestSignup && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setSuggestSignup(false);
                  }}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  Create an account with this email →
                </button>
              )}
              {info && <p className="mt-4 text-sm text-primary">{info}</p>}

              <button
                type="submit"
                className="gold-gradient mt-6 w-full rounded-xl py-3.5 font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              🔒 Accounts are stored on this device for the demo.
            </p>
          </div>
        </section>

        <div className="hidden justify-center md:flex">
          <div className="plastic-gradient h-[220px] w-[360px] -rotate-6 rounded-3xl border border-border p-7 shadow-[var(--shadow-lift)]">
            <div className="font-semibold tracking-wide">CARDBUY</div>
            <div className="gold-gradient my-5 h-9 w-12 rounded-md" />
            <div className="tracking-[4px] text-muted-foreground">•••• •••• •••• 4288</div>
            <div className="mt-7 text-right text-2xl font-extrabold text-primary">TOP UP</div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CardBuy — Secure Login to the Premium Card Marketplace" },
      {
        name: "description",
        content:
          "Sign in to CardBuy to browse premium gift, gaming and shopping cards and buy instantly from $5 to $10.",
      },
      { property: "og:title", content: "CardBuy — Secure Login" },
      {
        property: "og:description",
        content: "Access your premium card marketplace securely and buy cards from $5 to $10.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <div className="fixed left-[5%] top-7 text-2xl font-extrabold tracking-tight">
        Card<span className="text-primary">Buy</span>
      </div>

      <main className="mx-auto grid min-h-screen w-[92%] max-w-[1050px] items-center gap-16 py-28 md:grid-cols-2">
        <section>
          <h1 className="text-4xl font-bold md:text-5xl">Welcome Back</h1>
          <p className="mt-3 text-muted-foreground">
            Access your premium card marketplace securely.
          </p>

          <div className="glass-card mt-8 rounded-3xl p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/cards" });
              }}
            >
              <label className="mb-2 mt-1 block text-xs text-muted-foreground">
                Email or Mobile Number
              </label>
              <input
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                required
                autoComplete="username"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-input px-4 py-3.5 text-foreground outline-none focus:border-primary"
              />

              <label className="mb-2 mt-5 block text-xs text-muted-foreground">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={6}
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full rounded-xl border border-border bg-input px-4 py-3.5 text-foreground outline-none focus:border-primary"
              />

              <div className="my-5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">🔒 Secure login</span>
                <button
                  type="button"
                  onClick={() => setNotice("Password reset flow goes here.")}
                  className="text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="gold-gradient w-full rounded-xl py-3.5 font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                SIGN IN
              </button>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                New to CardBuy?{" "}
                <Link to="/cards" className="text-primary hover:underline">
                  Create Account
                </Link>
              </p>
            </form>

            {notice && <p className="mt-4 text-center text-xs text-primary">{notice}</p>}

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Demo UI — connect a secure backend authentication API for real login.
            </p>
          </div>
        </section>

        <div className="hidden justify-center md:flex">
          <div className="plastic-gradient h-[220px] w-[360px] -rotate-6 rounded-3xl border border-border p-7 shadow-[var(--shadow-lift)]">
            <div className="font-semibold tracking-wide">CARDBUY</div>
            <div className="gold-gradient my-5 h-9 w-12 rounded-lg" />
            <div className="tracking-[4px] text-muted-foreground">•••• •••• •••• 4288</div>
            <div className="mt-7 text-right text-2xl font-extrabold text-primary">PREMIUM</div>
          </div>
        </div>
      </main>
    </div>
  );
}

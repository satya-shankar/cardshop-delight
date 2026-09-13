import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CARDS, PAYMENT, type TopUpCard } from "@/lib/cards";
import { addOrder, getSession, inr, signOut } from "@/lib/store";

export const Route = createFileRoute("/cards")({
  head: () => ({
    meta: [
      { title: "Game Top Up Cards — Free Fire, BGMI and More on usCard" },
      {
        name: "description",
        content:
          "Buy Free Fire, BGMI, PUBG and Valorant top up cards for $5 or $10 with Binance or UPI payment and fast manual verification.",
      },
      { property: "og:title", content: "Game Top Up Cards on usCard" },
      {
        property: "og:description",
        content: "Free Fire, BGMI and more top up cards at fixed $5 and $10 prices.",
      },
    ],
  }),
  component: CardsPage,
});

function CardsPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [selected, setSelected] = useState<TopUpCard | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate({ to: "/" });
      return;
    }
    setEmail(session);
  }, [navigate]);

  if (!email) return null;

  return (
    <div className="min-h-screen pb-24">
      <header className="mx-auto flex w-[92%] max-w-[1100px] flex-wrap items-center justify-between gap-4 py-8">
        <Link to="/cards" className="text-2xl font-extrabold tracking-tight">
          us<span className="text-primary">Card</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <span className="hidden text-muted-foreground sm:inline">{email}</span>
          <Link to="/orders" className="text-primary hover:underline">
            My orders
          </Link>
          <button
            onClick={() => {
              signOut();
              navigate({ to: "/" });
            }}
            className="text-primary hover:underline"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto w-[92%] max-w-[1100px]">
        <h1 className="text-3xl font-bold md:text-4xl">Choose your top up card</h1>
        <p className="mt-2 text-muted-foreground">
          Fixed prices in USD and INR. Pay with Binance or UPI, then admin verifies your payment.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <article key={card.id} className="glass-card rounded-3xl p-6">
              <div className="plastic-gradient rounded-2xl border border-border p-5">
                <div className="text-xs font-semibold tracking-widest text-primary">
                  {card.app.toUpperCase()}
                </div>
                <div className="gold-gradient my-4 h-8 w-11 rounded-md" />
                <div className="tracking-[3px] text-muted-foreground">TOP UP CARD</div>
              </div>

              <h2 className="mt-5 text-lg font-semibold">{card.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{card.detail}</p>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-xl font-extrabold text-primary">${card.usd}.00</div>
                  <div className="text-xs text-muted-foreground">₹{inr(card.usd)}</div>
                </div>
                <button
                  onClick={() => setSelected(card)}
                  className="gold-gradient rounded-xl px-5 py-2.5 text-sm font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Buy card
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {selected && (
        <Checkout card={selected} email={email} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function Checkout({
  card,
  email,
  onClose,
}: {
  card: TopUpCard;
  email: string;
  onClose: () => void;
}) {
  const [method, setMethod] = useState<"binance" | "upi">("binance");
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);

  const digits = reference.replace(/\D/g, "");

  function submit() {
    setError(null);
    if (method === "binance") {
      if (!/^\d{10,16}$/.test(reference.trim())) {
        setError("Binance Order ID must be 10 to 16 digits.");
        return;
      }
    } else if (!/^\d{12}$/.test(reference.trim())) {
      setError("UPI UTR number must be exactly 12 digits.");
      return;
    }

    addOrder({
      id: `CB${Date.now()}`,
      email,
      cardId: card.id,
      cardName: card.name,
      app: card.app,
      usd: card.usd,
      inr: inr(card.usd),
      method,
      reference: reference.trim(),
      createdAt: Date.now(),
      status: "pending",
    });
    setPlaced(true);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4">
      <div className="glass-card my-8 w-full max-w-md rounded-3xl bg-card p-7">
        {placed ? (
          <div className="text-center">
            <div className="text-3xl">⏳</div>
            <h2 className="mt-3 text-xl font-semibold">Payment pending verification</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your order is pending for up to 30 minutes. The card is delivered once the admin
              verifies your payment.
            </p>
            <Link
              to="/orders"
              className="gold-gradient mt-6 block rounded-xl py-3 font-extrabold text-primary-foreground"
            >
              View my orders
            </Link>
            <button onClick={onClose} className="mt-3 text-sm text-muted-foreground hover:underline">
              Keep shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{card.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {card.app} • {card.detail}
                </p>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-input px-4 py-3">
              <span className="text-sm text-muted-foreground">Amount to pay</span>
              <span className="text-right">
                <span className="block text-lg font-extrabold text-primary">${card.usd}.00</span>
                <span className="block text-xs text-muted-foreground">₹{inr(card.usd)}</span>
              </span>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">Payment method</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(["binance", "upi"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMethod(m);
                    setReference("");
                    setError(null);
                  }}
                  className={
                    method === m
                      ? "gold-gradient rounded-xl py-3 font-bold text-primary-foreground"
                      : "rounded-xl border border-border bg-input py-3 font-bold hover:border-primary"
                  }
                >
                  {m === "binance" ? "Binance" : "UPI"}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-border bg-input p-4 text-sm">
              {method === "binance" ? (
                <>
                  <p className="text-muted-foreground">Send the amount to this Binance ID:</p>
                  <p className="mt-1 font-bold text-primary">{PAYMENT.binanceId}</p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">Pay via UPI to:</p>
                  <p className="mt-1 font-bold text-primary">{PAYMENT.upiId}</p>
                  <div className="mt-3 grid h-32 place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                    UPI QR code will appear here
                  </div>
                </>
              )}
            </div>

            <label className="mb-2 mt-6 block text-xs text-muted-foreground">
              {method === "binance"
                ? "Binance Order ID (10–16 digits)"
                : "UPI UTR number (12 digits)"}
            </label>
            <input
              inputMode="numeric"
              value={reference}
              onChange={(e) => setReference(e.target.value.replace(/\D/g, "").slice(0, 16))}
              maxLength={16}
              placeholder={method === "binance" ? "1234567890" : "123456789012"}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 outline-none focus:border-primary"
            />
            <p className="mt-2 text-xs text-muted-foreground">{digits.length} digits entered</p>

            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

            <button
              onClick={submit}
              className="gold-gradient mt-5 w-full rounded-xl py-3.5 font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              SUBMIT PAYMENT
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              After submitting, the order stays pending for 30 minutes until admin verification.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

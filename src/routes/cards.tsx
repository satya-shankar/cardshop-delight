import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/cards")({
  head: () => ({
    meta: [
      { title: "Buy Cards — CardBuy Marketplace from $5 to $10" },
      {
        name: "description",
        content:
          "Browse gift, gaming, shopping, travel and prepaid cards on CardBuy and complete checkout instantly with $5, $7 or $10 options.",
      },
      { property: "og:title", content: "Buy Cards — CardBuy Marketplace" },
      {
        property: "og:description",
        content: "Gift, gaming, shopping and travel cards available from $5 to $10.",
      },
    ],
  }),
  component: CardsPage,
});

type CardItem = {
  id: string;
  name: string;
  type: string;
  tagline: string;
  digits: string;
};

const CARDS: CardItem[] = [
  {
    id: "gift",
    name: "Gift Card",
    type: "Gifting",
    tagline: "Redeemable at 2,000+ partner stores.",
    digits: "4288",
  },
  {
    id: "gaming",
    name: "Gaming Card",
    type: "Gaming",
    tagline: "Top up coins, skins and season passes.",
    digits: "9134",
  },
  {
    id: "shopping",
    name: "Shopping Card",
    type: "Retail",
    tagline: "Instant balance for online checkouts.",
    digits: "7712",
  },
  {
    id: "travel",
    name: "Travel Card",
    type: "Travel",
    tagline: "Multi-currency spending on the move.",
    digits: "5063",
  },
  {
    id: "streaming",
    name: "Streaming Card",
    type: "Entertainment",
    tagline: "Music, movies and premium subscriptions.",
    digits: "3390",
  },
  {
    id: "prepaid",
    name: "Prepaid Card",
    type: "Everyday",
    tagline: "Reloadable card for daily spending.",
    digits: "8821",
  },
];

const AMOUNTS = [5, 6, 7, 8, 9, 10];

function CardsPage() {
  const [selected, setSelected] = useState<CardItem | null>(null);
  const [amount, setAmount] = useState(5);
  const [done, setDone] = useState<string | null>(null);

  const openBuy = (card: CardItem) => {
    setSelected(card);
    setAmount(5);
    setDone(null);
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="mx-auto flex w-[92%] max-w-[1100px] items-center justify-between py-8">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          Card<span className="text-primary">Buy</span>
        </Link>
        <Link to="/" className="text-sm text-primary hover:underline">
          Sign out
        </Link>
      </header>

      <main className="mx-auto w-[92%] max-w-[1100px]">
        <h1 className="text-3xl font-bold md:text-4xl">Choose your card</h1>
        <p className="mt-2 text-muted-foreground">
          Every card is available from $5 to $10. Delivery is instant after checkout.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <article key={card.id} className="glass-card rounded-3xl p-6">
              <div className="plastic-gradient rounded-2xl border border-border p-5">
                <div className="text-xs font-semibold tracking-widest text-muted-foreground">
                  {card.type.toUpperCase()}
                </div>
                <div className="gold-gradient my-4 h-8 w-11 rounded-md" />
                <div className="tracking-[3px] text-muted-foreground">•••• {card.digits}</div>
              </div>

              <h2 className="mt-5 text-lg font-semibold">{card.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{card.tagline}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">$5 – $10</span>
                <button
                  onClick={() => openBuy(card)}
                  className="gold-gradient rounded-xl px-5 py-2.5 text-sm font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Buy now
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass-card w-full max-w-md rounded-3xl bg-card p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {done ? (
              <div className="text-center">
                <div className="text-3xl">✅</div>
                <h2 className="mt-3 text-xl font-semibold">Purchase confirmed</h2>
                <p className="mt-2 text-sm text-muted-foreground">{done}</p>
                <button
                  onClick={() => setSelected(null)}
                  className="gold-gradient mt-6 w-full rounded-xl py-3 font-extrabold text-primary-foreground"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold">Buy {selected.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selected.tagline}</p>

                <p className="mt-6 text-xs text-muted-foreground">Select amount</p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {AMOUNTS.map((value) => (
                    <button
                      key={value}
                      onClick={() => setAmount(value)}
                      className={
                        value === amount
                          ? "gold-gradient rounded-xl py-3 font-bold text-primary-foreground"
                          : "rounded-xl border border-border bg-input py-3 font-bold text-foreground hover:border-primary"
                      }
                    >
                      ${value}
                    </button>
                  ))}
                </div>

                <label className="mb-2 mt-6 block text-xs text-muted-foreground">
                  Delivery email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 outline-none focus:border-primary"
                />

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-xl font-extrabold text-primary">
                    ${amount}.00
                  </span>
                </div>

                <button
                  onClick={() =>
                    setDone(`${selected.name} worth $${amount}.00 will be delivered instantly.`)
                  }
                  className="gold-gradient mt-5 w-full rounded-xl py-3.5 font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  PAY ${amount}
                </button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Demo checkout — connect a payment provider to charge real cards.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

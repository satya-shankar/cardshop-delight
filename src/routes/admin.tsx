import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getOrders, setOrderStatus, type Order } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Verification — Approve Top Up Card Payments | CardBuy" },
      {
        name: "description",
        content:
          "Admin panel to review pending Binance and UPI payments and approve or reject top up card orders on CardBuy.",
      },
      { property: "og:title", content: "Admin Verification — CardBuy" },
      {
        property: "og:description",
        content: "Approve or reject pending top up card payments.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const refresh = () => setOrders(getOrders());

  return (
    <div className="min-h-screen pb-24">
      <header className="mx-auto flex w-[92%] max-w-[900px] items-center justify-between py-8">
        <Link to="/cards" className="text-2xl font-extrabold tracking-tight">
          Card<span className="text-primary">Buy</span> <span className="text-sm">Admin</span>
        </Link>
        <button onClick={refresh} className="text-sm text-primary hover:underline">
          Refresh
        </button>
      </header>

      <main className="mx-auto w-[92%] max-w-[900px]">
        <h1 className="text-3xl font-bold">Payment verification</h1>
        <p className="mt-2 text-muted-foreground">
          Check the Binance Order ID or UPI UTR, then approve to deliver the card.
        </p>

        {orders.length === 0 ? (
          <p className="glass-card mt-8 rounded-2xl p-8 text-center text-muted-foreground">
            No orders submitted yet.
          </p>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((o) => (
              <article key={o.id} className="glass-card rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">
                      {o.cardName} <span className="text-muted-foreground">({o.app})</span>
                    </h2>
                    <p className="text-sm text-muted-foreground">{o.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {o.method === "binance" ? "Binance Order ID" : "UPI UTR"}: {o.reference}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-primary">${o.usd}.00</div>
                    <div className="text-xs text-muted-foreground">₹{o.inr}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">Status: {o.status}</span>
                  {o.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setOrderStatus(o.id, "approved");
                          refresh();
                        }}
                        className="gold-gradient rounded-xl px-4 py-2 text-sm font-bold text-primary-foreground"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setOrderStatus(o.id, "rejected");
                          refresh();
                        }}
                        className="rounded-xl border border-border px-4 py-2 text-sm font-bold hover:border-destructive"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

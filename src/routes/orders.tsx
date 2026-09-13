import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getOrders, getSession, PENDING_MS, type Order } from "@/lib/store";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — Track Top Up Card Payment Status | usCard" },
      {
        name: "description",
        content:
          "Track your usCard top up card orders: pending verification, approved deliveries and payment references for Binance and UPI.",
      },
      { property: "og:title", content: "My Orders — usCard" },
      {
        property: "og:description",
        content: "Track pending and approved top up card orders on usCard.",
      },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate({ to: "/" });
      return;
    }
    setEmail(session);
    setOrders(getOrders().filter((o) => o.email === session));
    const timer = setInterval(() => {
      setNow(Date.now());
      setOrders(getOrders().filter((o) => o.email === session));
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  if (!email) return null;

  return (
    <div className="min-h-screen pb-24">
      <header className="mx-auto flex w-[92%] max-w-[900px] items-center justify-between py-8">
        <Link to="/cards" className="text-2xl font-extrabold tracking-tight">
          us<span className="text-primary">Card</span>
        </Link>
        <Link to="/cards" className="text-sm text-primary hover:underline">
          Buy more cards
        </Link>
      </header>

      <main className="mx-auto w-[92%] max-w-[900px]">
        <h1 className="text-3xl font-bold">My orders</h1>
        <p className="mt-2 text-muted-foreground">
          Payments stay pending for 30 minutes while the admin verifies them.
        </p>

        {orders.length === 0 ? (
          <p className="glass-card mt-8 rounded-2xl p-8 text-center text-muted-foreground">
            No orders yet.
          </p>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((o) => {
              const left = Math.max(0, o.createdAt + PENDING_MS - now);
              const mins = Math.floor(left / 60000);
              const secs = Math.floor((left % 60000) / 1000);
              return (
                <article key={o.id} className="glass-card rounded-2xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{o.cardName}</h2>
                      <p className="text-sm text-muted-foreground">
                        {o.app} • Order {o.id}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {o.method === "binance" ? "Binance Order ID" : "UPI UTR"}: {o.reference}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-primary">${o.usd}.00</div>
                      <div className="text-xs text-muted-foreground">₹{o.inr}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-sm">
                    <span
                      className={
                        o.status === "approved"
                          ? "text-primary"
                          : o.status === "rejected"
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }
                    >
                      {o.status === "approved"
                        ? "✅ Verified — card delivered"
                        : o.status === "rejected"
                          ? "❌ Payment not verified"
                          : "⏳ Pending admin verification"}
                    </span>
                    {o.status === "pending" && (
                      <span className="text-xs text-muted-foreground">
                        {mins}m {secs}s left in the 30 minute window
                      </span>
                    )}
                  </div>

                  {o.status === "approved" && (
                    <div className="mt-3 rounded-xl border border-border bg-input p-3 text-sm">
                      Card code:{" "}
                      <span className="font-bold tracking-widest text-primary">
                        {o.id.slice(-8)}-{o.reference.slice(-4)}
                      </span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Admin? Open <Link to="/admin" className="text-primary hover:underline">/admin</Link> to
          verify payments.
        </p>
      </main>
    </div>
  );
}

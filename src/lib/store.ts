export type Account = { email: string; password: string; name: string };

export type Order = {
  id: string;
  email: string;
  cardId: string;
  cardName: string;
  app: string;
  usd: number;
  inr: number;
  method: "binance" | "upi";
  reference: string;
  createdAt: number;
  status: "pending" | "approved" | "rejected";
};

const ACCOUNTS = "cardbuy_accounts";
const SESSION = "cardbuy_session";
const ORDERS = "cardbuy_orders";

export const PENDING_MS = 30 * 60 * 1000;
export const USD_TO_INR = 88;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const getAccounts = () => read<Account[]>(ACCOUNTS, []);

export function createAccount(account: Account): { ok: boolean; error?: string } {
  const accounts = getAccounts();
  if (accounts.some((a) => a.email.toLowerCase() === account.email.toLowerCase())) {
    return { ok: false, error: "This email already has an account. Please sign in." };
  }
  write(ACCOUNTS, [...accounts, account]);
  return { ok: true };
}

export function login(email: string, password: string): { ok: boolean; error?: string } {
  const accounts = getAccounts();
  const found = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!found) {
    return { ok: false, error: "no-account" };
  }
  if (found.password !== password) {
    return { ok: false, error: "Wrong password. Try again or create a new account." };
  }
  write(SESSION, found.email);
  return { ok: true };
}

export const getSession = () => read<string | null>(SESSION, null);
export const signOut = () => window.localStorage.removeItem(SESSION);

export const getOrders = () => read<Order[]>(ORDERS, []);

export function addOrder(order: Order) {
  write(ORDERS, [order, ...getOrders()]);
}

export function setOrderStatus(id: string, status: Order["status"]) {
  write(
    ORDERS,
    getOrders().map((o) => (o.id === id ? { ...o, status } : o)),
  );
}

export const inr = (usd: number) => usd * USD_TO_INR;

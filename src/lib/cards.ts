export type TopUpCard = {
  id: string;
  app: string;
  name: string;
  detail: string;
  usd: number;
};

export const CARDS: TopUpCard[] = [
  {
    id: "freefire-5",
    app: "Free Fire",
    name: "Free Fire Top Up Card",
    detail: "520 diamonds • instant delivery",
    usd: 5,
  },
  {
    id: "freefire-10",
    app: "Free Fire",
    name: "Free Fire Top Up Card",
    detail: "1080 diamonds • instant delivery",
    usd: 10,
  },
  {
    id: "bgmi-5",
    app: "BGMI",
    name: "BGMI Top Up Card",
    detail: "325 UC • instant delivery",
    usd: 5,
  },
  {
    id: "bgmi-10",
    app: "BGMI",
    name: "BGMI Top Up Card",
    detail: "700 UC • instant delivery",
    usd: 10,
  },
  {
    id: "cod-10",
    app: "Call of Duty Mobile",
    name: "COD Mobile Top Up Card",
    detail: "800 CP • instant delivery",
    usd: 10,
  },
  {
    id: "pubg-5",
    app: "PUBG Mobile Global",
    name: "PUBG Top Up Card",
    detail: "325 UC • instant delivery",
    usd: 5,
  },
  {
    id: "valorant-10",
    app: "Valorant Mobile",
    name: "Valorant Top Up Card",
    detail: "1000 VP • instant delivery",
    usd: 10,
  },
  {
    id: "clash-5",
    app: "Clash of Clans",
    name: "Clash of Clans Top Up Card",
    detail: "500 gems • instant delivery",
    usd: 5,
  },
];

export const PAYMENT = {
  binanceId: "REPLACE_BINANCE_ID",
  upiId: "REPLACE@UPI",
};

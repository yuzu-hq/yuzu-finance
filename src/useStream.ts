import { useState, useEffect } from "react";

type Side = { price: number; quantity: number };
type Agg = { symbol: string; close: number };

type UseStreamResult = {
  pending: boolean;
  prices: Record<string, Agg>;
};

export type StreamType = "1S";
export type SymbolType = "C" | "S" | "FUT";

type Stream = { t: SymbolType; s: string };

const initialPrice = {
  HEQ2: 118.4,
  ZCU2: 609.4,
  NQU2: 12565.0,
};

export default function useStream(streams: Stream[]): UseStreamResult {
  const symbols = streams
    .filter(({ t }) => t !== "FUT")
    .map(({ t, s }) => [t, "1S", s].join(":"));

  const url = `https://sse.yuzu.dev/sse?token=demo&streams=${symbols.join(
    ","
  )}`;

  const [prices, setPrices] = useState<Record<string, Agg>>({});

  useEffect(() => {
    const stream = new EventSource(url, { withCredentials: false });
    stream.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      setPrices((prev) => ({
        ...prev,
        [data.stream.split(":")[2]]: data,
      }));
    });

    const timer = setInterval(() => {
      streams
        .filter(({ t }) => t === "FUT")
        .map(({ s }) => s)
        .forEach((s) => {
          const rand =
            1 + (Math.random() / 120) * (Math.round(Math.random()) * 2 - 1);

          setPrices((prev) => ({
            ...prev,
            [s]: {
              stream: `FUT:1S:${s}`,
              close: (prev[s]?.close || initialPrice[s]) * rand,
            },
          }));
        });
    }, 3000);

    return () => {
      clearInterval(timer);
      stream.close();
      setPrices({});
    };
  }, [JSON.stringify(streams)]);

  return {
    pending: Object.keys(prices).length === 0,
    prices,
  };
}

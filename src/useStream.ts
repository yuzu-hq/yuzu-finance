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

    return () => {
      stream.close();
      setPrices({});
    };
  }, [JSON.stringify(streams)]);

  return {
    pending: Object.keys(prices).length === 0,
    prices,
  };
}

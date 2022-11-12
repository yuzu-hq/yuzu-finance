import { useEffect, useState } from "react";

type Agg = { symbol: string; close: number };

type UseStreamResult = {
  pending: boolean;
  prices: Record<string, Agg>;
};

export type StreamType = "1S";
export type SymbolType = "C" | "S" | "F";

type Stream = { t: SymbolType; s: string };

export default function useStream(streams: Stream[]): UseStreamResult {
  const symbols = streams.map(({ t, s }) => [t, "1S", s].join(":"));

  const url = `https://sse.yuzu.dev/sse?token=demo&streams=${symbols.join(",")}`;

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
  }, symbols);

  return {
    pending: Object.keys(prices).length === 0,
    prices,
  };
}

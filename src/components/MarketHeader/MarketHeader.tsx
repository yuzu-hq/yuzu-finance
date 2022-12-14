import { useQuery } from "@apollo/client";

import djs from "dayjs";
import { useState } from "react";

import { ChipButton, PriceChip } from "..";
import { crypto, forex, usEquities } from "../../queries";
import useStream, { SymbolType } from "../../useStream";

const buttons = ["U.S. Equities", "Crypto", "Forex"];

const today = djs().format("YYYY-MM-DD");
const TopSymbols = {
  "U.S. Equities": {
    query: usEquities,
    symbols: ["SPY", "VTI", "WMT"],
    aggregates: { limit: 1, before: `${today}` },
    streamType: "S" as SymbolType,
  },
  Crypto: {
    query: crypto,
    symbols: ["BTC-USD", "ETH-USD", "SOL-USD", "DOGE-USD"],
    aggregates: { limit: 1, before: `${today}` },
    streamType: "C" as SymbolType,
  },
  Forex: {
    query: forex,
    symbols: ["EUR-USD", "GBP-USD", "JPY-USD", "RUB-USD"],
    aggregates: { limit: 2, before: `${today}` },
    streamType: "F" as SymbolType,
  },
};

type EquityType = keyof typeof TopSymbols;

const MarketHeader = (): JSX.Element => {
  const [selectedButton, setSelectedButton] = useState<EquityType>(
    Object.keys(TopSymbols)[0] as keyof typeof TopSymbols
  );

  const [streamType, setStreamType] = useState(TopSymbols[selectedButton].streamType);

  const { prices } = useStream(
    TopSymbols[selectedButton].symbols.map((s) => ({
      t: TopSymbols[selectedButton].streamType,
      s,
    }))
  );

  const { query, symbols, aggregates } = TopSymbols[selectedButton as EquityType];
  const { loading: glLoading, data: glData } = useQuery(query, {
    variables: {
      input: { symbols },
      aggregatesInput: aggregates,
    },
  });

  return (
    <div className="w-full p-6 gap-y-4 overflow-x-scroll flex flex-col">
      <div className="flex flex-row items-center gap-x-3">
        <h3 className="font-semibold">At a glance:</h3>
        {buttons.map((button) => (
          <ChipButton
            key={button}
            name={button}
            selected={selectedButton === button}
            onSelected={(): void => {
              setSelectedButton(button as EquityType);
            }}
            setStreamType={setStreamType}
          />
        ))}
      </div>
      <div className="flex w-full overflow-x-scroll flex-row gap-x-3">
        {glLoading && (
          <>
            {new Array(4).fill(null).map((_, i) => (
              <div key={i} className="rounded bg-slate-200 h-12 w-32 rounded-lg animate-pulse border"></div>
            ))}
          </>
        )}
        {glData &&
          glData[Object.keys(glData)[0]].map(
            (sec: Record<string, unknown> /* Steve: will fix this at a later date */) => (
              <div key={sec.id as string}>
                <PriceChip
                  name={sec.name as string}
                  symbol={sec.symbol as string}
                  price={
                    prices[sec.symbol as string]?.close?.toString() ||
                    (sec.lastTrade as { price: string })?.price ||
                    (sec.currentRate as string)
                  }
                  lastPrice={(sec.aggregates as { close: string }[])[0].close}
                  streamType={streamType}
                />
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default MarketHeader;

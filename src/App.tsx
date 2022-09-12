import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { SearchBar, YuzuHeader, MarketHeader, WatchList } from "./components";
import { WatchListQuery, usEquities, crypto, forex } from "./queries";

import useStream from "./useStream";

import djs from "dayjs";

const today = djs().format("YYYY-MM-DD");

// const buttons = ["U.S. Equities", "Crypto", "Forex"];

const TopSymbols = {
  "U.S. Equities": {
    query: usEquities,
    symbols: ["SPY", "VTI", "SOND"],
    aggregates: { limit: 1, before: `${today}` },
  },
  Crypto: {
    query: crypto,
    symbols: ["BTC-USD", "ETH-USD", "SOL-USD", "DOGE-USD"],
    aggregates: { limit: 1, before: `${today}` },
  },
  Forex: {
    query: forex,
    symbols: ["EUR-USD", "GBP-USD", "JPY-USD", "RUB-USD"],
    aggregates: { limit: 2, before: `${today}` },
  },
};

const initialWatchList = ["S:VTI", "S:SPY", "C:BTC-USD"];

function App() {
  const [selectedButton, setSelectedButton] = useState(
    Object.keys(TopSymbols)[0]
  );
  const [watchList, setWatchList] = useState(initialWatchList);

  // @ts-ignore
  const { query, symbols, aggregates } = TopSymbols[selectedButton];
  const { loading: glLoading, data: glData } = useQuery(query, {
    variables: {
      input: { symbols },
      aggregatesInput: aggregates,
    },
  });

  const { loading: wlLoading, data: wlData } = useQuery(WatchListQuery, {
    variables: {
      cry: {
        symbols: watchList
          .filter((w) => w.startsWith("C"))
          .map((f) => f.split(":")[1]),
      },
      cryAggregates: { limit: 2, before: `${today}` },
      sec: {
        symbols: watchList
          .filter((w) => w.startsWith("S"))
          .map((f) => f.split(":")[1]),
      },
      secAggregates: { limit: 1, before: `${today}` }
    },
  });

  const subscribedSymbols = watchList
    .map((wl) => ({
      t: wl.split(":")[0],
      s: wl.split(":")[1],
    }))
    .concat(
      TopSymbols[selectedButton]?.symbols.map((s) => {
        const t = {
          "U.S. Equities": "S",
          Crypto: "C",
          Forex: "F",
        }[selectedButton];
        return { t, s };
      })
    );

  const { pending, prices } = useStream(subscribedSymbols);
  const handleSymbolSelected = (symbol: string) => {
    setWatchList((wl) => [symbol, ...wl]);
  };

  return (
    <div className="w-screen min-h-screen bg-slate-50 flex flex-col">
      <YuzuHeader />
      <div className="flex grow container mx-auto mt-16 flex-col w-full py-12 items-center">
        <MarketHeader
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
          glLoading={glLoading}
          glData={glData}
          prices={prices}
        />
        <div className="w-1/2">
          <SearchBar onSymbolSelected={handleSymbolSelected} />
        </div>
        <WatchList
          wlLoading={wlLoading}
          wlData={wlData}
          prices={prices}
          watchList={watchList}
        />
      </div>
    </div>
  );
}

export default App;

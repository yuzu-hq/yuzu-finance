import { Link, Outlet } from "react-router-dom";
import { usEquities, forex, crypto, WatchListQuery } from "../../queries";
import MarketHeader from "../MarketHeader/MarketHeader";
import SearchBar from "../SearchBar";
import WatchList from "../WatchList/WatchList";
import djs from "dayjs";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import useStream from "../../useStream";

const today = djs().format("YYYY-MM-DD");

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

const YuzuHome = () => {
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
      }
    )
  );
  
  const { pending, prices } = useStream(subscribedSymbols);
  
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
  
  const handleSymbolSelected = (symbol: string) => {
    setWatchList((wl) => [symbol, ...wl]);
  };
  
  return (
    <>
      <main>
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
          <Outlet />
        </div>
      </main>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </>
  );
};

export default YuzuHome;
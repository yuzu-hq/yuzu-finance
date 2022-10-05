import djs from "dayjs";

import { Link, Outlet } from "react-router-dom";
import { usEquities, forex, crypto, WatchListQuery } from "../queries";
import { MarketHeader, SearchBar, WatchList } from "../components";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import useStream from "../useStream";

const initialWatchList = ["S:VTI", "S:SPY", "C:BTC-USD"];

const today = djs().format("YYYY-MM-DD");
const YuzuHome = () => {
  const [watchList, setWatchList] = useState(initialWatchList);

  // @ts-ignore
  const subscribedSymbols = watchList.map((wl) => ({
    t: wl.split(":")[0],
    s: wl.split(":")[1],
  }));

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
      secAggregates: { limit: 1, before: `${today}` },
    },
  });

  const handleSymbolSelected = (symbol: string) => {
    setWatchList((wl) => [symbol, ...wl]);
  };

  return (
    <>
      <main className="w-full mt-8 flex flex-col items-center">
        <div className="w-1/2">
          <SearchBar onSymbolSelected={handleSymbolSelected} />
        </div>
        <WatchList
          wlLoading={wlLoading}
          wlData={wlData}
          prices={prices}
          watchList={watchList}
        />
      </main>
    </>
  );
};

export default YuzuHome;

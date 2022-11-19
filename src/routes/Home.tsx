import { useQuery } from "@apollo/client";

import djs from "dayjs";
import { useEffect, useState } from "react";

import { SearchBar, WatchList } from "../components";
import { WatchListQuery } from "../queries";
import { AtAGlanceQueryQuery, AtAGlanceQueryQueryVariables } from "../types";
import useStream, { SymbolType } from "../useStream";

const initialWatchList = ["S:VTI", "S:SPY", "C:BTC-USD"];

const today = djs().format("YYYY-MM-DD");
const YuzuHome = (): JSX.Element => {
  const storedWatchList: string[] = [...JSON.parse(localStorage["watchList"])];
  const [watchList, setWatchList] = useState(storedWatchList || initialWatchList);

  useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(watchList));
  }, [watchList]);

  const subscribedSymbols = watchList.map((wl) => ({
    t: wl.split(":")[0] as SymbolType,
    s: wl.split(":")[1],
  }));

  const { prices } = useStream(subscribedSymbols);

  const { loading: wlLoading, data: wlData } = useQuery<AtAGlanceQueryQuery, AtAGlanceQueryQueryVariables>(
    WatchListQuery,
    {
      variables: {
        cry: {
          symbols: watchList.filter((w) => w.startsWith("C")).map((f) => f.split(":")[1]),
        },
        cryAggregates: { limit: 2, before: `${today}` },
        sec: {
          symbols: watchList.filter((w) => w.startsWith("S")).map((f) => f.split(":")[1]),
        },
        secAggregates: { limit: 1, before: `${today}` },
      },
    }
  );

  const handleSymbolSelected = (symbol: string): void => {
    setWatchList((wl) => [symbol, ...wl]);
  };

  return (
    <>
      <main className="w-full mt-8 flex flex-col items-center">
        <div className="w-1/2">
          <SearchBar onSymbolSelected={handleSymbolSelected} />
        </div>
        <WatchList wlLoading={wlLoading} wlData={wlData} prices={prices} watchList={watchList} />
      </main>
    </>
  );
};

export default YuzuHome;

import { useQuery } from "@apollo/client";

import djs from "dayjs";
import { useEffect, useState } from "react";

import { SearchBar, WatchList } from "../components";
import MarketNews from "../components/MarketNews";
import { WatchListQuery, marketNewsQuery } from "../queries";
import { AtAGlanceQueryQuery, AtAGlanceQueryQueryVariables, MarketNewsQuery } from "../types";
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

  const { loading: newsLoading, data: newsData } = useQuery<MarketNewsQuery>(marketNewsQuery);

  const handleSymbolSelected = (symbol: string): void => {
    setWatchList((wl) => [symbol, ...wl]);
  };

  return (
    <>
      <main className="w-full mt-8 flex flex-col">
        <div className="w-1/2 self-center">
          <SearchBar onSymbolSelected={handleSymbolSelected} />
        </div>
        <WatchList wlLoading={wlLoading} wlData={wlData} prices={prices} watchList={watchList} />
        <MarketNews newsLoading={newsLoading} newsData={newsData} />
      </main>
    </>
  );
};

export default YuzuHome;

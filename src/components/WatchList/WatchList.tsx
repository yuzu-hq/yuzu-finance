import TickerRow from "../TickerRow";

const initialWatchList = ["S:VTI", "S:SPY", "C:BTC-USD"];

type WatchListProps = {
  wlLoading: boolean;
  wlData: any;
  prices: any;
  watchList: string[];
}

const WatchList = ({ wlLoading, wlData, prices, watchList }: WatchListProps) => {
  return (
    <div className="flex flex-row py-8 px-12 w-full">
      <div className="flex flex-col grow">
        <h2 className="mb-2">Your watchlist</h2>
        <hr />
        <table className="divide-y table-fixed border-collapse">
          <tbody>
            {wlLoading &&
              new Array(3).fill(null).map((_, i) => (
                <tr key={i}>
                  <td className="py-4">
                    <div className="w-1/2 h-8 rounded bg-slate-200 animate-pulse" />
                  </td>
                </tr>
              ))}
            {wlData &&
              watchList.map((s) => {
                const symbol = s.split(":")[1];
                const delem = (() => {
                  switch (s[0]) {
                    case "S":
                      return wlData.securities.find(
                        (f) => f.symbol === symbol
                      );
                    case "C":
                      return wlData.cryptoTradingPairs.find(
                        (f) => f.symbol === symbol
                      );
                  }
                })();

                const aggregates = [...delem.aggregates];
                aggregates.reverse();

                const lastPrice = (() => {
                  switch (delem.__typename) {
                    case "Security":
                      return (
                        (delem.lastTrade && aggregates[0].close) ||
                        aggregates[1].close
                      );
                    default:
                      return aggregates[0].close;
                  }
                })();

                return (
                  <TickerRow
                    key={delem.symbol}
                    symbol={delem.symbol}
                    name={
                      delem.name ||
                      delem.underlyingAsset?.name ||
                      delem.symbol
                    }
                    price={
                      prices[delem.symbol]?.close ||
                      delem.lastTrade?.price ||
                      delem.currentPrice ||
                      aggregates[0]?.close
                    }
                    exp={delem.expirationDate}
                    lastPrice={lastPrice}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default WatchList;
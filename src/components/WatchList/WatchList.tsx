import { AtAGlanceQueryQuery } from "../../types";
import TickerRow from "../TickerRow";

type WatchListProps = {
  wlLoading: boolean;
  wlData: AtAGlanceQueryQuery | undefined;
  prices: Record<string, { symbol: string; close: number }>;
  watchList: string[];
};

type Security = AtAGlanceQueryQuery["securities"][number];
type CryptoTradingPair = AtAGlanceQueryQuery["cryptoTradingPairs"][number];

const WatchList = ({ wlLoading, wlData, prices, watchList }: WatchListProps): JSX.Element => (
  <div className="flex flex-row py-8 w-full">
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
              const streamType = s.split(":")[0];
              const symbol = s.split(":")[1];
              const delem = ((): Security | CryptoTradingPair | undefined => {
                if (s[0] === "S") {
                  return wlData.securities.find((f) => f.symbol === symbol);
                }

                return wlData.cryptoTradingPairs.find((f) => f.symbol === symbol);
              })();

              if (delem === undefined) {
                return null;
              }

              const aggregates = [...delem.aggregates];
              aggregates.reverse();

              const lastPrice = ((): string => {
                switch (delem.__typename) {
                  case "Security":
                    return (delem.lastTrade && aggregates[0].close) || aggregates[1].close;
                  default:
                    return aggregates[0].close;
                }
              })();

              const name = ((): string => {
                switch (delem.__typename) {
                  case "Security":
                    return (delem as Security).name;
                  default:
                    return (delem as CryptoTradingPair).symbol;
                }
              })();

              return (
                <TickerRow
                  key={delem.symbol}
                  streamType={streamType}
                  symbol={delem.symbol}
                  name={name}
                  price={prices[delem.symbol]?.close || delem.lastTrade?.price || aggregates[0]?.close}
                  lastPrice={lastPrice}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  </div>
);

export default WatchList;

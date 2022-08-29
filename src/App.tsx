import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import djs from "dayjs";
import reactLogo from "./assets/react.svg";

import ChipButton from "./components/ChipButton";
import PriceChip from "./components/PriceChip";
import SearchBar from "./components/SearchBar";
import TickerRow from "./components/TickerRow";

import useStream from "./useStream";

const buttons = ["Futures", "U.S. Equities", "Crypto", "Forex"];

const today = djs().format("YYYY-MM-DD");
const TopSymbols = {
  Futures: {
    query: gql`
      query FutQuery($input: FuturesFilterInput) {
        futuresContracts(input: $input) {
          id
          symbol
          currentPrice
          aggregates {
            close
          }
          underlyingAsset {
            name
          }
        }
      }
    `,
    symbols: ["ZCU2", "HEQ2", "NQU2"],
  },
  "U.S. Equities": {
    query: gql`
      query SecuritiesQuery($input: SecurityFilterInput) {
        securities(input: $input) {
          id
          symbol
          name
          lastTrade {
            price
          }
          aggregates(input: { limit: 1, before: "${today}" }) {
            close
          }
        }
      }
    `,
    symbols: ["AAPL", "BRK.B", "SOND", "PYPL"],
  },
  Crypto: {
    query: gql`
      query CryptoQuery($input: CryptoTradingPairFilterInput) {
        cryptoTradingPairs(input: $input) {
          id
          symbol
          lastTrade {
            price
          }
          aggregates(input: { limit: 1, before: "${today}" }) {
            close
          }
        }
      }
    `,
    symbols: ["BTC-USD", "ETH-USD", "SOL-USD", "DOGE-USD"],
  },
  Forex: {
    query: gql`
      query ForexQuery($input: ForexTradingPairFilterInput) {
        forexTradingPairs(input: $input) {
          id
          symbol
          currentRate
          aggregates(input: { limit: 2, before: "${today}" }) {
            close
          }
        }
      }
    `,
    symbols: ["EUR-USD", "GBP-USD", "JPY-USD", "RUB-USD"],
  },
};

const initialWatchlist = ["S:VTI", "C:BTC-USD", "F:NQU2"];

const WatchlistQuery = gql`
  query AtAGlanceQuery(
    $sec: SecurityFilterInput
    $cry: CryptoTradingPairFilterInput
    $fut: FuturesFilterInput
  ) {
    futuresContracts(input: $fut) {
      id
      symbol
      currentPrice
      expirationDate
      aggregates {
        close
      }
      underlyingAsset {
        name
      }
    }
    securities(input: $sec) {
      id
      symbol
      name
      lastTrade {
        price
      }
      aggregates(input: { limit: 2, before: "${today}" }) {
        time
        close
      }
    }
    cryptoTradingPairs(input: $cry) {
      id
      symbol
      lastTrade {
        price
      }
      aggregates(input: { limit: 1, before: "${today}" }) {
        time
        close
      }
    }
  }
`;

function App() {
  const [selectedButton, setSelectedButton] = useState(
    Object.keys(TopSymbols)[0]
  );
  const [watchlist, setWatchList] = useState(initialWatchlist);

  // @ts-ignore
  const { query, symbols } = TopSymbols[selectedButton];
  const { loading: glLoading, data: glData } = useQuery(query, {
    variables: {
      input: { symbols },
    },
  });

  const { loading: wlLoading, data: wlData } = useQuery(WatchlistQuery, {
    variables: {
      fut: {
        symbols: watchlist
          .filter((w) => w.startsWith("F"))
          .map((f) => f.split(":")[1]),
      },
      cry: {
        symbols: watchlist
          .filter((w) => w.startsWith("C"))
          .map((f) => f.split(":")[1]),
      },
      sec: {
        symbols: watchlist
          .filter((w) => w.startsWith("S"))
          .map((f) => f.split(":")[1]),
      },
    },
  });

  const subscribedSymbols = watchlist
    .map((wl) => ({
      t: wl.split(":")[0] === "F" ? "FUT" : wl.split(":")[0],
      s: wl.split(":")[1],
    }))
    .concat(
      TopSymbols[selectedButton]?.symbols.map((s) => {
        const t = {
          "U.S. Equities": "S",
          Crypto: "C",
          Forex: "F",
          Futures: "FUT",
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
      <div className="navigation flex-shrink fixed w-full">
        <h2>
          🍋 <span className="">Yuzu</span>{" "}
          <span className="text-amber-600 font-sans font-normal text-xl">
            Finance
          </span>
        </h2>
      </div>
      <div className="flex grow container mx-auto mt-16 flex-col w-full py-12 items-center">
        <div className="w-full p-6 gap-y-4 flex flex-col">
          <div className="flex flex-row items-center gap-x-3">
            <h3 className="font-semibold">At a glance:</h3>
            {buttons.map((button) => (
              <ChipButton
                key={button}
                name={button}
                selected={selectedButton === button}
                onSelected={() => setSelectedButton(button)}
              />
            ))}
          </div>
          <div className="flex w-full flex-row gap-x-3">
            {glLoading && (
              <>
                {new Array(4).fill(null).map((_, i) => (
                  <div
                    key={i}
                    className="rounded bg-slate-200 h-12 w-32 rounded-lg animate-pulse border"
                  ></div>
                ))}
              </>
            )}
            {glData &&
              glData[Object.keys(glData)[0]].map((sec) => (
                <div key={sec.id}>
                  <PriceChip
                    name={sec.underlyingAsset?.name || sec.name || sec.symbol}
                    price={
                      prices[sec.symbol]?.close ||
                      sec.lastTrade?.price ||
                      sec.currentRate ||
                      sec.currentPrice
                    }
                    lastPrice={sec.aggregates[0].close}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="w-1/2">
          <SearchBar onSymbolSelected={handleSymbolSelected} />
        </div>
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
                  watchlist.map((s) => {
                    const symbol = s.split(":")[1];
                    const delem = (() => {
                      switch (s[0]) {
                        case "F":
                          return wlData.futuresContracts.find(
                            (f) => f.symbol === symbol
                          );
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
      </div>
    </div>
  );
}

export default App;

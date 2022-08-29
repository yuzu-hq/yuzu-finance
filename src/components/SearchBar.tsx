import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

import cx from "classnames";

import { currencyFormat } from "../utilities";

const SearchQuery = gql`
  query SearchQuery($query: String) {
    cryptoTradingPairs(input: { q: $query, limit: 5 }) {
      id
      symbol
      aggregates(input: { period: MINUTE, limit: 1 }) {
        time
        close
      }
      baseAsset {
        name
        symbol
      }
    }
    securities(input: { q: $query, limit: 5 }) {
      symbol
      name
      aggregates(input: { limit: 1 }) {
        close
      }
    }
    futuresAssets(input: { q: $query }) {
      name
      subcategory
      category
      contracts {
        symbol
        expirationDate
        currentPrice
      }
    }
  }
`;

type SearchBarProps = {
  onSymbolSelected: (symbol: string) => void;
};

const SearchBar = (props: SearchBarProps): JSX.Element => {
  const { onSymbolSelected } = props;
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState("");

  const { data, loading } = useQuery(SearchQuery, {
    variables: {
      query,
    },
    skip: query.length < 2,
  });

  useEffect(() => {
    if (!active) {
      setQuery("");
    }
  }, [active]);

  const hasResults =
    data?.securities.length > 0 ||
    data?.cryptoTradingPairs.length > 0 ||
    data?.futuresAssets.length > 0;

  const handleClick = (s: string) => (e: Event) => {
    e.preventDefault();
    onSymbolSelected(s);
    setActive(false);
  };

  return (
    <div className="w-content relative">
      <div
        className={cx(
          "transition bg-white border-slate-200 p-4 hover:cursor-pointer shadow hover:shadow-lg focus-within:shadow-lg overflow-hidden",
          {
            "rounded-t-3xl border-r border-t border-l":
              query.length > 2 || hasResults,
            "border rounded-full": query.length < 2 && !hasResults,
          }
        )}
      >
        <input
          className="w-full"
          placeholder="Search"
          onFocus={() => setActive(true)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {(query.length > 2 || hasResults) && (
        <div className="border-b border-l border-r border-slate-200 flex flex-col absolute divide-y rounded-b-3xl bg-white w-full shadow-lg overflow-hidden">
          {!hasResults && <p className="text-slate-300 p-4">No results</p>}
          {data && (
            <>
              {data.futuresAssets?.map((c) => (
                <div
                  onClick={handleClick(`F:${c.contracts[0].symbol}`)}
                  className="flex flex-row justify-between items-center hover:bg-slate-100 hover:cursor-pointer p-4"
                  key={c.name}
                >
                  <div className="flex flex-col gap-y-1 items-start">
                    <p className="text-xs rounded bg-slate-200 p-1 flex inline-flex">
                      {c.contracts[0].symbol}
                    </p>
                    <p className="text-xs font-bold line-clamp-1 max-w-[16rem]">
                      {c.name} - {c.category} / {c.subcategory}
                    </p>
                  </div>
                  <p className="text-xs font-bold">
                    {currencyFormat.format(
                      parseFloat(c.contracts[0]?.currentPrice || 0)
                    )}
                  </p>
                </div>
              ))}
              {data.securities.map((s) => (
                <div
                  onClick={handleClick(`S:${s.symbol}`)}
                  className="flex flex-row justify-between items-center hover:bg-slate-100 hover:cursor-pointer p-4"
                  key={s.name}
                >
                  <div className="flex flex-col gap-y-1 items-start">
                    <p className="text-xs rounded bg-slate-200 p-1 flex inline-flex">
                      {s.symbol}
                    </p>
                    <p className="text-xs font-bold line-clamp-1 max-w-[16rem]">
                      {s.name}
                    </p>
                  </div>
                  <p className="text-xs font-bold">
                    {currencyFormat.format(
                      parseFloat(s.aggregates[0]?.close || 0)
                    )}
                  </p>
                </div>
              ))}
              {data.cryptoTradingPairs.map((c) => (
                <div
                  onClick={handleClick(`C:${c.symbol}`)}
                  className="flex flex-row justify-between items-center hover:bg-slate-100 hover:cursor-pointer p-4"
                  key={c.symbol}
                >
                  <div className="flex flex-col items-start gap-y-1">
                    <p className="text-xs rounded bg-slate-200 p-1 flex inline-flex">
                      {c.symbol}
                    </p>
                    <p className="text-xs font-bold line-clamp-1 max-w-[16rem]">
                      {c.baseAsset.name}
                    </p>
                  </div>
                  <p className="text-xs font-bold">
                    {currencyFormat.format(
                      parseFloat(c.aggregates[0]?.close || 0)
                    )}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

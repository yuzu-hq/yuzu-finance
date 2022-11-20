import { useQuery } from "@apollo/client";
import { ArrowSmDownIcon, ArrowSmUpIcon, PlusSmIcon } from "@heroicons/react/outline";

import cx from "classnames";
import djs from "dayjs";
import { useState } from "react";
// @ts-ignore: no types 😱
import { AreaChart } from "react-chartkick";
import { useParams } from "react-router-dom";

import { TimePeriodFilter } from "../components";
import { crypto, forex, usEquities, usMarketHours } from "../queries";
import {
  CryptoAggregatePeriod,
  CryptoQueryQuery,
  CryptoQueryQueryVariables,
  ForexQueryQuery,
  ForexQueryQueryVariables,
  SecuritiesQueryQuery,
  SecuritiesQueryQueryVariables,
  SecurityAggregatePeriod,
  UsMarketHoursQuery,
  UsMarketHoursQueryVariables,
} from "../types";
import { currencyFormat } from "../utilities";
import "chartkick/chart.js";

type AggPeriod = "DAY" | "MINUTE" | "HOUR";
type ChartProps = {
  loading: boolean;
  onPeriodChange: (p: AggPeriod) => void;
  aggPeriod: AggPeriod;
  data: {
    name: string;
    symbol?: string;
    lastTradePrice: string;
    lastTradeTime: string | null;
    aggregates: { time: string; close: string }[];
    newsArticles?: SecuritiesQueryQuery["securities"][number]["newsArticles"];
  } | null;
};

const Chart = (props: ChartProps): JSX.Element | null => {
  const { loading, data, aggPeriod, onPeriodChange } = props;

  if (loading && !data) {
    return <div>Loading...</div>;
  } else if (data) {
    const { name, symbol, lastTradeTime, lastTradePrice, aggregates, newsArticles } = data;

    const chart = aggregates.map(({ time, close }) => {
      let format = {
        HOUR: "MMM DTHH",
        MINUTE: "HH:mm",
        DAY: "MMM D, YYYY",
      }[aggPeriod];

      return [djs(time).format(format), close];
    });

    const lastTrade = parseFloat(lastTradePrice);
    const firstTrade = parseFloat(aggregates[0].close);
    const priceDelta = lastTrade - firstTrade;
    const percentChange = priceDelta / firstTrade;

    const chartColor = percentChange > 0 ? "#059669" : "#dc2626";

    return (
      <main>
        <div className="flex flex-b justify-between grow mx-auto w-full pb-2 border-b-2 items-center">
          <div className="flex gap-x-2 justify-between">{name}</div>
          <div className="items-center flex">
            <button className="px-4 py-2 inline-flex items-center gap-2 font-semibold text-sm bg-white border-2 border-gray-200 rounded-full shadow-sm">
              <PlusSmIcon className="text-blue-500 w-4 h-4" />
              <span className="text-black">Follow</span>
            </button>
          </div>
        </div>
        <div className="mt-4">
          <div
            className={cx("flex items-center gap-2", {
              "text-emerald-600": percentChange > 0,
              "text-red-600": percentChange < 0,
            })}
          >
            <h3 className="text-4xl text-black mb-2">{currencyFormat.format(parseFloat(lastTradePrice))}</h3>
            <div
              className={cx("p-1 flex flex-row rounded items-center", {
                "bg-emerald-100 text-emerald-600": percentChange > 0,
                "bg-red-100 text-red-600": percentChange < 0,
              })}
            >
              <span className="inline-flex items-center flex-row h-8 aspect-square">
                {percentChange < 0 && <ArrowSmDownIcon className="text-red-600 w-3/4" />}
                {percentChange > 0 && <ArrowSmUpIcon className="text-emerald-600 w-3/4" />}
              </span>
              <p>{(percentChange * 100).toFixed(2)}%</p>
            </div>
            <p>
              {percentChange > 0 && "+"} {priceDelta.toFixed(2)}
            </p>
          </div>
          {lastTradeTime && (
            <p className="text-gray-500 text-sm mb-2">{djs(lastTradeTime).format("MMM D, YYYY h:mm A")}</p>
          )}
          <div className="mb-2">
            <TimePeriodFilter onPeriodChange={onPeriodChange} aggPeriod={aggPeriod} />
          </div>
          <AreaChart
            colors={[chartColor]}
            data={chart}
            discrete={true}
            prefix="$"
            thousands=","
            round={2}
            zeros={false}
            min={null}
            max={null}
          />
        </div>
        {newsArticles && (
          <div className="mt-5">
            <h3 className="mb-5 font-semibold">News about {symbol}</h3>
            <div className="flex flex-row overflow-x-scroll gap-2">
              {newsArticles.map((newsArticle) => {
                return (
                  <a href={newsArticle.url} target="_blank">
                    <div className="flex flex-col gap-2 w-48 hover:bg-gray-200 hover:cursor-pointer">
                      {newsArticle.imageUrl && <img src={newsArticle.imageUrl} />}
                      <div className="p-2 flex flex-col gap-3 text-xs">
                        <span className="text-black">{newsArticle.title}</span>
                        <span className="text-gray-500">{djs(newsArticle.time).format("MMM D, YYYY h:mm A")}</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </main>
    );
  }

  return null;
};

// Return berfore and after matching nextTradingDay if the market is operations
//
// if it's closed, then retrun previousDay
function currentMarketHours(data: UsMarketHoursQuery | undefined): { before: string; after: string } | undefined {
  if (!data) {
    return undefined;
  }

  const { openNow, nextTradingDay, previousTradingDay } = data.usMarketHours;

  if (openNow) {
    return {
      before: nextTradingDay.closeTime,
      after: nextTradingDay.openTime,
    };
  } else {
    return {
      before: previousTradingDay.closeTime,
      after: previousTradingDay.openTime,
    };
  }
}

export default function Details(): JSX.Element {
  let params = useParams();
  const equitySymbol = params.tickerId as string;
  const streamType = params.streamType;

  const [aggPeriod, setAggPeriod] = useState<"DAY" | "HOUR" | "MINUTE">("DAY");

  const aggLimit = {
    MINUTE: 500,
    HOUR: 60,
    DAY: 30,
  }[aggPeriod];

  const { data: usMarketHoursData } = useQuery<UsMarketHoursQuery, UsMarketHoursQueryVariables>(usMarketHours);
  const beforeAndAfter = aggPeriod === "MINUTE" ? currentMarketHours(usMarketHoursData) : undefined;

  const { loading: securitiesLoading, data: securitiesPayload } = useQuery<
    SecuritiesQueryQuery,
    SecuritiesQueryQueryVariables
  >(usEquities, {
    skip: streamType !== "S" && usMarketHoursData === undefined,
    variables: {
      input: { symbols: [equitySymbol] },
      aggregatesInput: {
        period: aggPeriod as SecurityAggregatePeriod,
        limit: aggLimit,
        ...beforeAndAfter,
      },
    },
  });

  const { loading: cryptoLoading, data: cryptoPayload } = useQuery<CryptoQueryQuery, CryptoQueryQueryVariables>(
    crypto,
    {
      skip: streamType !== "C",
      variables: {
        input: { symbols: [equitySymbol] },
        aggregatesInput: {
          period: aggPeriod as CryptoAggregatePeriod,
          limit: aggLimit,
        },
      },
    }
  );

  const { loading: forexLoading, data: forexPayload } = useQuery<ForexQueryQuery, ForexQueryQueryVariables>(forex, {
    variables: {
      input: { symbols: [equitySymbol] },
      aggregatesInput: {
        limit: aggLimit,
      },
    },
  });

  switch (streamType) {
    case "S":
      return (
        <Chart
          loading={securitiesLoading}
          data={
            (securitiesPayload && {
              name: securitiesPayload.securities[0].name,
              symbol: securitiesPayload.securities[0].symbol,
              lastTradePrice: securitiesPayload.securities[0].lastTrade?.price,
              lastTradeTime: securitiesPayload.securities[0].lastTrade?.time,
              aggregates: securitiesPayload.securities[0].aggregates,
              newsArticles: securitiesPayload.securities[0].newsArticles,
            }) ||
            null
          }
          aggPeriod={aggPeriod}
          onPeriodChange={setAggPeriod}
        />
      );
    case "C":
      return (
        <Chart
          loading={cryptoLoading}
          data={
            (cryptoPayload && {
              name: cryptoPayload.cryptoTradingPairs[0].symbol,
              lastTradePrice: cryptoPayload.cryptoTradingPairs[0].lastTrade?.price,
              lastTradeTime: cryptoPayload.cryptoTradingPairs[0].lastTrade?.time,
              aggregates: cryptoPayload.cryptoTradingPairs[0].aggregates,
            }) ||
            null
          }
          aggPeriod={aggPeriod}
          onPeriodChange={setAggPeriod}
        />
      );
    default:
      return (
        <Chart
          loading={forexLoading}
          data={
            (forexPayload && {
              name: forexPayload.forexTradingPairs[0].symbol,
              lastTradePrice: forexPayload.forexTradingPairs[0].currentRate,
              lastTradeTime: null,
              aggregates: forexPayload.forexTradingPairs[0].aggregates,
            }) ||
            null
          }
          aggPeriod={aggPeriod}
          onPeriodChange={setAggPeriod}
        />
      );
  }
}

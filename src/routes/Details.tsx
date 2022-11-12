import { useQuery } from "@apollo/client";

import djs from "dayjs";
import { useState } from "react";
// @ts-ignore: no types 😱
import { AreaChart } from "react-chartkick";
import { useParams } from "react-router-dom";

import { TimePeriodFilter } from "../components";
import { crypto, forex, usEquities } from "../queries";
import {
  CryptoAggregatePeriod,
  CryptoQueryQuery,
  CryptoQueryQueryVariables,
  ForexQueryQuery,
  ForexQueryQueryVariables,
  SecuritiesQueryQuery,
  SecuritiesQueryQueryVariables,
  SecurityAggregatePeriod,
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
    lastTradePrice: string;
    lastTradeTime: string | null;
    aggregates: { time: string; close: string }[];
  } | null;
};

const Chart = (props: ChartProps): JSX.Element | null => {
  const { loading, data, aggPeriod, onPeriodChange } = props;

  if (loading && !data) {
    return <div>Loading...</div>;
  } else if (data) {
    const { name, lastTradeTime, lastTradePrice, aggregates } = data;

    const chart = aggregates.map(({ time, close }) => {
      let format = {
        HOUR: "MMM DTHH",
        MINUTE: "HH:mm",
        DAY: "MMM D, YYYY",
      }[aggPeriod];

      return [djs(time).format(format), close];
    });

    return (
      <main>
        <div className="flex flex-b justify-between grow mx-auto w-full pb-2 border-b-2 items-center">
          <div className="flex gap-x-2 justify-between">{name}</div>
        </div>
        <div className="mt-4">
          <h3 className="text-4xl	mb-2">{currencyFormat.format(parseFloat(lastTradePrice))}</h3>
          {lastTradeTime && (
            <p className="text-gray-500 text-sm mb-2">{djs(lastTradeTime).format("MMM D, YYYY h:mm A")}</p>
          )}
          <div className="mb-2">
            <TimePeriodFilter onPeriodChange={onPeriodChange} aggPeriod={aggPeriod} />
          </div>
          <AreaChart
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
      </main>
    );
  }

  return null;
};

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

  const { loading: securitiesLoading, data: securitiesPayload } = useQuery<
    SecuritiesQueryQuery,
    SecuritiesQueryQueryVariables
  >(usEquities, {
    skip: streamType !== "S",
    variables: {
      input: { symbols: [equitySymbol] },
      aggregatesInput: {
        period: aggPeriod as SecurityAggregatePeriod,
        limit: aggLimit,
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
              lastTradePrice: securitiesPayload.securities[0].lastTrade?.price,
              lastTradeTime: securitiesPayload.securities[0].lastTrade?.time,
              aggregates: securitiesPayload.securities[0].aggregates,
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

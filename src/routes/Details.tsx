import { useParams } from "react-router-dom";
import { LineChart } from 'react-chartkick';
import 'chartkick/chart.js'
import djs from "dayjs";
import { currencyFormat, fetchGraphData } from "../utilities";
import 'chartkick/chart.js'
import { useQuery } from "@apollo/client";
import { usEquities, forex, crypto } from "../queries";
import { useState } from "react";
import { TimePeriodFilter } from '../components';

export default function Details() {
  let params = useParams();
  const equitySymbol = params.tickerId;
  const [aggLimit, setAggLimit] = useState<number>(30);
  const [aggPeriod, setAggPeriod] = useState<string>("DAY");
  const [timePeriod, setTimePeriod] = useState<number>(30);
  const { loading, data} = useQuery(usEquities, {
    variables: {
      input: { symbols: [equitySymbol] },
      aggregatesInput: {
        period: aggPeriod,
        limit: aggLimit
      },
    },
  });

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  console.log("data, ", data)
  const USSecurities = data?.securities[0];
  const { 
    lastTrade: { price: lastPrice, time: lastTime },
    issuer: { name: issuerName }
  } = USSecurities;
  const graphData = USSecurities.aggregates.map((agg, i) => {
    let time = djs(agg.time).format('MMM D, YYYY');
    if (aggPeriod === "HOUR") {
      time =  djs(agg.time).format('MMM DTHH');
    }
    if (aggPeriod === "MINUTE") {
      time =  djs(agg.time).format('HH:mm');
    }
    const close = agg.close;
    return [time, close];
  }) || [];

  return (
    <>
      <main>
        <div className="flex flex-b justify-between grow mx-auto w-full pb-2 border-b-2 items-center">
          <div className="flex gap-x-2 justify-between">
            {issuerName}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-4xl	mb-2">{currencyFormat.format(lastPrice)}</h3>
          <p className="text-gray-500 text-sm mb-2">{djs(lastTime).format("MMM D, YYYY h:mm A")}</p>
          <div className="mb-2">
            <TimePeriodFilter setAggPeriod={setAggPeriod} setAggLimit={setAggLimit} setTimePeriod={setTimePeriod} timePeriod={timePeriod} />
          </div>
          <LineChart 
            data={graphData} discrete={true} prefix="$" thousands="," round={2} zeros={false}
            min={null} max={null}
          />
        </div>
      </main>
    </>
  );
}

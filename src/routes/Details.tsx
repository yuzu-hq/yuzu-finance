import { useParams } from "react-router-dom";
import { LineChart } from 'react-chartkick';
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
  const [timePeriod, setTimePeriod] = useState<number>(30);
  const [aggPeriod, setAggPeriod] = useState<string>("DAY");
  const { loading, data} = useQuery(usEquities, {
    variables: {
      input: { symbols: [equitySymbol] },
      aggregatesInput: {
        period: aggPeriod,
        limit: timePeriod
      },
    },
  });

  if (loading) {
    return (
      <div>
        <LineChart loading="Loading..." />
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
    const time = djs(agg.time).format('MMM D, YYYY');
    const close = agg.close;
    return [time, close];
  }) || [];

  return (
    <>
      <main>
        <div className="flex flex-b justify-between grow mx-auto w-full pb-2 border-b-2 items-center">
          <div className="flex gap-x-2 justify-between">
            {issuerName}
            {/* {timePeriodFilter()} */}
            <TimePeriodFilter timePeriod={timePeriod} onTimePeriodChange={setTimePeriod} />
          </div>
          <div className="flex gap-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => alert("follow button")}
            >
              Follow
            </button>
            <button 
              className="bg-transparent hover:bg-gray-200 text-blue-700 font-semibold py-2 px-4 border rounded-full border-blue-500"
              onClick={() => setAggPeriod("DAY")}
            >
              DAY
            </button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-4xl	mb-2">{currencyFormat.format(lastPrice)}</h3>
          <p className="text-gray-500 text-sm mb-2">{djs(lastTime).format("MMM D, YYYY h:mm A")}</p>
          <LineChart data={graphData} discrete={true} prefix="$" thousands="," round={2} zeros={false} />
        </div>
      </main>
    </>
  );
}

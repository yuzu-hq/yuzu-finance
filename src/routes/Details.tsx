import { useParams } from "react-router-dom";
import { LineChart, ColumnChart } from 'react-chartkick';
import djs from "dayjs";
import { currencyFormat, fetchGraphData } from "../utilities";
import 'chartkick/chart.js'
import { useQuery } from "@apollo/client";
import { usEquities, forex, crypto } from "../queries";

export default function Details() {
  let params = useParams();
  const equitySymbol = params.tickerId;
  const { loading, data} = useQuery(usEquities, {
    variables: {
      input: { symbols: [equitySymbol] },
      aggregatesInput: {
        period: "HOUR",
        limit: 22
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
    const time = agg.time;
    const close = agg.close;
    return [time, close];
  }) || [];
  console.log("graph data", graphData);
  // do we make a gql call here to grab relevant data for specific ticker?

  return (
    <>
      <main>
        <div className="flex flex-b justify-between grow mx-auto w-full pb-2 border-b-2 items-center">
          <div>{issuerName}</div>
          <div className="flex gap-x-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Follow
            </button>
            <button className="bg-transparent hover:bg-gray-200 text-blue-700 font-semibold py-2 px-4 border rounded-full border-blue-500">
              Button
            </button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-4xl	mb-2">{currencyFormat.format(lastPrice)}</h3>
          <p className="text-gray-500 text-sm mb-2">{djs(lastTime).format("MMM D, YYYY h:mm A")}</p>
          <LineChart data={graphData} prefix="$" thousands="," round={2} zeros={true} />
        </div>
        <div>
          Column Chart
          <ColumnChart data={graphData} />
        </div>
      </main>
    </>
  );
}

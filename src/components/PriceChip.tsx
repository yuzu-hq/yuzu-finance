import cx from "classnames";
import { useNavigate } from "react-router-dom";

import { ArrowSmUpIcon, ArrowSmDownIcon } from "@heroicons/react/outline";
import { currencyFormat } from "../utilities";

type PriceChipProps = {
  name: string;
  price: string;
  lastPrice: string;
  symbol: string;
};

export default function PriceChip({ name, price, lastPrice, symbol }: PriceChipProps): JSX.Element {
  const priceF = parseFloat(price);
  const lastPriceF = parseFloat(lastPrice);

  const percentChange = (priceF - lastPriceF) / lastPriceF;
  let navigate = useNavigate();

  return (
    <div
      className="flex flex-row p-2 gap-x-3 border rounded-lg text-xs bg-white hover:cursor-pointer transition hover:bg-slate-100"
      onClick={() => navigate(`/finance/quote/${symbol}`)}
    >
      <div
        className={cx(
          "flex flex-row justify-center items-center h-8 aspect-square rounded-lg",
          {
            "bg-emerald-400": percentChange > 0,
            "bg-red-300": percentChange < 0,
            "bg-slate-200": percentChange == 0,
          }
        )}
      >
        {percentChange < 0 && <ArrowSmDownIcon className="text-white w-3/4" />}
        {percentChange > 0 && <ArrowSmUpIcon className="text-white w-3/4" />}
      </div>
      <div className="flex flex-col justify-between items-start">
        <p className="font-bold line-clamp-1 w-24 max-w-[8rem]">{symbol}</p>
        <p>{currencyFormat.format(priceF)}</p>
      </div>
      <div className="flex flex-col justify-between items-start ml-2">
        <p className="font-bold">{(percentChange * 100).toFixed(2)}%</p>
        <p>{currencyFormat.format(priceF - lastPriceF)}</p>
      </div>
    </div>
  );
}

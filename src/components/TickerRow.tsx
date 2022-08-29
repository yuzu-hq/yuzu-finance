import cx from "classnames";
import djs from "dayjs";
import { currencyFormat } from "../utilities";

type TickerRowProps = {
  symbol: string;
  name: string;
  exp?: string;
  price: string;
  lastPrice: string;
};

export default function TickerRow(props: TickerRowProps): JSX.Element {
  const { symbol, name, price, lastPrice } = props;
  const pricef = parseFloat(price);
  const lastPricef = parseFloat(lastPrice);
  const pctChange = (pricef - lastPricef) / lastPricef;

  const date = props.exp && djs(props.exp).format("MMM YYYY");

  const textClass = cx("w-1/6", {
    "text-emerald-700": pctChange > 0,
    "text-red-700": pctChange < 0,
  });

  const blockClass = cx("rounded-lg px-2 py-1 w-fit", {
    "bg-emerald-200": pctChange > 0,
    "bg-red-200": pctChange < 0,
  });

  return (
    <tr className="w-full border-b text-sm font-semibold hover:bg-slate-100 hover:cursor-pointer">
      <td className="items-center w-max py-3">
        <div className="bg-slate-300 w-fit px-2 py-1 text-slate-600 rounded text-sm">
          {symbol}
        </div>
      </td>
      <td className="w-[35%] px-8">
        <div className="flex flex-col justify-between">
          <p className="line-clamp-1 max-w-full">{name}</p>
          {date && <p className="text-xs font-light">Exp: {date}</p>}
        </div>
      </td>
      <td className="w-1/6">
        <p>{currencyFormat.format(pricef)}</p>
      </td>
      <td className={textClass}>
        <p>{currencyFormat.format(pricef - lastPricef)}</p>
      </td>
      <td className="w-1/6">
        <div className={blockClass}>
          <p className={textClass}>{(pctChange * 100).toFixed(2)}%</p>
        </div>
      </td>
    </tr>
  );
}

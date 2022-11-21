import djs from "dayjs";
import { useNavigate } from "react-router-dom";

import { MarketNewsQuery } from "../types";

interface NewsRowProps {
  title: MarketNewsQuery["marketNews"][number]["title"];
  url: MarketNewsQuery["marketNews"][number]["url"];
  time: MarketNewsQuery["marketNews"][number]["time"];
  publisher: MarketNewsQuery["marketNews"][number]["publisher"];
  imageUrl?: MarketNewsQuery["marketNews"][number]["imageUrl"];
  subjects: MarketNewsQuery["marketNews"][number]["subjects"];
}

const NewsRow = ({ title, url, time, publisher, imageUrl, subjects }: NewsRowProps): JSX.Element => {
  let navigate = useNavigate();
  return (
    <div className="border-b border-y-2 sm:w-full md:w-9/12 py-3 flex flex-col gap-3">
      <a href={url} target="_blank">
        <tr className="w-full flex flex-row items-center hover:bg-slate-100 hover:cursor-pointer">
          <td className="w-8/12 mr-3">
            <div className="p2 flex flex-col gap-3">
              <div className="text-sm text-gray-500 pb-1">
                <span className="font-semibold ">{publisher}</span> {"\u2022"}{" "}
                <span>{djs(time).format("YYYY-MM-DD h:mm A")}</span>
              </div>
              <span className="text-sm">{title}</span>
            </div>
          </td>
          {imageUrl && (
            <td className="w-4/12 pl-2">
              <img className="h-auto w-auto rounded" src={imageUrl} />
            </td>
          )}
        </tr>
      </a>
      <tr>
        <div className="flex flex-row gap-2">
          {subjects.map((subject) => {
            const symbol = subject.symbol;
            return (
              <>
                <span
                  className="rounded-2xl text-xs p-2 border-2 border-gray-400 hover:bg-gray-300 hover:cursor-pointer"
                  onClick={(): void => navigate(`S:${symbol}`)}
                  data-tooltip-target="tooltip-default"
                >
                  {symbol}
                </span>
                <div
                  id="tooltip-default"
                  role="tooltip"
                  className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700"
                >
                  Tooltip content
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              </>
            );
          })}
        </div>
      </tr>
    </div>
  );
};

export default NewsRow;

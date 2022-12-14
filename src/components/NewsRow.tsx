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
        <div className="w-full flex flex-row items-center hover:bg-slate-100 hover:cursor-pointer">
          <div className="w-8/12 mr-3">
            <div className="p2 flex flex-col gap-3">
              <div className="text-sm text-gray-500 pb-1">
                <span className="font-semibold ">{publisher}</span> {"\u2022"}{" "}
                <span>{djs(time).format("YYYY-MM-DD h:mm A")}</span>
              </div>
              <span className="text-sm">{title}</span>
            </div>
          </div>
          {imageUrl && (
            <div className="w-4/12 pl-2">
              <img className="h-auto w-auto rounded" src={imageUrl} />
            </div>
          )}
        </div>
      </a>
      <div>
        <div className="flex flex-row gap-2">
          {subjects.map((subject) => {
            const symbol = subject.symbol;
            return (
              <>
                <span
                  className="rounded-2xl text-xs p-2 border-2 border-gray-400 hover:bg-gray-300 hover:cursor-pointer"
                  onClick={(): void => navigate(`S:${symbol}`)}
                >
                  {symbol}
                </span>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewsRow;

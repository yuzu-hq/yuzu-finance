import { MarketNewsQuery } from "../types";
import NewsRow from "./NewsRow";

interface MarketNewsProps {
  newsLoading: boolean;
  newsData: MarketNewsQuery | undefined;
}

const MarketNews = ({ newsLoading, newsData }: MarketNewsProps): JSX.Element => {
  return (
    <div>
      <h2 className="mb-2">Today's financial news</h2>
      {newsLoading &&
        new Array(3).fill(null).map((_, i) => (
          <tr key={i}>
            <td className="py-4">
              <div className="w-1/2 h-8 rounded bg-slate-200 animate-pulse" />
            </td>
          </tr>
        ))}
      {newsData &&
        newsData.marketNews &&
        newsData.marketNews.map((news, i) => {
          return (
            <NewsRow
              key={i}
              title={news.title}
              url={news.url}
              time={news.time}
              publisher={news.publisher}
              imageUrl={news.imageUrl}
              subjects={news.subjects}
            />
          );
        })}
    </div>
  );
};

export default MarketNews;

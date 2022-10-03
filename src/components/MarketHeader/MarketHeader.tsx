import { ChipButton, PriceChip } from "..";

const buttons = ["U.S. Equities", "Crypto", "Forex"];

type MarketHeaderProps = {
  setSelectedButton: (value: string) => void;
  selectedButton: string;
  glLoading: boolean;
  glData: any;
  prices: any;
};

const MarketHeader = ({
  selectedButton,
  setSelectedButton,
  glLoading,
  glData,
  prices,
}: MarketHeaderProps) => {
  return (
    <div className="w-full p-6 gap-y-4 flex flex-col">
      <div className="flex flex-row items-center gap-x-3">
        <h3 className="font-semibold">At a glance:</h3>
        {buttons.map((button) => (
          <ChipButton
            key={button}
            name={button}
            selected={selectedButton === button}
            onSelected={() => setSelectedButton(button)}
          />
        ))}
      </div>
      <div className="flex w-full flex-row gap-x-3">
        {glLoading && (
          <>
            {new Array(4).fill(null).map((_, i) => (
              <div
                key={i}
                className="rounded bg-slate-200 h-12 w-32 rounded-lg animate-pulse border"
              ></div>
            ))}
          </>
        )}
        {glData &&
          glData[Object.keys(glData)[0]].map((sec) => (
            <div key={sec.id}>
              <PriceChip
                name={sec.underlyingAsset?.name || sec.name}
                symbol={sec.symbol}
                price={
                  prices[sec.symbol]?.close ||
                  sec.lastTrade?.price ||
                  sec.currentRate ||
                  sec.currentPrice
                }
                lastPrice={sec.aggregates[0].close}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MarketHeader;

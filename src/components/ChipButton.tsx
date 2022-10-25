import cx from "classnames";
import { SymbolType } from "../useStream";

type ChipButtonProps = {
  name: string;
  selected: boolean;
  onSelected: () => void;
  setStreamType: (s: SymbolType) => void;
};

const getStreamType = (name: string, setStreamType: (s: SymbolType) => void) => {
  switch (name) {
    case "U.S. Equities":
      return setStreamType("S");
    case "Crypto":
      return setStreamType("C")
    case "Forex":
      return setStreamType("F");
  }
}

export default function ChipButton({
  name,
  selected,
  onSelected,
  setStreamType,
}: ChipButtonProps): JSX.Element {
  return (
    <div
      onClick={(): void => {
        !selected && onSelected();
        getStreamType(name, setStreamType)
      }}
      className={cx(
        "px-2 py-1 rounded-full font-medium text-sm hover:cursor-pointer",
        {
          "text-amber-500 bg-amber-200": selected,
        }
      )}
    >
      {name}
    </div>
  );
}

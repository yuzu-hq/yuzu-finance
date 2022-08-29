import cx from "classnames";

type ChipButtonProps = {
  name: string;
  selected: boolean;
  onSelected: () => void;
};

export default function ChipButton({
  name,
  selected,
  onSelected,
}: ChipButtonProps): JSX.Element {
  return (
    <div
      onClick={() => {
        !selected && onSelected();
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

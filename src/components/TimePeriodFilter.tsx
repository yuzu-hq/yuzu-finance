import cx from "classnames";
import React from "react";

export interface TimePeriodFilterProps {
  onPeriodChange: (value: "DAY" | "HOUR" | "MINUTE") => void;
  aggPeriod: string;
}

const TimePeriodFilter: React.FC<TimePeriodFilterProps> = ({ aggPeriod, onPeriodChange }) => {
  return (
    <div className="pl-3 flex gap-x-3">
      <button
        className={cx({
          "underline text-blue-800": aggPeriod === "MINUTE",
        })}
        onClick={(): void => onPeriodChange("MINUTE")}
      >
        1D
      </button>
      <button
        className={cx({
          "underline text-blue-800": aggPeriod === "HOUR",
        })}
        onClick={(): void => onPeriodChange("HOUR")}
      >
        5D
      </button>
      <button
        className={cx({
          "underline text-blue-800": aggPeriod === "DAY",
        })}
        onClick={(): void => onPeriodChange("DAY")}
      >
        1M
      </button>
    </div>
  );
};

export default TimePeriodFilter;

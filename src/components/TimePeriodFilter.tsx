import React from 'react';
import cx from "classnames";

export interface TimePeriodFilterProps {
  setTimePeriod: (value: number) => void;
  setAggPeriod: (value: "DAY" | "HOUR" | "MINUTE") => void;
  setAggLimit: (value: number) => void;
  timePeriod: number;
}

const TimePeriodFilter: React.FC<TimePeriodFilterProps> = ({ setAggPeriod, setAggLimit, timePeriod, setTimePeriod }) => {
  return (
    <div className='pl-3 flex gap-x-3'>  
      <button 
        className={cx({
          'underline text-blue-800': timePeriod === 1
        })} 
        onClick={() => {
          setTimePeriod(1);
          setAggLimit(500);
          setAggPeriod("MINUTE");
        }}
      >
        1D
      </button>
      <button 
        className={cx({
          'underline text-blue-800': timePeriod === 5
        })} 
        onClick={() => {
          setTimePeriod(5);
          setAggLimit(60)
          setAggPeriod("HOUR")
        }}
      >
        5D
      </button>
      <button 
        className={cx({
          'underline text-blue-800': timePeriod === 30
        })} 
        onClick={() => {
          setTimePeriod(30);
          setAggLimit(30)
          setAggPeriod("DAY")
        }}
      >
        1M
      </button>
    </div>
  )
};

export default TimePeriodFilter;
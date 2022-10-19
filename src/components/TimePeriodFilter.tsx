import React, { useState } from 'react';

const RadioTimePeriodFilter = ({ timePeriod, onTimePeriodChange }: { timePeriod: number, onTimePeriodChange: (value: number) => void }) => {
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    onTimePeriodChange(parseInt(event.target.value))
  }
  return (
    <div className='flex gap-x-2' onChange={onChangeHandler}>  
      <input type='radio' checked={timePeriod === 1} value={1} name='1D' /> 1D
      <input type='radio' checked={timePeriod === 5} value={5} name='5D' /> 5D
      <input type='radio' checked={timePeriod === 30} value={30} name='1M' /> 1M
    </div>
  )
};

export default RadioTimePeriodFilter;
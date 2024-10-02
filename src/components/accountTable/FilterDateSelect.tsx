import React, { useState } from 'react';
import { DatePicker } from '@/components/DatePicker';

interface FilterDateSelectProps {
  header: string;
  onDateSelect: (startDate: Date | null, endDate: Date | null) => void;
}

export const FilterDateSelect: React.FC<FilterDateSelectProps> = ({
  header,
  onDateSelect,
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    onDateSelect(date || null, endDate || null);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    onDateSelect(startDate || null, date || null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{header}</label>
      <div className="flex space-x-2">
        <DatePicker
          date={startDate}
          setDate={handleStartDateChange}
          placeholder="Start Date"
          showTime={true}
        />
        <DatePicker
          date={endDate}
          setDate={handleEndDateChange}
          placeholder="End Date"
          showTime={true}
        />
      </div>
    </div>
  );
};
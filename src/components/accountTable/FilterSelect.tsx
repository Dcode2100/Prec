import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterSelectProps {
  header: string;
  options: string[];
  onSelect: (value: string) => void;
  selected: string;
}

 const FilterSelect: React.FC<FilterSelectProps> = ({
  header,
  options,
  onSelect,
  selected,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{header}</label>
      <Select onValueChange={onSelect} value={selected}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${header}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
 };

export default FilterSelect;
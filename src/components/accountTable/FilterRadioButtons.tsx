import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FilterRadioButtonsProps {
  list: { value: string; label: string; id: string }[];
  onSelect: (value: string) => void;
  value: string;
  setValue: (value: string) => void;
}

const FilterRadioButtons: React.FC<FilterRadioButtonsProps> = ({
  list,
  onSelect,
  value,
  setValue,
}) => {
  return (
    <RadioGroup
      onValueChange={(newValue) => {
        setValue(newValue);
        onSelect(newValue);
      }}
      value={value}
      className="flex flex-col space-y-1"
    >
      {list.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <RadioGroupItem value={item.value} id={item.id} />
          <Label htmlFor={item.id}>{item.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default FilterRadioButtons;
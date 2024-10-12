import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { capitalize } from "@/utils/utils";
import FilterHeader from "@/components/accountTable/FilterHeader";

interface FilterNumberProps {
  header: string;
  onChange: (value: any) => void;
  minRange: number;
  maxRange: number;
  step?: number;
  prefix?: string;
}

const FilterNumber = (props: FilterNumberProps): React.ReactElement => {
  const [filterType, setFilterType] = useState("between");
  const [leftBound, setLeftBound] = useState(props.minRange);
  const [rightBound, setRightBound] = useState(props.maxRange);
  const prefix = props.prefix || "";

  let rangeValues = [leftBound];
  if (filterType === "between") {
    rangeValues = [leftBound, rightBound];
  }

  const setValues = (values: number[]) => {
    setLeftBound(values[0]);
    setRightBound(values[1]);

    if (filterType === "less_than") {
      props.onChange([null, values[0]]);
    } else if (filterType === "equal") {
      props.onChange([values[0], values[0] + 1]);
    } else {
      props.onChange([values[0], values[1]]);
    }
  };

  return (
    <div className="space-y-4">
      <FilterHeader value={props.header} />
      <Select
        onValueChange={(value) => setFilterType(value)}
        defaultValue={filterType}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={capitalize(filterType)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="greater_than">Greater Than Equal To</SelectItem>
          <SelectItem value="less_than">Less Than Equal To</SelectItem>
          <SelectItem value="equal">Equal</SelectItem>
          <SelectItem value="between">Between</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            {prefix}
          </span>
          <Input
            type="number"
            min={props.minRange}
            max={props.maxRange}
            step={props.step || 1}
            value={leftBound}
            onChange={(e) => setValues([parseFloat(e.target.value), rightBound])}
            className={cn("pl-8", prefix && "pl-6")}
          />
        </div>
        {filterType === "between" && (
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {prefix}
            </span>
            <Input
              type="number"
              min={props.minRange}
              max={props.maxRange}
              step={props.step || 1}
              value={rightBound}
              onChange={(e) => setValues([leftBound, parseFloat(e.target.value)])}
              className={cn("pl-8", prefix && "pl-6")}
            />
          </div>
        )}
      </div>
      <Slider
        value={rangeValues}
        min={props.minRange}
        max={props.maxRange}
        step={props.step || 1}
        onValueChange={setValues}
        className={`${filterType === "less_than" ? "direction-rtl" : ""} ${
          filterType === "equal" ? "slider-no-track" : ""
        }`}
      />
    </div>
  );
};

export default FilterNumber;

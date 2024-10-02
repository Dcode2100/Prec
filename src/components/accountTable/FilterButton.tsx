import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Generic } from "@/lib/types/types";
import { getNumberInRupee } from "@/utils/utils";
import numeral from "numeral";

interface FilterButtonProps {
  filterPills: Generic;
  openFilter: () => void;
  removeFilter: (filter: string) => void;
  className?: string;
}

const FilterButton = ({ filterPills, openFilter, removeFilter, className }: FilterButtonProps): React.ReactElement => {
  return (
    <div className={`flex items-center ${className || ''}`}>
      <div className="flex flex-wrap gap-2 flex-grow">
        {Object.entries(filterPills)
          .filter(([_, value]) => value && value.toLowerCase() !== "all")
          .map(([key, value]) => (
            <Badge key={key} variant="secondary" className="pl-2 pr-1 py-1">
              {value}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent"
                onClick={() => removeFilter(key)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
      </div>
      <Button variant="outline" size="sm" onClick={openFilter} className="ml-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filter
      </Button>
    </div>
  );
};

export const rangeToPill = (
  field: string,
  range: any,
  money = false
): string => {
  let left = numeral(range[0]).format("0");
  let right = numeral(range[1]).format("0");
  if (money) {
    left = getNumberInRupee(range[0]);
    right = getNumberInRupee(range[0]);
  }

  if (range[0] && range[1]) {
    return `${field} ${left} to ${right}`;
  } else if (range[0]) {
    return `${field} > ${left}`;
  } else if (range[1]) {
    return `${field} < ${right}`;
  }

  return "";
};

export const dateRangeToPill = (dates: any): string => {
  if (!dates[0] || !dates[1]) return "";
  const fmt = (d: moment.Moment) => d.toISOString().slice(0, 10);
  return fmt(dates[0]) + " to " + fmt(dates[1]);
};

export default FilterButton;

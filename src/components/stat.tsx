import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { getNumberInRupee } from "@/utils/utils";
import numeral from "numeral";

interface StatProps {
  change?: number;
  changeInfo?: string;
  stat: number | string | undefined;
  statInfo: string;
  isMoney?: boolean;
  isLoading?: boolean;
  currentPath?: string;
}

const Stat = (props: StatProps): React.ReactElement => {
  let stat = props.stat;
  if (typeof props.stat === "number") {
    stat = props.isMoney
      ? getNumberInRupee(props.stat)
      : numeral(props.stat).format("0,0");
  }

  const statSizeClass = cn({
    "text-2xl md:text-4xl": ["/orderanalytics", "/delivery_journey", "/acquisition", "/activation_analytics"].includes(props.currentPath || ''),
    "text-xl md:text-2xl": !["/orderanalytics", "/delivery_journey", "/acquisition", "/activation_analytics"].includes(props.currentPath || ''),
  });

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <p className="text-muted-foreground text-sm md:text-lg">
          {props.statInfo}
        </p>
        {props.isLoading ? (
          <Skeleton className="h-8 w-[200px] mt-2" />
        ) : (
          <p className={cn("font-medium", statSizeClass)}>{stat}</p>
        )}
        {(props.change || props.change === 0) && (
          <div className="flex items-center mt-2 space-x-2">
            <div className={cn(
              "flex items-center",
              props.change >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {props.change >= 0 ? (
                <ArrowUpIcon className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4" />
              )}
              <span className="text-sm md:text-lg">
                {numeral(props.change).format("+0.00 %")}
              </span>
            </div>
            <span className="text-muted-foreground text-sm md:text-lg hidden md:inline">
              {props.changeInfo}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Stat;

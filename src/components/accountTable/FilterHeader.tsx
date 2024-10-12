import React from "react";

const FilterHeader = (props: { value: string }): React.ReactElement => {
  return (
    <h2 className="text-md mt-2 font-medium">
      {props.value}
    </h2>
  );
};

export default FilterHeader;

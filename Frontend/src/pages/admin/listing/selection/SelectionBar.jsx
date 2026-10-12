import React from "react";
import SearchBlock from "./SearchBlock";
import DropDown from "./DropDown";
import {
  BATHS,
  BEDS,
  LISTING_TYPE,
  LOCATION,
  PROPERTY_TYPE,
  STATUS,
} from "../../../../utils/listing_data.js";

const SelectionBar = () => {
  return (
    <div
      className="border-b-2 border-b-gray-200 px-3 py-2 grid gap-2 
  grid-cols-[repeat(auto-fit,minmax(160px,1fr))]"
    >
      {/* search block */}
      <SearchBlock />
      {/* property type dropdown */}
      <DropDown title={"Property type"} contentArr={PROPERTY_TYPE} />
      {/* listing type dropdown */}
      <DropDown title={"listing type"} contentArr={LISTING_TYPE} />
      {/* bed dropdown */}
      <DropDown title={"beds"} contentArr={BEDS} />
      {/* bath dropdown */}
      <DropDown title={"baths"} contentArr={BATHS} />
      {/* location dropdown */}
      <DropDown title={"location"} contentArr={LOCATION} />
      {/* status dropdown */}
      <DropDown title={"staus"} contentArr={STATUS} />
      {/* rating dropdown */}
    </div>
  );
};

export default SelectionBar;

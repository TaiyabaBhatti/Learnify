import React from "react";
import MainHeader from "../MainHeader";
import ListingPropertyCard from "./ListingPropertyCard";
import { PROPERTY_LISTINGS } from "../../../utils/listing_data";
import SelectionBar from "./selection/SelectionBar";
MainHeader;

const ListingProperties = () => {
  return (
    <>
      <section className="">
        <MainHeader title={"Listings"} />

        <SelectionBar />
        <div className="p-2 mt-3  flex flex-wrap gap-3">
          {PROPERTY_LISTINGS.map((property, index) => {
            return <ListingPropertyCard key={index} data={property} />;
          })}
        </div>
      </section>
    </>
  );
};

export default ListingProperties;

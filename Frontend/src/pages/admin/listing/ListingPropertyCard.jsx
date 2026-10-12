import React from "react";
import ImageStateBlock from "../../../components/ImageStateBlock";
import { FaBed, FaEye } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { TbRubberStamp, TbRulerMeasure } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const ListingPropertyCard = ({ data }) => {
  return (
    <div className="rounded-lg hover:shadow-md transition overflow-hidden border border-gray-200 p-2 w-fit flex gap-x-1.5 text-scarpa-flow font-light min-w-lg">
      {/* Property image  */}

      <ImageStateBlock
        src={data?.imageUrl}
        alt={"Apartment"}
        parentProperties={""}
        childProperties={""}
      />

      <div className="space-y-3">
        {/* Title  */}
        <h1 className="capitalize text-lg leading-6 font-bold text-blue-zodiac">
          {data?.title}
        </h1>

        {/* Location Area */}
        <p className="text-sm">{data?.address}</p>

        {/* beds, bath, sq */}

        <div className="flex items-center gap-x-3 text-sm">
          <div className="flex items-center gap-x-1">
            <FaBed className="" />
            <span>{data?.beds} beds</span>
          </div>
          <div className="flex items-center gap-x-1">
            <FaBath />
            <span>{data?.baths} bath</span>
          </div>
          <div className="flex items-center gap-x-1">
            <TbRulerMeasure />
            <span>{data?.sqYards} sqyards</span>
          </div>
        </div>

        <hr className="border border-gray-200" />

        {/* Views  */}
        {/* Publish date  */}

        <div className="flex items-center gap-x-3 text-sm">
          <div className="flex items-center gap-x-1">
            <FaRegClock />
            <span>Published {data?.published}</span>
          </div>
          <div className="flex items-center gap-x-1">
            <FaEye />
            <span>{data?.views} views</span>
          </div>
        </div>

        {/* Price  */}

        {/* Status badge  */}
        {/* Edit/Delete buttons  */}
      </div>
    </div>
  );
};

export default ListingPropertyCard;

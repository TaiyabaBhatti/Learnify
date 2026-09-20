import React from "react";

const HighlightBlock = ({ objective }) => {
  return (
    <div className=" ">
      <p className="">Learning Objective</p>
      <p className="">{objective}</p>
    </div>
  );
};

export default HighlightBlock;

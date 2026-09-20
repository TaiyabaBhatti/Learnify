import React from "react";

const FollowupQuestions = ({ followupQuestions }) => {
  return (
    <div className="bg-white ">
      <p className="text-sm font-semibold ">Follow-up Questions</p>
      <div className="space-y-2">
        {followupQuestions?.map((question, index) => (
          <div key={index} className="flex gap-3">
            <span className=" text-xs ">{index + 1}</span>
            <p className="text-sm text-gray-700">{question}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowupQuestions;

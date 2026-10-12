import React from "react";
// import AdminIcon from "../../assets/images/admin-icon.jpg";

const AccountBlock = () => {
  return (
    <div className="flex items-center gap-x-2 p-5 border-t-2 border-t-gray-200">
      <div className="rounded-full w-10 h-10 bg-black"></div>
      <div>
        <h6 className="text-xs font-semibold">Student</h6>
        <p className="text-xs">Online</p>
      </div>
    </div>
  );
};

export default AccountBlock;

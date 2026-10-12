import React, { useEffect, useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { GrDocumentPerformance } from "react-icons/gr";
import { SiOpenmediavault } from "react-icons/si";
import { IoPeople } from "react-icons/io5";
// import dashboardAsideImg from "../../assets/dashbaord-aside-image.jpg";
import { HiMiniBuildingStorefront } from "react-icons/hi2";
import TabItem from "./TabItem";
import AccountBlock from "./AccountBlock";
import PageLogo from "../../components/PageLogo";
import { MENU_ITEMS } from "../../utils/raw_data";

const SideBar = ({ selectedSection, setSelectedSection }) => {
  const iconMap = {
    dashboard: <RxDashboard className="text-gray-600" />,
    lesson: <HiMiniBuildingStorefront className="text-gray-600" />,
    history: <SiOpenmediavault className="text-gray-600" />,
  };

  const [activeTab, setActiveTab] = useState(null);
  const [sidebarActive, setSidebarActive] = useState(true);

  useEffect(() => {}, [sidebarActive]);

  const handleTabClick = (id) => {
    setActiveTab((prev) => (prev === id ? null : id));
    setSelectedSection(id);
  };

  return (
    <aside className="h-screen border-r-2 border-r-gray-200 w-56 fixed left-0 top-0  ">
      {/* logo */}
      <div className=" h-20 p-5 border-b-2 border-b-gray-200">
        <PageLogo />
      </div>
      {/* side bar navigation tabs */}
      <div className="flex flex-col justify-between h-9/10">
        <div className=" p-3">
          {MENU_ITEMS.map((item) => {
            return (
              <div key={item.id}>
                {/* main tab */}
                <TabItem
                  tabStatus={activeTab === item.id}
                  text={item.text}
                  icon={iconMap[item.icon]}
                  onClick={() => handleTabClick(item.id)}
                />

                {/* subtab */}
                {activeTab === item.id && (
                  <div className="ml-2 pl-2 mt-2 space-y-2 border-l-2 border-l-gray-200">
                    {item?.subItems?.map((sub, index) => (
                      <p
                        key={index}
                        className="text-sm text-gray-950 cursor-pointer hover:text-black bg-green-haze opacity-60 hover:opacity-70 rounded-lg px-2 py-1"
                      >
                        {sub}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* admin account */}
        <AccountBlock />
      </div>
    </aside>
  );
};

export default SideBar;

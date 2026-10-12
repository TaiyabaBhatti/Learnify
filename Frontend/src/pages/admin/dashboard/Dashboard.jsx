import React from "react";
import MainHeader from "../MainHeader.jsx";
import SystemPromptBlock from "./SystemPromptBlock.jsx";

const Dashboard = () => {
  return (
    <>
      <section className="pt-28 flex items-center justify-center">
        <div>
          <MainHeader />
          <SystemPromptBlock />
        </div>
      </section>
    </>
  );
};

export default Dashboard;

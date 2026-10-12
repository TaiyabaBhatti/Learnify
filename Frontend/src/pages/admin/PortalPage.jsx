import React, { useState } from "react";
import SideBar from "./SideBar";
import PageLogo from "../../components/PageLogo";
import Dashboard from "./dashboard/Dashboard";
import ListingProperties from "./listing/ListingProperties";

const PortalPage = () => {
  // keeping track of sections

  const [selectedSection, setSelectedSection] = useState("dashboard");

  return (
    <section className="relative z-40">
      <SideBar
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />

      <main className="ml-56 bg-opacity-blue min-h-screen">
        {selectedSection === "dashboard" && <Dashboard />}
        {selectedSection === "listing" && <ListingProperties />}
      </main>
    </section>
  );
};

export default PortalPage;

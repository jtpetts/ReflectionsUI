import React from "react";
import AboutSection from "./sections/aboutSection";
import AdminLoginSection from "./sections/adminLoginSection";
import ArchitectureSection from "./sections/architectureSection";
import GuestLoginSection from "./sections/guestLoginSection";

function About() {
  return (
    <React.Fragment>
      <AboutSection />
      <ArchitectureSection />
      <GuestLoginSection />
      <AdminLoginSection />
    </React.Fragment>
  );
}

//https://www.amazon.com/dp/B00BSK6KSC/

export default About;

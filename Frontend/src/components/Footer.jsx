import React from "react";
import footerImage from "../assets/images/footer-bg-image.jpg";
import Wrapper from "./Wrapper";
import PageLogo from "./PageLogo";
import FooterTab from "./FooterTab";
import { IoLocation } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import {
  ADDRESS,
  EMAIL,
  FOOTER_NAVIGATION,
  FOOTER_QUICK_LINK,
  FOOTER_SERVICES,
  PHONE,
} from "../utils/raw_data";

const Footer = () => {
  return (
    <footer
      className="min-h-96  w-full bg-cover bg-center flex items-center relative py-10"
      style={{ backgroundImage: `url(${footerImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <Wrapper properties="relative z-10 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-4  gap-10 ">
          <div>
            <PageLogo />
            <p className="max-w-56 text-gray-100">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Explicabo, in!
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="text-lg text-green-haze font-medium mb-1">
              Navigation
            </h4>
            {FOOTER_NAVIGATION.map((tab, index) => {
              return <FooterTab key={index} text={tab} />;
            })}
          </div>
          <div className="flex flex-col">
            <h4 className="text-lg font-medium mb-1 text-green-haze">
              Quick Link
            </h4>
            {FOOTER_QUICK_LINK.map((tab, index) => {
              return <FooterTab key={index} text={tab} />;
            })}
          </div>
          <div className="flex flex-col">
            <h4 className="text-lg font-medium mb-1 text-green-haze">
              Services
            </h4>
            {FOOTER_SERVICES.map((tab, index) => (
              <FooterTab key={index} text={tab} />
            ))}
          </div>
        </div>
        <div className="flex items-start flex-col lmd:flex-row lmd:items-center gap-x-7">
          <div className="flex items-center gap-x-1">
            <IoLocation className="text-lg text-green-haze" />
            <p className="text-lg font-semibold text-white">{ADDRESS}</p>
          </div>
          <div className="flex items-center gap-x-1">
            <MdEmail className="text-lg text-green-haze" />
            <p className="text-lg font-semibold text-white">{EMAIL}</p>
          </div>
          <div className="flex items-center gap-x-1">
            <FaPhoneAlt className="text-lg text-green-haze" />
            <p className="text-lg font-semibold text-white">{PHONE}</p>
          </div>
        </div>
        <hr className="border-gray-600 border-[1.5px]" />

        <p className="font-medium text-center text-white">
          @2024 Revaz Template . All Rights Reserved
        </p>
      </Wrapper>
    </footer>
  );
};

export default Footer;

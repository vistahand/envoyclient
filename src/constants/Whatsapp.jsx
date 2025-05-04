import React from "react";
import { IoLogoWhatsapp } from "react-icons/io5";
import { useLocation } from "react-router-dom";

const WhatsappLink = () => {
  const location = useLocation().pathname;
  const user = location.startsWith("/user") || location.startsWith("/user/");
  const admin = location.startsWith("/admin") || location.startsWith("/admin/");
  const login = location.startsWith("/login") || location.startsWith("/login/");
  const register =
    location.startsWith("/register") || location.startsWith("/register/");
  const verify =
    location.startsWith("/admin-verify") ||
    location.startsWith("/admin-verify/");
  const reset =
    location.startsWith("/reset-password") ||
    location.startsWith("/reset-password/");
  const forgot =
    location.startsWith("/forgot-password") ||
    location.startsWith("/forgot-password/");
  const whatsappNumber = import.meta.env.VITE_ADMIN_NUMBER;

  const openWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello, I have an enquiry about Envoy Angel's services.`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* WhatsApp Button */}
      <div
        className={`${
          admin || user || register || login || verify || reset || forgot
            ? "hidden"
            : "block"
        } bg-[#25D366] py-3 px-3 fixed md:bottom-10 z-20
        ss:bottom-8 bottom-6 md:right-20 ss:right-16 right-5 rounded-full 
        transition-opacity duration-400 cursor-pointer grow2 hover:scale-110
        `}
        onClick={openWhatsApp}
      >
        <div className="flex items-center gap-2 ps-1">
          <span
            className={` text-white md:text-[14px] ss:text-[20px] text-[16px]`}
          >
            <strong>Reach us →</strong>
          </span>
          <IoLogoWhatsapp
            className="text-white md:text-[30px] ss:text-[26px]
          text-[22px]"
          />
        </div>
      </div>
    </>
  );
};

export default WhatsappLink;

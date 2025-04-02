import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdOutlineWarehouse } from "react-icons/md";

const PickupLocationCard = ({ name, address, phone, days, shippingTypes }) => {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg p-5 shadow-sm 
                    flex flex-col md:flex-row md:justify-between md:items-center">
      {/* Top Section (Icon & Details) - Mobile & Desktop */}
      <div className="flex items-start sm:items-center gap-4">
        <MdOutlineWarehouse className="text-2xl md:text-3xl text-primary" />
        <div>
          <h3 className="font-semibold text-gray-900 text-[16px] md:text-lg">{name}</h3>
          <p className="text-gray-600 text-[14px] md:text-sm">{address}</p>
          <p className="font-semibold text-gray-900 text-[14px] md:text-sm">{phone}</p>
        </div>
      </div>

      {/* Horizontal Divider for Mobile */}
      <div className="border-t border-gray-300 my-3 md:hidden"></div>

      {/* Middle Section - Days (Mobile & Desktop) */}
      <p className="text-gray-700 text-[14px] md:text-sm">{days}</p>

      {/* Horizontal Divider for Mobile */}
      <div className="border-t border-gray-300 my-3 md:hidden"></div>

      {/* Bottom Section - Shipping Types & More Icon */}
      <div className="flex justify-between items-center md:gap-6">
        {/* Shipping Types */}
        <div className="text-[14px] md:text-sm text-gray-700">
          {shippingTypes.map((type, index) => (
            <p key={index}>{type}</p>
          ))}
        </div>

        {/* More Options Icon - Positioned Correctly */}
        <FiMoreHorizontal className="text-gray-500 text-xl cursor-pointer" />
      </div>
    </div>
  );
};

export default PickupLocationCard;

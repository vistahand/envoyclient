import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { HiOutlineSearch } from "react-icons/hi";
import { shipmentHead } from "../../constants";
import {
  AiOutlineDoubleLeft,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineDoubleRight,
} from "react-icons/ai";
import { TiArrowSortedDown } from "react-icons/ti";
import { LuArrowLeftRight } from "react-icons/lu";
import {
  HiOutlineDotsHorizontal,
  HiOutlineDocumentDownload,
} from "react-icons/hi";
import { GrLocation } from "react-icons/gr";
import { TbTrashX } from "react-icons/tb";
import { IoInformationCircleOutline } from "react-icons/io5";
import { shipments } from "../../services/api";
import { format } from "date-fns";

const Shipments = () => {
  const [selectedTab, setSelectedTab] = useState("active");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalShipments, setTotalShipments] = useState(0);
  const [menuOpen, setMenuOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shipmentData, setShipmentData] = useState([]);
  const [displayedShipments, setDisplayedShipments] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShipments();
  }, [currentPage, rowsPerPage, selectedTab]);

  const fetchShipments = async () => {
    try {
      setLoading(true);

      // Get shipments from API
      const response = await shipments.getAll(currentPage, rowsPerPage);

      if (response.success) {
        const apiShipments = response.data.shipments;
        setShipmentData(apiShipments);

        // Set pagination details
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
          setTotalShipments(response.data.pagination.total);
        }

        // Transform API data to match the table format
        const transformedShipments = apiShipments.map((shipment) => {
          // Filter by status based on the selected tab
          let includeShipment = true;
          if (
            selectedTab === "active" &&
            shipment.status !== "awaiting_pickup" &&
            shipment.status !== "in_transit"
          ) {
            includeShipment = false;
          } else if (
            selectedTab === "delivered" &&
            shipment.status !== "delivered"
          ) {
            includeShipment = false;
          } else if (
            selectedTab === "pending" &&
            shipment.status !== "pending"
          ) {
            includeShipment = false;
          }

          // Format dates
          const createdDate = shipment.createdAt
            ? format(new Date(shipment.createdAt), "dd MMM yyyy")
            : "";
          const estimatedDelivery = shipment.delivery?.estimatedDate
            ? format(new Date(shipment.delivery.estimatedDate), "dd MMM yyyy")
            : "";

          return {
            _id: shipment._id,
            include: includeShipment,
            trackId: shipment.trackingNumber || "N/A",
            shipDate: createdDate,
            estDelivery: estimatedDelivery,
            shipType:
              shipment.type === "international" ? "International" : "Local",
            destination: `${shipment.recipient?.address?.city || ""}, ${
              shipment.recipient?.address?.country || ""
            }`,
            recipient: shipment.recipient?.name || "N/A",
            shipStatus: mapStatusToDisplay(shipment.status),
            rawStatus: shipment.status,
            cost: shipment.cost?.total || 0,
            currency: shipment.cost?.currency || "eur",
          };
        });

        // Filter shipments based on the selected tab
        setDisplayedShipments(transformedShipments.filter((s) => s.include));
      } else {
        setError(response.message || "Failed to fetch shipments");
      }
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setError("An error occurred while fetching shipments");
    } finally {
      setLoading(false);
    }
  };

  // Map API status to display text
  const mapStatusToDisplay = (status) => {
    switch (status) {
      case "awaiting_pickup":
        return "Awaiting Pickup";
      case "in_transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      case "pending":
        return "Pending";
      default:
        return (
          status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")
        );
    }
  };

  const handleSelectItem = (e, index) => {
    e.stopPropagation();
    const newSelectedShipments = [...selectedShipments];

    if (newSelectedShipments.includes(index)) {
      newSelectedShipments.splice(newSelectedShipments.indexOf(index), 1);
    } else {
      newSelectedShipments.push(index);
    }

    setSelectedShipments(newSelectedShipments);
    setSelectAll(newSelectedShipments.length === displayedShipments.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedShipments([]);
    } else {
      setSelectedShipments([...Array(displayedShipments.length).keys()]);
    }
    setSelectAll(!selectAll);
  };

  const toggleMenu = (index) => {
    if (menuOpen === index) {
      setMenuOpen(null);
      return;
    }
    setMenuOpen(index);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRowClick = (data) => {
    navigate(`/user/shipments/details?id=${data._id}`);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTrackShipment = (e, trackingId) => {
    e.stopPropagation();
    navigate(`/trackshipment?tracking=${trackingId}`);
  };

  const handleViewDetails = (e, id) => {
    e.stopPropagation();
    navigate(`/user/shipments/details?id=${id}`);
  };

  const handleDownloadReceipt = (e, id) => {
    e.stopPropagation();
    // Implement download receipt functionality
    console.log("Download receipt for", id);
  };

  const handleCancelShipment = (e, id) => {
    e.stopPropagation();
    // Implement cancel shipment functionality
    console.log("Cancel shipment", id);
  };

  return (
    <section className="w-full">
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex justify-between items-center md:gap-0 ss:gap-0 gap-8">
          <div className="flex flex-col">
            <h1
              className="text-primary tracking-tight font-bold md:text-[30px] 
            ss:text-[30px] text-[23px]"
            >
              Shipments
            </h1>

            <h4
              className="text-main2 tracking-tight font-medium md:text-[16px] 
            ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem] 
            leading-[1.2rem] md:max-w-full ss:max-w-[80%] max-w-full"
            >
              Create, view, track and manage all your active and delivered
              shipments in one place
            </h4>
          </div>

          <button
            type="button"
            onClick={() => navigate("/user/shipments/createshipment")}
            className="bg-primary md:text-[14px] ss:text-[15px] text-[13px]
          md:py-3 ss:py-3 py-2.5 md:px-6 ss:px-6 px-2.5 flex text-white md:rounded-xl ss:rounded-xl
          rounded-lg grow4 cursor-pointer items-center justify-center gap-3 md:w-auto ss:w-[27%]"
          >
            <p className="hidden md:flex ss:flex">Create New</p>

            <GoPlus className="text-[20px]" />
          </button>
        </div>

        <div className="w-full flex flex-col gap-6">
          <div
            className="flex items-center md:gap-6 ss:gap-6 gap-5 
          tracking-tight"
          >
            <h2
              className={`text-main4 md:text-[15px] ss:text-[15px] text-[14px]
            ${
              selectedTab === "active"
                ? "text-primary font-extrabold border-b-primary border-b-[2px] px-3"
                : "font-semibold"
            } 
              md:pb-2 ss:pb-2 pb-1 text-center cursor-pointer
              hover:text-primary navsmooth3`}
              onClick={() => handleTabChange("active")}
            >
              Active
            </h2>

            <h2
              className={`text-main4 md:text-[15px] ss:text-[15px] text-[14px]
            text-center hover:text-primary cursor-pointer navsmooth3
            ${
              selectedTab === "delivered"
                ? "text-primary font-extrabold border-b-primary border-b-[2px] px-3"
                : "font-semibold"
            }
            md:pb-2 ss:pb-2 pb-1`}
              onClick={() => handleTabChange("delivered")}
            >
              Delivered
            </h2>

            <h2
              className={`text-main4 md:text-[15px] ss:text-[15px] text-[14px]
            text-center hover:text-primary cursor-pointer navsmooth3
            ${
              selectedTab === "pending"
                ? "text-primary font-extrabold border-b-primary border-b-[2px] px-3"
                : "font-semibold"
            }
            md:pb-2 ss:pb-2 pb-1`}
              onClick={() => handleTabChange("pending")}
            >
              Pending
            </h2>
          </div>

          <div className="w-full">
            <div
              className="md:w-[40%] ss:w-[70%] w-full rounded-lg p-3 
            gap-5 outline outline-[1px] outline-main7 bg-mainalt flex 
            items-center justify-between"
            >
              <input
                type="text"
                placeholder="Search by origin, destination, recipient details, etc."
                className="text-main8 focus:outline-none text-[14px] w-full
                placeholder:text-[13px] placeholder:text-main8 font-medium 
                tracking-tight bg-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />

              <HiOutlineSearch className="w-[1.4rem] h-auto text-main8 cursor-pointer" />
            </div>
          </div>

          <div className="w-full rounded-lg outline outline-[1px] outline-main9 md:p-5 ss:p-5 p-4 flex flex-col gap-5">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-main4">Loading shipments...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-mainRed">{error}</p>
              </div>
            ) : displayedShipments.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-10 gap-4">
                <p className="text-main4">
                  No shipments found in this category.
                </p>
                <button
                  onClick={() => navigate("/user/shipments/createshipment")}
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm"
                >
                  Create New Shipment
                </button>
              </div>
            ) : (
              <div className="w-full rounded-lg outline outline-[1px] outline-main9 overflow-x-auto">
                <table className="w-full p-5 overflow-x-auto md:mr-0 mr-3">
                  <thead className="md:text-[14px] ss:text-[14px] text-[13px] font-medium text-main4 tracking-tight">
                    <tr className="w-full">
                      <th className="text-left pl-5 py-5 border-b border-main9">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className={`cursor-pointer custom-checkbox ${
                            !selectAll ? "custom-checkbox-head" : ""
                          } checkbox2`}
                        />
                      </th>

                      <th className="md:hidden text-left ss:pl-5 pl-4 ss:py-5 py-4 border-b border-main9"></th>

                      {shipmentHead.map((item, index) => (
                        <th
                          key={index}
                          index={index}
                          className="text-left pl-5 py-5 border-b border-main9"
                        >
                          <div className="flex items-center">
                            <h2 className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[15ch]">
                              {item.title}
                            </h2>

                            {(item.id === "shipdate" ||
                              item.id === "estDelivery") && (
                              <LuArrowLeftRight className="w-4 h-4 transform rotate-90 ml-3 cursor-pointer text-main2" />
                            )}
                          </div>
                        </th>
                      ))}

                      <th className="hidden md:table-cell pl-5 py-5 border-b border-main9"></th>
                    </tr>
                  </thead>

                  <tbody className="md:text-[14px] ss:text-[14px] text-[13px] font-semibold text-main2 tracking-tight">
                    {displayedShipments.map((data, index) => (
                      <tr
                        key={data._id}
                        onClick={() => handleRowClick(data)}
                        className="cursor-pointer hover:bg-mainalt"
                      >
                        <td
                          className="text-left pl-5 md:py-5 ss:py-5 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedShipments.includes(index)}
                            onChange={(e) => handleSelectItem(e, index)}
                            className={`cursor-pointer custom-checkbox ${
                              !selectedShipments.includes(index)
                                ? "custom-checkbox-head"
                                : ""
                            } checkbox2`}
                          />
                        </td>

                        <td
                          className="md:hidden text-left ss:pl-5 pl-4 ss:py-5 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            className="cursor-pointer"
                            onClick={() => toggleMenu(index)}
                          >
                            <HiOutlineDotsHorizontal className="text-main4 text-[20px]" />
                          </div>
                          {menuOpen === index && (
                            <div
                              ref={menuRef}
                              className="absolute top-0 left-12 bg-white 
                              rounded-lg shadow-[0px_5px_15px_rgba(0,0,0,0.20)] z-50 w-[200px] navsmooth"
                            >
                              <ul className="list-none divide-y divide-main7">
                                <li
                                  className="p-3 hover:bg-mainalt cursor-pointer text-main2 flex items-center gap-2"
                                  onClick={(e) =>
                                    handleTrackShipment(e, data.trackId)
                                  }
                                >
                                  <GrLocation className="text-[17px]" />
                                  Track shipment
                                </li>
                                <li
                                  className="p-3 hover:bg-mainalt cursor-pointer text-main2 flex items-center gap-2"
                                  onClick={(e) =>
                                    handleViewDetails(e, data._id)
                                  }
                                >
                                  <IoInformationCircleOutline className="text-[17px]" />
                                  See full details
                                </li>
                                <li
                                  className="p-3 hover:bg-mainalt cursor-pointer text-main2 flex items-center gap-2"
                                  onClick={(e) =>
                                    handleDownloadReceipt(e, data._id)
                                  }
                                >
                                  <HiOutlineDocumentDownload className="text-[17px]" />
                                  Download receipt
                                </li>
                                <li
                                  className="p-3 hover:bg-mainalt cursor-pointer text-mainRed flex items-center gap-2"
                                  onClick={(e) =>
                                    handleCancelShipment(e, data._id)
                                  }
                                >
                                  <TbTrashX className="text-[17px]" />
                                  Cancel Shipment
                                </li>
                              </ul>
                            </div>
                          )}
                        </td>

                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4">
                          {data.trackId}
                        </td>
                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4">
                          {data.shipDate}
                        </td>
                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4">
                          {data.estDelivery}
                        </td>
                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4">
                          {data.shipType}
                        </td>
                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4">
                          {data.destination}
                        </td>
                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[15ch]">
                          {data.recipient}
                        </td>
                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4">
                          {data.shipStatus}
                        </td>

                        <td
                          className="hidden md:table-cell relative text-left md:px-4 ss:px-4 px-3 md:py-5 ss:py-5 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            className="cursor-pointer"
                            onClick={() => toggleMenu(index)}
                          >
                            <HiOutlineDotsHorizontal className="text-main4 text-[24px]" />
                          </div>
                          {menuOpen === index && (
                            <div
                              ref={menuRef}
                              className="absolute top-5 right-[100%] bg-white 
                              rounded-lg shadow-[0px_5px_15px_rgba(0,0,0,0.20)] z-50 w-[200px] navsmooth"
                            >
                              <ul className="list-none divide-y divide-main7">
                                <li
                                  className="p-3 hover:bg-mainalt cursor-pointer text-main2 flex items-center gap-2"
                                  onClick={(e) =>
                                    handleTrackShipment(e, data.trackId)
                                  }
                                >
                                  <GrLocation className="text-[17px]" />
                                  Track shipment
                                </li>
                                <li
                                  className="p-3 hover:bg-mainalt cursor-pointer text-main2 flex items-center gap-2"
                                  onClick={(e) =>
                                    handleViewDetails(e, data._id)
                                  }
                                >
                                  <IoInformationCircleOutline className="text-[17px]" />
                                  See full details
                                </li>
                                <li
                                  className="p-3 hover:bg-mainalt cursor-pointer text-main2 flex items-center gap-2"
                                  onClick={(e) =>
                                    handleDownloadReceipt(e, data._id)
                                  }
                                >
                                  <HiOutlineDocumentDownload className="text-[17px]" />
                                  Download receipt
                                </li>
                                <li
                                  className="p-3 hover:bg-mainalt cursor-pointer text-mainRed flex items-center gap-2"
                                  onClick={(e) =>
                                    handleCancelShipment(e, data._id)
                                  }
                                >
                                  <TbTrashX className="text-[17px]" />
                                  Cancel Shipment
                                </li>
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="w-full border-t-[1px] border-main9 md:px-5 md:py-5 py-5 ss:px-5">
              <div
                className="flex items-center md:justify-end ss:justify-end justify-between text-main8 md:text-[14px] ss:text-[15px]
              text-[14px] tracking-tight font-medium md:mr-10 ss:mr-10"
              >
                <div className="flex items-center">
                  <span className="ss:mr-2 mr-1">Rows per page:</span>

                  <div className="relative flex items-center">
                    <select
                      value={rowsPerPage}
                      onChange={handleChangeRowsPerPage}
                      className="bg-transparent md:pr-6 ss:pr-6 pr-4 md:mr-2 mr-3 py-1 custom-select
                      cursor-pointer px-2"
                    >
                      {[10, 20, 30, 50].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3">
                      <TiArrowSortedDown className="text-main text-[15px]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center md:ml-6 ss:ml-8 md:mr-5">
                  <span className="md:mr-0 ss:mr-0 mr-5">
                    {`${Math.min(
                      (currentPage - 1) * rowsPerPage + 1,
                      totalShipments
                    )}-${Math.min(currentPage * rowsPerPage, totalShipments)} 
                    of ${totalShipments}`}
                  </span>

                  <button
                    onClick={handleFirstPage}
                    className="md:ml-6 ss:ml-10 ml-2"
                  >
                    <AiOutlineDoubleLeft />
                  </button>

                  <button onClick={handlePreviousPage} className="ml-3">
                    <AiOutlineLeft />
                  </button>

                  <button onClick={handleNextPage} className="ml-3">
                    <AiOutlineRight />
                  </button>

                  <button onClick={handleLastPage} className="ml-3">
                    <AiOutlineDoubleRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shipments;

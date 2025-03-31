import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";
import { paymentHead } from "../../constants";
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
import { PiWarningOctagon } from "react-icons/pi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { payments } from "../../services/api";
import { format } from "date-fns";

const Payments = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [displayedPayments, setDisplayedPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, [currentPage, rowsPerPage]);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      // Get payments from API
      const response = await payments.getAll({
        page: currentPage,
        limit: rowsPerPage,
      });

      if (response.success) {
        const apiPayments = response.data.payments;
        setPaymentData(apiPayments);

        // Set pagination details
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
          setTotalPayments(parseInt(response.data.pagination.total));
        }

        // Transform API data to match the table format
        const transformedPayments = apiPayments.map((payment) => {
          // Format dates
          const createdDate = payment.payment?.createdAt
            ? format(new Date(payment.payment.createdAt), "dd MMM yyyy")
            : format(new Date(payment.createdAt), "dd MMM yyyy");

          // Format currency and amount
          const amount = payment.cost?.total || payment.payment?.amount || 0;
          const currency = payment.cost?.currency || "eur";
          const formattedAmount = formatAmount(amount, currency);

          return {
            _id: payment._id,
            amount: formattedAmount,
            transId: payment.payment?.transactionId || "N/A",
            initDate: createdDate,
            payPurpose: getPaymentPurpose(payment),
            payMethod: formatPaymentMethod(
              payment.payment?.method || "unknown"
            ),
            payStat: capitalize(payment.payment?.status || "unknown"),
            trackingNumber: payment.trackingNumber || "N/A",
            rawStatus: payment.payment?.status || "unknown",
          };
        });

        setDisplayedPayments(transformedPayments);
      } else {
        setError(response.message || "Failed to fetch payments");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("An error occurred while fetching payments");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount, currency) => {
    if (currency === "eur") {
      return `€${amount.toFixed(2)}`;
    } else if (currency === "ngn") {
      return `₦${amount.toFixed(2)}`;
    }
    return `${amount.toFixed(2)}`;
  };

  const getPaymentPurpose = (payment) => {
    if (payment.trackingNumber) {
      const shipmentType = payment.trackingNumber.startsWith("INT")
        ? "International"
        : "Local";
      return `${shipmentType} Shipping`;
    }
    return "Shipping Service";
  };

  const formatPaymentMethod = (method) => {
    switch (method) {
      case "stripe":
        return "Online (Stripe)";
      case "bank_transfer":
        return "Bank Transfer";
      case "cash":
        return "Cash";
      default:
        return capitalize(method);
    }
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace("_", " ");
  };

  const handleSelectRow = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
    setSelectAll(selectedRows.length + 1 === displayedPayments.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...Array(displayedPayments.length).keys()]);
    }
    setSelectAll(!selectAll);
  };

  const toggleMenu = (index) => {
    setMenuOpen(menuOpen === index ? null : index);
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
    navigate(`/user/payments/details?id=${data._id}`);
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (e, id) => {
    e.stopPropagation();
    navigate(`/user/payments/details?id=${id}`);
  };

  const handleDownloadReceipt = (e, id) => {
    e.stopPropagation();
    // Implement download receipt functionality
    console.log("Download receipt for", id);
  };

  const handleReportProblem = (e, id) => {
    e.stopPropagation();
    // Implement report problem functionality
    console.log("Report problem for", id);
  };

  const PendingFinalization = () => {
    const [pendingShipment, setPendingShipment] = useState(null);

    useEffect(() => {
      const lastPayment = localStorage.getItem("lastSuccessfulPayment");
      if (lastPayment) {
        setPendingShipment(JSON.parse(lastPayment));
      }
    }, []);

    if (!pendingShipment) return null;

    return (
      <div className="w-full rounded-lg outline outline-[1px] outline-main9 md:p-5 ss:p-5 p-4 flex flex-col gap-5 mb-6 bg-yellow-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-primary font-bold text-[18px]">
              Incomplete Shipment
            </h3>
            <p className="text-main4 text-[14px]">
              You have a payment that was successful but the shipment wasn't
              finalized.
            </p>
          </div>
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg text-[14px] font-medium"
            onClick={() =>
              navigate(
                `/createshipment-payment/failure?error=finalization&payment=${pendingShipment.paymentId}`
              )
            }
          >
            Complete Shipment
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full">
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex items-center justify-between md:gap-0 ss:gap-5 gap-4 mb-3">
          <div className="flex flex-col">
            <h1
              className="text-primary tracking-tight font-bold md:text-[30px] 
            ss:text-[30px] text-[23px]"
            >
              Payments
            </h1>

            <h4
              className="text-main2 tracking-tight font-medium md:text-[16px] 
            ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem] 
            leading-[1.2rem]"
            >
              Track all your payment receipts in one place
            </h4>
          </div>

          <button
            className="bg-main7 md:text-[14px] ss:text-[14px] text-[13px]
          flex text-main2 md:rounded-xl rounded-lg grow4 cursor-pointer whitespace-nowrap
          items-center justify-center gap-2 md:py-3 ss:py-3 py-2.5 md:px-6 ss:px-6 px-2.5"
            onClick={() => navigate("/user/help")}
          >
            <p className="font-semibold hidden md:flex ss:flex">
              Report a problem
            </p>

            <PiWarningOctagon className="md:text-[16px] ss:text-[18px] text-[17px]" />
          </button>
        </div>

        <PendingFinalization />

        <div className="w-full flex flex-col gap-6">
          <div className="w-full">
            <div
              className="md:w-[40%] ss:w-[70%] w-full rounded-lg p-3 
            gap-5 outline outline-[1px] outline-main7 bg-mainalt flex 
            items-center justify-between"
            >
              <input
                type="text"
                placeholder="Search by transaction ID or amount"
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
                <p className="text-main4">Loading payments...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-mainRed">{error}</p>
              </div>
            ) : displayedPayments.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-10 gap-4">
                <p className="text-main4">No payment records found.</p>
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

                      {paymentHead.map((item, index) => (
                        <th
                          key={index}
                          className="text-left pl-5 py-5 border-b border-main9"
                        >
                          <div className="flex justify-between items-center">
                            <h2>{item.title}</h2>

                            {item.id === "initDate" && (
                              <LuArrowLeftRight className="w-4 h-4 transform rotate-90 ml-3 cursor-pointer text-main2" />
                            )}
                          </div>
                        </th>
                      ))}

                      <th className="hidden md:table-cell pl-5 py-5 border-b border-main9"></th>
                    </tr>
                  </thead>

                  <tbody className="md:text-[14px] ss:text-[14px] text-[13px] font-semibold text-main2 tracking-tight">
                    {displayedPayments.map((data, index) => (
                      <tr
                        key={index}
                        onClick={() => handleRowClick(data)}
                        className={`hover:bg-mainalt navsmooth cursor-pointer ${
                          index !== displayedPayments.length - 1
                            ? "border-b border-main9"
                            : ""
                        } ${selectedRows.includes(index) ? "bg-main7" : ""}`}
                      >
                        <td
                          className="text-left pl-5 py-5 md:pr-0 pr-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(index)}
                            onChange={() => handleSelectRow(index)}
                            className="cursor-pointer custom-checkbox checkbox2"
                          />
                        </td>

                        <td
                          className="md:hidden relative ss:px-4 px-3 ss:py-5 py-4"
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
                              className="absolute top-0 left-12 bg-white 
                              rounded-lg shadow-[0px_5px_15px_rgba(0,0,0,0.20)] z-50 w-[200px] navsmooth"
                            >
                              <ul className="list-none divide-y divide-main7">
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
                                  className="p-3 hover:bg-mainalt cursor-pointer text-main2 flex items-center gap-2"
                                  onClick={(e) =>
                                    handleReportProblem(e, data._id)
                                  }
                                >
                                  <PiWarningOctagon className="text-[17px]" />
                                  Report a problem
                                </li>
                              </ul>
                            </div>
                          )}
                        </td>

                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4">
                          {data.amount}
                        </td>
                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4">
                          {data.transId}
                        </td>
                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4">
                          {data.initDate}
                        </td>
                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[20ch]">
                          {data.payPurpose}
                        </td>
                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4">
                          {data.payMethod}
                        </td>
                        <td className="text-left pl-5 md:py-5 ss:py-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block w-2.5 h-2.5 rounded-full mr-3 ${
                              data.payStat === "Completed"
                                ? "bg-greenSuccess"
                                : "bg-logRed"
                            }`}
                          ></span>
                          {data.payStat}
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
                                  className="p-3 hover:bg-mainalt cursor-pointer text-main2 flex items-center gap-2"
                                  onClick={(e) =>
                                    handleReportProblem(e, data._id)
                                  }
                                >
                                  <PiWarningOctagon className="text-[17px]" />
                                  Report a problem
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
                      totalPayments
                    )}-${Math.min(currentPage * rowsPerPage, totalPayments)} 
                    of ${totalPayments}`}
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

export default Payments;

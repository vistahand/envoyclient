import { useState, useEffect } from "react";
import { shipments } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";
import { format } from "date-fns";
import { RecentDrafts } from "../../components";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userShipments, setUserShipments] = useState([]);
  const [metricsData, setMetricsData] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        // Use the shipments.getAll endpoint to fetch user shipments
        const response = await shipments.getAll(); // Just get first 5 for homepage

        if (response.success) {
          setUserShipments(response.data.shipments.slice(0, 5));
          setMetricsData(response.data.shipments);
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

    fetchShipments();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "eeee do MMMM, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "awaiting_pickup":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-indigo-100 text-indigo-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/user/shipments/details?id=${id}`);
  };

  return (
    <section className="w-full flex mb-6">
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex items-center md:gap-0 ss:gap-5 gap-4 mb-3">
          <div className="flex flex-col w-full">
            <h1
              className="text-primary tracking-tight font-bold md:text-[30px]
            ss:text-[30px] text-[23px]"
            >
              Dashboard
            </h1>

            <h4
              className="text-main2 tracking-tight font-medium md:text-[16px]
            ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem]
            leading-[1.2rem] md:max-w-full ss:max-w-[80%] max-w-full"
            >
              Welcome back, {user?.firstName || "User"}! View and manage your
              recent shipments.
            </h4>
          </div>

          <a href="/user/shipments/createshipment">
            <button
              type="button"
              className="bg-primary md:text-[14px] ss:text-[15px] text-[13px]
            md:py-3 ss:py-3 py-2.5 md:px-6 ss:px-6 px-2.5 flex text-white md:rounded-xl ss:rounded-xl
            rounded-lg grow4 cursor-pointer gap-3 items-center"
            >
              <p>Create Shipment</p>

              <HiOutlineArrowRight className="text-[14px]" />
            </button>
          </a>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 ss:grid-cols-2 grid-cols-1 gap-5">
          <div className="bg-white border border-main7 rounded-xl p-5">
            <h3 className="text-main2 font-semibold text-lg mb-1">
              Total Shipments
            </h3>
            <p className="text-3xl font-bold text-primary">
              {metricsData.length}
            </p>
            <div className="mt-3 text-sm text-main4">All your shipments</div>
          </div>

          <div className="bg-white border border-main7 rounded-xl p-5">
            <h3 className="text-main2 font-semibold text-lg mb-1">
              In Transit
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {
                metricsData.filter(
                  (s) =>
                    s.status === "in_transit" || s.status === "awaiting_pickup"
                ).length
              }
            </p>
            <div className="mt-3 text-sm text-main4">Shipments in progress</div>
          </div>

          <div className="bg-white border border-main7 rounded-xl p-5">
            <h3 className="text-main2 font-semibold text-lg mb-1">Delivered</h3>
            <p className="text-3xl font-bold text-green-600">
              {metricsData.filter((s) => s.status === "delivered").length}
            </p>
            <div className="mt-3 text-sm text-main4">Completed shipments</div>
          </div>
        </div>

        {/* Recent Drafts Section */}
        <RecentDrafts />

        {/* Recent Shipments Section */}
        <div className="w-full">
          <div
            className="md:mb-6 mb-10 w-full md:rounded-2xl ss:rounded-2xl
          rounded-xl md:p-6 ss:p-6 p-3 md:border ss:border border-main7 flex flex-col"
          >
            <div
              className="w-full flex items-center justify-between md:mb-6
            ss:mb-6 mb-4"
            >
              <h3
                className="text-main2 tracking-tight font-semibold
              md:text-[19px] ss:text-[19px] text-[17px]"
              >
                Recent Shipments
              </h3>

              <button
                type="button"
                onClick={() => navigate("/user/shipments")}
                className="md:text-[13px] ss:text-[14px] text-[13px]
                md:py-2 ss:py-2 py-1.5 md:px-5 ss:px-5 px-4 flex border border-main7
                text-main2 rounded-full grow4 cursor-pointer gap-1
                items-center hover:bg-main6 hover:text-white navsmooth"
              >
                <p>View All</p>

                <HiOutlineArrowRight className="text-[14px]" />
              </button>
            </div>

            {loading ? (
              <div className="w-full py-8 flex justify-center">
                <p className="text-main4">Loading shipments...</p>
              </div>
            ) : error ? (
              <div className="w-full py-8 flex justify-center">
                <p className="text-mainRed">{error}</p>
              </div>
            ) : userShipments.length === 0 ? (
              <div className="w-full py-8 flex flex-col items-center justify-center">
                <p className="text-main4 text-center">
                  You don't have any shipments yet. Create your first shipment
                  to get started.
                </p>
                <button
                  onClick={() => navigate("/user/shipments/createshipment")}
                  className="mt-4 text-primary underline font-medium"
                >
                  Create a Shipment
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-main7">
                  <thead className="bg-mainalt">
                    <tr>
                      <th
                        scope="col"
                        className="md:px-6 ss:px-6 px-4 py-3 text-left text-xs font-medium text-main4 uppercase tracking-wider"
                      >
                        Tracking Number
                      </th>
                      <th
                        scope="col"
                        className="md:px-6 ss:px-6 px-4 py-3 text-left text-xs font-medium text-main4 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-main4 uppercase tracking-wider"
                      >
                        From
                      </th>
                      <th
                        scope="col"
                        className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-main4 uppercase tracking-wider"
                      >
                        To
                      </th>
                      <th
                        scope="col"
                        className="md:px-6 ss:px-6 px-4 py-3 text-left text-xs font-medium text-main4 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="md:px-6 ss:px-6 px-4 py-3 text-right text-xs font-medium text-main4 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-main7">
                    {userShipments.map((shipment) => (
                      <tr key={shipment._id} className="hover:bg-gray-50">
                        <td className="md:px-6 ss:px-6 px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-main2">
                            {shipment.trackingNumber}
                          </div>
                        </td>
                        <td className="md:px-6 ss:px-6 px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1.5 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(
                              shipment.status
                            )}`}
                          >
                            {shipment.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-main4">
                            {shipment.sender?.address?.country || "-"}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-main4">
                            {shipment.recipient?.address?.country || "-"}
                          </div>
                        </td>
                        <td className="md:px-6 ss:px-6 px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-main4">
                            {formatDate(shipment.createdAt)}
                          </div>
                        </td>
                        <td className="md:px-6 ss:px-6 px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(shipment._id)}
                            className="text-primary hover:text-secondary underline cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;

// import { useState, useEffect } from "react";
// import LocalIcon from "../../assets/loc-ship.svg";
// import InternationalIcon from "../../assets/int-ship.svg";
// import { HiOutlineArrowRight } from "react-icons/hi";
// import { MdArrowOutward } from "react-icons/md";
// import { blogpic, paymentact } from "../../assets";

// const Home = () => {
//   const [countries, setCountries] = useState([]);

//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await fetch("https://restcountries.com/v3.1/all");

//         const data = await response.json();
//         const sortedCountries = [...data].sort((a, b) =>
//           a.name.common.localeCompare(b.name.common)
//         );

//         setCountries(sortedCountries);
//       } catch (error) {
//         console.error("Error fetching countries:", error);
//       }
//     };

//     fetchCountries();
//   }, []);

//   return (
//     <section className="w-full h-full">
//       <div
//         className="w-full h-full flex md:flex-row flex-col md:gap-16
//       gap-12"
//       >
//         <div className="md:w-[66%] w-full flex flex-col gap-8">
//           <div className="flex flex-col">
//             <h1
//               className="text-primary tracking-tight font-bold md:text-[30px]
//             ss:text-[30px] text-[23px]"
//             >
//               User Dashboard
//             </h1>

//             <h4
//               className="text-main2 tracking-tight font-medium md:text-[16px]
//             ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem]
//             leading-[1.2rem]"
//             >
//               Welcome to your user dashboard! You can see your shipments,
//               perform tasks and much more.
//             </h4>
//           </div>

//           <div className="flex flex-col gap-5">
//             <div className="flex items-center gap-2">
//               <h4
//                 className="tracking-tight text-main4 md:text-[16px]
//               ss:text-[16px] text-[15px] font-semibold"
//               >
//                 Active Shipments
//               </h4>

//               <div
//                 className="md:w-3 ss:w-3 w-2.5 md:h-3 ss:h-3 h-2.5
//                 rounded-full bg-greenSuccess"
//               />
//             </div>

//             <div
//               className="w-full flex md:flex-row ss:flex-row flex-col
//             md:gap-6 ss:gap-6 gap-5"
//             >
//               <div
//                 className="md:w-[50%] ss:w-[50%] w-full bg-primary3
//               rounded-lg p-5 flex flex-col gap-5"
//               >
//                 <div className="flex items-center gap-2">
//                   <img
//                     src={InternationalIcon}
//                     className="w-[1.4rem] h-auto object-contain
//                     text-primary"
//                   />

//                   <p
//                     className="text-primary tracking-tight md:text-[14px]
//                   ss:text-[15px] text-[13px] font-bold"
//                   >
//                     International Shipping
//                   </p>
//                 </div>

//                 <div className="w-full flex gap-5 items-center">
//                   <div className="flex gap-2.5">
//                     <img
//                       src={
//                         countries.find((country) => country.cca2 === "IE")
//                           ?.flags?.png
//                       }
//                       alt="flag"
//                       className="w-10 h-[1.4rem] rounded-[0.2rem]"
//                     />

//                     <p
//                       className="md:text-[16px] ss:text-[16px]
//                     text-[14px] tracking-tight font-extrabold text-main2"
//                     >
//                       Ireland
//                     </p>
//                   </div>

//                   <p
//                     className="md:text-[14px] ss:text-[15px]
//                   text-[13px] tracking-tight font-semibold text-main4"
//                   >
//                     to
//                   </p>

//                   <div className="flex gap-2.5">
//                     <img
//                       src={
//                         countries.find((country) => country.cca2 === "NG")
//                           ?.flags?.png
//                       }
//                       alt="flag"
//                       className="w-10 h-[1.4rem] rounded-[0.2rem]"
//                     />

//                     <p
//                       className="md:text-[16px] ss:text-[16px]
//                     text-[14px] tracking-tight font-extrabold text-main2"
//                     >
//                       Nigeria
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <p
//                     className="text-[13px] font-medium text-main4
//                   tracking-tight"
//                   >
//                     Status
//                   </p>

//                   <h4
//                     className="md:text-[16px] ss:text-[16px] text-[15px]
//                   tracking-tight font-extrabold text-main2"
//                   >
//                     Package Shipped
//                   </h4>

//                   <div className="flex items-center gap-3.5">
//                     <p
//                       className="font-medium text-[13px] text-main4
//                     tracking-tight"
//                     >
//                       Monday 28th October, 2024.
//                     </p>

//                     <div className="h-[3px] w-[3px] bg-main4 rounded-full" />

//                     <p
//                       className="font-medium text-[13px] tracking-tight
//                     text-main4"
//                     >
//                       11:25AM
//                     </p>
//                   </div>

//                   <div>
//                     <a
//                       href="/user/shipments/details"
//                       className="text-primary underline cursor-pointer
//                     hover:text-secondary grow2 md:text-[15px] ss:text-[15px]
//                     text-[14px] font-semibold mt-6 tracking-tight inline-flex"
//                     >
//                       See shipment details
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               <div
//                 className="md:w-[50%] ss:w-[50%] w-full bg-primary3
//               rounded-lg p-5 flex flex-col gap-5"
//               >
//                 <div className="flex items-center gap-2">
//                   <img
//                     src={LocalIcon}
//                     className="w-[1.4rem] h-auto object-contain
//                     text-primary"
//                   />

//                   <p
//                     className="text-primary tracking-tight md:text-[14px]
//                   ss:text-[15px] text-[13px] font-bold"
//                   >
//                     Local Shipping
//                   </p>
//                 </div>

//                 <div className="w-full flex gap-5 items-center">
//                   <div className="flex gap-2.5">
//                     <img
//                       src={
//                         countries.find((country) => country.cca2 === "IE")
//                           ?.flags?.png
//                       }
//                       alt="flag"
//                       className="w-10 h-[1.4rem] rounded-[0.2rem]"
//                     />

//                     <p
//                       className="md:text-[16px] ss:text-[16px]
//                     text-[14px] tracking-tight font-extrabold text-main2"
//                     >
//                       Dublin
//                     </p>
//                   </div>

//                   <p
//                     className="md:text-[14px] ss:text-[15px]
//                   text-[13px] tracking-tight font-semibold text-main4"
//                   >
//                     to
//                   </p>

//                   <p
//                     className="md:text-[16px] ss:text-[16px]
//                   text-[14px] tracking-tight font-extrabold text-main2"
//                   >
//                     Galway
//                   </p>
//                 </div>

//                 <div className="flex flex-col gap-1">
//                   <p
//                     className="text-[13px] font-medium text-main4
//                   tracking-tight"
//                   >
//                     Status
//                   </p>

//                   <h4
//                     className="md:text-[16px] ss:text-[16px] text-[15px]
//                   tracking-tight font-extrabold text-main2"
//                   >
//                     Awaiting drop-off
//                   </h4>

//                   <p
//                     className="font-medium text-[13px] text-main4
//                   tracking-tight"
//                   >
//                     Drop your shipment at the selected pickup station
//                   </p>

//                   {/* <div className='flex items-center gap-3.5'>
//                     <p className="font-medium text-[13px] text-main4
//                     tracking-tight">
//                       Monday 28th October, 2024.
//                     </p>

//                     <div className='h-[3px] w-[3px] bg-main4 rounded-full'/>

//                     <p className="font-medium text-[13px] tracking-tight
//                     text-main4">
//                       11:25AM
//                     </p>
//                   </div> */}

//                   <div>
//                     <a
//                       href="/user/shipments/details"
//                       className="text-primary underline cursor-pointer
//                     hover:text-secondary grow2 md:text-[15px] ss:text-[15px]
//                     text-[14px] font-semibold mt-6 tracking-tight inline-flex"
//                     >
//                       See shipment details
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <a
//                 href="/user/shipments"
//                 className="inline-flex items-center gap-3 mt-2 cursor-pointer
//               grow8"
//               >
//                 <h3
//                   className="text-primary md:text-[16px] ss:text-[17px]
//                 text-[15px] font-semibold tracking-tight"
//                 >
//                   See all shipments
//                 </h3>

//                 <HiOutlineArrowRight
//                   className="text-[14px] text-primary"
//                   strokeWidth={2.5}
//                 />
//               </a>
//             </div>
//           </div>
//         </div>

//         <div className="md:w-[34%] ss:w-[55%] w-full flex flex-col">
//           <div
//             className="w-full md:rounded-2xl ss:rounded-2xl rounded-xl
//           md:h-[400px] ss:h-[400px] h-[400px] relative"
//             style={{
//               backgroundImage: `url(${blogpic})`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               backgroundRepeat: "no-repeat",
//             }}
//           >
//             <div
//               className="absolute bottom-0 left-0 right-0 h-3/4
//               bg-gradient-to-b from-transparent to-black md:rounded-2xl
//               ss:rounded-2xl rounded-xl"
//             />

//             <div
//               className="flex justify-between gap-5 w-full absolute
//             md:p-7 ss:p-7 p-5 bottom-0"
//             >
//               <div className="flex flex-col gap-4">
//                 <h2
//                   className="text-white md:text-[20px] ss:text-[21px]
//                 text-[17px] font-bold md:leading-[1.7rem] ss:leading-[1.8rem]
//                 leading-[1.5rem] tracking-tight"
//                 >
//                   The Ultimate Guide to Shipping Between Ireland and Nigeria
//                 </h2>

//                 <div>
//                   <div className="inline-flex items-center gap-3 cursor-pointer grow8">
//                     <p
//                       className="text-white tracking-tight md:text-[14px]
//                     ss:text-[15px] text-[14px] font-medium"
//                     >
//                       New Blog Post
//                     </p>

//                     <HiOutlineArrowRight
//                       className="md:text-[14px] ss:text-[15px] text-[14px]
//                       text-white"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div
//                 className="cursor-pointer flex items-end
//               justify-end"
//               >
//                 <MdArrowOutward
//                   className="md:w-[3.5rem] ss:w-[3.5rem] w-[3rem] rounded-full
//                   h-auto md:p-3.5 ss:p-3.5 p-3 text-main2 bg-white"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="w-full">
//             <div
//               className="md:my-6 my-10 w-full md:rounded-2xl ss:rounded-2xl
//             rounded-xl md:p-6 ss:p-6 p-5 bg-mainalt flex flex-col md:gap-8
//             ss:gap-8 gap-6"
//             >
//               <div className="flex items-center gap-2">
//                 <img
//                   src={paymentact}
//                   alt="paymentactivity"
//                   className="w-[1.5rem] h-auto text-primary"
//                 />

//                 <h2
//                   className="text-primary md:text-[20px] ss:text-[20px]
//                 text-[17px] font-bold tracking-tight"
//                 >
//                   Payment Activity
//                 </h2>
//               </div>

//               <table className="">
//                 <thead
//                   className="md:text-[13px] ss:text-[14px] text-[13px]
//                 font-medium text-main4 tracking-tight"
//                 >
//                   <tr>
//                     <th className="py-3 pr-4 text-left w-1/3">Amount</th>
//                     <th className="py-3 pr-4 text-left w-1/3">Shipment ID</th>
//                     <th className="py-3 pr-4 text-left w-1/3">Date</th>
//                   </tr>
//                 </thead>

//                 <tbody
//                   className="md:text-[14px] ss:text-[15px] text-[13px]
//                 text-main2 font-bold"
//                 >
//                   <tr
//                     className="hover:bg-main7 border-b border-main7
//                   cursor-pointer"
//                   >
//                     <td className="pr-4 py-3">
//                       <span className="line-through">N</span>280,500
//                     </td>
//                     <td className="pr-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[13ch]">
//                       TRX-18084578123
//                     </td>
//                     <td className="pr-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[13ch]">
//                       29 Oct 2024
//                     </td>
//                   </tr>

//                   <tr
//                     className="hover:bg-main7 border-b border-main7
//                   cursor-pointer"
//                   >
//                     <td className="pr-4 py-3">
//                       <span className="line-through">N</span>280,500
//                     </td>
//                     <td className="pr-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[13ch]">
//                       TRX-18084578123
//                     </td>
//                     <td className="pr-4 py-3">29 Oct 2024</td>
//                   </tr>

//                   <tr
//                     className="hover:bg-main7 border-b border-main7
//                   cursor-pointer"
//                   >
//                     <td className="pr-4 py-3">
//                       <span className="line-through">N</span>280,500
//                     </td>
//                     <td className="pr-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[13ch]">
//                       TRX-18084578123
//                     </td>
//                     <td className="pr-4 py-3">29 Oct 2024</td>
//                   </tr>
//                 </tbody>
//               </table>

//               <div>
//                 <a
//                   href="/user/payments"
//                   className="inline-flex items-center gap-3 cursor-pointer grow8"
//                 >
//                   <h3
//                     className="text-primary md:text-[15px] ss:text-[15px]
//                   text-[14px] font-semibold tracking-tight"
//                   >
//                     See all payments
//                   </h3>

//                   <HiOutlineArrowRight
//                     className="text-[14px] text-primary"
//                     strokeWidth={2.5}
//                   />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Home;

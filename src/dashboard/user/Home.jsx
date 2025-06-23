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
    } catch {
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
                  You don&apos;t have any shipments yet. Create your first
                  shipment to get started.
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

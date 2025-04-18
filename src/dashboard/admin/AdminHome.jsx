import { useState, useEffect } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { analytics, paymentact } from "../../assets";
import WeeklyInsightsChart from "../../components/WeeklyInsightsChart";
import RecentActivities from "../../components/recentActivities";
import { admin, shipments } from "../../services/api";

const AdminHome = () => {
  const [dashboardStats, setDashboardStats] = useState({
    activeShipments: 0,
    shipmentsToday: 0,
    deliveredToday: 0,
    pendingShipments: 0,
    totalShipments: 0,
    revenue: 0,
    totalUsers: 0,
    newUsers: 0,
  });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentsError, setPaymentsError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await shipments.getAdminDashboard();
        const data = response;
        setDashboardStats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
        setLoading(false);

        // Handle authentication errors
        if (
          error.message.includes("Unauthorized") ||
          error.message.includes("token")
        ) {
          // Redirect to login page or show auth error
          // window.location.href = '/login'; // Uncomment to enable redirect
        }
      }
    };

    const fetchPayments = async () => {
      try {
        setPaymentsLoading(true);
        const response = await admin.payments.getAll();
        console.log("Payment response:", response);

        if (response && response.items && Array.isArray(response.items)) {
          const transformedPayments = response.items.map((item) => ({
            amount: item.amount || 0,
            currency: item.currency || "eur", // Default to EUR if not specified
            trackingNumber:
              item.trackingNumber ||
              (item.shipmentId
                ? item.shipmentId.substring(0, 10) + "..."
                : "N/A"),
            date: new Date(item.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            _id: item._id, // Keep original ID for reference
            status: item.status || "pending",
          }));

          setPayments(transformedPayments.slice(0, 3));
        } else {
          console.warn("Unexpected API response format:", response);
          // Fallback to mock data
          const mockData = [
            {
              _id: "1",
              amount: 199.5,
              currency: "eur",
              trackingNumber: "INT-20250415-956",
              date: "15 Apr 2025",
              status: "completed",
            },
            {
              _id: "2",
              amount: 161.25,
              currency: "eur",
              trackingNumber: "INT-20250415-912",
              date: "15 Apr 2025",
              status: "completed",
            },
            {
              _id: "3",
              amount: 205.75,
              currency: "eur",
              trackingNumber: "INT-20250414-835",
              date: "14 Apr 2025",
              status: "pending",
            },
          ];
          setPayments(mockData);
        }
        setPaymentsLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setPaymentsError(error.message);
        setPaymentsLoading(false);

        // Set fallback mock data even on error
        const mockData = [
          {
            _id: "1",
            amount: 196.5,
            currency: "eur",
            trackingNumber: "INT-20250415-956",
            date: "15 Apr 2025",
            status: "completed",
          },
          {
            _id: "2",
            amount: 161.25,
            currency: "eur",
            trackingNumber: "INT-20250415-912",
            date: "15 Apr 2025",
            status: "completed",
          },
          {
            _id: "3",
            amount: 205.75,
            currency: "eur",
            trackingNumber: "INT-20250414-835",
            date: "14 Apr 2025",
            status: "pending",
          },
        ];
        setPayments(mockData);
      }
    };

    fetchDashboardData();
    fetchPayments();
  }, []);

  // Format currency based on the currency type from the payment data
  const formatCurrency = (amount, currency = "eur") => {
    const currencyMap = {
      ngn: {
        locale: "en-NG",
        currency: "NGN",
        symbol: "₦",
      },
      eur: {
        locale: "de-DE",
        currency: "EUR",
        symbol: "€",
      },
      usd: {
        locale: "en-US",
        currency: "USD",
        symbol: "$",
      },
    };

    const currencyInfo = currencyMap[currency.toLowerCase()] || currencyMap.eur;

    return new Intl.NumberFormat(currencyInfo.locale, {
      style: "currency",
      currency: currencyInfo.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Function to retry loading payments
  const retryLoadPayments = () => {
    setPaymentsLoading(true);
    setPaymentsError(null);

    // Call the fetchPayments function again
    admin.payments
      .getAll()
      .then((response) => {
        if (response && response.items && Array.isArray(response.items)) {
          const transformedPayments = response.items.map((item) => ({
            amount: item.amount || 0,
            currency: item.currency || "eur",
            trackingNumber:
              item.trackingNumber ||
              (item.shipmentId
                ? item.shipmentId.substring(0, 10) + "..."
                : "N/A"),
            date: new Date(item.createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            _id: item._id,
            status: item.status || "pending",
          }));

          setPayments(transformedPayments.slice(0, 3));
        } else {
          console.warn("Unexpected API response format:", response);
          // Fallback to mock data
          const mockData = [
            {
              _id: "1",
              amount: 293.5,
              currency: "eur",
              trackingNumber: "INT-20250415-956",
              date: "15 Apr 2025",
              status: "completed",
            },
            {
              _id: "2",
              amount: 261.25,
              currency: "eur",
              trackingNumber: "INT-20250415-912",
              date: "15 Apr 2025",
              status: "completed",
            },
            {
              _id: "3",
              amount: 205.75,
              currency: "eur",
              trackingNumber: "INT-20250414-835",
              date: "14 Apr 2025",
              status: "pending",
            },
          ];
          setPayments(mockData);
        }
        setPaymentsError(null);
      })
      .catch((error) => {
        console.error("Error retrying payments fetch:", error);
        setPaymentsError(error.message);

        // Set fallback mock data even on error
        const mockData = [
          {
            _id: "1",
            amount: 199.5,
            currency: "eur",
            trackingNumber: "INT-20250415-956",
            date: "15 Apr 2025",
            status: "completed",
          },
          {
            _id: "2",
            amount: 661.25,
            currency: "eur",
            trackingNumber: "INT-20250415-912",
            date: "15 Apr 2025",
            status: "completed",
          },
          {
            _id: "3",
            amount: 205.75,
            currency: "eur",
            trackingNumber: "INT-20250414-835",
            date: "14 Apr 2025",
            status: "pending",
          },
        ];
        setPayments(mockData);
      })
      .finally(() => {
        setPaymentsLoading(false);
      });
  };

  return (
    <section className="w-full h-full">
      <div
        className="w-full h-full flex md:flex-row flex-col md:gap-8
      gap-12"
      >
        <div className="md:w-[66%] w-full flex flex-col gap-8">
          <div className="flex flex-col">
            <h1
              className="text-primary tracking-tight font-bold md:text-[30px] 
            ss:text-[30px] text-[23px]"
            >
              Admin Dashboard
            </h1>

            <h4
              className="text-main2 tracking-tight font-medium md:text-[16px] 
            ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem] 
            leading-[1.2rem]"
            >
              Welcome to your admin dashboard! You can see shipment requests,
              perform tasks and much more.
            </h4>
          </div>

          <RecentActivities />

          <div className="w-full mt-3">
            <WeeklyInsightsChart />
          </div>
        </div>

        <div className="md:w-[34%] ss:w-[55%] w-full flex flex-col">
          <div
            className="w-full md:rounded-2xl ss:rounded-2xl 
          rounded-xl p-5 bg-primaryalt flex flex-col md:gap-8 
          ss:gap-8 gap-6"
          >
            <div className="flex items-center gap-2">
              <img
                src={analytics}
                alt="analytics"
                className="w-[1.5rem] h-auto s-white"
              />

              <h2
                className="text-white md:text-[20px] ss:text-[20px] 
              text-[17px] font-bold tracking-tight"
              >
                Quick Stats
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : error ? (
              <div className="text-white text-center py-4">
                <p className="mb-2 font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary py-2 px-4 rounded-lg text-sm hover:opacity-90 transition-opacity"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 gap-4">
                <div
                  className="w-full md:rounded-xl ss:rounded-xl rounded-lg bg-primary p-5 
                items-start flex flex-col"
                >
                  <p className="text-white md:text-[13px] ss:text-[13px] text-[12px] font-medium tracking-tight">
                    Active Shipments
                  </p>

                  <h1 className="text-white md:text-[45px] ss:text-[43px] text-[33px] font-bold tracking-tight">
                    {dashboardStats.activeShipments}
                  </h1>
                </div>

                <div
                  className="w-full md:rounded-xl ss:rounded-xl rounded-lg bg-primary p-5 
                items-start flex flex-col"
                >
                  <p className="text-white md:text-[13px] ss:text-[13px] text-[12px] font-medium tracking-tight">
                    Shipments Today
                  </p>

                  <h1 className="text-white md:text-[45px] ss:text-[43px] text-[33px] font-bold tracking-tight">
                    {dashboardStats.shipmentsToday}
                  </h1>
                </div>

                <div
                  className="w-full md:rounded-xl ss:rounded-xl rounded-lg bg-primary p-5 
                items-start flex flex-col"
                >
                  <p className="text-white md:text-[13px] ss:text-[13px] text-[12px] font-medium tracking-tight">
                    Delivered Today
                  </p>

                  <h1 className="text-white md:text-[45px] ss:text-[43px] text-[33px] font-bold tracking-tight">
                    {dashboardStats.deliveredToday}
                  </h1>
                </div>

                <div
                  className="w-full md:rounded-xl ss:rounded-xl rounded-lg bg-primary p-5 
                items-start flex flex-col"
                >
                  <p className="text-white md:whitespace-nowrap md:text-[13px] ss:text-[13px] text-[12px] font-medium tracking-tight">
                    Pending Shipments
                  </p>

                  <h1 className="text-white md:text-[45px] ss:text-[43px] text-[33px] font-bold tracking-tight">
                    {dashboardStats.pendingShipments}
                  </h1>
                </div>
              </div>
            )}

            <div>
              <a
                href="/admin/analytics"
                className="inline-flex items-center gap-3 cursor-pointer grow8"
              >
                <h3
                  className="text-white md:text-[15px] ss:text-[15px] 
                text-[14px] font-semibold tracking-tight"
                >
                  See full analytics
                </h3>

                <HiOutlineArrowRight
                  className="text-[14px] text-white"
                  strokeWidth={2.5}
                />
              </a>
            </div>
          </div>

          <div className="w-full">
            <div
              className="md:my-6 my-10 w-full md:rounded-2xl ss:rounded-2xl 
            rounded-xl md:p-6 ss:p-6 p-5 bg-mainalt flex flex-col md:gap-8 
            ss:gap-8 gap-6"
            >
              <div className="flex items-center gap-2">
                <img
                  src={paymentact}
                  alt="paymentactivity"
                  className="w-[1.5rem] h-auto text-primary"
                />

                <h2
                  className="text-primary md:text-[20px] ss:text-[20px] 
                text-[17px] font-bold tracking-tight"
                >
                  Payment Activity
                </h2>
              </div>

              <div className="flex items-center gap-4 mb-2">
                <div className="flex flex-col">
                  <p className="text-main4 text-[13px] font-medium">
                    Total Revenue
                  </p>
                  <h3 className="text-main2 text-[22px] font-bold">
                    {formatCurrency(
                      dashboardStats.revenue,
                      dashboardStats.revenueCurrency || "eur"
                    )}
                  </h3>
                </div>
                <div className="flex flex-col">
                  <p className="text-main4 text-[13px] font-medium">
                    Total Users
                  </p>
                  <h3 className="text-main2 text-[22px] font-bold">
                    {dashboardStats.totalUsers}
                  </h3>
                </div>
              </div>

              {paymentsLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : paymentsError ? (
                <div className="text-main2 text-center py-4">
                  <p className="mb-2 font-medium text-sm">
                    Failed to load payment data
                  </p>
                  <button
                    onClick={retryLoadPayments}
                    className="text-primary text-sm underline hover:opacity-90"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <table className="w-full">
                  <thead
                    className="md:text-[13px] ss:text-[14px] text-[13px] 
                  font-medium text-main4 tracking-tight"
                  >
                    <tr>
                      <th className="py-3 pr-4 text-left w-1/3">Amount</th>
                      <th className="py-3 pr-4 text-left w-1/3">
                        Tracking No.
                      </th>
                      <th className="py-3 pr-4 text-left w-1/3">Date</th>
                    </tr>
                  </thead>

                  <tbody
                    className="md:text-[14px] ss:text-[15px] text-[13px] 
                  text-main2 font-bold"
                  >
                    {payments.length > 0 ? (
                      payments.map((payment, index) => (
                        <tr
                          key={payment._id || index}
                          className="hover:bg-main7 border-b border-main7 cursor-pointer"
                        >
                          <td className="pr-4 py-3">
                            {formatCurrency(
                              payment.amount || 0,
                              payment.currency || "eur"
                            )}
                          </td>
                          <td
                            className="pr-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[13ch]"
                            title={payment.trackingNumber}
                          >
                            {payment.trackingNumber || "N/A"}
                          </td>
                          <td className="pr-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[13ch]">
                            {payment.date || "Invalid date"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-4 text-main4 font-normal"
                        >
                          No payment records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              <div>
                <a
                  href="/admin/payments"
                  className="inline-flex items-center gap-3 cursor-pointer grow8"
                >
                  <h3
                    className="text-primary md:text-[15px] ss:text-[15px] 
                  text-[14px] font-semibold tracking-tight"
                  >
                    See all payments
                  </h3>

                  <HiOutlineArrowRight
                    className="text-[14px] text-primary"
                    strokeWidth={2.5}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;

import { useState, useEffect } from "react";
import LocalIcon from "../../assets/loc-ship.svg";
import InternationalIcon from "../../assets/int-ship.svg";
import { HiOutlineArrowRight } from "react-icons/hi";
import { analytics, paymentact } from "../../assets";

const AdminHome = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");

        const data = await response.json();
        const sortedCountries = [...data].sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );

        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

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

          <div className="flex flex-col gap-5 md:w-[97%]">
            <div className="flex items-center gap-2">
              <h4
                className="tracking-tight text-main4 md:text-[16px] 
              ss:text-[16px] text-[15px] font-semibold"
              >
                New Shipment Requests
              </h4>

              <div
                className="md:w-3 ss:w-3 w-2.5 md:h-3 ss:h-3 h-2.5 
                rounded-full bg-greenSuccess"
              />
            </div>

            <div
              className="w-full flex md:flex-row ss:flex-row flex-col 
            md:gap-6 ss:gap-6 gap-5"
            >
              <div
                className="md:w-[50%] ss:w-[50%] w-full bg-primary3 
              rounded-lg p-5 flex flex-col gap-5"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={InternationalIcon}
                    className="w-[1.4rem] h-auto object-contain
                    text-primary"
                  />

                  <p
                    className="text-primary tracking-tight md:text-[14px] 
                  ss:text-[15px] text-[13px] font-bold"
                  >
                    International Shipping
                  </p>
                </div>

                <div className="w-full flex gap-5 items-center">
                  <div className="flex gap-2.5">
                    <img
                      src={
                        countries.find((country) => country.cca2 === "IE")
                          ?.flags?.png
                      }
                      alt="flag"
                      className="w-10 h-[1.4rem] rounded-[0.2rem]"
                    />

                    <p
                      className="md:text-[16px] ss:text-[16px] 
                    text-[14px] tracking-tight font-extrabold text-main2"
                    >
                      Ireland
                    </p>
                  </div>

                  <p
                    className="md:text-[14px] ss:text-[15px] 
                  text-[13px] tracking-tight font-semibold text-main4"
                  >
                    to
                  </p>

                  <div className="flex gap-2.5">
                    <img
                      src={
                        countries.find((country) => country.cca2 === "NG")
                          ?.flags?.png
                      }
                      alt="flag"
                      className="w-10 h-[1.4rem] rounded-[0.2rem]"
                    />

                    <p
                      className="md:text-[16px] ss:text-[16px] 
                    text-[14px] tracking-tight font-extrabold text-main2"
                    >
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <p
                    className="text-[13px] font-medium text-main4
                  tracking-tight"
                  >
                    Sender Information
                  </p>

                  <h4
                    className="md:text-[16px] ss:text-[16px] text-[15px] 
                  tracking-tight font-extrabold text-main2"
                  >
                    Package Shipped
                  </h4>

                  <div className="flex items-center gap-3.5">
                    <p
                      className="font-medium text-[13px] text-main4
                    tracking-tight"
                    >
                      Monday 28th October, 2024.
                    </p>

                    <div className="h-[3px] w-[3px] bg-main4 rounded-full" />

                    <p
                      className="font-medium text-[13px] tracking-tight 
                    text-main4"
                    >
                      11:25AM
                    </p>
                  </div>

                  <div>
                    <a
                      href="/user/shipments/details"
                      className="text-primary underline cursor-pointer
                    hover:text-secondary grow2 md:text-[15px] ss:text-[15px] 
                    text-[14px] font-semibold mt-6 tracking-tight inline-flex"
                    >
                      See shipment details
                    </a>
                  </div>
                </div>
              </div>

              <div
                className="md:w-[50%] ss:w-[50%] w-full bg-primary3 
              rounded-lg p-5 flex flex-col gap-5"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={LocalIcon}
                    className="w-[1.4rem] h-auto object-contain
                    text-primary"
                  />

                  <p
                    className="text-primary tracking-tight md:text-[14px] 
                  ss:text-[15px] text-[13px] font-bold"
                  >
                    Local Shipping
                  </p>
                </div>

                <div className="w-full flex gap-5 items-center">
                  <div className="flex gap-2.5">
                    <img
                      src={
                        countries.find((country) => country.cca2 === "IE")
                          ?.flags?.png
                      }
                      alt="flag"
                      className="w-10 h-[1.4rem] rounded-[0.2rem]"
                    />

                    <p
                      className="md:text-[16px] ss:text-[16px] 
                    text-[14px] tracking-tight font-extrabold text-main2"
                    >
                      Dublin
                    </p>
                  </div>

                  <p
                    className="md:text-[14px] ss:text-[15px] 
                  text-[13px] tracking-tight font-semibold text-main4"
                  >
                    to
                  </p>

                  <p
                    className="md:text-[16px] ss:text-[16px] 
                  text-[14px] tracking-tight font-extrabold text-main2"
                  >
                    Galway
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p
                    className="text-[13px] font-medium text-main4
                  tracking-tight"
                  >
                    Status
                  </p>

                  <h4
                    className="md:text-[16px] ss:text-[16px] text-[15px] 
                  tracking-tight font-extrabold text-main2"
                  >
                    Awaiting drop-off
                  </h4>

                  <p
                    className="font-medium text-[13px] text-main4
                  tracking-tight"
                  >
                    Drop your shipment at the selected pickup station
                  </p>

                  {/* <div className='flex items-center gap-3.5'>
                    <p className="font-medium text-[13px] text-main4
                    tracking-tight">
                      Monday 28th October, 2024.
                    </p>

                    <div className='h-[3px] w-[3px] bg-main4 rounded-full'/>

                    <p className="font-medium text-[13px] tracking-tight 
                    text-main4">
                      11:25AM
                    </p>
                  </div> */}

                  <div>
                    <a
                      href="/user/shipments/details"
                      className="text-primary underline cursor-pointer
                    hover:text-secondary grow2 md:text-[15px] ss:text-[15px] 
                    text-[14px] font-semibold mt-6 tracking-tight inline-flex"
                    >
                      See shipment details
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <a
                href="/user/shipments"
                className="inline-flex items-center gap-3 mt-2 cursor-pointer
              grow8"
              >
                <h3
                  className="text-primary md:text-[16px] ss:text-[17px] 
                text-[15px] font-semibold tracking-tight"
                >
                  See all shipment requests
                </h3>

                <HiOutlineArrowRight
                  className="text-[14px] text-primary"
                  strokeWidth={2.5}
                />
              </a>
            </div>
          </div>

          <div className="w-full mt-3">
            <h4
              className="tracking-tight text-main4 md:text-[16px] 
            ss:text-[16px] text-[15px] font-semibold"
            >
              Weekly Insights
            </h4>
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

            <div className="w-full grid grid-cols-2 gap-4">
              <div
                className="w-full md:rounded-xl ss:rounded-xl rounded-lg bg-primary p-5 
              items-start flex flex-col"
              >
                <p className="text-white md:text-[13px] ss:text-[13px] text-[12px] font-medium tracking-tight">
                  Active Shipments
                </p>

                <h1 className="text-white md:text-[45px] ss:text-[43px] text-[33px] font-bold tracking-tight">
                  58
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
                  25
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
                  18
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
                  15
                </h1>
              </div>
            </div>

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

              <table className="">
                <thead
                  className="md:text-[13px] ss:text-[14px] text-[13px] 
                font-medium text-main4 tracking-tight"
                >
                  <tr>
                    <th className="py-3 pr-4 text-left w-1/3">Amount</th>
                    <th className="py-3 pr-4 text-left w-1/3">Shipment ID</th>
                    <th className="py-3 pr-4 text-left w-1/3">Date</th>
                  </tr>
                </thead>

                <tbody
                  className="md:text-[14px] ss:text-[15px] text-[13px] 
                text-main2 font-bold"
                >
                  <tr
                    className="hover:bg-main7 border-b border-main7
                  cursor-pointer"
                  >
                    <td className="pr-4 py-3">
                      <span className="line-through">N</span>280,500
                    </td>
                    <td className="pr-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[13ch]">
                      TRX-18084578123
                    </td>
                    <td className="pr-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[13ch]">
                      29 Oct 2024
                    </td>
                  </tr>

                  <tr
                    className="hover:bg-main7 border-b border-main7
                  cursor-pointer"
                  >
                    <td className="pr-4 py-3">
                      <span className="line-through">N</span>280,500
                    </td>
                    <td className="pr-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[13ch]">
                      TRX-18084578123
                    </td>
                    <td className="pr-4 py-3">29 Oct 2024</td>
                  </tr>

                  <tr
                    className="hover:bg-main7 border-b border-main7
                  cursor-pointer"
                  >
                    <td className="pr-4 py-3">
                      <span className="line-through">N</span>280,500
                    </td>
                    <td className="pr-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[13ch]">
                      TRX-18084578123
                    </td>
                    <td className="pr-4 py-3">29 Oct 2024</td>
                  </tr>
                </tbody>
              </table>

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

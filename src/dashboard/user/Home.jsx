import { useState, useEffect } from 'react';
// import { ReactComponent as LocalIcon } from '../../assets/loc-ship.svg';
import { ReactComponent as InternationalIcon } from '../../assets/int-ship.svg';

const Home = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');

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
    <section className='w-full h-full'>
      <div className='w-full h-full flex md:flex-row flex-col md:gap-8
      ss:gap-8 gap-6'>
        <div className='md:w-[67%] w-full flex flex-col md:gap-6 ss:gap-6 
        gap-5'>
          <div className='flex flex-col gap-3'>
            <h1 className='text-primary tracking-tight font-bold md:text-[30px] 
            ss:text-[28px] text-[22px]'>
              User Dashboard
            </h1>

            <h4 className='text-main2 tracking-tight font-medium md:text-[16px] 
            ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem] 
            leading-[1.3rem]'>
              Welcome to your user dashboard! You can see your shipments,
              perform tasks and much more.
            </h4>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <h4 className='tracking-tight text-main4 md:text-[16px] 
              ss:text-[16px] text-[14px]'>
                Active Shipments
              </h4>

              <div className='w-2 h-2 rounded-full bg-greenSuccess'/>
            </div>

            <div className='w-full flex md:flex-row ss:flex-row flex-col 
            gap-4'>
              <div className='md:w-[50%] bg-primary3 rounded-lg p-3 flex 
              flex-col gap-4'>
                <div className='flex items-center gap-2'>
                  <InternationalIcon 
                    className='w-[1.8rem] h-auto object-contain
                    stroke-primary'
                  />

                  <p className='text-primary tracking-tight text-[15px] 
                  font-bold'>
                    International Shipping
                  </p>
                </div>

                <div className="w-full flex gap-6 items-center">
                  <div className="rounded-lg md:px-8 ss:px-8 px-6 md:py-5 
                  ss:py-5 py-4 bg-mainalt flex gap-2">
                    <img
                      src={
                        countries.find(
                          (country) => country.cca2 === 'IE'
                        )?.flags?.png
                      }
                      alt="flag"
                      className="w-10 h-[1.4rem] rounded-[0.2rem]"
                    />

                    <p className="md:text-[15px] ss:text-[15px] 
                    text-[14px] tracking-tight font-bold text-main2">
                      Ireland
                    </p>
                  </div>

                  <p className="md:text-[15px] ss:text-[15px] 
                  text-[14px] tracking-tight font-semibold text-main4">
                    to
                  </p>

                  <div className="rounded-lg  md:px-8 ss:px-8 px-6 md:py-5 
                  ss:py-5 py-4 bg-mainalt flex gap-2">
                    <img
                      src={
                        countries.find(
                          (country) => country.cca2 === 'NG'
                        )?.flags?.png
                      }
                      alt="flag"
                      className="w-10 h-[1.4rem] rounded-[0.2rem]"
                    />

                    <p className="md:text-[15px] ss:text-[15px] 
                    text-[14px] tracking-tight font-bold text-main2">
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <p className='tracking-tight'>
                    Status
                  </p>

                  <h4 className='tracking-tight'>
                    Package Shipped
                  </h4>

                  <div className='flex items-center gap-3'>
                    <p>
                      Wednesday 30th October, 2024.
                    </p>
                  </div>

                  <h3 className='text-primary underline cursor-pointer
                  hover:text-secondary grow2'>
                    See shipment details
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
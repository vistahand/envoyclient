import React from 'react'

const Home = () => {
  return (
    <section className='w-full h-full'>
      <div className='w-full h-full flex md:flex-row flex-col md:gap-8
      ss:gap-8 gap-6'>
        <div className='md:w-[67%] w-full flex flex-col md:gap-6 ss:gap-6 
        gap-5'>
          <div className='flex flex-col gap-3'>
            <h1 className='text-primary tracking-tight'>
              User Dashboard
            </h1>

            <h4 className='text-main2 tracking-tight'>
              Welcome to your user dashboard! You can see your shipments,
              perform tasks and much more.
            </h4>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <h4 className='tracking-tight'>
                Active Shipments
              </h4>

              <div className='w-2 h-2 rounded-full bg-greenDeep'/>
            </div>

            <div className='w-full flex md:flex-row ss:flex-row flex-col 
            gap-4'>
              <div className='md:w-[50%] bg-primary1 rounded-lg p-3 flex 
              flex-col gap-4'>
                <div className='flex items-center gap-2'>

                  <p className='text-primary tracking-tight'>
                    International Shipping
                  </p>
                </div>

                <div>

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
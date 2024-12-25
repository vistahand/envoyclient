import { IoSearchOutline } from "react-icons/io5";

const Navbar = () => {
  return (
    <section className='w-full flex items-center z-20 border-b border-b-main7'>
      <div className="w-full flex items-center py-4 px-8 justify-between">
        <div className='bg-mainalt w-[50%] rounded-full flex p-3 gap-3
        items-center'>
          <IoSearchOutline
            className='w-[1.3rem] h-auto text-main2'
          />

          <input
            type="text"
            placeholder="Search for anything"
            className="text-main4 focus:outline-none text-[15px] 
            placeholder:text-main4 font-semibold tracking-tight bg-transparent"
          />
        </div>

        <div>

        </div>
      </div>
    </section>
  )
};

export default Navbar;
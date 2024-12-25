import { IoSearchOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { PiBell } from "react-icons/pi";
import { profilepic } from "../../assets";

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

        <div className="flex items-center gap-7">
          <a href="/user" 
          className="bg-mainalt rounded-full p-3 relative grow2">
            <FiMail
              className='text-main2 text-[20px]'
            />
            
            <span className='absolute top-0 right-0 bg-logRed 
              rounded-full w-[12px] h-[12px]'
            />
          </a>

          <a href="/user" 
          className="bg-mainalt rounded-full p-3 relative grow2">
            <PiBell
              className='text-main2 text-[20px]'
              strokeWidth={3}
            />

            <span className='absolute top-0 right-0 bg-logRed 
              rounded-full w-[12px] h-[12px]'
            />
          </a>

          <div className="flex items-center gap-4 cursor-pointer">
            <div className="rounded-full overflow-hidden">
              <img
                src={profilepic}
                alt="profilepic"
                className="w-10 h-10 object-cover"
              />
            </div>

            <p className="text-[16px] tracking-tight text-main2
            font-semibold">
              Peter Alaks
            </p>

            <MdKeyboardArrowDown
              className='text-main2 text-[20px]'
            />
          </div>
        </div>
      </div>
    </section>
  )
};

export default Navbar;
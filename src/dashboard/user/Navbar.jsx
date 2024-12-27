import { useState, useEffect, useRef } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { PiBell } from "react-icons/pi";
import { profilepic } from "../../assets";
import { IoIosMenu } from "react-icons/io";
import { BsX } from 'react-icons/bs';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const menuRef = useRef(null);
  // const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  const disableScroll = () => {
    setScrollPosition(window.pageYOffset);
    document.body.style.overflow = 'hidden';
    document.body.style.top = `-${scrollPosition}px`;
  };

  const enableScroll = () => {
    document.body.style.overflow = 'auto';
    document.body.style.top = '0';
  };

  useEffect(() => {
    if (!toggle) {
      enableScroll();
    }
  }, [toggle]);      

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className='w-full flex items-center border-b border-b-main7'>
      <div className="w-full flex items-center md:py-4 ss:py-4 py-5 
      md:px-7 ss:px-10 px-5 justify-between">
        <div className='bg-mainalt w-[50%] rounded-full flex p-3 gap-3 
        items-center hidden md:flex'>
          <IoSearchOutline
            className='w-[1.3rem] h-auto text-main2 cursor-pointer'
          />

          <input
            type="text"
            placeholder="Search for anything"
            className="text-main4 focus:outline-none text-[15px] w-full
            placeholder:text-[14px] placeholder:text-main4 font-semibold 
            tracking-tight bg-transparent"
          />
        </div>

        <div className="md:hidden flex">
          <div>
            {toggle ? (
              <BsX
                size={38}
                className="object-contain cursor-pointer"
                style={{ color: '#1E3F76'}}
                onClick={() => {
                  setToggle(!toggle);
                  enableScroll();
                }}
              />
              ) : (
              <IoIosMenu
                size={38}
                className="object-contain cursor-pointer"
                style={{ color: '#1E3F76'}}
                onClick={() => {
                  setToggle(!toggle);
                  disableScroll();
                }}
              />
            )}
          </div>
          
          <div ref={menuRef}
          className={`ss:px-10 ss:py-4 p-5 absolute top-0 left-0 z-10 flex-col 
          w-full bg-white shadow-lg overflow-y-auto ss:h-auto h-screen
          ${toggle 
            ? 'menu-slide-enter menu-slide-enter-active' 
            : 'menu-slide-exit menu-slide-exit-active'}`
          }
          >
            
          </div>
        </div>

        <div className="flex items-center md:gap-7 ss:gap-7 gap-4">
          <a href="/user" 
          className="bg-mainalt rounded-full ss:p-3 p-2.5 relative 
          md:hidden flex">
            <IoSearchOutline
              className='text-main2 text-[19px]'
              strokeWidth={3}
            />
          </a>

          <a href="/user" 
          className="bg-mainalt rounded-full md:p-3 ss:p-3 p-2.5 relative 
          grow2">
            <FiMail
              className='text-main2 text-[19px]'
            />
            
            <span className='absolute top-0 right-0 bg-logRed 
              rounded-full md:w-[12px] ss:w-[12px] w-[10px] md:h-[12px]
              ss:h-[12px] h-[10px]'
            />
          </a>

          <a href="/user" 
          className="bg-mainalt rounded-full md:p-3 ss:p-3 p-2.5 relative 
          grow2">
            <PiBell
              className='text-main2 text-[19px]'
              strokeWidth={3}
            />

            <span className='absolute top-0 right-0 bg-logRed 
              rounded-full md:w-[12px] ss:w-[12px] w-[10px] md:h-[12px]
              ss:h-[12px] h-[10px]'
            />
          </a>

          <div className="flex items-center md:gap-4 ss:gap-4 gap-2 
          cursor-pointer">
            <div className="rounded-full overflow-hidden">
              <img
                src={profilepic}
                alt="profilepic"
                className="md:w-10 ss:w-10 w-9 md:h-10 ss:h-10 h-9 
                object-cover"
              />
            </div>

            <p className="text-[16px] tracking-tight text-main2
            font-semibold hidden md:flex ss:flex">
              Peter Alaks
            </p>

            <MdKeyboardArrowDown
              className='text-main2 md:text-[20px] text-[22px]'
            />
          </div>
        </div>
      </div>
    </section>
  )
};

export default Navbar;
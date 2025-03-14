import { useState, useEffect, useRef } from 'react';
import { HiOutlineSearch } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { PiBell } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { profilepic, logo, logout, settings } from "../../assets";
import { IoIosMenu } from "react-icons/io";
import { BsX } from 'react-icons/bs';
import { adminSideLinks } from '../../constants';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [notificationMenu, setNotificationMenu] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState('Home');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/admin' || currentPath === '/admin/') {
      setActive('Home');
    } else if (currentPath.startsWith('/admin/')) {
      const pathSegments = currentPath.split('/');
      const activeLink = adminSideLinks.find(link => link.route.includes(pathSegments[2]));
      if (activeLink) {
        setActive(activeLink.title);
      }
    }
  }, [location]);

  const handleSideItemClick = (link) => {
    // if (session) {
    setActive(link.title);
    navigate(link.route);
    // }
  };

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
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleSearchClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleSearchClickOutside);
    };
  }, []);

  return (
    <section className='w-full flex items-center border-b border-b-main7'>
      <div className="w-full flex items-center md:py-4 py-5 md:px-7 
      ss:px-10 px-5 justify-between">
        <div className='bg-mainalt w-[50%] rounded-full p-3 gap-3 
        items-center hidden md:flex'>
          <HiOutlineSearch
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
            {!toggle && (
              <IoIosMenu
              size={40}
              style={{ color: '#1E3F76'}}
              onClick={() => {
                setToggle(!toggle);
                disableScroll();
              }}
              />
            )}
          </div>

          {toggle && (
            <div className="fixed top-0 left-0 w-full h-screen bg-black 
            bg-opacity-50 z-10 navsmooth" 
            onClick={() => setToggle(false)} />
          )}
          
          <div ref={menuRef}
          className={`ss:px-10 ss:py-5 p-5 absolute top-0 left-0 z-20 flex
          flex-col ss:w-[50%] w-full bg-white shadow-lg overflow-y-auto h-auto
          ${toggle 
            ? 'menu-slide-enter2 menu-slide-enter-active2' 
            : 'menu-slide-exit2 menu-slide-exit-active2'}`
          }
          >
            <div className='w-full flex items-center justify-between'>
              <img
                src={logo} alt='logo'
                className='ss:h-[2.5rem] h-[2.2rem] w-auto'
              />

              {toggle && (
                <BsX
                size={40}
                style={{ color: '#DE2323'}}
                onClick={() => {
                  setToggle(!toggle);
                  enableScroll();
                }}
                />
              )}
            </div>

            <ul className="list-none flex flex-col gap-2 mt-12 w-full">
              {adminSideLinks.map((link) => (
                <li
                  key={link.id}
                  className={`${
                  active === link.title
                    ? 'bg-primary rounded-lg text-white font-bold'
                    : 'bg-none text-main2 font-semibold'
                  } ss:text-[16px] text-[15px] tracking-tight`}
                  onClick={() => {
                    handleSideItemClick(link);
                    setToggle(!toggle);
                  }}
                >
                  <div className={`p-3 flex ss:gap-4 gap-3 items-center`}>
                    <img 
                      src={link.Icon}
                      alt={link.id}
                      className={`ss:w-[1.5rem] w-[1.4rem] h-auto ${
                        active === link.title ? 's-white' : 's-main2'
                      }`}                                  
                    />
                    {link.title}
                  </div>
                </li>
              ))}

              {/* <li className={`text-[19px] list-item
              ${!session ? 'opacity-50' : 'hover:text-secondary cursor-pointer grow3'} 
              text-textalt mt-20`}>
                <div className='flex gap-6 px-5 items-center'
                onClick={handleLogout}>
                  <HiLogout className='transform scale-x-[-1]'
                  />
                  Logout
                </div>
              </li> */}
            </ul>

            <ul className="list-none flex flex-col gap-2 mt-8 w-full 
            border-t border-t-main7 pt-8">
              <li className='text-main2 font-semibold ss:text-[16px] 
              text-[15px] tracking-tight'>
                <div className={`flex p-3 ss:gap-4 gap-3 items-center`}>
                  <img 
                    src={settings}
                    alt='settings'
                    className='ss:w-[1.5rem] w-[1.4rem] h-auto'
                  />
                  Settings
                </div>
              </li>

              <li className='text-logRed font-semibold ss:text-[16px] 
              text-[15px] tracking-tight'>
                <div className={`flex p-3 ss:gap-4 gap-3 items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
                >
                  <img 
                    src={logout}
                    alt='logout'
                    className='ss:w-[1.5rem] w-[1.4rem] h-auto'
                  />
                  Logout
                </div>
              </li>
            </ul>

            <div className="flex flex-col gap-1.5 mt-12 w-full 
            border-t border-t-main7 pt-3 pb-3">
              <p className='text-main4 ss:text-[13px] text-[12px] tracking-tight
              font-medium'>
                v. 1.0.1
              </p>
            
              <p className='ss:text-[13px] text-[12px] text-main4 mt-0.5 
              font-medium tracking-tight'>
                ©2025 Envoy Angel Shipping and Logistics Ltd. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center md:gap-7 ss:gap-7 gap-4">
          <div ref={searchRef} className="bg-mainalt rounded-full ss:p-3 p-2.5 relative md:hidden flex navsmooth">
            {isSearchOpen ? (
              <div className='flex items-center justify-between w-full'>
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="text-main4 focus:outline-none ss:text-[15px] text-[13px] ss:w-[14rem] w-[14rem]
                  ss:placeholder:text-[14px] placeholder:text-[13px] placeholder:text-main4 font-medium 
                  tracking-tight bg-transparent"
                />

                <HiOutlineSearch
                  className='text-[19px] h-auto text-main2'
                />
              </div>
            ) : (
              <HiOutlineSearch
                className="text-main2 text-[19px]"
                onClick={handleSearchClick}
              />
            )}
          </div>

          <a href="" 
          className={`bg-mainalt rounded-full md:p-3 ss:p-3 p-2.5 relative grow2 ${isSearchOpen ? 'md:flex hidden' : 'flex'}`}>
            <FiMail
              className='text-main2 text-[19px]'
            />
            
            <span className='absolute top-0 right-0 bg-logRed 
              rounded-full md:w-[12px] ss:w-[12px] w-[10px] md:h-[12px]
              ss:h-[12px] h-[10px]'
            />
          </a>

          <div 
          className={`rounded-full relative ${isSearchOpen ? 'md:flex hidden' : 'flex'}`}
          onClick={(e) => {
            e.preventDefault();
            setNotificationMenu(!notificationMenu);
          }}>
            <div className="bg-mainalt grow2 rounded-full md:p-3 ss:p-3 p-2.5 text-main2 cursor-pointer">
              <PiBell
                className='text-[19px]'
                strokeWidth={4}
              />
            </div>

            <span className='absolute top-0 right-0 bg-logRed 
              rounded-full md:w-[12px] ss:w-[12px] w-[10px] md:h-[12px]
              ss:h-[12px] h-[10px]'
            />

            {notificationMenu && (
              <div ref={notificationRef}
              className="absolute top-[130%] md:right-[-150%] ss:right-[-400%] right-[-210%] bg-white md:rounded-xl 
              ss:rounded-xl rounded-lg shadow-[0px_5px_15px_rgba(0,0,0,0.20)] z-50 md:w-[450px] 
              ss:w-[350px] w-[300px] navsmooth md:max-h-auto ss:max-h-auto max-h-screen">
                <div className="flex flex-col md:p-5 ss:p-5 p-4 tracking-tight">
                  <h2 className="pb-4 font-bold md:text-[16px] ss:text-[15px] text-[14px] text-main2 border-b border-main7">
                    Notifications
                  </h2>

                  <div className="flex flex-col divide-y divide-main7">
                    <div className="flex items-center gap-3 py-4">
                      <div className="md:w-2.5 w-2 md:h-2.5 h-2 rounded-full bg-secondary flex-shrink-0" />

                      <p className="md:text-[14px] ss:text-[13px] text-[12px] text-main2 md:leading-[1.2rem] ss:leading-[1.2rem] leading-[1.1rem] font-semibold">
                        Your shipment with tracking number 001F5TG8XR4U  has been confirmed and shipped!
                      </p>
                    </div>

                    <div className="flex items-center gap-3 py-4">
                      <div className="md:w-2.5 w-2 md:h-2.5 h-2 rounded-full bg-secondary flex-shrink-0" />

                      <p className="md:text-[14px] ss:text-[13px] text-[12px] text-main2 md:leading-[1.2rem] ss:leading-[1.2rem] leading-[1.1rem] font-semibold">
                        Your payment was successful! We have sent a receipt to your email; if you didn't receive any mail, contact us by clicking here
                      </p>
                    </div>

                    <div className="flex items-center gap-3 py-4">
                      <div className="md:w-2.5 w-2 md:h-2.5 h-2 rounded-full bg-main4 flex-shrink-0" />

                      <p className="md:text-[14px] ss:text-[13px] text-[12px] text-main4 md:leading-[1.2rem] ss:leading-[1.2rem] leading-[1.1rem] font-medium">
                        Welcome to Envoy Angel Shipping and Logistics! We're super delighted you chose us to be your premier logistics partner.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 py-4">
                      <div className="md:w-2.5 w-2 md:h-2.5 h-2 rounded-full bg-main4 flex-shrink-0" />

                      <p className="md:text-[14px] ss:text-[13px] text-[12px] text-main4 md:leading-[1.2rem] ss:leading-[1.2rem] leading-[1.1rem] font-medium">
                        Endeavour to confirm your email address to unlock all the features of Envoy Angel
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-main7 pt-3 mt-14">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotificationMenu(false);
                      }}
                      className="flex items-center gap-2 md:text-[14px] text-[13px] text-logRed font-medium"
                    >
                      <div className="md:w-6 w-5 md:h-6 h-5 rounded-full bg-redCircle flex items-center justify-center">
                        <IoClose className="text-logRed md:text-[14px] text-[13px]" />
                      </div>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`flex items-center md:gap-4 ss:gap-4 gap-2 cursor-pointer ${isSearchOpen ? 'md:flex hidden' : 'flex'}`}>
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
              Envoy Admin
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
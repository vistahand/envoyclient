import { useState, useEffect, useRef } from "react";
import { BsX } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles";
import { navLinks } from "../constants";
import { logo, logout } from "../assets";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosMenu } from "react-icons/io";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TrackModal } from "../components";
import { useAuth } from "../context/AuthContext";
import { GoPerson } from "react-icons/go";
import LogoutComponent from "./Logout";

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const [toggle, setToggle] = useState(false);
  const menuRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  if (isAuthenticated) {
    console.log("User is authenticated:", user);
  } else {
    console.log("User is not authenticated", user);
  }
  useEffect(() => {
    if (user) {
      setUserData(user);
    } else {
      setUserData(null);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  const disableScroll = () => {
    setScrollPosition(window.pageYOffset);
    document.body.style.overflow = "hidden";
    document.body.style.top = `-${scrollPosition}px`;
  };

  const enableScroll = () => {
    document.body.style.overflow = "auto";
    document.body.style.top = "0";
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`w-full flex items-center fixed top-0 z-40 navsmooth
    ${isScrolled ? "shadow-lg" : ""}`}
    >
      <div className={`w-full flex bg-white ${styles.paddingX}`}>
        <div
          className="w-full flex justify-between items-center 
            max-w-[68rem] mx-auto py-5"
        >
          <div className="md:w-1/6 ss:w-1/3 w-1/2">
            <a href="/">
              <img
                src={logo}
                alt="logo"
                className="w-auto h-auto cursor-pointer"
              />
            </a>
          </div>

          <div
            className="justify-center relative
                items-center hidden md:flex"
          >
            <div className="flex items-center w-full">
              <ul className="list-none flex flex-row gap-8">
                {navLinks.map((link, index) => (
                  <li
                    key={link.id}
                    className="text-decoration-none cursor-pointer 
                                    py-2 flex flex-row gap-1.5 items-center relative"
                    onMouseEnter={() => toggleMenu(link.id)}
                    onMouseLeave={() => toggleMenu(null)}
                  >
                    <h3 className="text-primary text-[15px] font-[600]">
                      {link.title}
                    </h3>

                    <MdKeyboardArrowDown
                      className={`text-primary text-[16px] font-medium transition-transform duration-300 ${
                        openMenuId === link.id ? "rotate-180" : ""
                      }`}
                    />

                    {openMenuId === link.id && (
                      <div
                        className={`absolute top-full left-1/2 transform -translate-x-1/2 
                                        fade-in border-[1px] border-mainalt z-10`}
                      >
                        <div
                          className="bg-mainalt shadow-xl p-6
                                            flex flex-col gap-2 z-20"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {link.links.map((subLink, index) =>
                            subLink.name === "Track Shipment" ? (
                              <button
                                key={index}
                                onClick={() => {
                                  setIsTrackModalOpen(true);
                                  disableScroll();
                                }}
                                className="flex text-[14px] text-main
                                                            hover:font-medium"
                              >
                                {subLink.name}
                              </button>
                            ) : (
                              <a
                                key={index}
                                href={subLink.route}
                                className="flex text-[14px] text-main
                                                            hover:font-medium"
                              >
                                {subLink.name}
                              </a>
                            )
                          )}
                        </div>
                        <div
                          className="absolute top-0 left-1/2 z-[-10]
                                            transform -translate-x-1/2 w-10 h-10 bg-mainalt
                                            rotate-45 border-[1px] border-mainalt"
                        ></div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="hidden md:block relative">
              <div
                className={`flex items-center md:gap-4 ss:gap-4 gap-2 cursor-pointer`}
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                {user?.profileImage ? (
                  <div className="rounded-full overflow-hidden">
                    <img
                      src={user.profileImage}
                      alt="User Profile"
                      className="w-[40px] h-[40px] rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-[40px] h-[40px] rounded-full bg-gray-200 flex items-center justify-center">
                    <GoPerson className="w-5 h-5 text-gray-500" />
                  </div>
                )}

                <p className="text-[16px] tracking-tight text-main2 font-semibold hidden md:flex ss:flex capitalize">
                  {`${userData?.firstName} ${userData?.lastName}` || "Guest"}
                </p>

                <MdKeyboardArrowDown
                  className={`text-main2 md:text-[20px] text-[22px] transition-transform duration-300 ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <a
                    href={`${userData?.role === "admin" ? "/admin" : "/user"}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary font-medium"
                  >
                    Account
                  </a>
                  <a
                    href={`${
                      userData?.role === "admin"
                        ? "/admin/settings"
                        : "/user/settings"
                    }`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary font-medium"
                  >
                    Settings
                  </a>

                  <LogoutComponent
                    component="div"
                    className="text-logRed font-semibold text-sm cursor-pointer tracking-tight hover:bg-gray-100"
                  >
                    <div className="flex p-3 ss:gap-4 gap-3 items-center">
                      <img src={logout} alt="logout" className="w-6 h-6" />
                      Logout
                    </div>
                  </LogoutComponent>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              <h1
                className="text-primary cursor-pointer ss:text-[20px] 
                            text-[8px] font-[600]"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Login
              </h1>

              <a
                href="/createshipment"
                className="bg-primary ss:text-[16px] text-[13px] 
                            py-3 ss:px-8 px-6 flex text-white rounded-full w-1/8
                            items-center gap-3"
              >
                <p className="font-[500]">Book a Shipment</p>

                <HiOutlineArrowRight
                  className="ss:text-[18px]
                                text-[15px]"
                />
              </a>
            </div>
          )}
          {/* FOR MOBILE */}

          <div
            className="md:hidden flex justify-end flex-1 
                items-center navsmooth"
          >
            <div className="z-20">
              {toggle ? (
                <BsX
                  size={40}
                  className="object-contain cursor-pointer"
                  style={{ color: "#1E3F76" }}
                  onClick={() => {
                    setToggle(!toggle);
                    enableScroll();
                  }}
                />
              ) : (
                <IoIosMenu
                  size={40}
                  className="object-contain cursor-pointer"
                  style={{ color: "#1E3F76" }}
                  onClick={() => {
                    setToggle(!toggle);
                    disableScroll();
                  }}
                />
              )}
            </div>

            {toggle && (
              <div
                className="fixed top-24 left-0 w-full 
                        h-screen bg-black bg-opacity-70 z-5 navsmooth"
                onClick={() => setToggle(false)}
              />
            )}

            <div
              ref={menuRef}
              className={`p-6 ss:mt-20 mt-[70px] absolute top-0 
                        right-0 z-10 flex-col w-full bg-white shadow-lg
                        ss:px-16 px-5 overflow-y-auto pb-10
                        ${
                          toggle
                            ? "menu-slide-enter menu-slide-enter-active"
                            : "menu-slide-exit menu-slide-exit-active"
                        }`}
            >
              <ul
                className="list-none flex flex-col ss:gap-5 gap-4 
                        ss:mb-20 mb-16"
              >
                {navLinks.map((link) => (
                  <li
                    key={link.id}
                    className="text-decoration-none flex 
                            flex-col"
                    onClick={() => toggleMenu(link.id)}
                  >
                    <div
                      className="flex flex-row 
                                items-center gap-2.5"
                    >
                      <h3
                        className="text-primary 
                                    ss:text-[20px] text-[16px] 
                                    font-medium"
                      >
                        {link.title}
                      </h3>

                      <MdKeyboardArrowDown
                        className={`text-primary text-[20px] transition-transform duration-300
                                        ${
                                          openMenuId === link.id
                                            ? "rotate-180"
                                            : ""
                                        }`}
                      />
                    </div>

                    {openMenuId === link.id && (
                      <div
                        className="mt-3 fade-in ml-2"
                        style={{ maxHeight: "30vh", overflowY: "auto" }}
                      >
                        <div
                          className="flex flex-col ss:gap-3 
                                        gap-2.5"
                        >
                          {link.links.map((subLink, index) =>
                            subLink.name === "Track Shipment" ? (
                              <button
                                key={index}
                                onClick={() => {
                                  setIsTrackModalOpen(true);
                                  disableScroll();
                                }}
                                className="ss:text-[17px] 
                                                        text-[15px] text-main text-left"
                              >
                                {subLink.name}
                              </button>
                            ) : (
                              <a
                                key={index}
                                href={subLink.route}
                                className="ss:text-[17px] 
                                                        text-[15px] text-main"
                              >
                                {subLink.name}
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {isAuthenticated ? (
                <div className="relative">
                  <div
                    className={`flex items-center md:gap-4 ss:gap-4 gap-2 cursor-pointer`}
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                  >
                    {user?.profileImage ? (
                      <div className="rounded-full overflow-hidden">
                        <img
                          src={user.profileImage}
                          alt="User Profile"
                          className="w-[40px] h-[40px] rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-[40px] h-[40px] rounded-full bg-gray-200 flex items-center justify-center">
                        <GoPerson className="w-5 h-5 text-gray-500" />
                      </div>
                    )}

                    <p className="text-[16px] tracking-tight text-main2 font-semibold hidden md:flex ss:flex capitalize">
                      {`${userData?.firstName} ${userData?.lastName}` ||
                        "Guest"}
                    </p>

                    <MdKeyboardArrowDown
                      className={`text-main2 md:text-[20px] text-[22px] transition-transform duration-300 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Mobile Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="mt-3 bg-gray-50 rounded-md py-2 shadow-sm">
                      <a
                        href={`${
                          userData?.role === "admin" ? "/admin" : "/user"
                        }`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary font-medium"
                      >
                        Account
                      </a>
                      <a
                        href={`${
                          userData?.role === "admin"
                            ? "/admin/settings"
                            : "/user/settings"
                        }`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ss:text-[17px] text-[15px]"
                      >
                        Settings
                      </a>

                      <LogoutComponent
                        component="div"
                        className="text-logRed font-semibold text-sm cursor-pointer tracking-tight hover:bg-gray-100"
                      >
                        <div className="flex p-3 ss:gap-4 gap-3 items-center">
                          <img src={logout} alt="logout" className="w-6 h-6" />
                          Logout
                        </div>
                      </LogoutComponent>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <h1
                    className="text-primary cursor-pointer ss:text-[20px] 
                            text-[8px]"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                  >
                    Login
                  </h1>

                  <a
                    href="/createshipment"
                    className="bg-primary ss:text-[16px] text-[13px] 
                            py-3 ss:px-8 px-6 flex text-white rounded-full w-1/8
                            items-center gap-3"
                  >
                    <p className="font-[500]">Book a Shipment</p>

                    <HiOutlineArrowRight
                      className="ss:text-[18px]
                                text-[15px]"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isTrackModalOpen && (
        <TrackModal
          onClose={() => {
            setIsTrackModalOpen(false);
            enableScroll();
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;

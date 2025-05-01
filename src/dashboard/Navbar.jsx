import { useState, useEffect, useRef } from "react";
import { HiLogout } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { PiBell } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { logo, logout, settings } from "../assets";
import { IoIosMenu } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { BsX } from "react-icons/bs";
import { adminSideLinks, sideLinks } from "../constants";
import { useNavigate, useLocation } from "react-router-dom";
import { GoPerson } from "react-icons/go";
import LogoutComponent from "../components/Logout";

const Navbar = () => {
  const { user } = useAuth(); // Get user data from AuthContext
  const [toggle, setToggle] = useState(false);
  const [notificationMenu, setNotificationMenu] = useState(false);
  const menuRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("Home");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    } else {
      setUserData(null);
    }
  }, [user]);

  // Determine which links to use based on the path
  const isAdminPath = location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  const currentLinks = isAdminPath ? adminSideLinks : sideLinks;

  const currentPath = location.pathname;
  useEffect(() => {
    // Use the appropriate link set based on path
    const links = isAdminPath ? adminSideLinks : sideLinks;
    
    if (currentPath === "/user" || currentPath === "/user/") {
      setActive("Home");
    } else if (currentPath === "/admin" || currentPath === "/admin/") {
      setActive("Dashboard"); // Assuming "Dashboard" is the title for the admin home
    } else if (currentPath.startsWith("/user/") || currentPath.startsWith("/admin/")) {
      const pathSegments = currentPath.split("/");
      
      // Fix: Check if the link has route property before accessing includes()
      const activeLink = links.find((link) =>
        link.route && link.route.includes(pathSegments[2])
      );

      // Check for dropdown items
      for (const link of links) {
        if (link.hasDropdown && link.dropdownItems) {
          for (const item of link.dropdownItems) {
            if (currentPath === item.route) {
              setActive(item.title);
              setOpenDropdown(link.id);
              return;
            }
          }
        }
      }

      if (activeLink) {
        setActive(activeLink.title);
      }
    }
  }, [location, isAdminPath]);

  // Modified to only handle dropdown toggling, not navigation or modal closing
  const handleSideItemClick = (link) => {
    if (link.hasDropdown) {
      setOpenDropdown(openDropdown === link.id ? null : link.id);
    } else {
      setActive(link.title);
      navigate(link.route);
      setToggle(false); // Close the modal only for non-dropdown items
    }
  };

  // This will handle navigation and modal closing when a dropdown item is clicked
  const handleDropdownItemClick = (parentLink, item) => {
    setActive(item.title);
    navigate(item.route);
    setToggle(false); // Close the modal when dropdown item is clicked
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
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationMenu(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleSearchClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleSearchClickOutside);
    };
  }, []);
  
  return (
    <section className="w-full flex items-center border-b border-b-main7">
      <div
        className="w-full flex items-center md:py-4 py-5 md:px-7 
      ss:px-10 px-5 justify-between"
      >
        <div className="hidden md:block"></div>

        {/* sidebar  */}
        <div className="md:hidden flex">
          <div>
            {!toggle && (
              <IoIosMenu
                size={40}
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
              className="fixed top-0 left-0 w-full h-screen bg-black 
            bg-opacity-50 z-10 navsmooth"
              onClick={() => setToggle(false)}
            />
          )}

          <div
            ref={menuRef}
            className={`ss:px-10 ss:py-5 p-5 absolute top-0 left-0 z-20 flex
            flex-col justify-between my-auto  ss:w-[50%] w-[80%] bg-white shadow-lg overflow-y-auto h-screen
            ${
              toggle
                ? "menu-slide-enter2 menu-slide-enter-active2"
                : "menu-slide-exit2 menu-slide-exit-active2"
            }`}
          >
           <div className="w-full flex items-center justify-between"
           >
           <div
              onClick={() => {
                navigate("/");
              }}
            >
              <img
                src={logo}
                alt="logo"
                className="ss:h-[2.5rem] h-[2.2rem] w-auto"
              />
            </div>
            {toggle && (
                <BsX
                  size={40}
                  style={{ color: "#DE2323" }}
                  onClick={() => {
                    setToggle(!toggle);
                    enableScroll();
                  }}
                />
              )}
              </div>

            <ul className="list-none flex flex-col gap-2 mt-12 w-full">
              {currentLinks.map((link) => (
                <li key={link.id}>
                  <div
                    className={`${
                      (active === link.title || openDropdown === link.id) &&
                      !link.hasDropdown
                        ? "bg-primary rounded-lg text-white font-bold"
                        : "bg-none text-main2 grow4 font-semibold"
                    } cursor-pointer text-[16px] tracking-tight`}
                    onClick={() => {
                      handleSideItemClick(link);
                      // We only close the toggle if it's not a dropdown
                      if (!link.hasDropdown) {
                        setToggle(false);
                      }
                    }}
                  >
                    <div
                      className={`p-3 flex gap-4 items-center justify-between`}
                    >
                      <div className="flex gap-4 items-center">
                        <img
                          src={link.Icon}
                          alt={link.id}
                          className={`w-[1.5rem] h-auto ${
                            active === link.title || openDropdown === link.id
                              ? "text-black"
                              : "text-black"
                          }`}
                        />
                        {link.title}
                      </div>
                      {link.hasDropdown && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 transition-transform ${
                            openDropdown === link.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {link.hasDropdown && link.dropdownItems && openDropdown === link.id && (
                    <ul className="pl-10 mt-1 space-y-1">
                      {link.dropdownItems.map((item) => (
                        <li
                          key={item.id}
                          className={`${
                            active === item.title
                              ? "text-primary font-bold"
                              : "text-main2 font-semibold"
                          } cursor-pointer text-[14px] tracking-tight py-2`}
                          onClick={() => {
                            handleDropdownItemClick(link, item);
                            // Close the modal when dropdown item is clicked
                            setToggle(false);
                          }}
                        >
                          {item.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <ul
              className="list-none flex flex-col gap-2 mt-auto w-full 
                border-t border-t-main7 pt-8"
            >
              <li
                onClick={() => {
                  navigate(
                    `${
                      userData?.role === "admin"
                        ? "/admin/settings"
                        : "/user/settings"
                    }`
                  );
                  setToggle(false);
                }}
                className="text-main2 font-semibold cursor-pointer ss:text-[16px] 
                  text-[15px] tracking-tight"
              >
                <div className={`flex p-3 ss:gap-4 gap-3 items-center`}>
                  <img
                    src={settings}
                    alt="settings"
                    className="ss:w-[1.5rem] w-[1.4rem] h-auto"
                  />
                  Settings
                </div>
              </li>

              <LogoutComponent
                component="div"
                className="text-logRed font-semibold text-sm cursor-pointer tracking-tight hover:bg-gray-100"
              >
                <div className="flex p-3 ss:gap-4 gap-3 items-center">
                  <img src={logout} alt="logout" className="w-6 h-6" />
                  Logout
                </div>
              </LogoutComponent>
            </ul>

            <div
              className="flex flex-col gap-1.5 mt-5 w-full 
                border-t border-t-main7 pt-3 pb-3"
            >
              <p
                className="ss:text-[13px] text-[12px] text-main4 mt-0.5 
              font-medium tracking-tight"
              >
                ©2025 Envoy Angel Shipping and Logistics Ltd. All Rights
                Reserved.
              </p>
            </div>
          </div>
        </div>

        {/* mobile top */}
        <div className="flex items-center md:gap-x-7 ss:gap-x-7 gap-x-4">
          {/* notification is commented out in original code */}

          {/* settings profile image */}
          <div className="relative">
            <div
              className={`flex items-center md:gap-4 ss:gap-4 gap-2 cursor-pointer ${
                isSearchOpen ? "md:flex hidden" : "flex"
              }`}
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              {user?.profileImage !== "default.jpg" ? (
                <div className="rounded-full overflow-hidden">
                 {user?.profileImage ? (
                   <img
                   src={user.profileImage}
                   alt="User Profile"
                   className="w-[40px] h-[40px] rounded-full object-cover"
                 />
                 ) : (
                  <div className="w-[40px] h-[40px] rounded-full bg-gray-200 flex items-center justify-center">
                    <GoPerson className="w-5 h-5 text-gray-500" />
                  </div>
                 )}
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
              <div
                ref={profileDropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              >
                <a
                  href={`${userData?.role === "admin" ? "/admin" : "/user"}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary font-medium"
                >
                  Account
                </a>
                <a
                  href={`${
                    isAdminPath
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
        </div>
      </div>
    </section>
  );
};

export default Navbar;
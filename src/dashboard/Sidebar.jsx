import { useState, useEffect } from "react";
import { adminSideLinks, sideLinks } from "../constants";
import { help, logo, logout, settings } from "../assets";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LogoutComponent from "../components/Logout";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("Home");
  const [openDropdown, setOpenDropdown] = useState(null);

  const currentPath = location.pathname;
  useEffect(() => {
    if (currentPath === "/user" || currentPath === "/user/") {
      setActive("Home");
    } else if (
      currentPath.startsWith("/user/") ||
      currentPath.startsWith("/admin/")
    ) {
      const pathSegments = currentPath.split("/");
      const activeLink = sideLinks.find((link) =>
        link.route.includes(pathSegments[2])
      );
      
      // Check if the current path matches a dropdown item
      const links = currentPath.startsWith("/admin") ? adminSideLinks : sideLinks;
      for (const link of links) {
        if (link.hasDropdown) {
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
  }, [location]);

  const handleSideItemClick = (link) => {
    if (link.hasDropdown) {
      setOpenDropdown(openDropdown === link.id ? null : link.id);
    } else {
      setActive(link.title);
      navigate(link.route);
    }
  };

  const handleDropdownItemClick = (parentLink, item) => {
    setActive(item.title);
    navigate(item.route);
  };

  const links =
    currentPath.startsWith("/admin") || currentPath.startsWith("/admin/")
      ? adminSideLinks
      : sideLinks;

  return (
    <section className="w-full px-7 flex items-center z-20">
      <div className="w-full flex items-center py-10">
        <div className="flex flex-col justify-between my-auto items-center w-full h-screen">
          <div className="w-full" onClick={() => navigate("/")}>
            <img
              src={logo}
              alt="logo"
              className="w-[14rem] h-auto cursor-pointer"
            />
          </div>

          <ul className="list-none flex flex-col gap-2.5 mt-14 w-full">
            {links.map((link) => (
              <li key={link.id}>
                <div
                  className={`${
                    (active === link.title || openDropdown === link.id) && !link.hasDropdown
                      ? "bg-primary rounded-lg text-white font-bold"
                      : "bg-none text-main2 grow4 font-semibold"
                  } cursor-pointer text-[16px] tracking-tight`}
                  onClick={() => handleSideItemClick(link)}
                >
                  <div className={`p-3 flex gap-4 items-center justify-between`}>
                    <div className="flex gap-4 items-center">
                      <img
                        src={link.Icon}
                        alt={link.id}
                        className={`w-[1.5rem] h-auto ${
                          active === link.title || openDropdown === link.id ? "text-black" : "text-black"
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
                
                {link.hasDropdown && openDropdown === link.id && (
                  <ul className="pl-10 mt-1 space-y-1">
                    {link.dropdownItems.map((item) => (
                      <li
                        key={item.id}
                        className={`${
                          active === item.title
                            ? "text-primary font-bold"
                            : "text-main2 font-semibold"
                        } cursor-pointer text-[14px] tracking-tight py-2`}
                        onClick={() => handleDropdownItemClick(link, item)}
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <>
            <ul
              className="list-none flex flex-col gap-2.5 mt-auto 
                    w-full border-t border-t-main7 pt-12"
            >
              <li className="text-main2 grow4 font-semibold cursor-pointer text-[16px] tracking-tight">
                <Link
                  to={`${
                    currentPath.startsWith("/admin") ||
                    currentPath.startsWith("/admin/")
                      ? "/admin/settings"
                      : "/user/settings"
                  }`}
                  className="flex p-3 gap-4 items-center"
                >
                  <img
                    src={settings}
                    alt="settings"
                    className="w-[1.5rem] h-auto"
                  />
                  Settings
                </Link>
              </li>

              <LogoutComponent
                component="li"
                className="text-logRed grow4 font-semibold
                        cursor-pointer text-[16px] tracking-tight"
              >
                <div className={`flex p-3 gap-4 items-center`}>
                  <img
                    src={logout}
                    alt="logout"
                    className="w-[1.5rem] h-auto"
                  />
                  Logout
                </div>
              </LogoutComponent>
            </ul>

            <div
              className="flex flex-col gap-1.5 mt-5 w-full 
                    border-t border-t-main7 pt-3"
            >
              <p className="text-[13px] text-main4 mt-0.5 font-medium tracking-tight">
                ©2025 Envoy Angel Shipping and Logistics Ltd. All Rights
                Reserved.
              </p>
            </div>
          </>
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
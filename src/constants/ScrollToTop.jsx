import { useState, useEffect } from "react";
import { IoArrowUp } from "react-icons/io5";
import { useLocation } from "react-router-dom";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation().pathname;
  const user = location.startsWith("/user");
  const admin = location.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsVisible(scrollTop > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`${
        admin || user ? "hidden" : "block"
      } bg-primary py-3 px-3 fixed md:bottom-10 z-20
    ss:bottom-8 bottom-6 md:left-20 ss:left-16 left-5 rounded-full 
    transition-opacity duration-400 cursor-pointer grow2 animate-bounce
    ${isVisible ? "opacity-90" : "opacity-0 pointer-events-none"}`}
      onClick={scrollToTop}
    >
      <IoArrowUp
        className="text-white md:text-[18px] ss:text-[20px]
        text-[16px]"
      />
    </div>
  );
};

export default ScrollToTopButton;

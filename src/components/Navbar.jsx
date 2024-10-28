import { useState, useEffect, useRef } from 'react';
import { BsX } from 'react-icons/bs';
import styles from '../styles';
import { navLinks } from '../constants';
import { logo } from '../assets';
import { TiArrowSortedDown } from "react-icons/ti";
import { IoMenu } from "react-icons/io5";
import { useNavigate  } from 'react-router-dom';

const Navbar = () => {
    const [toggle, setToggle] = useState(false);
    const menuRef = useRef(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [scrollPosition, setScrollPosition] = useState(0);


    const toggleMenu = (id) => {
        setOpenMenuId((prevId) => (prevId === id ? null : id));
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
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


  return (
    <nav className='w-full flex items-center fixed top-0 z-20 navsmooth'>    
        <div className={`w-full flex bg-white ${styles.paddingX}`}>
            <div className='w-full flex justify-between items-center 
            max-w-[72rem] mx-auto py-3'>
                <div className='w-2/5'>
                    <a href='/'>
                        <img
                            src={logo} alt='logo'
                            className='w-auto h-auto cursor-pointer'
                        />
                    </a>
                </div>
                

                <div className='flex w-full justify-center relative
                    items-center hidden md:flex'>
                    <div className="flex items-center w-full">
                        <ul className="list-none flex flex-row gap-6">
                            {navLinks.map((link, index) => (
                            <li
                                key={link.id}
                                className='text-decoration-none cursor-pointer 
                                py-2 flex flex-row gap-1 items-center relative'
                                onMouseEnter={() => toggleMenu(link.id)}
                                onMouseLeave={() => toggleMenu(null)}
                            >
                                <h3 className='text-main text-[13px] font-medium'>
                                    {link.title}
                                </h3>
                                
                                <TiArrowSortedDown 
                                    className='text-main text-[15px]'
                                />

                                {openMenuId === link.id && (
                                    <div className={`absolute top-full ${index === 0 ? 
                                    'left-0 transform-none' 
                                    : 'left-1/2 transform -translate-x-1/2'} 
                                    fade-in border-[1px] border-main2 z-10`}>
                                        <div className="bg-white shadow-xl p-6
                                        flex flex-col gap-1.5 z-20"
                                        style={{whiteSpace: 'nowrap'}}
                                        >
                                            {link.links.map((subLink, index) => (
                                                <a
                                                    key={index}
                                                    href={subLink.route}
                                                    className="flex text-[13px] text-main
                                                    hover:font-medium"
                                                >
                                                    {subLink.name}
                                                </a>
                                            ))}
                                        </div>
                                        <div className={`absolute top-0 ${index === 0 
                                        ? 'left-[15%] z-[-10]' 
                                        : 'left-1/2 z-[-10]'} 
                                        transform -translate-x-1/2 w-10 h-10
                                        bg-white rotate-45 border-[1px] border-main2`}>
                                        </div>
                                    </div>
                                )}
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="hidden md:flex justify-end w-full">
                    <div className='bg-primary text-[13px] py-3 px-5 flex gap-3
                    text-white rounded-full grow4 cursor-pointer w-[160px]
                    items-center'
                    // onClick={() => {
                    //     setToggle(!toggle);
                    // }}
                    >
                        Book a Shipment
                    </div>
                </div>

                {/* FOR MOBILE */}
                
                <div className="md:hidden flex justify-end flex-1 
                items-center">
                    <div className="flex items-center z-20 ss:gap-8 
                    gap-5">
                        {toggle ? (
                            <BsX
                                size={38}
                                className="object-contain cursor-pointer"
                                style={{ color: '#050759' }}
                                onClick={() => {
                                    setToggle(!toggle);
                                    enableScroll();
                                }}
                            />
                            ) : (
                            <IoMenu
                                size={38}
                                className="object-contain cursor-pointer"
                                style={{ color: '#050759' }}
                                onClick={() => {
                                    setToggle(!toggle);
                                    disableScroll();
                                }}
                            />
                        )}
                    </div>

                    <div ref={menuRef}
                        className={`p-6 ss:mt-20 mt-20 absolute top-0 
                        right-0 z-10 flex-col w-full bg-white shadow-lg
                        ss:px-16 h-[80vh] overflow-y-auto
                        ${toggle 
                            ? 'menu-slide-enter menu-slide-enter-active' 
                            : 'menu-slide-exit menu-slide-exit-active'}`
                        }
                    >
                        <ul className="list-none flex flex-col 
                        ss:gap-4 gap-4 ss:mb-14 mb-10">
                        {navLinks.map((link) => (
                            <li
                            key={link.id}
                            className='text-decoration-none flex 
                            flex-col'
                            onClick={() => toggleMenu(link.id)}
                            >
                                <div className='flex flex-row 
                                items-center ss:gap-2 gap-2'>
                                    <h3 className='text-main 
                                    ss:text-[16px] text-[15px] 
                                    font-medium'>
                                        {link.title}
                                    </h3>

                                    <TiArrowSortedDown 
                                        className='text-main ss:text-[18px]
                                        text-[16px]' 
                                    />
                                </div>
                                
                                {openMenuId === link.id && (
                                    <div className='mt-2 fade-in ml-2' 
                                    style={{ maxHeight: '30vh', 
                                    overflowY: 'auto' }}>
                                        <div className='flex flex-col 
                                        ss:gap-2 gap-2'>
                                            {link.links.map((subLink, index) => (
                                            <a
                                                key={index}
                                                href={subLink.route}
                                                className="ss:text-[15px] 
                                                text-[14px] text-main"
                                            >
                                                {subLink.name}
                                            </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                        </ul>

                        <div className='bg-primary text-[13px] py-3 px-5 flex gap-3
                        text-white rounded-full grow4 cursor-pointer w-[160px]
                        items-center'
                        // onClick={() => {
                        //     setToggle(!toggle);
                        // }}
                        >
                            Book a Shipment
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;
import { useState, useEffect, useRef } from 'react';
import { BsX } from 'react-icons/bs';
import styles from '../styles';
import { navLinks } from '../constants';
import { logo } from '../assets';
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useNavigate  } from 'react-router-dom';

const Navbar = () => {
    const [toggle, setToggle] = useState(false);
    const menuRef = useRef(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const navigate = useNavigate();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
    <nav className={`w-full flex items-center fixed top-0 z-50 navsmooth
    ${ isScrolled ? 'shadow-lg' : '' }`}>    
        <div className={`w-full flex bg-white ${styles.paddingX}`}>
            <div className='w-full flex justify-between items-center 
            max-w-[68rem] mx-auto py-5'>
                <div className='md:w-1/6 ss:w-1/3 w-1/2'>
                    <a href='/'>
                        <img
                            src={logo} alt='logo'
                            className='w-auto h-auto cursor-pointer'
                        />
                    </a>
                </div>

                <div className='flex justify-center relative
                    items-center hidden md:flex'>
                    <div className="flex items-center w-full">
                        <ul className="list-none flex flex-row gap-8">
                            {navLinks.map((link, index) => (
                                <li
                                    key={link.id}
                                    className='text-decoration-none cursor-pointer 
                                    py-2 flex flex-row gap-1.5 items-center relative'
                                    onMouseEnter={() => toggleMenu(link.id)}
                                    onMouseLeave={() => toggleMenu(null)}
                                >
                                    <h3 className='text-primary text-[15px] font-[600]'>
                                        {link.title}
                                    </h3>
                                    
                                    <MdKeyboardArrowDown
                                        className={`text-primary text-[16px] font-medium transition-transform duration-300 ${
                                            openMenuId === link.id ? 'rotate-180' : ''
                                        }`}
                                    />

                                    {openMenuId === link.id && (
                                        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 
                                        fade-in border-[1px] border-mainalt z-10`}>
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
                                            <div className='absolute top-0 left-1/2 z-[-10]
                                            transform -translate-x-1/2 w-10 h-10 bg-white
                                            rotate-45 border-[1px] border-mainalt'>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="hidden md:flex justify-end items-center
                gap-5">
                    <h1 className='text-primary text-[15px] font-[600]
                    cursor-pointer grow2'>
                        Log In
                    </h1>

                    <a href='/'
                    className='bg-primary text-[13px] py-3 px-6 flex
                    text-white rounded-full grow4 cursor-pointer w-1/8
                    items-center gap-3'
                    >
                        <p className='font-[500]'>
                            Book a Shipment
                        </p>
                        
                        <HiOutlineArrowRight className='text-[14px]'/>
                    </a>
                </div>

                {/* FOR MOBILE */}
                
                <div className="md:hidden flex justify-end flex-1 
                items-center navsmooth">
                    <div className="flex items-center z-20 ss:gap-8 
                    gap-5">
                        {toggle ? (
                            <BsX
                                size={40}
                                className="object-contain cursor-pointer"
                                style={{ color: '#050759' }}
                                onClick={() => {
                                    setToggle(!toggle);
                                    enableScroll();
                                }}
                            />
                            ) : (
                            <IoMenu
                                size={40}
                                className="object-contain cursor-pointer"
                                style={{ color: '#050759' }}
                                onClick={() => {
                                    setToggle(!toggle);
                                    disableScroll();
                                }}
                            />
                        )}
                    </div>

                    {toggle && (
                        <div className="fixed top-24 left-0 w-full 
                        h-screen bg-black bg-opacity-60 z-5 navsmooth" 
                        onClick={() => setToggle(false)} />
                    )}

                    <div ref={menuRef}
                        className={`p-6 ss:mt-20 mt-20 absolute top-0 
                        right-0 z-10 flex-col w-full bg-white shadow-lg
                        ss:px-16 overflow-y-auto pb-10
                        ${toggle 
                            ? 'menu-slide-enter menu-slide-enter-active' 
                            : 'menu-slide-exit menu-slide-exit-active'}`
                        }
                    >
                        <ul className="list-none flex flex-col ss:gap-5 gap-4 
                        ss:mb-20 mb-16">
                        {navLinks.map((link) => (
                            <li
                            key={link.id}
                            className='text-decoration-none flex 
                            flex-col'
                            onClick={() => toggleMenu(link.id)}
                            >
                                <div className='flex flex-row 
                                items-center gap-2.5'>
                                    <h3 className='text-primary 
                                    ss:text-[20px] text-[16px] 
                                    font-medium'>
                                        {link.title}
                                    </h3>

                                    <MdKeyboardArrowDown 
                                        className={`text-primary text-[20px] transition-transform duration-300
                                        ${openMenuId === link.id ? 'rotate-180' : ''}`} 
                                    />
                                </div>
                                
                                {openMenuId === link.id && (
                                    <div className='mt-3 fade-in ml-2' 
                                    style={{ maxHeight: '30vh', 
                                    overflowY: 'auto' }}>
                                        <div className='flex flex-col ss:gap-3 
                                        gap-2.5'>
                                            {link.links.map((subLink, index) => (
                                            <a
                                                key={index}
                                                href={subLink.route}
                                                className="ss:text-[17px] 
                                                text-[15px] text-main"
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

                        <div className="flex items-center gap-6">
                            <h1 className='text-primary ss:text-[20px] 
                            text-[16px] font-[600]'>
                                Log In
                            </h1>

                            <a href='/'
                            className='bg-primary ss:text-[16px] text-[13px] 
                            py-3 ss:px-8 px-6 flex text-white rounded-full w-1/8
                            items-center gap-3'
                            >
                                <p className='font-[500]'>
                                    Book a Shipment
                                </p>
                                
                                <HiOutlineArrowRight className='ss:text-[18px]
                                text-[15px]'/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;
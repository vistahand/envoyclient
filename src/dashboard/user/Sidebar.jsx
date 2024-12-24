import { useState } from 'react';
import { sideLinks } from '../../constants';
import { help, logo, logout, settings } from '../../assets';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
//   const { data: session } = useSession();
    const navigate = useNavigate();
    const [active, setActive] = useState('Home');

//   useEffect(() => {
//     if (session) {
//       const currentPath = pathname.split('/')[1];
//       const activeLink = sideLinks.find(link => link.route.includes(currentPath));
//       if (activeLink) {
//         setActive(activeLink.title);
//       }
//     }
//   }, [pathname, session]);

    const handleSideItemClick = (link) => {
        // if (session) {
        setActive(link.title);
        navigate(link.route);
        // }
    };

//   const handleLogout = () => {
//     if (session) {
//       signOut({ callbackUrl: 'http://localhost:3001' });
//     }
//   };

  return (
        <section className='w-full px-8 flex items-center z-20'>
            <div className="w-full flex items-center py-10">
                <div className="flex flex-col items-center w-full h-screen">
                    <div className='w-full'>
                        <img
                            src={logo} alt='logo'
                            className='w-[14rem] h-auto cursor-pointer'
                        />
                    </div>

                    <ul className="list-none flex flex-col gap-2 mt-16 w-full">
                        {sideLinks.map((link) => (
                            <li
                                key={link.id}
                                className={`${
                                active === link.title
                                    ? 'bg-primary rounded-lg text-white font-bold'
                                    : 'bg-none text-main2 grow4 font-semibold'
                                } cursor-pointer text-[17px] tracking-tight`}
                                onClick={() => {
                                    handleSideItemClick(link);
                                }}
                            >
                                <div className={`p-3 flex gap-4 items-center`}>
                                    <img 
                                        src={link.Icon}
                                        alt={link.id}
                                        className='w-[1.6rem] h-auto'
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

                    <ul className="list-none flex flex-col gap-2 mt-32 
                    w-full border-t border-t-main7 pt-12">
                        <li className='text-main2 grow4 font-semibold
                        cursor-pointer text-[17px] tracking-tight'>
                            <div className={`flex p-3 gap-4 items-center`}>
                                <img 
                                    src={help}
                                    alt='helpcentre'
                                    className='w-[1.6rem] h-auto'
                                />
                                Help Centre
                            </div>
                        </li>

                        <li className='text-main2 grow4 font-semibold
                        cursor-pointer text-[17px] tracking-tight'>
                            <div className={`flex p-3 gap-4 items-center`}>
                                <img 
                                    src={settings}
                                    alt='settings'
                                    className='w-[1.6rem] h-auto'
                                />
                                Settings
                            </div>
                        </li>

                        <li className='text-logRed grow4 font-semibold
                        cursor-pointer text-[17px] tracking-tight'>
                            <div className={`flex p-3 gap-4 items-center`}>
                                <img 
                                    src={logout}
                                    alt='logout'
                                    className='w-[1.6rem] h-auto'
                                />
                                Logout
                            </div>
                        </li>
                    </ul>

                    <div className="flex flex-col gap-1.5 mt-14 w-full 
                    border-t border-t-main7 pt-3">
                        <p className='text-main4 text-[13px] tracking-tight
                        font-medium'>
                            v. 1.0.1
                        </p>
                      
                        <p className='text-[13px] text-main4 mt-0.5 font-medium tracking-tight'>
                            ©2024 Envoy Angel Shipping and Logistics Ltd. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sidebar;
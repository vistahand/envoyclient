// import { useState } from 'react';
// import { sideLinks } from '../../constants';
import { logo } from '../../assets';
// import { useNavigate } from 'react-router-dom';
// import { HiLogout } from "react-icons/hi";

const Sidebar = () => {
//   const { data: session } = useSession();
    // const navigate = useNavigate();
    // const [active, setActive] = useState('');

//   useEffect(() => {
//     if (session) {
//       const currentPath = pathname.split('/')[1];
//       const activeLink = sideLinks.find(link => link.route.includes(currentPath));
//       if (activeLink) {
//         setActive(activeLink.title);
//       }
//     }
//   }, [pathname, session]);

//   const handleSideItemClick = (link) => {
//     if (session) {
//       setActive(link.title);
//       router.push(link.route);
//     }
//   };

//   const handleLogout = () => {
//     if (session) {
//       signOut({ callbackUrl: 'http://localhost:3001' });
//     }
//   };

  return (
        <section className='px-8 flex items-center z-20'>
            <div className="w-full flex justify-between items-center py-10">
                <div className="flex flex-col items-center w-full
                h-screen">
                    <div className='w-full'>
                        <img
                            src={logo} alt='logo'
                            className='w-[14rem] h-auto cursor-pointer'
                        />
                    </div>

                {/* <ul className="list-none flex flex-col gap-3 hidden md:flex
                mt-24">
                    {sideLinks.map((link) => (
                    <li
                        key={link.id}
                        className={`${
                        active === link.title
                            ? 'bg-secondary rounded-md text-primary'
                            : 'bg-none text-textalt hover:text-secondary grow3'
                        } ${!session ? 'opacity-50' : 'cursor-pointer'}  
                        text-[19px] list-item`}
                        onClick={() => {
                        handleSideItemClick(link);
                        }}
                    >
                        <div className={`py-2 px-5 flex gap-6 items-center`}>
                        {link.Icon && <link.Icon />}
                        {link.title}
                        </div>
                    </li>
                    ))}

                    <li className={`text-[19px] list-item
                    ${!session ? 'opacity-50' : 'hover:text-secondary cursor-pointer grow3'} 
                    text-textalt mt-20`}>
                    <div className='flex gap-6 px-5 items-center'
                    onClick={handleLogout}>
                        <HiLogout className='transform scale-x-[-1]'
                        />
                        Logout
                    </div>
                    </li>
                </ul> */}
                </div>
            </div>
        </section>
    );
};

export default Sidebar;
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { textVariant } from '../utils/motion';
import { BiCopyright } from 'react-icons/bi';
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { footerLinks, socialMedia } from '../constants';
import { logo } from '../assets';
import React from 'react';

const Footer = () => {
  return (
    <section className='relative w-full md:min-h-[300px] ss:min-h-[700px] 
    min-h-[900px] flex items-center flex-col'>
        <div className='flex items-center w-full relative md:pb-10 ss:pb-8
        pb-6'>
            <div className='flex md:flex-row flex-col md:justify-between 
            w-full'>
                <div className='flex flex-col md:gap-5 ss:gap-6 gap-5'>
                    <img src={logo} alt='logo' className='md:w-[60%] 
                    ss:w-[40%] w-[60%] h-auto' />

                    <p className='text-main2 md:text-[14px] ss:text-[16px]
                    text-[12px] md:leading-[20px] ss:leading-[23px] leading-[18px]
                    font-medium tracking-tight md:max-w-[45ch]'>
                        Envoy Angel Shipping and Logistics is a trusted provider 
                        of seamless, secure shipping solutions between Ireland 
                        and Nigeria. Simplifying the complexities of international 
                        shipping, one delivery at a time.
                    </p>
                    
                    <div className='flex md:gap-3.5 ss:gap-5 gap-4 items-center'>
                        {socialMedia.map((social, index) => (
                            <a target='_blank' href={social.link} rel="noreferrer" key={index}
                            className='bg-primary rounded-full p-1.5 relative'>
                                {React.createElement(social.image, {
                                    className: `md:w-4 ss:w-5 w-4 h-auto text-white ${social.id === "facebook" ? '' : ''}`
                                })}
                            </a>
                        ))}
                    </div>
                </div>
                
                <div className='w-full flex md:flex-row grid md:mt-0 ss:mt-10
                mt-8 md:grid-cols-5 ss:grid-cols-3 grid-cols-2 md:gap-5'>
                    {footerLinks.map((footerLink, index) => (
                        <div key={index} className='flex flex-col md:my-3 ss:my-3
                        my-3 w-full'>
                            <h4 className={`font-bold md:text-[15px] ss:text-[18px] 
                            text-[14px] text-primary tracking-tight
                            ${index !== footerLinks.length - 1 ? 'md:mr-14 ss:mr-8 mr-8' : 'mr-12'}`}>
                            {footerLink.title}
                            </h4>

                            <ul className='list-none mt-3 w-full 
                            justify-between flex flex-col'>
                                {footerLink.links.map((Link, index) => (
                                    <a target='blank' href={Link.route} key={Link.name}>
                                        <li className={`md:text-[13px] ss:text-[16px] grow2 tracking-tight
                                        text-[12px] md:leading-[15px] ss:leading-[20px] leading-[12px]
                                        text-main2 hover:text-secondary cursor-pointer font-medium
                                        ${index !== footerLink.links.length - 1 ? 'md:mb-2.5 ss:mb-2 mb-2.5' : 'mb-0'}`}>
                                           <span className="flex items-center gap-2.5">
                                                {Link.name}
                                                {Link.name === "Careers" && (
                                                    <FaArrowUpRightFromSquare 
                                                    className="w-2.5 h-2.5" />
                                                )}
                                            </span>
                                        </li>
                                    </a>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <motion.div variants={textVariant()} className='flex w-full
        md:justify-between md:items-center border-t-[1px] border-main5 md:pt-8 
        ss:pt-8 pt-4 md:flex-row flex-col'>
            <div className='flex md:items-center ss:items-center'>
                <BiCopyright className='sm:mr-1 mr-1 md:text-[16px] 
                ss:text-[18px] text-[15px] mt-1 text-main4' />

                <p className='md:text-[13px] ss:text-[15px] text-[12px] 
                text-main4 md:mt-1 ss:mt-1 mt-0.5'>
                    2024 Envoy Angel Shipping and Logistics Ltd. All Rights Reserved.
                </p>
            </div>

            <p className='text-main4 md:text-[13px] ss:text-[14px] 
            text-[12px] md:mt-0 ss:mt-8 mt-6'>
                Designed and Developed by <span className='font-bold'>
                    <a href='https://www.pluggresources.com'
                    rel="noreferrer" target='_blank'
                    >
                        Plugg Resources
                    </a>
                </span>
            </p>
        </motion.div>
    </section>
  )
};

export default SectionWrapper(Footer, '');
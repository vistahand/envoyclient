import React from 'react';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { blogCards } from '../constants';
import { HiOutlineArrowRight } from "react-icons/hi";

const BlogCard = ({ index, title, image, description }) => {

  return (
    <motion.div className='rounded-2xl relative md:basis-1/3 ss:basis-1/2 
    basis-full h-[500px] flex navsmooth cursor-pointer hover:shadow-xl'
      variants={fadeIn('', 'spring', index * 0.5, 0.75)}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-3/4
        bg-gradient-to-b from-transparent to-primaryalt rounded-xl"
      />
      <div className="absolute bottom-0 left-0 right-0 h-2/3
        bg-gradient-to-b from-transparent to-primaryalt rounded-xl"
      />

      <div className='flex flex-col md:gap-4 ss:gap-2.5 absolute
      gap-2 md:p-8 ss:p-8 p-6 bottom-0'>
        <h1 className='text-white md:text-[30px] ss:text-[25px] 
        text-[18px] font-bold md:leading-[2.2rem] max-w-[10ch]
        ss:leading-[2.3rem] leading-[2.3rem]'>
          {title}
        </h1>

        <p className='text-white md:leading-[20px] tracking-tight
        ss:leading-[20px] leading-[18px] md:text-[14px] 
        ss:text-[14px] text-[13px]'>
          {description}
        </p>
      </div>
    </motion.div>
  )
};

const Blog = () => {
  return (
    <section className='relative w-full min-h-[800px] flex items-center'>
      <div className='flex flex-col w-full md:gap-12 ss:gap-10 gap-6'>
        <motion.div variants={textVariant()}
        className='flex justify-between items-center w-full md:gap-24
        ss:gap-10 gap-6'>
          <h1 className='text-primary font-bold md:text-[40px] 
          ss:text-[25px] text-[20px] tracking-tight w-1/2
          md:leading-[3.3rem] ss:leading-[1.3rem] leading-[1.3rem]'>
            Stay informed, stay ahead of the curve
          </h1>

          <p className='text-main md:text-[16px] md:leading-[1.3rem] 
          ss:leading-[1.3rem] leading-[1.3rem] ss:text-[16px] text-[13px] 
          w-1/2 font-medium'>
            Discover expert insights, shipping guides, and the latest 
            trends in logistics. Our resources are designed to help you 
            make smarter decisions, optimize your shipments, and stay 
            updated with everything happening at Envoy Angel and beyond.
          </p>
        </motion.div>

        <div className='flex md:gap-8 ss:gap-8 gap-6 w-full'>
          {blogCards.map((card, index) => (
            <BlogCard
              key={index} 
              index={index} 
              {...card}
            />
          ))}
        </div>

        <div className='flex items-center justify-center w-full md:pt-5'>
          <a href='/'
          className='bg-primary text-[13px] py-3.5 px-6 flex
          text-white rounded-full grow4 cursor-pointer w-1/8
          items-center gap-3 font-semibold'
          >
            <p>
              View all posts
            </p>
            
            <HiOutlineArrowRight className='text-[14px] text-white'/>
          </a>
        </div>
      </div>
    </section>
  )
};

export default SectionWrapper(Blog, '');
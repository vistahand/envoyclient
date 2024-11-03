import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { textVariant } from '../utils/motion';
import { testimonials } from '../constants';
import { FaArrowRight } from "react-icons/fa6";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


const TestCard = ({ title, image, description, name, profession  }) => {

  return (
    <motion.div
        className="rounded-2xl relative w-full flex bg-mainBlack md:gap-6
        h-[23em] mx-auto"
    >
        <div className='flex flex-col md:gap-5 ss:gap-5 gap-2 md:p-10 
        ss:p-6 p-4 justify-center items-start tracking-tight w-full'>
            <h1 className='text-white md:text-[30px] ss:text-[25px] 
            text-[18px] font-medium md:leading-[2.2rem] md:max-w-[20ch]
            ss:leading-[2.3rem] leading-[2.3rem]'>
                "{title}"
            </h1>

            <p className='text-main3 md:leading-[20px]
            ss:leading-[20px] leading-[18px] md:text-[14px] 
            ss:text-[14px] text-[13px]'>
                {description}
            </p>

            <div className='flex flex-col'>
                <p className='text-white md:leading-[20px]
                ss:leading-[20px] leading-[18px] md:text-[13px] 
                ss:text-[14px] text-[13px] font-semibold'>
                    {name}
                </p>

                <p className='text-main3 md:leading-[20px]
                ss:leading-[20px] leading-[18px] md:text-[12px] 
                ss:text-[12px] text-[11px]'>
                    {profession}
                </p>
            </div>
        </div>

        <div className='flex w-2/3'>
            <img 
                src={image}
                alt='Testimonial'
                className='object-cover rounded-r-2xl'
            />
        </div>
    </motion.div>
  )
};

const Testimonial = () => {

    const NextArrow = ({ onClick }) => (
        <button
            className="absolute md:right-0 ss:right-0 bottom-0 md:p-3 ss:p-3 p-2 border-mainBlack 
            rounded-full grow2 border-[3px] transform translate-x-1/2
            z-10"
            onClick={onClick}
            style={{ top: '50%', transform: 'translate(180%, -50%)' }}
        >
            <FaArrowRight className="text-mainBlack" />
        </button>
    );
    
    const PrevArrow = ({ onClick }) => (
        <button
            className="absolute md:left-0 ss:left-0 bottom-0 md:p-3 ss:p-3 p-2 border-mainBlack 
            rounded-full grow2 border-[3px] transform -translate-x-1/2
            z-10"
            onClick={onClick}
            style={{ top: '50%', transform: 'translate(-180%, -50%)' }}
        >
            <FaArrowRight className="rotate-180 text-mainBlack" />
        </button>
    );

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };


  return (
    <section className='relative w-full min-h-[600px] flex items-center'>
        <div className='flex flex-col w-full md:gap-12 ss:gap-10 gap-6'>
            <motion.div variants={textVariant()}
            className='flex flex-col justify-center items-center w-full md:gap-10
            ss:gap-8 gap-6'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[25px] text-[20px] tracking-tight md:leading-[0rem]
                ss:leading-[1.3rem] leading-[1.3rem]'>
                    What our clients are saying
                </h1>

                <p className='text-main2 md:text-[17px] md:leading-[1.3rem] 
                ss:leading-[1.3rem] leading-[1.3rem] ss:text-[16px] text-[13px] 
                text-center font-semibold md:max-w-[75ch]'>
                    Our commitment to exceptional service, seamless booking, 
                    and reliable deliveries keeps our clients coming back 
                    every time.
                </p>
            </motion.div>

            <div className='w-full relative mx-auto rounded-2xl'>
                <Slider {...settings} className="w-[85%] mx-auto rounded-2xl">
                    {testimonials.map((testimonial, index) => (
                        <TestCard key={index} {...testimonial} />
                    ))}
                </Slider>
            </div>
        </div>
    </section>
  )
};

export default SectionWrapper(Testimonial, '');
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { cards } from '../constants';

const CardItem = ({ index, title, image, description }) => {
    
    return (
        <motion.div
        variants={fadeIn('', 'spring', index * 0.5, 0.75)}>
            <div className='flex items-center justify-center
            md:gap-10 ss:gap-8 gap-6'>
                <img 
                    src={image}
                    alt='product step'
                    className='md:w-[150px] ss:w-[150px] w-[140px] 
                    md:h-[150px] ss:h-[150px] h-[140px] object-cover'
                />

                <div className='flex flex-col md:gap-2.5 ss:gap-2.5
                gap-2 tracking-tight'>
                    <h1 className='text-primary md:text-[18px] ss:text-[18px] 
                    text-[15px] font-bold'>
                        {title}
                    </h1>

                    <p className='text-main font-medium md:leading-[20px]
                    ss:leading-[20px] leading-[18px] md:text-[14px] 
                    ss:text-[15px] text-[13px]'>
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    )
};

const Cards = () => {
  return (
    <section className='relative w-full min-h-[700px] mx-auto flex
    items-center'>
        <div className='flex flex-col'>
            <div className='grid md:gap-16 ss:gap-14 gap-10 md:mt-16 
            md:grid-cols-2 ss:mt-12 mt-8 w-full'>
                {cards.map((card, index) => (
                    <CardItem
                        key={index} 
                        index={index} 
                        {...card}
                    />
                ))}
            </div>
        </div>
    </section>
  )
};

export default SectionWrapper(Cards, '');
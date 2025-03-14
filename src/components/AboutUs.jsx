import { SectionWrapper } from "../hoc";
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { about } from '../assets';

const AboutUs = () => {

    return (
        <section className='w-full flex min-h-[400px]'>
            <motion.div variants={fadeIn('down', 'spring', 0.3)} className="w-full flex flex-col md:gap-10 ss:gap-8 gap-6">
                <h1 className='text-primary font-bold md:text-[35px] 
                ss:text-[33px] text-[28px] tracking-tight md:max-w-[25ch] ss:max-w-[25ch] max-w-[20ch]
                md:leading-[2.8rem] ss:leading-[2.6rem] leading-[2.1rem]'>
                    About Us: Envoy Angel Shipping and Logistics Ltd.
                </h1>

                <div className="w-full flex md:flex-row flex-col md:gap-12 ss:gap-10 gap-8 md:justify-between">
                    <motion.div variants={textVariant()} className="md:w-[50%] w-full">
                        <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2 leading-[20px]">
                                Since its inception in 2010, Envoy Angel Shipping and Logistics Ltd. has 
                                stood as a beacon of reliability and dedication in the shipping and 
                                logistics industry. Established and registered in both Ireland and Nigeria, 
                                we specialize in bridging the gap between these two nations, offering 
                                world-class logistics solutions tailored to the unique needs of our clients. 
                                With a commitment to excellence, we strive to redefine standards of 
                                efficiency, transparency, and professionalism in the movement of goods 
                                across continents, ensuring that every shipment entrusted to us is handled 
                                with the utmost care and precision.
                            </p>

                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2 leading-[20px]">
                                At the heart of our company is a deeply rooted commitment to giving back. 
                                Inspired by the vision of our founder, Elder Adewale Bankole Adejuwon, we 
                                believe that true success is measured not only in business milestones but 
                                also in the positive impact we can make in our communities. Our charity 
                                organization in Nigeria extends a helping hand to the less privileged, 
                                championing access to primary, secondary, and tertiary education for 
                                under-resourced youth. We provide opportunities for those with a desire 
                                to embark on various apprenticeships, believing, as our founder often 
                                states, “A nation without education or the means to earn a living is a 
                                nation sowing the seeds of poverty.”
                            </p>

                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2 leading-[20px]">
                                At Envoy Angel, we are also dedicated to supporting widows and widowers, 
                                helping them find stability and empowerment in challenging times. This 
                                focus on charity is not an afterthought; it is embedded in our ethos. For 
                                as Albert Schweitzer wisely said, “The purpose of human life is to serve, 
                                and to show compassion and the will to help others.” 
                            </p>

                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2 leading-[20px]">
                                We are more than a shipping company. We are Envoy Angel, carrying not 
                                only goods but hope, opportunity, and change.
                            </p>
                        </div>
                    </motion.div>

                    <div className="md:w-[50%] ss:w-[70%] md:mb-0 ss:mb-0 mb-8">
                        <motion.div variants={fadeIn('left', 'spring', 0.3)} 
                        className='w-full md:rounded-2xl md:h-[350px] h-[250px]
                        ss:rounded-2xl rounded-xl relative overflow-hidden'>
                            <img
                                src={about}
                                alt='About Us'
                                className='object-cover object-center w-full h-full md:rounded-2xl
                                ss:rounded-2xl rounded-xl'
                            />

                            <div 
                                className='h-[15px] w-full absolute bottom-0 
                                bg-secondary'
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default SectionWrapper(AboutUs, '');
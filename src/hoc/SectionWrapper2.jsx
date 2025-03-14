import { motion } from 'framer-motion';
import { staggerContainer } from '../utils/motion';

const SectionWrapper2 = (Component, idName) => function HOC(props) {
    return (
        <motion.section
            variants={staggerContainer()}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.10 }}
        >
            <span className='hash-span' id={idName}>
                &nbsp;
            </span>
            <Component {...props}/>
        </motion.section>
    )
};

export default SectionWrapper2;
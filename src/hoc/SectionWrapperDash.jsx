import { motion } from 'framer-motion';
import styles from '../styles';
import { staggerContainer } from '../utils/motion';

const SectionWrapperDash = (Component) => function HOC(props) {
    return (
        <motion.section
            variants={staggerContainer()}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.10 }}
            className={`${styles.padding1} max-w-[86rem] mx-auto`}
        >
            <Component {...props}/>
        </motion.section>
    )
};

export default SectionWrapperDash;
import { motion } from 'framer-motion';
import styles from '../styles';
import { staggerContainer } from '../utils/motion';

const SectionWrapperApp = (Component, idName) => function HOC(props) {
    return (
        <motion.section
            variants={staggerContainer()}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.10 }}
            className={`${styles.paddingZ} max-w-[78rem] mx-auto`}
        >
            <span className='hash-span' id={idName}>
                &nbsp;
            </span>
            <Component {...props}/>
        </motion.section>
    )
};

export default SectionWrapperApp;
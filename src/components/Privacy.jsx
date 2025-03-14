import { SectionWrapper } from "../hoc";
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';

const Privacy = () => {

    return (
        <section className='w-full flex min-h-[400px] py-3 md:pb-0 ss:pb-0 pb-6'>
            <motion.div variants={fadeIn('down', 'spring', 0.3)} className="w-full flex flex-col md:gap-10 ss:gap-8 gap-6">
                <h1 className='text-primary font-bold md:text-[35px] 
                ss:text-[33px] text-[28px] tracking-tight md:max-w-[25ch] ss:max-w-[25ch] max-w-[20ch]
                md:leading-[2.8rem] ss:leading-[2.6rem] leading-[2.1rem]'>
                    Privacy Policy: Envoy Angel Shipping and Logistics Ltd.
                </h1>

                <motion.div variants={textVariant()} className="w-full">
                    <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            Envoy Angel Shipping and Logistics Ltd. we are committed to protecting the privacy and security of our clients, partners, and users. This Privacy Policy outlines our practices for gathering, using, disclosing, and safeguarding your information when you interact with our website, services, and other digital channels. By engaging with our website or services, you consent to the collection and use of your information in accordance with this Privacy Policy.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            1. Information Collection
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            Personal Information: We may collect personal information that identifies you, such as your name, email address, phone number, and mailing address, when you interact with us, register on our site, or communicate with us directly.
                            <br></br>Usage Data: We gather data on how our website and services are accessed and used. This may include IP addresses, browser types, pages viewed, time spent on pages, and other diagnostic data.
                            <br></br>Cookies and Tracking: We use cookies, web beacons, and other tracking technologies to enhance your experience, provide targeted services, and analyze site performance. You may adjust your browser settings to decline cookies, but this may limit certain functionalities of our website.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            2. Use of Information
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            Service Delivery: We use collected information to process shipments, manage logistics, communicate with clients, and improve our overall services.
                            <br></br>Customer Support: Your information helps us respond more effectively to your customer service requests and support needs.
                            <br></br>Marketing and Communication: With your consent, we may send you updates, promotional materials, and news about our services and initiatives. You may opt-out at any time.
                            <br></br>Analytics and Improvement: Data gathered helps us analyze usage trends, understand customer needs, and continuously improve our website, services, and offerings.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            3. Information Sharing and Disclosure
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            Trusted Third-Party Services: We may share your data with carefully vetted third-party service providers who assist in our operations, including payment processing, shipment tracking, analytics, and marketing. These providers are required to use your data solely for the services they perform on our behalf and to maintain the confidentiality of your information.
                            <br></br>Legal Requirements: We may disclose your information if required by law or if we believe such action is necessary to protect and defend our rights, ensure compliance with legal obligations, or safeguard the safety of our users and the public.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            4. Data Security
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            We employ industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes implementing encryption, firewalls, secure servers, and regular security audits. While we strive to ensure the protection of your data, no system is entirely foolproof, and we cannot guarantee absolute security.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            5. Data Retention
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            We retain personal information only as long as necessary to fulfil the purposes for which it was collected, or as required by applicable laws. When your information is no longer needed, we will dispose of it in a secure manner.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            6. Your Privacy Rights
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            Access and Correction: You have the right to request access to the information we hold about you and to correct inaccuracies.
                            <br></br>Data Portability and Deletion: You may request that your data be transferred to another service provider or deleted from our systems, subject to certain legal exceptions.
                            <br></br>Opt-Out of Communications: You may opt out of marketing and promotional communications at any time by following the instructions provided in our emails or by contacting us directly.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            7. International Data Transfers
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            As we operate between Ireland and Nigeria, your information may be transferred and stored in data centres across these regions. We comply with local data protection laws and strive to ensure adequate protection for your data during such transfers.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            8. Changes to this Privacy Policy
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            Envoy Angel Shipping and Logistics Ltd. reserves the right to update or modify this Privacy Policy at any time. We encourage you to review this policy periodically for any updates. Your continued use of our website and services constitutes acceptance of any changes made to this policy.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            9. Contact Us
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            For questions or concerns regarding this Privacy Policy, or to exercise your privacy rights, please contact us at contact@envoyangel.com
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            "Protecting your privacy is our commitment. Your trust is our responsibility."
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SectionWrapper(Privacy, '');
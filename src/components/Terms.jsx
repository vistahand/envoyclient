import { SectionWrapper } from "../hoc";
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';

const Terms = () => {

    return (
        <section className='w-full flex min-h-[400px] py-3 md:pb-0 ss:pb-0 pb-6'>
            <motion.div variants={fadeIn('down', 'spring', 0.3)} className="w-full flex flex-col md:gap-10 ss:gap-8 gap-6">
                <h1 className='text-primary font-bold md:text-[35px] 
                ss:text-[33px] text-[28px] tracking-tight md:max-w-[25ch] ss:max-w-[25ch] max-w-[20ch]
                md:leading-[2.8rem] ss:leading-[2.6rem] leading-[2.1rem]'>
                    Terms of Use for Envoy Angel Shipping and Logistics Ltd.
                </h1>

                <motion.div variants={textVariant()} className="w-full">
                    <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            Welcome to the Envoy Angel Shipping and Logistics Ltd. website. By accessing or using our Site, you agree to comply with and be bound by these Terms of Use. Please read these terms carefully, as they constitute a legal agreement between you user and Envoy Angel Shipping and Logistics Ltd. our Company.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            1. Acceptance of Terms
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            By accessing, browsing, or using this Site, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree with these terms, please do not use this Site.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            2. Use of the Site
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            Permitted Use: This Site and its content are provided solely for personal, non-commercial use and for legitimate business purposes related to Envoy Angel Shipping and Logistic Ltd.'s services.
                            <br></br>Prohibited Actions: You agree not to misuse this Site. Prohibited actions include, but are not limited to:
                            <br></br> &nbsp; - Unauthorized access or interference with the Site, its servers, or networks.
                            <br></br> &nbsp; - Attempting to disrupt, overload, or harm the Site.
                            <br></br> &nbsp; - Using the Site to transmit or upload harmful code, including viruses or malicious software.
                            <br></br> &nbsp; - Copying, distributing, or disclosing any part of the Site without authorization.
                            <br></br> &nbsp; - Account Security: If you create an account on our Site, you are responsible for maintaining the confidentiality of your account information. You agree to notify us immediately of any unauthorized use of your account or any other security breach.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            3. Intellectual Property
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            - Ownership: All content on this Site, including text, graphics, logos, icons, images, audio, video, software, and trademarks, is the property of Envoy Angel Shipping and Logistics Ltd. or its licensors and is protected by copyright, trademark, and other intellectual property laws.
                            <br></br>- Limited License: We grant you a limited, non-exclusive, revocable license to access and use the Site for personal and business use by these Terms. This license does not grant you any right to sell, resell, copy, or modify any part of the Site's content.
                            <br></br>- Restrictions: Any unauthorized use of the Site's content, including reproduction, modification, distribution, or republication, without our written consent, is strictly prohibited.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            4. Content Accuracy and Liability
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            - Informational Purposes: While we strive to ensure that all content on our Site is accurate and up-to-date, the Site's content is provided for general informational purposes only. We make no guarantees regarding the accuracy, completeness, or reliability of any information on the Site.
                            <br></br>- No Liability: Envoy Angel Shipping and Logistic Ltd. will not be held liable for any damages arising from your reliance on any content provided on the Site. You assume full responsibility for any risks associated with using the Site.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            5. Third-Party Links and Resources
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            Our Site may contain links to third-party websites, products, or services. These links are provided solely for your convenience and do not imply any endorsement, sponsorship, or recommendation by Envoy Angel Shipping and Logistics Ltd. We are not responsible for the content, security, or practices of any third-party websites or resources. Use these links at your own risk.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            6. Disclaimer of Warranties
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            This Site is provided on an "as-is" and "as-available" basis. Envoy Angel Shipping and Logistics Ltd. makes no warranties, express or implied, regarding the Site, including but not limited to, its accuracy, reliability, availability, or suitability for any particular purpose. To the fullest extent permitted by law, we disclaim all warranties, including any implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            7. Limitation of Liability
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            To the maximum extent permitted by law, Envoy Angel Shipping and Logistic Ltd. shall not be liable for any indirect, incidental, consequential, special, or punitive damages, or for any loss of profits or revenue, whether incurred directly or indirectly, arising from:
                            <br></br> &nbsp; - Your use of or inability to use the Site.
                            <br></br> &nbsp; - Any content or information obtained from the Site.
                            <br></br> &nbsp; - Any unauthorized access, use, or alteration of your transmissions or data.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            8. Indemnification
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            You agree to indemnify, defend, and hold harmless Envoy Angel Shipping and Logistics Ltd. and its affiliates, directors, officers, employees, and agents from and against any claims, liabilities, damages, losses, or expenses (including legal fees) arising out of or in connection with:
                            <br></br> &nbsp; - Your use of the Site.
                            <br></br> &nbsp; - Your violation of these Terms of Use.
                            <br></br> &nbsp; - Your violation of any rights of a third party.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            9. Modifications to Terms of Use
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            Envoy Angel Shipping and Logistic Ltd. reserves the right to modify or update these Terms of Use at any time, at its sole discretion. Changes will be effective immediately upon posting on the Site. By continuing to use the Site after changes are posted, you agree to accept the modified Terms of Use. We encourage you to review these terms periodically.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            10. Governing Law and Jurisdiction
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            These Terms of Use are governed by and construed by the laws of Ireland and Nigeria, without regard to its conflict of law principles. Any disputes arising under these terms shall be resolved exclusively in the courts located in Ireland or Nigeria, and you consent to the jurisdiction of such courts.
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2 leading-[21px]">
                            11. Contact Information
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            For questions or comments regarding these Terms of Use, please contact us via contact@envoyangel.com
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2 leading-[21px]">
                            "Integrity in our work, security in our services, and respect for our clients' rights are the pillars of our promise."
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SectionWrapper(Terms, '');
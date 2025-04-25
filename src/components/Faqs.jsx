import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapperApp } from "../hoc";
import { FiSearch, FiPlus, FiMinus } from 'react-icons/fi';
import { FaShippingFast, FaTruck, FaCreditCard } from 'react-icons/fa';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const FAQItem = ({ question, answer, isOpen, toggle }) => {
  return (
    <motion.div 
      className="border-b border-gray-200 py-4"
      variants={itemVariants}
    >
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={toggle}
      >
        <h3 className="md:text-[16px] ss:text-[15px] text-[14px] font-medium text-main4">{question}</h3>
        <button className="text-primary">
          {isOpen ? <FiMinus /> : <FiPlus />}
        </button>
      </div>
      
      {isOpen && (
        <motion.div 
          className="md:text-[15px] ss:text-[14px] text-[13px] text-main4 mt-2 pr-8"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {answer}
        </motion.div>
      )}
    </motion.div>
  );
};

const FAQs = () => {
  const [openFAQ, setOpenFAQ] = useState({
    "shipping-1": true,
    "tracking-1": true,
    "payment-1": true
  });

  const toggleFAQ = (id) => {
    setOpenFAQ(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqCategories = [
    {
      id: "shipping",
      icon: <FaShippingFast className="text-primary text-xl" />,
      title: "Shipping",
      faqs: [
        {
          id: "shipping-1",
          question: "What items can I ship with EnvoyAngel?",
          answer: "You can ship most general goods including electronics, fashion items, home essentials, and more. However, restricted items like firearms, hazardous materials, perishable foods, and cash are prohibited. Please check our shipping guide for the full list."
        },
        {
          id: "shipping-2",
          question: "Do you offer local pickup services?",
          answer: "Yes, EnvoyAngel offers local pickup services in select locations. Please contact our customer service team or check your account dashboard to see if this service is available in your area."
        },
        {
          id: "shipping-3",
          question: "Can I ship internationally?",
          answer: "Yes, EnvoyAngel provides international shipping services to over 200 countries worldwide. International shipping rates vary depending on the destination, weight, and dimensions of your package."
        }
      ]
    },
    {
      id: "tracking",
      icon: <FaTruck className="text-primary text-xl" />,
      title: "Tracking",
      faqs: [
        {
          id: "tracking-1",
          question: "How do I track my shipment?",
          answer: "Simply go to the Tracking Page and enter your tracking number. You can also log in to your dashboard for a full tracking history."
        },
        {
          id: "tracking-2",
          question: "What does \"In Transit\" mean?",
          answer: "\"In Transit\" means your package is on its way to the destination. It has been processed and is currently being transported through our logistics network."
        },
        {
          id: "tracking-3",
          question: "My tracking hasn't updated. What should I do?",
          answer: "Tracking updates may be delayed by 24-48 hours. If your tracking hasn't updated for more than 3 days, please contact our customer support team for assistance."
        }
      ]
    },
    {
      id: "payments",
      icon: <FaCreditCard className="text-primary text-xl" />,
      title: "Payments & Pricing",
      faqs: [
        {
          id: "payment-1",
          question: "How is my shipping fee calculated?",
          answer: "Shipping fees are based on the weight, dimensions, and destination of your package. Additional fees may apply for expedited delivery or oversized items."
        },
        {
          id: "payment-2",
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, bank transfers, and digital wallets. We ensure secure transaction processing for all payment methods."
        },
        {
          id: "payment-3",
          question: "Are there any hidden charges?",
          answer: "EnvoyAngel maintains full transparency in pricing. All applicable charges are displayed during checkout. There are no hidden fees, though taxes and duties may apply for international shipments."
        }
      ]
    }
  ];

  return (
    <section className="relative w-full font-manrope">
      {/* Hero Banner */}
      <motion.div 
        className="relative bg-primary text-white py-16 px-4 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            className="md:text-[37px] ss:text-[35px] text-[32px] font-semibold tracking-tight mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Got Questions? We've Got Answers.
          </motion.h1>
          <motion.p 
            className="md:text-[15px] ss:text-[14px] text-[13px] max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find quick answers to common questions about your shipments, payments, account, and more. If you 
            still need help, our team is just a message away.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            className="mt-8 max-w-xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-md">
              <input 
                type="text" 
                placeholder="Type your question..." 
                className="py-4 px-5 w-full text-main4 outline-none md:text-[15px] ss:text-[14px] text-[13px]"
              />
              <button className="bg-white px-4 py-4">
                <FiSearch className="text-primary text-xl" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* FAQ Content */}
      <div className="max-w-6xl mx-auto w-full py-12 px-4">
        {faqCategories.map((category, index) => (
          <motion.div 
            key={category.id} 
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            transition={{ delay: index * 0.2 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-6"
              variants={itemVariants}
            >
              <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                {category.icon}
              </div>
              <h2 className="text-primary font-semibold md:text-[28px] ss:text-[26px] text-[24px]">
                {category.title}
              </h2>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6"
              variants={containerVariants}
            >
              {category.faqs.map(faq => (
                <FAQItem 
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ[faq.id] || false}
                  toggle={() => toggleFAQ(faq.id)}
                />
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      {/* Still Need Help Section */}
      <motion.div 
        className="bg-primary text-white py-12 px-4 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="md:text-[32px] ss:text-[30px] text-[28px] font-semibold tracking-tight mb-2"
            variants={itemVariants}
          >
            Still Need Help?
          </motion.h2>
          <motion.p 
            className="md:text-[15px] ss:text-[14px] text-[13px] mb-8"
            variants={itemVariants}
          >
            Can't find what you're looking for? Our team is available 24/7
          </motion.p>
          
          <motion.div 
            className="flex justify-center gap-4 flex-wrap"
            variants={containerVariants}
          >
            <motion.button 
              className="bg-white text-primary rounded-full md:text-[14px] ss:text-[13px] text-[12px] font-medium py-3.5 px-10 flex items-center justify-center gap-2"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.button>
            <motion.button 
              className="bg-transparent border border-white text-white rounded-full md:text-[14px] ss:text-[13px] text-[12px] font-medium py-3.5 px-10 flex items-center justify-center gap-2"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Live Chat
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Footer Copyright */}
      <motion.div 
        className="max-w-6xl mx-auto w-full px-4 py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="md:text-[13px] ss:text-[13px] text-[11px] text-main4 font-medium">
          © 2025 Envoy Angel Shipping and Logistics Ltd. All Rights Reserved.
        </p>
      </motion.div>
    </section>
  );
};

export default SectionWrapperApp(FAQs, "faqs");
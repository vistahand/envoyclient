import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
// Import the image directly to ensure proper bundling
import comingBgImage from '../assets/coming.png'; // Adjust the path as needed

const Blog = () => {
  // Animation variants for different elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const formVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.4 }
    }
  };
  
  const backgroundVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 0.9,
      transition: { duration: 1.2 }
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background image */}
      <motion.div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${comingBgImage})` }}
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      />
      
      {/* Content overlay with staggered animations */}
      <motion.div 
        className="relative z-10 w-full max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Heading with animation */}
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-white mb-4"
          variants={itemVariants}
        >
          Envoy Angel Marketplace Coming Soon!
        </motion.h1>
        
        {/* Subheading with animation */}
        <motion.p 
          className="text-lg md:text-xl text-white mb-12"
          variants={itemVariants}
        >
          Get ready to explore a smarter way to shop, ship, and connect. All in one place. Launching soon!
        </motion.p>
        
        {/* Signup Form with animation
        <motion.div 
          className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg"
          variants={formVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Be the first to know when we launch
          </h2>
          
          <div className="flex flex-col gap-4">
            <motion.input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-blue-primary transition duration-300"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            
            <motion.button 
              className="w-full bg-primary text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-900 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Notify Me
            </motion.button>
          </div>
        </motion.div> */}
      </motion.div>
    </div>
  );
};

export default Blog;
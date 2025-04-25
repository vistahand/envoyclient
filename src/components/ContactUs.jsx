import React, { useState } from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';
import { SectionWrapperApp } from "../hoc";
import Modal from '../components/Modal'; // Make sure the path is correct based on your file structure

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://envoyserver-pyxd.onrender.com';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Show success modal
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Message Sent!',
          message: 'Your message has been sent successfully. We will get back to you soon.'
        });
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          subject: '',
          message: ''
        });
      } else {
        // Show error modal
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Message Not Sent',
          message: data.message || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Connection Error',
        message: 'Network error. Please check your connection and try again later.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Define modal buttons based on type
  const getModalButtons = () => {
    if (modalState.type === 'success') {
      return [
        {
          label: 'Great!',
          onClick: closeModal,
          variant: 'success'
        }
      ];
    } else {
      return [
        {
          label: 'Try Again',
          onClick: closeModal,
          variant: 'danger'
        }
      ];
    }
  };
  
  return (
    <section className="relative w-full font-manrope">
      {/* Modal for form submission feedback */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        buttons={getModalButtons()}
        size="sm"
      />
    
      {/* Hero Banner with Flag Animation Effect */}
      <div className="relative overflow-hidden bg-primary text-white py-16 px-4 text-center">
        {/* Animated flag-like wave elements */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute w-full h-24 bg-white/10 animate-pulse transform -translate-y-12 left-0 right-0 opacity-70"></div>
          <div className="absolute w-full h-24 bg-white/5 animate-bounce transform translate-y-12 left-0 right-0 opacity-50 duration-1000"></div>
          <div className="absolute w-full h-16 bg-white/5 animate-pulse transform -translate-y-8 translate-x-8 opacity-30 duration-700"></div>
        </div>
        
        {/* Color stripes that appear to flow upward */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute w-full h-24 bg-primary/80 animate-pulse transform translate-y-32 left-0 right-0"></div>
          <div className="absolute w-full h-32 bg-primary/60 animate-bounce transform translate-y-16 left-0 right-0 duration-1000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="md:text-[37px] ss:text-[35px] text-[32px] font-semibold tracking-tight mb-2">We're Here to Help</h1>
          <p className="md:text-[15px] ss:text-[16px] text-[14px] tracking-tight">Contact our team for assistance, inquiries, or support.</p>
        </div>
      </div>
      
      {/* Contact Form Section */}
      <div className="max-w-6xl mx-auto w-full py-12 px-4 flex flex-col md:flex-row gap-8">
        {/* Contact Form */}
        <div className="flex-1">
          <div className="border border-main6 rounded-lg p-6 shadow-sm">
            <h2 className="text-primary font-semibold md:text-[28px] ss:text-[26px] text-[24px] tracking-tight mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  className="md:py-3.5 py-3 md:px-3.5 px-3 peer outline text-black md:rounded-lg rounded-md 
                  md:text-[14px] ss:text-[14px] text-[12px] outline-[1px] bg-transparent w-full focus:outline-primary outline-main6"
                />
                <label
                  htmlFor="fullName"
                  className="absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                  md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform
                  md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                  duration-300 peer-placeholder-shown:translate-y-0 text-main6
                  peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                  ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                  peer-focus:scale-75 peer-focus:text-main6 pointer-events-none z-10 px-2"
                >
                  Enter your full name
                </label>
              </div>

              <div className="mb-4 relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  className="md:py-3.5 py-3 md:px-3.5 px-3 peer outline text-black md:rounded-lg rounded-md 
                  md:text-[14px] ss:text-[14px] text-[12px] outline-[1px] bg-transparent w-full focus:outline-primary outline-main6"
                />
                <label
                  htmlFor="email"
                  className="absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                  md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform
                  md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                  duration-300 peer-placeholder-shown:translate-y-0 text-main6
                  peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                  ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                  peer-focus:scale-75 peer-focus:text-main6 pointer-events-none z-10 px-2"
                >
                  Enter your email address
                </label>
              </div>

              <div className="mb-4 relative">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <div className="absolute left-0 inset-y-0 flex pl-3.5 items-center pointer-events-none">
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder=" "
                      required
                      className="md:py-3.5 py-3 pl-12 md:px-3.5 px-3 peer outline text-black md:rounded-lg rounded-md 
                      md:text-[14px] ss:text-[14px] text-[12px] outline-[1px] bg-transparent w-full focus:outline-primary outline-main6"
                    />
                    <label
                      htmlFor="phoneNumber"
                      className="absolute md:left-12 left-12 md:top-3.5 top-3 origin-[0] 
                      md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform
                      md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                      duration-300 peer-placeholder-shown:translate-y-0 text-main6
                      peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                      ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                      peer-focus:scale-75 peer-focus:text-main6 pointer-events-none z-10 px-2"
                    >
                      Enter your phone number
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4 relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  className="md:py-3.5 py-3 md:px-3.5 px-3 peer outline text-black md:rounded-lg rounded-md 
                  md:text-[14px] ss:text-[14px] text-[12px] outline-[1px] bg-transparent w-full focus:outline-primary outline-main6"
                />
                <label
                  htmlFor="subject"
                  className="absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                  md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform
                  md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                  duration-300 peer-placeholder-shown:translate-y-0 text-main6
                  peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                  ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                  peer-focus:scale-75 peer-focus:text-main6 pointer-events-none z-10 px-2"
                >
                  Enter subject
                </label>
              </div>

              <div className="mb-6 relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder=" "
                  rows="6"
                  required
                  className="md:py-3.5 py-3 md:px-3.5 px-3 peer outline text-black md:rounded-lg rounded-md 
                  md:text-[14px] ss:text-[14px] text-[12px] outline-[1px] bg-transparent w-full focus:outline-primary outline-main6"
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                  md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform
                  md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                  duration-300 peer-placeholder-shown:translate-y-0 text-main6
                  peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                  ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                  peer-focus:scale-75 peer-focus:text-main6 pointer-events-none z-10 px-2"
                >
                  Enter message
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`bg-primary text-[13px] py-3.5 px-14 flex text-white rounded-full grow4 cursor-pointer items-center justify-center gap-3 mobbut w-full md:w-auto ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="flex-1">
          <h2 className="text-primary font-semibold md:text-[28px] ss:text-[26px] text-[24px] tracking-tight mb-2">Contact Information</h2>
          <p className="md:text-[15px] ss:text-[14px] text-[13px] text-main4 mb-8">Have questions or assistance? Our team is here to help</p>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                <FiMail className="text-primary text-xl" />
              </div>
              <div>
                <h3 className="text-primary font-medium md:text-[16px] ss:text-[15px] text-[14px]">Email Address</h3>
                <p className="text-main4 md:text-[15px] ss:text-[14px] text-[13px]">mail@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                <FiPhone className="text-primary text-xl" />
              </div>
              <div>
                <h3 className="text-primary font-medium md:text-[16px] ss:text-[15px] text-[14px]">Phone Number</h3>
                <p className="text-main4 md:text-[15px] ss:text-[14px] text-[13px]">+234 123 456 7890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Copyright */}
      <div className="max-w-6xl mx-auto w-full px-4 pb-8">
        <p className="md:text-[13px] ss:text-[13px] text-[11px] text-main4 font-medium">
          © 2025 Envoy Angel Shipping and Logistics Ltd. All Rights Reserved.
        </p>
      </div>
    </section>
  );
};

export default SectionWrapperApp(ContactUs, "");
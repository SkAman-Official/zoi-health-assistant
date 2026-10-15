// src/ContactInner.js
import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowRight, FaPaperPlane } from 'react-icons/fa';
import Map from "./Map";
import ContactBox from "./ContactBox/ContactBox";
import "../../../Shared/BreadCrumb/BreadCrumb";
import "react-icons/fa6";
const ContactInner = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };
  return <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
    {/* Hero Section */}
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/20 to-purple-900/30"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
        
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Get In Touch</h1>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
          Have questions or need assistance? Our team is ready to help you with any inquiries.
        </p>
        {/* <div className="flex justify-center items-center text-indigo-200">
            <span className="mr-2">Home</span>
            <FaArrowRight className="mx-2 text-sm" />
            <span className="ml-2 font-medium text-white">Contact</span>
           </div> */}
      </div>dccf0opaZTT90
    </div>

    {/* Main Content */}
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Contact Info */}
          <div className="md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-10">
            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
              
            <div className="space-y-6 mb-10">
              <div className="flex items-start">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <FaPhone className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Phone</h3>
                  <p className="text-indigo-100">+91 70036 97337</p>
                  <p className="text-indigo-200 text-sm">Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>
                
              <div className="flex items-start">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Email</h3>
                  <p className="text-indigo-100">zoihealthedge911@gmail.com</p>
                  <p className="text-indigo-200 text-sm">swalkervevo@gmail.com</p>
                </div>
              </div>
                
              <div className="flex items-start">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Headquarters</h3>
                  <p className="text-indigo-100">Sonarpur</p>
                  <p className="text-indigo-200 text-sm">Kolkata, India</p>
                </div>
              </div>
                
              <div className="flex items-start">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Working Hours</h3>
                  <p className="text-indigo-100">Monday - Friday</p>
                  <p className="text-indigo-200 text-sm">9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
              
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => <a key={index} href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300">
                  <Icon className="text-lg" />
                </a>)}
              </div>
            </div>
          </div>
            
          {/* Contact Form */}
          <div className="md:w-3/5 p-10">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Send us a message</h2>
            <p className="text-gray-600 mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>
              
            {submitStatus === 'success' && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-green-800">Message Sent Successfully!</h3>
                <p className="text-green-700 text-sm">We'll get back to you as soon as possible.</p>
              </div>
            </div>}
              
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="John Doe" required />
                </div>
                  
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="john@example.com" required />
                </div>
              </div>
                
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="How can we help?" required />
              </div>
                
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="Type your message here..." required></textarea>
              </div>
                
              <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center items-center py-4 px-6 rounded-lg font-medium text-white transition-all ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'}`}>
                {isSubmitting ? <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </> : <>
                  <FaPaperPlane className="mr-2" />
                  Send Message
                  </>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <ContactBox />

    {/* Map Section */}
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Find Our Office</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Visit us at our headquarters or contact us to schedule a meeting</p>
        </div>
          
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-96 bg-gradient-to-br from-blue-100 to-indigo-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Map className="text-white text-2xl" /> 
                  </div>
                </div>
              </div>
            </div>
              
            <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-5 max-w-xs">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Our Headquarters</h3>
              <p className="text-gray-600 mb-3">123 Tech Street, San Francisco, CA 94107</p>
              <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors flex items-center">
                Open in Maps
                <FaArrowRight className="ml-2 text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
      
    {/* FAQ Section */}
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our services and support</p>
          </div>
            
          <div className="space-y-6">
            {[{
              question: "How quickly do you respond to inquiries?",
              answer: "Our team typically responds within 24 hours during business days. For urgent matters, please call our support line."
            }, {
              question: "What are your business hours?",
              answer: "Our support team is available Monday through Friday from 9:00 AM to 6:00 PM EST."
            }, {
              question: "Do you offer in-person consultations?",
              answer: "Yes, we offer in-person meetings at our headquarters by appointment only. Please contact us to schedule."
            }, {
              question: "Can I visit your office without an appointment?",
              answer: "For security and efficiency reasons, we require appointments for all office visits. Please contact us to schedule."
            }].map((faq, index) => <div key={index} className="bg-gray-50 hover:bg-indigo-50 border border-gray-200 rounded-xl p-6 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>)}
          </div>
        </div>
      </div>
    </div>
      
    {/* Newsletter */}
    <div className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest updates, offers, and industry insights.
          </p>
            
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-grow px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <button className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
      
    {/* Footer */}
    <div className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>© 2023 Company Name. All rights reserved.</p>
      </div>
    </div>
  </div>;
};
export default ContactInner;

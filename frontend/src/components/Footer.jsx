import React, { forwardRef } from 'react'
import footerLogo from "../assets/footer-logo.png"
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowRight } from "react-icons/fa"
import { Link } from 'react-router-dom'

const Footer = forwardRef((props, ref) => {
  return (
    <footer ref={ref} id={props.id} className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <img src={footerLogo} alt="BookStore Logo" className="mb-6 w-40 filter brightness-0 invert" />
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your premier destination for quality books. Discover new worlds through literature and expand your knowledge with our curated collection.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-800 p-3 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-1">
                <FaFacebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-800 p-3 rounded-lg hover:bg-blue-400 transition-all duration-300 transform hover:-translate-y-1">
                <FaTwitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-800 p-3 rounded-lg hover:bg-pink-600 transition-all duration-300 transform hover:-translate-y-1">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-blue-500">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Shop', href: '/shop' },
                { name: 'Best Sellers', href: '/bestsellers' },
                { name: 'New Arrivals', href: '/new-arrivals' },
                { name: 'Categories', href: '/categories' },
                { name: 'Deals', href: '/deals' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                    <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-blue-500">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Contact Us', href: '/contact' },
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'Returns', href: '/returns' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Track Order', href: '/track-order' },
                { name: 'Size Guide', href: '/size-guide' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                    <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-blue-500">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  Shyamnagar, North 24 PGS<br />
                  West Bengal, 743127
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-400 flex-shrink-0" />
                <p className="text-gray-300">7003539303</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-400 flex-shrink-0" />
                <p className="text-gray-300">support@bookstore.com</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-400">Store Hours</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <div className="flex justify-between">
                  <span>Mon - Fri:</span>
                  <span>9AM - 8PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10AM - 6PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>12PM - 5PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} BookStore. All rights reserved.</p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center space-x-6 text-sm">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Cookie Policy
              </Link>
              <Link to="/refund-policy" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Refund Policy
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>We accept:</span>
              <div className="flex space-x-1">
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center text-xs">Visa</div>
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center text-xs">MC</div>
                <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center text-xs">PayPal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
import React from 'react'
import bannerImg from "../../assets/banner.png"

const Banner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className='flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16 py-12 lg:py-20'>
          {/* Image Section */}
          <div className='lg:w-1/2 w-full flex justify-center lg:justify-end'>
            <div className="relative max-w-md lg:max-w-lg">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl blur-lg opacity-50"></div>
              <img 
                src={bannerImg} 
                alt="New Book Releases" 
                className="relative w-full h-auto object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          
          {/* Content Section */}
          <div className='lg:w-1/2 w-full text-center lg:text-left'>
            <div className="space-y-6">
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight'>
                New Releases{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  This Week
                </span>
              </h1>
              
              <p className='text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0'>
                It's time to update your reading list with some of the latest and greatest releases in the literary world. From heart-pumping thrillers to captivating memoirs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button className='btn-primary px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300'>
                  Subscribe Now
                </button>
                <button className='px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300'>
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">50+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">New Books</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">25+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Authors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">15+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </section>
  )
}

export default Banner
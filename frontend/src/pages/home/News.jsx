import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { useSubscribe } from '../../hooks/useSubscribe';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import images
import news1 from "../../assets/news/news-1.png"
import news2 from "../../assets/news/news-2.png"
import news3 from "../../assets/news/news-3.png"
import news4 from "../../assets/news/news-4.png"

const news = [
    {
        "id": 1,
        "title": "Global Climate Summit Calls for Urgent Action",
        "description": "World leaders gather at the Global Climate Summit to discuss urgent strategies to combat climate change, focusing on reducing carbon emissions and fostering renewable energy solutions.",
        "image": news1,
        "category": "Environment",
        "date": "2 hours ago",
        "readTime": "3 min read"
    },
    {
        "id": 2,
        "title": "Breakthrough in AI Technology Announced",
        "description": "A major breakthrough in artificial intelligence has been announced by researchers, with new advancements promising to revolutionize industries from healthcare to finance.",
        "image": news2,
        "category": "Technology",
        "date": "5 hours ago",
        "readTime": "4 min read"
    },
    // ... rest of your news data
]

const News = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const { subscribe, loading, error, success, reset } = useSubscribe();

  const categories = ['All', 'Technology', 'Science', 'Business', 'Environment'];

  const filteredNews = activeCategory === 'All' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    const result = await subscribe(email, 'news-section');
    
    if (result.success) {
      setEmail('');
      // Auto hide success message after 5 seconds
      setTimeout(() => {
        reset();
      }, 5000);
    }
  };

  const handleCloseSuccess = () => {
    reset();
  };

  return (
    <section className='py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Success/Error Messages */}
        {success && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-green-800 font-semibold mb-1">Successfully Subscribed!</h4>
                  <p className="text-green-700 text-sm">
                    Thank you for subscribing to our newsletter.
                  </p>
                </div>
                <button
                  onClick={handleCloseSuccess}
                  className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-red-800 font-semibold mb-1">Subscription Failed</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={reset}
                  className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18-6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Your existing News component JSX remains the same */}
        {/* ... */}

        {/* Enhanced CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Stay Updated with Our Newsletter</h3>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Get the latest news, exclusive content, and special offers delivered directly to your inbox.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <div className="flex-1 relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-2xl text-gray-900 border-0 focus:ring-4 focus:ring-white/30 transition-all duration-300 pr-12"
                    required
                    disabled={loading}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={loading || !email}
                  className="bg-white text-blue-600 hover:text-blue-700 px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 justify-center min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
              
              <p className="text-blue-200 text-sm mt-4">
                No spam ever. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default News
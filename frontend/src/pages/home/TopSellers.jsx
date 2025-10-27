import React, { useState, useMemo } from 'react'
import BookCard from '../books/BookCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchTrendingBooksQuery, useFetchRecommendedBooksQuery, useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import Loading from '../../components/Loading';

const categories = [
  "All Genres", 
  "Fiction", 
  "Non-Fiction", 
  "Science", 
  "Technology", 
  "Business", 
  "Biography", 
  "History", 
  "Fantasy", 
  "Horror", 
  "Romance", 
  "Mystery", 
  "Children"
];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Genres");
  const [activeTab, setActiveTab] = useState('trending'); // 'trending' or 'recommended'

  // Fetch data based on active tab
  const { data: trendingBooks = [], isLoading: trendingLoading } = useFetchTrendingBooksQuery();
  const { data: recommendedBooks = [], isLoading: recommendedLoading } = useFetchRecommendedBooksQuery();
  const { data: allBooks = [], isLoading: allLoading } = useFetchAllBooksQuery({ limit: 50 });

  const isLoading = trendingLoading || recommendedLoading || allLoading;

  // Get books based on active tab
  const getActiveBooks = () => {
    switch (activeTab) {
      case 'trending':
        return trendingBooks;
      case 'recommended':
        return recommendedBooks;
      default:
        return allBooks.books || allBooks;
    }
  };

  const activeBooks = getActiveBooks();

  // Filter books by category
  const filteredBooks = useMemo(() => {
    if (!activeBooks || activeBooks.length === 0) return [];
    
    if (selectedCategory === "All Genres") {
      return activeBooks;
    }
    
    return activeBooks.filter(book => 
      book.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      book.subcategory?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [activeBooks, selectedCategory]);

  // Get unique categories from books
  const availableCategories = useMemo(() => {
    if (!activeBooks || activeBooks.length === 0) return categories;
    
    const bookCategories = activeBooks.map(book => book.category).filter(Boolean);
    const uniqueCategories = [...new Set(bookCategories)];
    
    return [
      "All Genres",
      ...uniqueCategories.sort().map(cat => 
        cat.charAt(0).toUpperCase() + cat.slice(1)
      )
    ];
  }, [activeBooks]);

  if (isLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Books
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of trending and recommended books from various genres
          </p>
        </div>

        {/* Tabs and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'trending'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              🔥 Trending
            </button>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'recommended'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-500'
              }`}
            >
              ⭐ Recommended
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-500'
              }`}
            >
              📚 All Books
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium hidden sm:block">Filter by:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm min-w-[200px]"
            >
              {availableCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Books Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-blue-500">{filteredBooks.length}</span>{" "}
            {activeTab === 'trending' ? 'trending' : activeTab === 'recommended' ? 'recommended' : ''} books
            {selectedCategory !== "All Genres" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Books Slider */}
        {filteredBooks.length > 0 ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            navigation={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            modules={[Pagination, Navigation, Autoplay]}
            className="topSellersSwiper"
          >
            {filteredBooks.map((book) => (
              <SwiperSlide key={book._id}>
                <BookCard book={book} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No books found
            </h3>
            <p className="text-gray-500">
              {selectedCategory !== "All Genres" 
                ? `No ${activeTab} books found in ${selectedCategory}. Try another category.`
                : `No ${activeTab} books available at the moment.`
              }
            </p>
          </div>
        )}

        {/* View All CTA */}
        {filteredBooks.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedCategory('All Genres');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              View All Books
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .topSellersSwiper {
          padding: 20px 10px 40px;
        }
        .topSellersSwiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
};

export default TopSellers;
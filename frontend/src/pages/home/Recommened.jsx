import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import BookCard from '../books/BookCard';
import { useFetchRecommendedBooksQuery } from '../../redux/features/books/booksApi';
import Loading from '../../components/Loading';

const Recommended = () => {
  const { data: books = [], isLoading, isError } = useFetchRecommendedBooksQuery();

  if (isLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Loading text="Loading recommended books..." />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to load recommendations</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Recommended For You
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curated selection of books we think you'll love
          </p>
        </div>

        {/* Books Slider */}
        {books.length > 0 ? (
          <>
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              navigation={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
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
              className="recommendedSwiper pb-12"
            >
              {books.map((book) => (
                <SwiperSlide key={book._id} className="h-auto">
                  <BookCard book={book} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Progress Indicator */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-blue-600">{books.length}</span> recommended books
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Our recommendation engine is working on finding the perfect books for you. 
              Check back soon or browse our full collection.
            </p>
            <button
              onClick={() => window.location.href = '/books'}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Browse All Books
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .recommendedSwiper {
          padding: 20px 10px 40px;
        }
        .recommendedSwiper .swiper-slide {
          height: auto;
          display: flex;
        }
        .recommendedSwiper .swiper-button-next,
        .recommendedSwiper .swiper-button-prev {
          color: #3b82f6;
          background: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .recommendedSwiper .swiper-button-next:after,
        .recommendedSwiper .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
        .recommendedSwiper .swiper-pagination-bullet-active {
          background: #3b82f6;
        }
      `}</style>
    </section>
  );
};

export default Recommended;
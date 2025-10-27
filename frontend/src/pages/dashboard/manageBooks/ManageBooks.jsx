import React, { useState } from 'react'
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading';

const ManageBooks = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const { data: booksResponse, isLoading, refetch } = useFetchAllBooksQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        category: categoryFilter
    });

    const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

    // Extract books from response (handle both old and new response formats)
    const books = booksResponse?.books || booksResponse || [];
    const totalPages = booksResponse?.totalPages || 1;
    const totalBooks = booksResponse?.total || books?.length || 0;

    // Handle deleting a book with confirmation
    const handleDeleteBook = async (id, title) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${title}". This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await deleteBook(id).unwrap();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Book has been deleted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                });
                refetch();
            } catch (error) {
                console.error('Failed to delete book:', error);
                Swal.fire({
                    title: 'Error!',
                    text: error?.data?.message || 'Failed to delete book. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#d33',
                });
            }
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Handle category filter
    const handleCategoryFilter = (e) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(1);
    };

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setCurrentPage(1);
    };

    // Pagination controls
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (isLoading) return <Loading />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Manage Books</h2>
                            <p className="text-gray-600 mt-1">
                                Total Books: {totalBooks} {totalPages > 1 && `| Page ${currentPage} of ${totalPages}`}
                            </p>
                        </div>
                        <Link
                            to="/dashboard/add-book"
                            className="mt-4 md:mt-0 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                        >
                            Add New Book
                        </Link>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search books by title, author, or description..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        {/* Category Filter */}
                        <div className="w-full md:w-64">
                            <select
                                value={categoryFilter}
                                onChange={handleCategoryFilter}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                <option value="fiction">Fiction</option>
                                <option value="non-fiction">Non-Fiction</option>
                                <option value="science">Science</option>
                                <option value="technology">Technology</option>
                                <option value="business">Business</option>
                                <option value="biography">Biography</option>
                                <option value="history">History</option>
                                <option value="fantasy">Fantasy</option>
                                <option value="horror">Horror</option>
                                <option value="romance">Romance</option>
                                <option value="mystery">Mystery</option>
                                <option value="children">Children's</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-200"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Books Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Book
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {books.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No books found. {searchTerm || categoryFilter ? 'Try adjusting your filters.' : 'Start by adding a new book!'}
                                    </td>
                                </tr>
                            ) : (
                                books.map((book, index) => (
                                    <tr key={book._id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-10 bg-gray-200 rounded overflow-hidden">
                                                    {book.coverImage ? (
                                                        <img
                                                            className="h-12 w-10 object-cover"
                                                            src={book.coverImage}
                                                            alt={book.title}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className="h-12 w-10 bg-gray-200 flex items-center justify-center text-gray-400 text-xs hidden">
                                                        No Image
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                                        {book.title}
                                                    </div>
                                                    <div className="flex items-center mt-1 space-x-2">
                                                        {book.trending && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                                Trending
                                                            </span>
                                                        )}
                                                        {book.recommended && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                Recommended
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{book.author}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 capitalize">{book.category}</div>
                                            {book.subcategory && (
                                                <div className="text-xs text-gray-500 capitalize">{book.subcategory}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                ${book.newPrice}
                                            </div>
                                            {book.oldPrice > book.newPrice && (
                                                <div className="text-xs text-gray-500 line-through">
                                                    ${book.oldPrice}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                book.stock > 10 
                                                    ? 'bg-green-100 text-green-800'
                                                    : book.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {book.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                book.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : book.status === 'inactive'
                                                    ? 'bg-gray-100 text-gray-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {book.status?.charAt(0).toUpperCase() + book.status?.slice(1) || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-3">
                                                <Link
                                                    to={`/dashboard/edit-book/${book._id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors duration-200"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteBook(book._id, book.title)}
                                                    disabled={isDeleting}
                                                    className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                >
                                                    Delete
                                                </button>
                                                <Link
                                                    to={`/books/${book._id}`}
                                                    className="text-blue-600 hover:text-blue-900 font-medium transition-colors duration-200"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    // Show only nearby pages to avoid too many buttons
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => paginate(pageNumber)}
                                                className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors duration-200 ${
                                                    currentPage === pageNumber
                                                        ? 'border-indigo-500 bg-indigo-500 text-white'
                                                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    }
                                    return null;
                                })}
                                <button
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBooks;
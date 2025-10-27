// BooksellerAddBook.jsx
import React, { useState } from 'react'
import InputField from '../addBook/InputField'
import SelectField from '../addBook/SelectField'
import { useForm } from 'react-hook-form'
import { useAddBookMutation } from '../../../redux/features/books/booksApi'
import Swal from 'sweetalert2'
import { useAuth } from '../../../context/AuthContext'

const BooksellerAddBook = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [addBook, { isLoading }] = useAddBookMutation()
  const { backendUser } = useAuth()

  const [imageURL, setImageURL] = useState('')
  const [additionalImages, setAdditionalImages] = useState([''])

  const addImageField = () => {
    setAdditionalImages([...additionalImages, ''])
  }

  const updateAdditionalImage = (index, value) => {
    const updatedImages = [...additionalImages]
    updatedImages[index] = value
    setAdditionalImages(updatedImages)
  }

  const removeImageField = (index) => {
    if (additionalImages.length > 1) {
      const updatedImages = additionalImages.filter((_, i) => i !== index)
      setAdditionalImages(updatedImages)
    }
  }

  const onSubmit = async (data) => {
    // Filter out empty additional images
    const filteredAdditionalImages = additionalImages.filter(img => img.trim() !== '')
    
    // Combine form data + image URLs
    const newBookData = {
      ...data,
      coverImage: imageURL,
      images: filteredAdditionalImages,
      oldPrice: parseFloat(data.oldPrice),
      newPrice: parseFloat(data.newPrice),
      stock: parseInt(data.stock) || 0,
      pages: parseInt(data.pages) || null,
      trending: data.trending || false,
      recommended: data.recommended || false,
      // Add bookseller information
      seller: backendUser?.id,
      storeName: backendUser?.profile?.storeName,
      // The backend should automatically associate this with the logged-in bookseller via token
    }

    try {
      await addBook(newBookData).unwrap()
      Swal.fire({
        title: "Book Added Successfully!",
        text: "Your book has been added to your store catalog.",
        icon: "success",
        confirmButtonColor: "#10B981",
      })
      reset()
      setImageURL('')
      setAdditionalImages([''])
    } catch (error) {
      console.error('Error adding book:', error)
      Swal.fire({
        title: "Error Adding Book",
        text: error?.data?.message || "Failed to add book. Please try again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Add New Book to Your Store</h1>
        <p className="text-purple-100">
          Add a new book to your store catalog. Fill in the details below.
        </p>
      </div>

      {/* Store Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Store Name</label>
            <p className="text-gray-900 font-medium">{backendUser?.profile?.storeName || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Contact Email</label>
            <p className="text-gray-900">{backendUser?.email}</p>
          </div>
        </div>
      </div>

      {/* Book Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Book Details</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Title"
              name="title"
              placeholder="Enter book title"
              register={register}
              required={true}
              error={errors.title}
            />

            <InputField
              label="Author"
              name="author"
              placeholder="Enter author name"
              register={register}
              required={true}
              error={errors.author}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register("description", { required: "Description is required" })}
              placeholder="Enter book description"
              rows="4"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Category and Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Category"
              name="category"
              options={[
                { value: '', label: 'Choose A Category' },
                { value: 'fiction', label: 'Fiction' },
                { value: 'finance', label: 'Finance' },
                { value: 'non-fiction', label: 'Non-Fiction' },
                { value: 'science', label: 'Science' },
                { value: 'technology', label: 'Technology' },
                { value: 'business', label: 'Business' },
                { value: 'biography', label: 'Biography' },
                { value: 'history', label: 'History' },
                { value: 'motivation', label: 'Motivation' },
                { value: 'fantasy', label: 'Fantasy' },
                { value: 'horror', label: 'Horror' },
                { value: 'romance', label: 'Romance' },
                { value: 'mystery', label: 'Mystery' },
                { value: 'children', label: "Children's" },
                { value: 'selfhelp', label: "Self-Help" },
              ]}
              register={register}
              required={true}
              error={errors.category}
            />

            <SelectField
              label="Language"
              name="language"
              options={[
                { value: 'English', label: 'English' },
                { value: 'Spanish', label: 'Spanish' },
                { value: 'French', label: 'French' },
                { value: 'German', label: 'German' },
                { value: 'Chinese', label: 'Chinese' },
                { value: 'Japanese', label: 'Japanese' },
                { value: 'Other', label: 'Other' },
              ]}
              register={register}
            />
          </div>

          {/* Pricing and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Old Price ($)"
              name="oldPrice"
              type="number"
              step="0.01"
              placeholder="Original price"
              register={register}
              required={true}
              error={errors.oldPrice}
            />

            <InputField
              label="New Price ($)"
              name="newPrice"
              type="number"
              step="0.01"
              placeholder="Selling price"
              register={register}
              required={true}
              error={errors.newPrice}
            />

            <InputField
              label="Stock Quantity"
              name="stock"
              type="number"
              placeholder="Available stock"
              register={register}
              defaultValue={1}
            />
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="ISBN"
              name="isbn"
              placeholder="Enter ISBN number (optional)"
              register={register}
            />

            <InputField
              label="Publisher"
              name="publisher"
              placeholder="Enter publisher name (optional)"
              register={register}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Published Date"
              name="publishedDate"
              type="date"
              register={register}
            />

            <InputField
              label="Pages"
              name="pages"
              type="number"
              placeholder="Number of pages (optional)"
              register={register}
            />
          </div>

          {/* Condition and Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Condition"
              name="condition"
              options={[
                { value: 'new', label: 'New' },
                { value: 'used', label: 'Used' },
                { value: 'refurbished', label: 'Refurbished' },
              ]}
              register={register}
            />

            <InputField
              label="Subcategory"
              name="subcategory"
              placeholder="Enter subcategory (optional)"
              register={register}
            />
          </div>

          {/* Tags */}
          <InputField
            label="Tags"
            name="tags"
            placeholder="Enter tags separated by commas (e.g., fantasy, adventure, magic)"
            register={register}
          />

          {/* Book Features */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Book Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('trending')}
                  className="rounded text-purple-600 focus:ring focus:ring-offset-2 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm font-semibold text-gray-700">Mark as Trending</span>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('recommended')}
                  className="rounded text-purple-600 focus:ring focus:ring-offset-2 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm font-semibold text-gray-700">Mark as Recommended</span>
              </div>
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cover Image URL *
            </label>
            <input
              type="text"
              placeholder="Enter cover image URL (e.g. https://example.com/image.jpg)"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              required
            />
            {imageURL && (
              <div className="mt-2">
                <img
                  src={imageURL}
                  alt="Book Preview"
                  className="w-32 h-40 object-cover rounded-md border shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Image Preview</p>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Images (Optional)
            </label>
            {additionalImages.map((image, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter additional image URL"
                  value={image}
                  onChange={(e) => updateAdditionalImage(index, e.target.value)}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                />
                {additionalImages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm transition-colors"
            >
              Add Another Image
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 text-white font-bold rounded-lg transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Book...
                </div>
              ) : (
                'Add Book to Store'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BooksellerAddBook
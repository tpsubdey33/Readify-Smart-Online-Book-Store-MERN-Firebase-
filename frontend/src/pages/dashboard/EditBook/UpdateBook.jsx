import React, { useEffect, useState } from 'react'
import InputField from '../addBook/InputField'
import SelectField from '../addBook/SelectField'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useFetchBookByIdQuery, useUpdateBookMutation } from '../../../redux/features/books/booksApi';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';

const UpdateBook = () => {
  const { id } = useParams();
  const { data: bookData, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  
  const [additionalImages, setAdditionalImages] = useState(['']);
  const [coverImage, setCoverImage] = useState('');

  // Initialize form with book data
  useEffect(() => {
    if (bookData) {
      setValue('title', bookData.title);
      setValue('author', bookData.author);
      setValue('description', bookData.description);
      setValue('category', bookData.category);
      setValue('subcategory', bookData.subcategory || '');
      setValue('isbn', bookData.isbn || '');
      setValue('publisher', bookData.publisher || '');
      setValue('publishedDate', bookData.publishedDate ? new Date(bookData.publishedDate).toISOString().split('T')[0] : '');
      setValue('language', bookData.language || 'English');
      setValue('pages', bookData.pages || '');
      setValue('condition', bookData.condition || 'new');
      setValue('stock', bookData.stock || 0);
      setValue('trending', bookData.trending || false);
      setValue('recommended', bookData.recommended || false);
      setValue('oldPrice', bookData.oldPrice);
      setValue('newPrice', bookData.newPrice);
      setValue('tags', bookData.tags?.join(', ') || '');
      
      // Handle images
      setCoverImage(bookData.coverImage || '');
      if (bookData.images && bookData.images.length > 0) {
        setAdditionalImages(bookData.images);
      } else {
        setAdditionalImages(['']);
      }
    }
  }, [bookData, setValue]);

  // Add more image fields
  const addImageField = () => {
    setAdditionalImages([...additionalImages, '']);
  };

  // Update additional images
  const updateAdditionalImage = (index, value) => {
    const updatedImages = [...additionalImages];
    updatedImages[index] = value;
    setAdditionalImages(updatedImages);
  };

  // Remove image field
  const removeImageField = (index) => {
    if (additionalImages.length > 1) {
      const updatedImages = additionalImages.filter((_, i) => i !== index);
      setAdditionalImages(updatedImages);
    }
  };

  const onSubmit = async (data) => {
    // Filter out empty additional images
    const filteredAdditionalImages = additionalImages.filter(img => img.trim() !== '');
    
    // Prepare update data
    const updateBookData = {
      ...data,
      coverImage: coverImage,
      images: filteredAdditionalImages,
      oldPrice: parseFloat(data.oldPrice),
      newPrice: parseFloat(data.newPrice),
      stock: parseInt(data.stock) || 0,
      pages: data.pages ? parseInt(data.pages) : null,
      trending: data.trending || false,
      recommended: data.recommended || false,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : []
    };

    try {
      await updateBook({ id, ...updateBookData }).unwrap();
      
      Swal.fire({
        title: "Success!",
        text: "Book updated successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK"
      });
      
      await refetch();
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to update book. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center text-red-500 py-8">Error fetching book data</div>;

  return (
    <div className="max-w-2xl mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
          required={true}
          error={errors.title}
        />

        {/* Author */}
        <InputField
          label="Author"
          name="author"
          placeholder="Enter author name"
          register={register}
          required={true}
          error={errors.author}
        />

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register("description", { required: "Description is required" })}
            placeholder="Enter book description"
            rows="4"
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Category */}
        <SelectField
          label="Category"
          name="category"
          options={[
            { value: '', label: 'Choose A Category' },
            { value: 'fiction', label: 'Fiction' },
            { value: 'non-fiction', label: 'Non-Fiction' },
            { value: 'science', label: 'Science' },
            { value: 'technology', label: 'Technology' },
            { value: 'business', label: 'Business' },
            { value: 'biography', label: 'Biography' },
            { value: 'history', label: 'History' },
            { value: 'fantasy', label: 'Fantasy' },
            { value: 'horror', label: 'Horror' },
            { value: 'romance', label: 'Romance' },
            { value: 'mystery', label: 'Mystery' },
            { value: 'children', label: "Children's" },
          ]}
          register={register}
          required={true}
          error={errors.category}
        />

        {/* Subcategory */}
        <InputField
          label="Subcategory"
          name="subcategory"
          placeholder="Enter subcategory (optional)"
          register={register}
        />

        {/* ISBN */}
        <InputField
          label="ISBN"
          name="isbn"
          placeholder="Enter ISBN number (optional)"
          register={register}
        />

        {/* Publisher */}
        <InputField
          label="Publisher"
          name="publisher"
          placeholder="Enter publisher name (optional)"
          register={register}
        />

        {/* Published Date */}
        <InputField
          label="Published Date"
          name="publishedDate"
          type="date"
          register={register}
        />

        {/* Language */}
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

        {/* Pages */}
        <InputField
          label="Pages"
          name="pages"
          type="number"
          placeholder="Number of pages (optional)"
          register={register}
        />

        {/* Condition */}
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

        {/* Stock */}
        <InputField
          label="Stock Quantity"
          name="stock"
          type="number"
          placeholder="Available stock"
          register={register}
        />

        {/* Old Price */}
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

        {/* New Price */}
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

        {/* Tags */}
        <InputField
          label="Tags"
          name="tags"
          placeholder="Enter tags separated by commas (e.g., fantasy, adventure, magic)"
          register={register}
        />

        {/* Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('trending')}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">Trending Book</span>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('recommended')}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">Recommended Book</span>
          </div>
        </div>

        {/* Cover Image URL */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cover Image URL *
          </label>
          <input
            type="text"
            placeholder="Enter cover image URL (e.g. https://...)"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {coverImage && (
            <div className="mt-2">
              <img
                src={coverImage}
                alt="Book Preview"
                className="w-32 h-40 object-cover rounded-md border"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <p className="text-xs text-gray-500 mt-1">Current Cover Image</p>
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
                className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 py-3 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className={`flex-1 py-3 text-white font-bold rounded-md transition-colors ${
              isUpdating 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isUpdating ? 'Updating...' : 'Update Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBook;
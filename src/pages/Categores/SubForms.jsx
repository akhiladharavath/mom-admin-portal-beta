import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient';

function SubForms() {
  const [formData, setFormData] = useState({
    subcategory_name: '',
    category: '',
    imageFile: null,
    imageUrl: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient('/api/medicines/categories');
      if (response) {
        setCategories(response);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData(prevData => ({
          ...prevData,
          imageFile: file,
          imageUrl: URL.createObjectURL(file)
        }));
      }
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('subcategory_name', formData.subcategory_name);
      data.append('category', formData.category);
      if (formData.imageFile) {
        data.append('imageUrl', formData.imageFile);
      }

      const response = await apiClient('/api/medicines/subcategories', {
        method: 'POST',
        body: data,
      });
      if (response) {
        setFormData({
          subcategory_name: '',
          category: '',
          imageFile: null,
          imageUrl: ''
        });
        alert('Subcategory created successfully!');
      } else {
        console.error('Failed to create subcategory');
        alert('Failed to create subcategory. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl text-gray-700">
                <h2 className="leading-relaxed">Add SubCategory</h2>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">

                {/* Image Upload */}
                <div className="col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Medicine Image
                  </label>
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Subcategory"
                      className="w-24 h-24 object-cover rounded mb-3"
                    />
                  )}
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-teal-600"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose">SubCategory Name</label>
                  <input
                    type="text"
                    name="subcategory_name"
                    value={formData.subcategory_name}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-black-600"
                    placeholder="Enter subcategory name"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id} className="text-gray-700">
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-teal-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600'
                    }`}
                >
                  {loading ? 'Creating...' : 'Create SubCategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubForms;
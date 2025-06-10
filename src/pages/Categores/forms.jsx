import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [formData, setFormData] = useState({
    subcategory_name: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/medicines/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/medicines/subcategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Subcategory created:', data);
        
        setFormData({
          subcategory_name: '',
          category: ''
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
                    <option value="select Category">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id} className="text-gray-700">
                       <div className='text-red-800'> {category.category_name} </div>
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-#00a99dS-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
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

export default MyComponent;
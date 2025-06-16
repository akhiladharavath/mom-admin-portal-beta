import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import apiClient from '../../utils/apiClient';

function MyComponent() {
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    category_name: '',
 
  });
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(()=>{
    if(id){
            apiClient(`/api/medicines/categories/${id}`)
        .then(data => setFormData({ category_name: data.category_name }))
        .catch(() => {});
    }
  },[id])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   try {
    const response = await apiClient('/api/medicines/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (response) {
      console.log('Category created:', response);

      setFormData({ category_name:'' });
    } else {
      console.error('Failed to create category');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl text-gray-700">
                <h2 className="leading-relaxed">Add  Category</h2>
                
              </div>
            </div>
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Category Name</label>
                  <input
                    type="text"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Enter category name"
                  />
                </div>
                
              
              </div>
              <div className="pt-4 flex items-center space-x-4">
               
                <button
                  // type="submit"
                  
                  className="bg-teal-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none "
                  type="submit">{id ? 'Update' : 'Create'}
                
                  Create Category
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
import React, { createContext, useContext, useState } from 'react';
import apiClient from '../../utils/apiClient';

const MedicineContext = createContext();

export function MedicineProvider({ children }) {
  const [medicine, setMedicine] = useState([]);

  async function addCategory(name) {
    const res = await apiClient('/api/medicines/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_name: name }),
    });
    return res;
  }

  async function addSubCategory({ name, categoryId, imageFile }) {
    const form = new FormData();
    form.append('subcategory_name', name);
    form.append('category', categoryId);
    form.append('imageUrl', imageFile);
    const res = await apiClient('/api/medicines/subcategories', {
      method: 'POST',
      body: form,
    });
    return res;
  }

  async function addMedicine(formData) {
    const res = await apiClient('/api/medicines/medicines', {
      method: 'POST',
      body: formData,
    });

    setMedicine(prev => [...prev, res]);
    return res;
  }

  const fetchCategories = () => apiClient('/api/medicines/categories');
  const fetchSubCategories = categoryId =>
    apiClient(`/api/medicines/categories/${categoryId}/subcategories`);
  const fetchMedicines = () => apiClient('/api/medicines/medicines');

  return (
    <MedicineContext.Provider
      value={{
        medicine,
        addCategory,
        addSubCategory,
        addMedicine,
        fetchCategories,
        fetchSubCategories,
        fetchMedicines,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
}

export default () => {
  const ctx = useContext(MedicineContext);
  if (!ctx) throw new Error("Context not found");
  return ctx;
};

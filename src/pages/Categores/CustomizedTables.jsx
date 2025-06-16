import { useNavigate } from 'react-router';
import ReusableTable from '../../components/TableComponent/TableComponent';
import { useEffect, useState } from 'react';
import DeleteAlert from '../../components/Medicines/Deletealert';
import apiClient from '../../utils/apiClient';


const columns = [
  { id: "_id", label: "Category ID", minWidth: 70 },
  { id: "category_name", label: "Category", minWidth: 100 },
];

function CategoryHeader({ onSearch }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <input
        type="text"
        placeholder="Search Categories"
        onChange={e => onSearch(e.target.value)}
        className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <button
        onClick={() => navigate('/forms')}
        className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200 shadow-md"
      >
        + Add Category
      </button>
    </div>
  );
}



export default function CategoryPage() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await apiClient('/api/medicines/categories');
      if (data) {
        setRows(data);
        setFilteredRows(data);
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log("error");
    }
  };

  fetchCategories();
}, []);

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    setFilteredRows(
      rows.filter((row) =>
        row.category_name &&
        row.category_name.toLowerCase().includes(searchValue)
      )
    );
  };

  const handleDelete = async (id) => {
    const confirmDelete = await DeleteAlert()
    if (!confirmDelete) return;
    try {
      const response = await apiClient(`/api/medicines/categories/${id}`, {
        method: 'DELETE',
      });
      if (response) {
        setRows(rows => rows.filter(item => item._id !== id));
        setFilteredRows(rows => rows.filter(item => item._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      alert("Error deleting");
    }
  };

  const handleEditSave = async (id, newName) => {
    try {
      const response = await apiClient(`/api/medicines/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: newName }),
      });
      if (response) {
        setRows(rows => rows.map(item =>
          item._id === id ? { ...item, category_name: newName } : item
        ));
        setFilteredRows(rows => rows.map(item =>
          item._id === id ? { ...item, category_name: newName } : item
        ));
      } else {
        alert("Failed to update category");
      }
    } catch (error) {
      alert("Error updating category");
    }
  };

  return (

    <div className="max-w-6xl mx-auto  p-8">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-8">
        Categories Management
      </h1>

      <CategoryHeader onSearch={handleSearch} />

      <ReusableTable
        columns={columns}
        rows={filteredRows || []}
        onDelete={handleDelete}
        onEditSave={handleEditSave}
      />
    </div>
  
);

}
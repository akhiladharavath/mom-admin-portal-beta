import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import DeleteAlert from '../../components/Medicines/Deletealert';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import apiClient from '../../utils/apiClient';

const PaginatedTable = () => {
  const Navigate = useNavigate();
  const [data, setData] = useState([]);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const [singleCategory, setSingleCategory] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    const confirmDelete = await DeleteAlert();
    if (!confirmDelete) return;

    try {
      await apiClient(`/api/medicines/medicines/${id}`, {
        method: "DELETE",
      });

      const updatedData = data.filter((item) => item._id !== id);
      setData(updatedData);
      setFilteredData(updatedData);
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchSubCategory();
  }, []);


  const discount = (markedPrice, sellingPrice) => {
  if (!markedPrice || !sellingPrice || markedPrice <= 0) return 0;
  const discountAmount = markedPrice - sellingPrice;
  return `${((discountAmount / markedPrice) * 100).toFixed(2)}%`;
};
  const fetchMedicines = async () => {
    try {
      const response = await apiClient('/api/medicines/medicines');
      if (!response)
        throw new Error(`HTTP error! status: ${response.status}`);
      setData(response);
      setFilteredData(response);
    } catch (err) {
      console.error("Error fetching medicines:", err);
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await apiClient('/api/medicine/subcategories');
      if (response) {
        setSubCategory(response);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // const fetchCategories = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/api/medicines/categories");
  //     if (response.ok) {
  //     const data = await response.json();
  //     setCategory(data);
  //     } else {
  //     console.error("Failed to fetch categories");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  const SingleSubCategory = async (id) => {
    try {
      const response = await apiClient(`/api/medicine/subcategories/${id}`);
      if (response) {
        setSingleCategory(response);
      }
    } catch (error) {}
  };

  const handleFilterChange = async (e) => {
    const subCatId = e.target.value;
    setSelectedSubCategory(subCatId);
    setCurrentPage(1);

    if (subCatId === "") {
      setFilteredData(data);
      setSingleCategory("");
    } else {
      const filtered = data.filter((item) =>
        item.subcategories?.includes(subCatId)
      );
      setFilteredData(filtered);
      await SingleSubCategory(subCatId);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = data.filter((item) =>
      Object.values(item).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="p-6  min-h-screen">
      <div className="text-3xl font-bold text-teal-600 text-center mb-8">
        <h1>Medicine Details</h1>
      </div>

      {/* Search, Filter, Add Button */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <input
          type="text"
          onChange={handleSearch}
          className="border border-teal-300 rounded-lg px-4 py-2 w-full md:w-72 shadow-sm focus:ring-2 focus:ring-teal-400 outline-none transition"
          placeholder="Search for medicines..."
        />

        <select
          value={selectedSubCategory}
          onChange={handleFilterChange}
          className="border border-teal-300 rounded-lg px-4 py-2 w-full md:w-52 bg-white shadow-sm focus:ring-2 focus:ring-teal-400 outline-none transition"
        >
          <option value="">Sub Categories</option>
          {subCategory.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.subcategory_name}
            </option>
          ))}
        </select>

        <button
          onClick={() => Navigate("/medicineform")}
          className="text-white bg-teal-600 hover:bg-teal-700 font-semibold rounded-lg px-6 py-2 shadow-md transition"
        >
          + Add Medicine
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-teal-600 text-white text-xs uppercase tracking-wide">
            <tr>
              {[
                "Image",
                "Name",
                "Price",
                "Prescription",
                "Description",
                "Use",
                "Ingredients",
                "Dose",
                "Manufacturer",

                "Not For",
                "Side Effects",
                "Store",
                "Expiry",
                "Manufactured",
                "DiscountPrice",
                "Discount",
                "Category",
                "SubCategory",
                "Actions",
              ].map((title, index) => (
                <th key={index} className="px-4 py-3 whitespace-nowrap">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={16} className="text-center py-8 text-gray-500">
                  No medicine found
                </td>
              </tr>
            ) : (
              currentItems?.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-teal-50 transition-all duration-200"
                >
                  <td className="px-4 py-2">
                    <img
                      src={item?.imageUrl}
                      alt={item?.medicine_name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2" title={item?.medicine_name}>
                    {item?.medicine_name?.slice(0, 10)}...
                  </td>
                  <td className="px-4 py-2">{item?.price}</td>
                  <td className="px-4 py-2">
                    {item?.prescription_drug ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2" title={item?.description}>
                    {item?.description?.slice(0, 10)}...
                  </td>
                  <td className="px-4 py-2" title={item?.use}>
                    {item?.use?.slice(0, 10)}...
                  </td>
                  <td className="px-4 py-2" title={item?.ingredients}>
                    {item?.ingredients?.slice(0, 10)}...
                  </td>
                  <td className="px-4 py-2" title={item?.dose}>
                    {item?.dose?.slice(0, 10)}...
                  </td>
                  <td className="px-4 py-2" title={item?.manufacturer}>
                    {item?.manufacturer?.slice(0, 10)}...
                  </td>
                  {/* Category */}

                  {/* <td className="px-4 py-2" title={item?.category}>
                    {item?.category?.slice ? item?.category?.slice(0, 10) + "..." : ""}
                  </td>
                  {/* Sub-Categories */}

                  <td className="px-4 py-2" title={item?.not_for}>
                    {item?.not_for?.slice(0, 10)}...
                  </td>
                  <td className="px-4 py-2" title={item?.side_effects}>
                    {item?.side_effects?.slice(0, 10)}...
                  </td>
                  <td className="px-4 py-2" title={item?.store}>
                    {item?.store?.slice(0, 10)}...
                  </td>
                  <td className="px-4 py-2">{item?.expiry_date}</td>
                  <td className="px-4 py-2">{item?.manufacture_date}</td>
                   
                  <td className="px-4 py-2">{item.discounted_price?item.discounted_price:item.price}</td>

                  <td className="px-4 py-2">
                      {discount(item.price, item.discounted_price)}
                  </td>

                  <td>
                    {item.subcategories && Array.isArray(item.subcategories)
                      ? [
                          ...new Set(
                            item.subcategories.map(
                              (sub) => sub.category.category_name
                            )
                          ),
                        ].join(", ")
                      : ""}
                  </td>
                  <td>
                    {item.subcategories && Array.isArray(item.subcategories)
                      ? item.subcategories
                          .map((sub) => sub.subcategory_name)
                          .join(", ")
                      : ""}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => Navigate(`/Updatedform/${item._id}`)}
                      className="text-teal-900 p-2 rounded border transition border-teal-700"
                      title="Edit"
                    >
                      <BsFillPencilFill />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-teal-900 p-2 rounded border transition border-teal-700"
                      title="Delete"
                    >
                      <BsFillTrashFill />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        <p className="text-gray-700 font-medium">
          Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
        </p>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredData.length / itemsPerPage)
          }
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedTable;

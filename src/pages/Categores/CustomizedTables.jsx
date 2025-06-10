import { Stack, TextField, Button } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import ReusableTable from '../../components/TableComponent/TableComponent';
import { useEffect, useState } from 'react';
 import * as React from "react";

const columns = [
  { id: "_id", label: "Category ID", minWidth: 70 },
  { id: "category_name", label: "Category", minWidth: 100 },

];

function CategoryHeader() {
  // const navigate = useNavigate();
  return (
    <Stack direction="row" spacing={2} marginBottom={2}>
      <TextField label="Search" variant="outlined" />
      <Button
        // onClick={() => navigate('/forms')}
        variant="contained"
        sx={{ backgroundColor: '#05a99d' }}
      >
        Add
      </Button>
    </Stack>
  );
}

export default function CategoryPage() {
  const navigate = useNavigate();
  const [row, setRow] = React.useState([]);
  React.useEffect(() => {
    const fetchCategores = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/medicines/categories"
        );
        const json = await response.json();

        if (response.ok) {
          setRow(json);
          console.log(json);
        } else {
          console.log("eerir");
        }
      } catch (err) {
        console.log("eerir");
      }
    };

    fetchCategores();
  }, []);

    const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const response = await fetch(`http://localhost:3000/api/medicines/categories/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRow(row.filter(item => item._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      alert("Error deleting");
    }
  };


const handleEditSave = async (id, newName) => {
  try {
    const response = await fetch(`http://localhost:3000/api/medicines/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_name: newName }),
    });
    if (response.ok) {
      setRow(row => row.map(item =>
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
    <div style={{ margin: '50px auto', width: '80%' }}>
      <CategoryHeader />
<ReusableTable columns={columns} rows={row} onDelete={handleDelete} onEditSave={handleEditSave} />    </div>
  );
}

// import * as React from 'react';
// import { Stack, TextField, Button } from '@mui/material';
// import ReusableTable from '../../components/TableComponent/TableComponent';

// const columns = [
//   { id: 'category', label: 'Category ID', minWidth: 70 },
//   { id: 'subcategory_name', label: 'Sub-Category', minWidth: 100 },
//   { id: 'created_at', label: 'Action', minWidth: 100 },
  
// ];



// function CategoryHeader() {
//   // const navigate = useNavigate();
//   return (
    
//     <div>
//     <h1 style={{ color: '#05a99d', fontSize: '24px', marginBottom: '20px' }}>Sub-Categories</h1>
    
//   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,flexDirection:'row'}}>
    
//     <Stack direction="row" spacing={2} marginBottom={2}>
//       <TextField label="Search" variant="outlined"
//       style={{ height:56}} />
//       <div style={{ display: 'flex', alignItems: 'center' }}> 
//       <Button
//         onClick={() => navigate('/forms')}
//         type="button"
//         style={{ backgroundColor: '#05a99d', color: '#fff',height:25, width: 10 }}
//         variant="contained"
//       >
//         Add
//       </Button>
//       </div>
//     </Stack>
    
//     </div>
//     </div>
//   );
// }

// export default function CategoryPage() {
//   const[row,setRow]=React.useState([])
//   React.useEffect(() => {
//         const fetchSubCategores = async () => {
//             try {
//                 const response = await fetch(`http://localhost:3000/api/medicines/subcategories`);
//                 const json = await response.json();

//                 if (response.status === 200 && Array.isArray(json)) {
//                     setRow(json);
//                     console.log(json)
//                 } else {
//                     console.log("eerir")
//                 }
//             } catch (err) {
//                  console.log("eerir")
//             }
//         };

//         fetchSubCategores();
//     }, []);
//   return (
//     <div style={{ margin: '50px auto', width: '80%' }}
//     >
//       <CategoryHeader />
//       <ReusableTable columns={columns} rows={row} />
//     </div>
//   );
// }


import { Stack, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../components/TableComponent/TableComponent';
import { useEffect, useState } from 'react';
 import * as React from "react";

const columns = [
  { id: "_id", label: "Sub Category ID", minWidth: 70 },
  { id: "subcategory_name", label: "SubCategory Name", minWidth: 100 },
  { id: "category", label: "Category ID", minWidth: 100 },
 

];

function CategoryHeader() {
  const navigate = useNavigate();
  return (
    
    <Stack direction="row" spacing={2} marginBottom={2}>
      <div style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',flex: 0.5 }}>
      <div style={{ color: '#00a99d', fontSize: '24px', marginBottom: '20px' }}>
      
      <h1> Sub Categores</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <TextField label="Search" variant="outlined" color='#00a99d' />
      <Button
        onClick={() => navigate('/forms')}
        variant="contained"
        sx={{ backgroundColor: '#00a99d' }}
      >
        Add Sub-Categores
      </Button>
      </div>
      </div>
    </Stack>
  );
}

export default function CategoryPage() {
  const [row, setRow] = React.useState([]);
  React.useEffect(() => {
    const fetchSubCategores = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/medicines/subcategories"
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

    fetchSubCategores();
  }, []);
  return (
    <div style={{ margin: '50px auto', width: '80%' }}>
      <CategoryHeader />
      <ReusableTable columns={columns} rows={row} />
    </div>
  );
}
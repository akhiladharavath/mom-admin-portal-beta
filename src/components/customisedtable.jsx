import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import apiClient from '../utils/apiClient';


const columns = [
  { id: 'name', label: 'Name', minWidth: 150, align: 'center' },
  {
    id: 'mobileNo',
    label: 'Mobile Number',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'dateOfBirth',
    label: 'Date of Birth',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'gender',
    label: 'Gender',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  { id: 'age', label: 'Age', minWidth: 100, align: 'center' },
  {
    id: 'bloodgroup',
    label: 'Blood Group',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'isAdmin',
    label: 'Admin',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'isRegistered',
    label: 'Registered',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'primaryAddress',
    label: 'Primary Address',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
];

function createData(name, mobileNo, dateOfBirth, gender, email, age, bloodgroup, isAdmin, isRegistered, primaryAddress) {
  return { name, mobileNo, dateOfBirth, gender, email, age, bloodgroup, isAdmin, isRegistered, primaryAddress };
}

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient('/api/user/');
        console.log('API Response:', response);

        if (!Array.isArray(response.users)) {
          setError('Error: users is not an array');
          console.error('Error: users is not an array');
          return;
        }

        if (response) {
          const formattedData = response.users.map((user) =>
            createData(
              user.name,
              user.mobileNo,
              user.dateOfBirth,
              user.gender,
              user.email,
              user.age,
              user.bloodgroup,
              user.isAdmin,
              user.isRegistered,
              user.primaryAddress
            )
          );
          setRows(formattedData);
          setFilteredRows(formattedData);
          console.log('Success: users fetched successfully');
        } else {
          setError('Error: response not ok');
          console.error('Error: response not ok');
        }
      } catch (err) {
        setError('Error fetching data: ' + err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = rows.filter((row) =>
      Object.values(row).some(
        (val) =>
          val && val.toString().toLowerCase().includes(value)
      )
    );
    setFilteredRows(filtered);
    setPage(0);
  };

  return (
    <div className="container mx-auto p-4  ]">
            <div className="text-3xl font-bold text-teal-600 text-center mb-8">
        <h1>User Details</h1>
      </div>
      <div className="m-5 mt-8 flex justify-start ">
<input
        type="text" 
        placeholder="Search..."
        onChange={handleFilter}
          className="border border-teal-300 rounded-lg px-4 py-2 w-full md:w-72 shadow-sm focus:ring-2 focus:ring-teal-400 outline-none transition"
      />  
      </div>
      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}
      <div className="rounded-xl shadow-xl mt-10  ">
        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', borderRadius: '12px', color:'white'}}>
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, background: '#00a99d', color:'black',fontSize: 14,fontweight: 800,border: '5px #D5ECE9',padding:10  }}
                    >
                      {column.label}  
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
         <TableBody>
                {filteredRows.length === 0 && !loading && !error ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <div style={{ textAlign:"center",width:'70%',fontSize: 16, color: '#888'}}>
                        No user found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, rowIndex) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={rowIndex}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={`${column.id}-${rowIndex}`}
                              align={column.align}
                              style={{
                                fontSize: 14,
                                padding: 5,
                                fontWeight: 500,
                                fontFamily: "sans-serif",
                              }}
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 35]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
}
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

const columns = [
  { id: 'name', label: 'Name', minWidth: 170, align: 'center' },
  {
    id: 'mobileNo',
    label: 'Mobile Number',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'dateOfBirth',
    label: 'Date of Birth',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'gender',
    label: 'Gender',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  { id: 'age', label: 'Age', minWidth: 100, align: 'center' },
  {
    id: 'bloodgroup',
    label: 'Blood Group',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'isAdmin',
    label: 'Admin',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'isRegistered',
    label: 'Registered',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'primaryAddress',
    label: 'Primary Address',
    minWidth: 170,
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
        const response = await fetch('http://localhost:3000/api/user/');
        const json = await response.json();
        console.log('API Response:', json);

        if (!Array.isArray(json.users)) {
          setError('Error: users is not an array');
          console.error('Error: users is not an array');
          return;
        }

        if (response.ok) {
          const formattedData = json.users.map((user) =>
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
    <div className="container mx-auto p-4">
      <div className="m-5 mt-4 flex justify-start">
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleFilter}
          fullWidth
          sx={{ maxWidth: 400 }}
        />
      </div>
      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}
      <div className="rounded-xl shadow-xl mt-10">
        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, background: '#00a99d', color:'#ffff',fontSize: 13 }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, rowIndex) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={`${column.id}-${rowIndex}`}
                            align={column.align}
                            style={{ fontSize: 13,padding:8,fontWeight:500, fontFamily: 'sans-serif' }}
                          >
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
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
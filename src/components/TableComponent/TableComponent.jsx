import * as React from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow
} from '@mui/material';

import { BsFillTrashFill, BsFillPencilFill, BsCheckLg, BsX } from 'react-icons/bs';


export default function ReusableTable({
  columns,
  rows,
  onDelete,
  onEditSave,
  rowsPerPageOptions = [10, 25, 100]
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [editId, setEditId] = React.useState(null);
  const [editValue, setEditValue] = React.useState('');

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  
  const startEdit = (row) => {
    setEditId(row._id);
    setEditValue(row.category_name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValue('');
  };

  const saveEdit = () => {
    if (onEditSave && editId) {
      onEditSave(editId, editValue);
    }
    setEditId(null);
    setEditValue('');
  };

  const columnsWithActions = [
    ...columns,
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'center',
    }
  ];

  return (
    <div className="flex flex-column justify-between margin-right-10">

    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 340, overflowY: 'auto' }}
      className="w-1000 h-1000 object-cover rounded-lg shadow-md">
        
        <Table stickyHeader
        className="min-w-full text-sm text-left"
       >
          <TableHead
          className="sticky top-0 bg-teal-600 text-white text-xs uppercase tracking-wider"
          >
            <TableRow>
              {columnsWithActions.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth, backgroundColor: '#00a99d',fontSize:12,color:'#ffff',padding: '7px' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

         

            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                <TableRow hover key={idx}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || 'left'}
                      style={{ fontSize: 12, color: '#000', padding: '5px' }}
                    >
                      {column.id === 'category_name' && editId === row._id ? (
                        <input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                          style={{ fontSize: 12, padding: '2px 4px', width: '90%' }}
                        />
                      ) : (
                        row[column.id]
                      )}
                    </TableCell>
                  ))}

                  <TableCell align="center" style={{ fontSize: 12, color: '#000', padding: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      {editId === row._id ? (
                        <>
                          <button
                            style={{ background: '#00a99d', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px' }}
                            onClick={saveEdit}
                          >
                            <BsCheckLg />
                          </button>
                          {/* <button
                            style={{ background: '#ccc', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px' }}
                            onClick={cancelEdit}
                          >
                            <BsX />
                          </button> */}
                        </>
                      ) : (
                        <>
                          <button
                            style={{ display: 'flex', alignItems: 'center', backgroundColor: '#00a99d', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
                            onClick={() => startEdit(row)}
                          >
                            <BsFillPencilFill style={{ marginRight: '8px', cursor: 'pointer' }} />
                          </button>
                          <button
                            style={{ display: 'flex', alignItems: 'center', backgroundColor: '#00a99d', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
                            onClick={() => onDelete && onDelete(row._id)}
                          >
                            <BsFillTrashFill style={{ cursor: 'pointer' }} />
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <div></div>
    </div>
  );
}
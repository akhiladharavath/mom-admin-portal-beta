import { Stack, TextField, Button } from '@mui/material';
import ReusableTable from '../../components/TableComponent/TableComponent';

const columns = [
  { id: 'id', label: 'ID', minWidth: 70 },
  { id: 'category', label: 'Category', minWidth: 100 },
];

const rows = [
  { id: '1', category: 'Hair Care' },
  { id: '2', category: 'Baby Care' },
  { id: '3', category: 'Women Care' },
  { id: '4', category: 'Diabaitc' },
  { id: '5', category: 'Skin Care' },
  { id: '6', category: 'Fever' },
  { id: '7', category: 'Asthama' },
  { id: '8', category: 'Blood Pressure' },
  { id: '9', category: 'Hart' },
  { id: '10', category: 'JP' },
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
  return (
    <div style={{ margin: '50px auto', width: '80%' }}>
      <CategoryHeader />
      <ReusableTable columns={columns} rows={rows} />
    </div>
  );
}

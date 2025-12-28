import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Paper, Typography, Box } from '@mui/material';
import './App.css';

interface User {
  id: number;
  name: string;
  email: string;
}

// Define Columns for the Material Table
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Full Name', width: 200, flex: 1 },
  { field: 'email', headerName: 'Email Address', width: 250, flex: 1 },
];

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: User[]) => {
        // Databricks might return uppercase keys (NAME, EMAIL) 
        // Ensure your data matches the 'field' in columns
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ padding: "40px", maxWidth: '1000px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        Databricks User Directory
      </Typography>

      <Paper sx={{ height: 400, width: '100%', boxShadow: 3 }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        // If Databricks doesn't provide a unique 'id' field, 
        // use getRowId={(row) => row.some_unique_internal_id}
        />
      </Paper>
    </Box>
  );
}

export default App;
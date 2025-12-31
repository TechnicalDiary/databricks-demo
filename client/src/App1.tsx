import { useEffect, useState, useCallback } from 'react';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Paper, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import './App.css';

interface User {
    id: number | string;
    name: string;
    email: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User>({ id: '', name: '', email: '' });
    const [isEdit, setIsEdit] = useState(false);
    const [saving, setSaving] = useState(false);


    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []); // Memoizes the function once

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpen = (user?: User) => {
        if (user) {
            setCurrentUser(user);
            setIsEdit(true);
        } else {
            setCurrentUser({ id: '', name: '', email: '' });
            setIsEdit(false);
        }
        setOpen(true);
    };

    const handleSave = async () => {
        setSaving(true); // Start Loader
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `/api/users/${currentUser.id}` : '/api/users';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentUser),
            });
            if (res.ok) {
                setOpen(false);
                fetchUsers(); // Refresh list
            }
        } catch (err) {
            console.error("Save error:", err);
        } finally {
            setSaving(false); // Stop Loader (Success or Error)
        }
    };

    const handleDelete = async (id: number | string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
                if (res.ok) fetchUsers();
            } catch (err) {
                console.error("Delete error:", err);
            }
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Full Name', width: 200, flex: 1 },
        { field: 'email', headerName: 'Email Address', width: 250, flex: 1 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon color="primary" />}
                    label="Edit"
                    onClick={() => handleOpen(params.row)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon color="error" />}
                    label="Delete"
                    onClick={() => handleDelete(params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{ padding: "40px", maxWidth: '1000px', margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    Databricks User Directory
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                    Add User
                </Button>
            </Box>

            <Paper sx={{ height: 500, width: '100%', boxShadow: 3 }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    loading={loading}
                    pageSizeOptions={[5, 10]}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    sx={{ border: 0 }}
                />
            </Paper>

            {/* Add/Edit Modal */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField label="Name" value={currentUser.name} onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })} />
                    <TextField label="Email" value={currentUser.email} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <LoadingButton
                        onClick={handleSave}
                        loading={saving}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                    >
                        Save
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default App;
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Divider,
  Paper,
  Container
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Components aur Services import karein
import { type Contract, initialContract } from './types/contract';
import { contractService } from './services/api';
import { ContractForm } from './components/ContractForm';

function App() {
  // State Management
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [formData, setFormData] = useState<Contract>(initialContract);
  const [tabValue, setTabValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // API se data load karne ka function
  const loadContracts = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const data = await contractService.getAll();
      setContracts(data);
    } catch (err) {
      console.error("Failed to load contracts:", err);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  // Save Handle Logic
  const handleSaveDeal = async () => {
    if (!formData.analystName || !formData.date) {
      alert("Please fill in basic details like Analyst Name and Date.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await contractService.create(formData);
      if (response.ok) {
        setFormData(initialContract); // Form reset karein
        await loadContracts(); // List refresh karein
        alert("Deal Saved Successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to save"}`);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      try {
        await contractService.delete(id);
        loadContracts();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', pb: 10 }}>
      {/* Top Action Bar */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
        p: 2,
        bgcolor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <LoadingButton
          loading={isSaving}
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveDeal}
          sx={{ bgcolor: '#3f51b5', '&:hover': { bgcolor: '#303f9f' } }}
        >
          Save Deal
        </LoadingButton>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
        >
          Submit Final Scenario
        </Button>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          sx={{ borderColor: '#ccc', color: '#666' }}
        >
          Export Excel
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#1a237e' }}>
          Advanced Pricing Deal Analyzer
        </Typography>

        {/* Navigation Tabs */}
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 4,
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '1rem' }
          }}
        >
          <Tab label="1. Setup & Scenarios" />
          <Tab label="2. Pricing & Floors" />
          <Tab label="3. Impact Analysis" />
          <Tab label="4. Approvals" />
        </Tabs>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Box>
            {/* Form Section */}
            <ContractForm data={formData} onChange={setFormData} />

            {/* Saved List Section */}
            <Typography variant="h6" sx={{ mt: 5, mb: 2, fontWeight: 700, color: '#444' }}>
              2. Saved Contracts
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {isDataLoading ? (
              <Typography sx={{ textAlign: 'center', py: 5 }}>Loading contracts...</Typography>
            ) : contracts.length === 0 ? (
              <Paper sx={{ p: 5, textAlign: 'center', borderStyle: 'dashed', borderWidth: 2 }}>
                <Typography color="text.secondary">No saved contracts found. Create your first deal above.</Typography>
              </Paper>
            ) : (
              contracts.map((contract) => (
                <Paper
                  key={contract.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    transition: '0.2s',
                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {contract.analystName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contract.customerSize} | {contract.therapySelection}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'right', mr: 5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                      {contract.dealValue || "0K"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Est. Value</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ bgcolor: '#2e7d32', borderRadius: '4px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ bgcolor: '#d32f2f', borderRadius: '4px' }}
                      onClick={() => handleDelete(contract.id!)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              ))
            )}
          </Box>
        )}

        {tabValue !== 0 && (
          <Paper sx={{ p: 10, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Tab {tabValue + 1} content is under development.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default App;
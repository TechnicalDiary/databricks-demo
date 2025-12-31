import { Grid, TextField, Paper, Typography } from '@mui/material'; // Standard Grid import
import { type Contract } from '../types/contract';

interface Props {
    data: Contract;
    onChange: (newData: Contract) => void;
}

export const ContractForm = ({ data, onChange }: Props) => {
    const handleChange = (field: keyof Contract) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...data, [field]: e.target.value });
    };

    return (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
                1. Contract Metadata & Setup
            </Typography>

            {/* MUI v7 standard Grid syntax */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth label="Analyst Name" variant="filled" value={data.analystName} onChange={handleChange('analystName')} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth type="date" variant="filled" value={data.date} onChange={handleChange('date')} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth label="Current Market Share (%)" variant="filled" value={data.marketShare} onChange={handleChange('marketShare')} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth label="Customer Size & Type" variant="filled" value={data.customerSize} onChange={handleChange('customerSize')} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth label="Operating Unit" variant="filled" value={data.operatingUnit} onChange={handleChange('operatingUnit')} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField fullWidth label="Therapy Selection" variant="filled" value={data.therapySelection} onChange={handleChange('therapySelection')} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <TextField fullWidth multiline rows={3} label="Anecdotal Negotiation Notes" variant="filled" value={data.notes} onChange={handleChange('notes')} />
                </Grid>
            </Grid>
        </Paper>
    );
};
export interface Contract {
    id?: number | string;
    analystName: string;
    date: string;
    marketShare: string;
    customerSize: string;
    operatingUnit: string;
    therapySelection: string;
    notes: string;
    dealValue: string;
}

export const initialContract: Contract = {
    analystName: '',
    date: new Date().toISOString().split('T')[0],
    marketShare: '',
    customerSize: '',
    operatingUnit: '',
    therapySelection: '',
    notes: '',
    dealValue: '0K'
};
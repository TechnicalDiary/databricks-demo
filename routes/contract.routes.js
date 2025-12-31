import express from "express";
import { executeQuery } from "../services/databricks.service.js";

const router = express.Router();

/**
 * GET: /api/contracts
 * Saare contracts fetch karne ke liye
 */
router.get("/", async (req, res) => {
    try {
        const data = await executeQuery("SELECT * FROM workspace.default.contracts ORDER BY id DESC");

        // Frontend compatibility (snake_case to camelCase mapping)
        const formattedData = data.map(row => ({
            id: row.id,
            analystName: row.analyst_name,
            date: row.contract_date,
            marketShare: row.market_share,
            customerSize: row.customer_size,
            operatingUnit: row.operating_unit,
            therapySelection: row.therapy_selection,
            notes: row.notes,
            dealValue: row.deal_value
        }));

        res.json(formattedData);
    } catch (err) {
        console.error('Fetch Error:', err);
        res.status(500).json({ error: "Failed to fetch contracts", details: err.message });
    }
});

/**
 * POST: /api/contracts
 * Naya contract insert karne ke liye
 */
router.post("/", async (req, res) => {
    const {
        analystName, date, marketShare, customerSize,
        operatingUnit, therapySelection, notes, dealValue
    } = req.body;

    try {
        const query = `
            INSERT INTO workspace.default.contracts 
            (analyst_name, contract_date, market_share, customer_size, operating_unit, therapy_selection, notes, deal_value) 
            VALUES 
            ('${analystName}', '${date}', '${marketShare}', '${customerSize}', '${operatingUnit}', '${therapySelection}', '${notes}', '${dealValue || '0K'}')
        `;

        await executeQuery(query);
        res.status(201).json({ message: "Contract saved successfully" });
    } catch (err) {
        console.error('Insert Error:', err);
        res.status(500).json({ error: "Failed to save contract", details: err.message });
    }
});

/**
 * DELETE: /api/contracts/:id
 * Specific contract delete karne ke liye
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const query = `DELETE FROM workspace.default.contracts WHERE id = ${id}`;
        await executeQuery(query);
        res.json({ message: "Contract deleted successfully" });
    } catch (err) {
        console.error('Delete Error:', err);
        res.status(500).json({ error: "Failed to delete contract" });
    }
});

export default router;
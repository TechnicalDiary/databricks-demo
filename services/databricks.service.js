const { DBSQLClient } = require('@databricks/sql');

/**
 * Executes a SQL query against a Databricks SQL Warehouse
 * @param {string} query - The SQL statement to run
 */
async function executeQuery(query) {
    // Validate that environment variables are present
    if (!process.env.DATABRICKS_HOST || !process.env.DATABRICKS_WAREHOUSE_ID || !process.env.DATABRICKS_TOKEN) {
        throw new Error("Missing required Databricks environment variables. Check your app.yaml or App settings.");
    }

    const client = new DBSQLClient();

    // Construct the correct HTTP path for the warehouse
    const warehousePath = `/sql/1.0/warehouses/${process.env.DATABRICKS_WAREHOUSE_ID}`;

    try {
        await client.connect({
            host: process.env.DATABRICKS_HOST.replace('https://', ''), // Remove https:// if present
            path: warehousePath,
            token: process.env.DATABRICKS_TOKEN
        });

        const session = await client.openSession();

        // Execute the statement
        const queryOperation = await session.executeStatement(query, {
            runAsync: true,
            maxRows: 1000 // Optional: limit rows for performance
        });

        // Fetch the data
        const result = await queryOperation.fetchAll();

        // Clean up resources
        await queryOperation.close();
        await session.close();

        return result;
    } catch (error) {
        console.error("Databricks SQL Execution Error:", error);
        throw error;
    } finally {
        // Always close the client connection
        await client.close();
    }
}

module.exports = { executeQuery };
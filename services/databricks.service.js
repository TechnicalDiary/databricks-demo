const { DBSQLClient } = require('@databricks/sql');

// Token ab hum function argument mein pass karenge
async function executeQuery(query, userToken) {
    const client = new DBSQLClient();
    try {
        await client.connect({
            host: process.env.DATABRICKS_HOST,
            path: `/sql/1.0/warehouses/${process.env.DATABRICKS_WAREHOUSE_ID}`,
            token: userToken // User ka token jo header se aaya
        });

        const session = await client.openSession();
        const queryOperation = await session.executeStatement(query);
        const result = await queryOperation.fetchAll();

        await queryOperation.close();
        await session.close();
        return result;
    } catch (error) {
        console.error("Query Error:", error);
        throw error;
    } finally {
        await client.close();
    }
}

module.exports = { executeQuery };
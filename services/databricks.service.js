const { DBSQLClient } = require('@databricks/sql');
const axios = require('axios');

async function getAppToken() {
    // Note: This URL works specifically for Databricks Apps
    const tokenUrl = `https://${process.env.DATABRICKS_HOST}/oidc/v1/token`;

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('scope', 'all-apis');

    const response = await axios.post(tokenUrl, params, {
        auth: {
            username: process.env.DATABRICKS_CLIENT_ID,
            password: process.env.DATABRICKS_CLIENT_SECRET
        }
    });
    return response.data.access_token;
}

async function executeQuery(query) {
    const client = new DBSQLClient();
    try {
        const token = await getAppToken();
        await client.connect({
            host: process.env.DATABRICKS_HOST,
            path: `/sql/1.0/warehouses/${process.env.DATABRICKS_WAREHOUSE_ID}`,
            token: token
        });

        const session = await client.openSession();
        const queryOperation = await session.executeStatement(query);
        const result = await queryOperation.fetchAll();
        await queryOperation.close();
        await session.close();
        return result;
    } catch (error) {
        console.error("SQL Error:", error.response?.data || error.message);
        throw error;
    } finally {
        await client.close();
    }
}

module.exports = { executeQuery };
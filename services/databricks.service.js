const { DBSQLClient } = require('@databricks/sql');
const axios = require('axios');

async function getAppToken() {
    try {
        const response = await axios.post(
            `https://${process.env.DATABRICKS_HOST}/oidc/v1/token`,
            new URLSearchParams({
                'grant_type': 'client_credentials',
                'scope': 'all-apis'
            }),
            {
                auth: {
                    username: process.env.DATABRICKS_CLIENT_ID,
                    password: process.env.DATABRICKS_CLIENT_SECRET
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Auth Error:", error.response?.data || error.message);
        throw new Error("App could not authenticate itself");
    }
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
    } finally {
        await client.close();
    }
}

module.exports = { executeQuery };
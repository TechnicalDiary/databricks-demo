const { DBSQLClient } = require('@databricks/sql');
const axios = require('axios');

async function getAccessToken() {
    try {
        const host = process.env.DATABRICKS_HOST;
        const clientId = process.env.DATABRICKS_CLIENT_ID;
        const clientSecret = process.env.DATABRICKS_CLIENT_SECRET;
        if (!host) {
            console.error("Host not found");
            throw new Error("Host not found");
        } else if (!clientId) {
            console.error("ClientId not found");
            throw new Error("ClientId not found");
        } else if (!clientSecret) {
            console.error("Client secredt not found");
            throw new Error("Client secredt not found");
        }
        console.log('ENV:', process.env)
        // Databricks OAuth token endpoint call karein
        const response = await axios.post(
            `https://${host}/oidc/token`,
            new URLSearchParams({
                'grant_type': 'client_credentials',
                'scope': 'all-apis'
            }),
            {
                auth: {
                    username: clientId,
                    password: clientSecret
                }
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Token Fetch Error:", error.response?.data || error.message);
        throw new Error("Could not fetch OAuth token");
    }
}

async function executeQuery(query) {
    const client = new DBSQLClient();
    try {
        const token = await getAccessToken();

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
        console.error("Query Execution Error:", error);
        throw error;
    } finally {
        await client.close();
    }
}

module.exports = { executeQuery };
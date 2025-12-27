const { DBSQLClient } = require('@databricks/sql');

<<<<<<< HEAD
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
=======
// Token ab hum function argument mein pass karenge
async function executeQuery(query, userToken) {
    const client = new DBSQLClient();
    try {
>>>>>>> refs/remotes/origin/main
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
<<<<<<< HEAD
=======
    } catch (error) {
        console.error("Query Error:", error);
        throw error;
>>>>>>> refs/remotes/origin/main
    } finally {
        await client.close();
    }
}

module.exports = { executeQuery };
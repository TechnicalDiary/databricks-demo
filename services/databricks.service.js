import axios from "axios";

/* ===============================
   ENV CONFIG
================================ */
const DATABRICKS_HOST = process.env.DATABRICKS_HOST;
const CLIENT_ID = process.env.DATABRICKS_CLIENT_ID;
const CLIENT_SECRET = process.env.DATABRICKS_CLIENT_SECRET;

/* ===============================
   GET OAUTH ACCESS TOKEN
================================ */
const getAccessToken = async () => {
    const tokenUrl = `https://${DATABRICKS_HOST}/oidc/token`;

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("scope", "all-apis");

    const response = await axios.post(tokenUrl, params, {
        auth: {
            username: CLIENT_ID,
            password: CLIENT_SECRET,
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    return response.data.access_token;
};

/* ===============================
   EXECUTE SQL QUERY
================================ */
export const executeQuery = async (sql) => {
    try {
        const accessToken = await getAccessToken();

        const response = await axios.post(
            `https://${DATABRICKS_HOST}/api/2.0/sql/statements`,
            {
                statement: sql,
                warehouse_id: process.env.DATABRICKS_WAREHOUSE_ID,
                wait_timeout: "30s",
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.result?.data_array || [];
    } catch (error) {
        console.error(
            "Databricks query error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

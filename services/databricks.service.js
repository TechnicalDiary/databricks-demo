import axios from "axios";
import { databricksConfig } from "../config/databricks.config.js";

export const executeQuery = async (sql) => {
    try {
        const response = await axios.post(
            `${databricksConfig.host}/api/2.0/sql/statements`,
            {
                statement: sql,
                warehouse_id: databricksConfig.warehouseId
            },
            {
                headers: {
                    Authorization: `Bearer ${databricksConfig.token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log(response);


        return response.data.result.data_array;
    } catch (error) {
        console.error("Databricks query error:", error.message);
        throw error;
    }
};
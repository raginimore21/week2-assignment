
require("dotenv").config();

const sql = require("mssql/msnodesqlv8");

const connectionString =
    "Driver={ODBC Driver 18 for SQL Server};" +
    `Server=${process.env.DB_SERVER};` +
    `Database=${process.env.DB_NAME};` +
    "Trusted_Connection=Yes;" +
    "TrustServerCertificate=Yes;";

const config = {
    driver: "msnodesqlv8",
    connectionString: connectionString
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Connected to SQL Server successfully!");
        return pool;
    })
    .catch(error => {
        console.error("Database connection failed:", error.message);
        throw error;
    });

module.exports = { sql, poolPromise };


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { poolPromise } = require("./db");
const employeeRoutes = require("./employeeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Employee Management API is running!");
});

app.get("/api/test-db", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(
            "SELECT DB_NAME() AS databaseName"
        );

        res.json({
            message: "Database connection successful",
            database: result.recordset[0].databaseName
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database connection failed" });
    }
});

app.use("/api/employees", employeeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

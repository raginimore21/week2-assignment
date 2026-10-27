
const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("./db");

// GET: Retrieve all employees
router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(
            "SELECT * FROM Employees ORDER BY Id DESC"
        );

        res.json(result.recordset);
    } catch (error) {
        console.error("Fetch employees error:", error);
        res.status(500).json({ message: "Failed to fetch employees" });
    }
});

// GET: Retrieve one employee
router.get("/:id", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, Number(req.params.id))
            .query("SELECT * FROM Employees WHERE Id = @id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error("Fetch employee error:", error);
        res.status(500).json({ message: "Failed to fetch employee" });
    }
});

// POST: Add a new employee
router.post("/", async (req, res) => {
    const { Name, Department, Role, Salary, JoinDate } = req.body;

    if (!Name?.trim() || !Department?.trim() || !Role?.trim() ||
        Salary === "" || Salary === undefined || JoinDate === undefined || !JoinDate) {
        return res.status(400).json({
            message: "Please provide all employee details"
        });
    }

    const salary = Number(Salary);
    const date = new Date(`${JoinDate}T00:00:00Z`);

    if (!Number.isFinite(salary) || salary < 0 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(JoinDate) ||
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== JoinDate) {
        return res.status(400).json({
            message: "Enter a valid salary and join date"
        });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("Name", sql.NVarChar(100), Name.trim())
            .input("Department", sql.NVarChar(100), Department.trim())
            .input("Role", sql.NVarChar(100), Role.trim())
            .input("Salary", sql.Decimal(10, 2), salary)
            .input("JoinDate", sql.Date, JoinDate)
            .query(`
                INSERT INTO Employees (Name, Department, Role, Salary, JoinDate)
                OUTPUT INSERTED.*
                VALUES (@Name, @Department, @Role, @Salary, @JoinDate)
            `);

        res.status(201).json({
            message: "Employee added successfully",
            employee: result.recordset[0]
        });
    } catch (error) {
        console.error("Add employee error:", error);
        res.status(500).json({ message: "Failed to add employee" });
    }
});

// PUT: Update an employee
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { Name, Department, Role, Salary, JoinDate } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid employee ID" });
    }

    if (!Name?.trim() || !Department?.trim() || !Role?.trim() ||
        Salary === "" || Salary === undefined || !JoinDate) {
        return res.status(400).json({
            message: "Please provide all employee details"
        });
    }

    const salary = Number(Salary);
    const date = new Date(`${JoinDate}T00:00:00Z`);

    if (!Number.isFinite(salary) || salary < 0 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(JoinDate) ||
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== JoinDate) {
        return res.status(400).json({
            message: "Enter a valid salary and join date"
        });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .input("Name", sql.NVarChar(100), Name.trim())
            .input("Department", sql.NVarChar(100), Department.trim())
            .input("Role", sql.NVarChar(100), Role.trim())
            .input("Salary", sql.Decimal(10, 2), salary)
            .input("JoinDate", sql.Date, JoinDate)
            .query(`
                UPDATE Employees
                SET Name = @Name,
                    Department = @Department,
                    Role = @Role,
                    Salary = @Salary,
                    JoinDate = @JoinDate
                OUTPUT INSERTED.*
                WHERE Id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({
            message: "Employee updated successfully",
            employee: result.recordset[0]
        });
    } catch (error) {
        console.error("Update employee error:", error);
        res.status(500).json({ message: "Failed to update employee" });
    }
});

// DELETE: Remove an employee
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid employee ID" });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                DELETE FROM Employees
                OUTPUT DELETED.Id
                WHERE Id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Delete employee error:", error);
        res.status(500).json({ message: "Failed to delete employee" });
    }
});

module.exports = router;


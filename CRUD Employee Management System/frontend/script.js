
const API_URL = "http://localhost:5000/api/employees";

const form = document.getElementById("employeeForm");
const employeeId = document.getElementById("employeeId");
const nameInput = document.getElementById("name");
const departmentInput = document.getElementById("department");
const roleInput = document.getElementById("role");
const salaryInput = document.getElementById("salary");
const joinDateInput = document.getElementById("joinDate");
const tableBody = document.getElementById("employeeTableBody");
const totalEmployees = document.getElementById("totalEmployees");
const searchInput = document.getElementById("searchInput");
const statusMessage = document.getElementById("statusMessage");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const formTitle = document.getElementById("formTitle");

let employees = [];
let sortField = "Id";
let sortDirection = "desc";

function showMessage(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

function formatDate(value) {
    if (!value) return "";
    return String(value).slice(0, 10);
}

function formatSalary(value) {
    return Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

async function request(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

async function loadEmployees() {
    tableBody.innerHTML =
        '<tr><td colspan="7">Loading employees...</td></tr>';

    try {
        employees = await request(API_URL);
        renderEmployees();
        showMessage("");
    } catch (error) {
        tableBody.innerHTML =
            '<tr><td colspan="7">Could not load employees.</td></tr>';
        showMessage(error.message, "error");
    }
}

function renderEmployees() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filtered = employees.filter(employee =>
        [
            employee.Name,
            employee.Department,
            employee.Role,
            employee.Id
        ].some(value => String(value ?? "").toLowerCase().includes(searchTerm))
    );

    filtered.sort((a, b) => {
        let first = a[sortField];
        let second = b[sortField];

        if (sortField === "Salary" || sortField === "Id") {
            first = Number(first);
            second = Number(second);
        } else {
            first = String(first ?? "").toLowerCase();
            second = String(second ?? "").toLowerCase();
        }

        if (first < second) return sortDirection === "asc" ? -1 : 1;
        if (first > second) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    totalEmployees.textContent = employees.length;

    if (filtered.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="7">No employees found.</td></tr>';
        return;
    }

    tableBody.replaceChildren();

    filtered.forEach(employee => {
        const row = document.createElement("tr");

        const values = [
            employee.Id,
            employee.Name,
            employee.Department,
            employee.Role,
            `₹${formatSalary(employee.Salary)}`,
            formatDate(employee.JoinDate)
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "action-button edit-button";
        editButton.addEventListener("click", () => editEmployee(employee.Id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "action-button delete-button";
        deleteButton.addEventListener("click", () => deleteEmployee(employee.Id));

        actionsCell.append(editButton, deleteButton);
        row.appendChild(actionsCell);
        tableBody.appendChild(row);
    });
}

function resetForm() {
    form.reset();
    employeeId.value = "";
    formTitle.textContent = "Add New Employee";
    saveButton.textContent = "Add Employee";
    cancelButton.hidden = true;
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const payload = {
        Name: nameInput.value.trim(),
        Department: departmentInput.value.trim(),
        Role: roleInput.value.trim(),
        Salary: salaryInput.value,
        JoinDate: joinDateInput.value
    };

    if (!payload.Name || !payload.Department || !payload.Role ||
        payload.Salary === "" || !payload.JoinDate) {
        showMessage("Please complete all fields.", "error");
        return;
    }

    if (!Number.isFinite(Number(payload.Salary)) ||
        Number(payload.Salary) < 0) {
        showMessage("Please enter a valid, non-negative salary.", "error");
        return;
    }

    const isEditing = Boolean(employeeId.value);
    const url = isEditing ? `${API_URL}/${employeeId.value}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    saveButton.disabled = true;
    showMessage(isEditing ? "Updating employee..." : "Adding employee...");

    try {
        const result = await request(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        resetForm();
        await loadEmployees();
        showMessage(result.message || "Saved successfully.", "success");
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        saveButton.disabled = false;
    }
});

function editEmployee(id) {
    const employee = employees.find(item => item.Id === id);
    if (!employee) return;

    employeeId.value = employee.Id;
    nameInput.value = employee.Name;
    departmentInput.value = employee.Department;
    roleInput.value = employee.Role;
    salaryInput.value = employee.Salary;
    joinDateInput.value = formatDate(employee.JoinDate);

    formTitle.textContent = "Edit Employee";
    saveButton.textContent = "Update Employee";
    cancelButton.hidden = false;

    form.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteEmployee(id) {
    const employee = employees.find(item => item.Id === id);
    if (!employee) return;

    const confirmed = window.confirm(
        `Are you sure you want to delete ${employee.Name}?`
    );

    if (!confirmed) return;

    try {
        const result = await request(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        await loadEmployees();
        showMessage(result.message || "Employee deleted successfully.", "success");
    } catch (error) {
        showMessage(error.message, "error");
    }
}

searchInput.addEventListener("input", renderEmployees);

document.querySelectorAll(".sort-button").forEach(button => {
    button.addEventListener("click", () => {
        const field = button.dataset.sort;

        if (sortField === field) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortField = field;
            sortDirection = "asc";
        }

        renderEmployees();
    });
});

cancelButton.addEventListener("click", resetForm);

loadEmployees();

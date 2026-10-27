# week2-assignment

# Task 1-Responsive Company Website-BlueTech

## About the Project

BlueTech is a professional and responsive company website developed as part of my Week 2 internship assignment. The website presents company information, services, and contact details using a clean blue-and-white design.

## Objectives

- Develop a professional company website.
- Create responsive web pages for desktop, tablet, and mobile devices.
- Display company information and services.
- Implement a contact form with input validation.
- Practice HTML5, CSS3, JavaScript, and Bootstrap 5.

## Technologies Used

- **HTML5** – Creates the structure of the website.
- **CSS3** – Adds styling, layouts, colors, and responsive design.
- **JavaScript** – Handles form validation and interactive functionality.
- **Bootstrap 5.3.3** – Provides responsive layouts and navigation components.

## Website Pages

### 1. Home
Introduces BlueTech with a hero section and highlights the company's services.

### 2. About Us
Provides company information, its mission, vision, and values.

### 3. Services
Displays the services offered by the company through service cards.

### 4. Contact Us
Provides contact information and a validated contact form with the following fields:
- Name
- Email
- Subject
- Message

## Key Features

- Responsive navigation bar.
- Professional blue-and-white color theme.
- Mobile-friendly design.
- Company introduction and service sections.
- Contact form with required-field and email-format validation.
- JavaScript form validation and feedback messages.
- Consistent header and footer.
- Responsive layouts using Bootstrap and CSS media queries.

## Project Structure

```text
week2-assignment/
│
├── index.html
├── about.html
├── services.html
├── contact.html
├── style.css
├── script.js
├── README.md
└── images/
    ├── hero-image.jpg
    ├── about.jpg
    └── services.jpg
```

## How to Run the Project Locally

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Make sure all required images are available in the images folder.
4. Open `index.html` in your browser or run it using the Live Server extension.
5. Navigate through the Home, About Us, Services, and Contact Us pages.

## Live Website

[View BlueTech Responsive Company Website](https://raginimore21.github.io/week2-assignment/responsive-company-website/)

## Contact Form Validation

The contact form validates user input before submission. Required fields must be completed, and the email address must follow a valid format.

# Task2-CRUD Employee Management System

## 1. Project Overview

The CRUD Employee Management System is a web application designed to help HR administrators manage employee records efficiently.

The application allows users to add, view, search, sort, edit, and delete employee information through a simple and responsive user interface. Employee records are stored in a Microsoft SQL Server database.

## 2. Objectives

- Develop a user-friendly employee management interface.
- Implement Create, Read, Update, and Delete (CRUD) operations.
- Connect the frontend to a backend REST API.
- Store employee records in a relational database.
- Implement search, sorting, and input validation.
- Test API endpoints using Postman.

## 3. Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Fetch API

### Backend
- Node.js
- Express.js
- CORS
- dotenv

### Database
- Microsoft SQL Server
- SQL Server Management Studio (SSMS)
- mssql
- msnodesqlv8
- ODBC Driver 18 for SQL Server

### API Testing
- Postman

### Development Tools
- Visual Studio Code
- Google Chrome
- Git and GitHub

## 4. Project Structure

```text
crud-employee-management/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── employeeRoutes.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── database/
│   └── schema.sql
├── screenshots/
└── README.md
```

Note: Create the `database` and `screenshots` folders and add the corresponding files if they do not already exist. Do not upload `.env` to a public GitHub repository.

## 5. Features

### Employee Management
- Add new employees.
- View employee records in a table.
- Edit employee information using a pre-filled form.
- Delete employee records with a confirmation dialog.

### Search and Sorting
- Search employee records by name, department, role, or ID.
- Sort employee table columns.

### Validation and Feedback
- Validate required employee fields.
- Prevent invalid salary values.
- Display success or error messages for operations.

### Database Integration
- Store employee records in SQL Server.
- Retrieve records using backend API endpoints.
- Save changes to the database.

## 6. Database Design

**Database name:** `EmployeeManagement`

**Table name:** `Employees`

| Column | Data Type | Description |
|---|---|---|
| Id | INT IDENTITY | Primary key |
| Name | NVARCHAR(100) | Employee name |
| Department | NVARCHAR(100) | Employee department |
| Role | NVARCHAR(100) | Job role |
| Salary | DECIMAL(10,2) | Employee salary |
| JoinDate | DATE | Employee joining date |
| CreatedAt | DATETIME2 | Record creation timestamp |

## 7. REST API Endpoints

Base URL: `http://localhost:5000/api/employees`

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | Retrieve all employees |
| GET | `/api/employees/:id` | Retrieve an employee by ID |
| POST | `/api/employees` | Add a new employee |
| PUT | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |

## 8. Installation and Setup

### Prerequisites

Install the following software:

- Node.js and npm
- Microsoft SQL Server
- SQL Server Management Studio (SSMS)
- Visual Studio Code
- ODBC Driver 18 for SQL Server

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd crud-employee-management
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### Step 2: Create the Database

Open SQL Server Management Studio and connect to your local SQL Server instance.

Create the database and table using the following SQL script:

```sql
CREATE DATABASE EmployeeManagement;
GO

USE EmployeeManagement;
GO

CREATE TABLE Employees (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Department NVARCHAR(100) NOT NULL,
    Role NVARCHAR(100) NOT NULL,
    Salary DECIMAL(10,2) NOT NULL CHECK (Salary >= 0),
    JoinDate DATE NOT NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO
```

Save this script as `database/schema.sql` if you have not already saved it.

If the database and table already exist, do not run the creation script again.

### Step 3: Install Backend Dependencies

Open the terminal in Visual Studio Code and run:

```bash
cd backend
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DB_SERVER=localhost\SQLEXPRESS01
DB_NAME=EmployeeManagement
```

Use the correct SQL Server instance name for your computer. This configuration uses Windows Authentication through the `msnodesqlv8` driver.

### Step 5: Start the Backend Server

From the `backend` folder, run:

```bash
node server.js
```

Expected terminal output:

```text
Server running at http://localhost:5000
Connected to SQL Server successfully!
```

The exact order of these messages may vary.

### Step 6: Open the Frontend

Open `frontend/index.html` in your browser. Alternatively, use the Live Server extension in Visual Studio Code.

Keep the backend server running while using the website.

### Step 7: Test the Backend

Open the following URL in your browser:

`http://localhost:5000/api/test-db`

Then test the employee API using Postman or the website.

## 9. Testing

Test the following scenarios before submission:

1. Add an employee with valid details.
2. View employee records in the table.
3. Search for an employee by name or department.
4. Sort the table by different columns.
5. Edit an employee and verify the changes.
6. Delete an employee after confirming the action.
7. Submit invalid or empty values and check validation messages.
8. Verify that changes are reflected in SQL Server.
9. Test API endpoints using Postman.
10. Check the application's response when the backend is unavailable.






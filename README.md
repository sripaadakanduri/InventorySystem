# Inventory Management System

A full-stack Inventory & Order Management application built using React and ASP.NET Core.  
The application supports authentication, product management, order processing and inventory tracking.

---

# Features

- User Authentication & Authorization
- JWT Token Security
- Product Management
- Inventory Tracking
- Order Management
- Responsive UI with Tailwind CSS
- REST API Integration
- Layered Architecture

---

# Tech Stack

## Frontend
- React
- Tailwind CSS
- Axios
- React Router
- Lucide React

## Backend
- ASP.NET Core
- Entity Framework Core
- Swagger

## Database
- SQL Server

---

# Required Installations

## Install Node.js & npm

https://nodejs.org/

Verify installation:
```bash
node -v
npm -v
```

---

## Install .NET SDK

https://dotnet.microsoft.com/en-us/download

Verify installation:
```bash
dotnet --version
```

---

# Frontend Package Installations

Navigate to:
```bash
InventorySystem.React
```

Install dependencies:
```bash
npm install
```

Additional packages used:
```bash
npm install axios
npm install react-router-dom
npm install @microsoft/signalr
npm install lucide-react
npm install tailwindcss
```

---

# Backend Package Installations

Navigate to:
```bash
InventorySystem.API
```

Install required NuGet packages:
```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Swashbuckle.AspNetCore
```

---

# Running the Application

## Run Backend

Navigate to:
```bash
InventorySystem.API
```

Run:
```bash
dotnet run
```

Backend:
```text
https://localhost:7236
```

Swagger:
```text
https://localhost:7236/swagger
```

---

## Run Frontend

Navigate to:
```bash
InventorySystem.React.Client
```

Run:
```bash
npm run dev
```

Frontend:
```text
http://localhost:5176
```

---

# Database Migration

Run:
```bash
dotnet ef database update
```

---

# Authentication

- JWT Authentication
- SHA256 Password Hashing
- Protected API Routes
- Role-Based Authorization

---


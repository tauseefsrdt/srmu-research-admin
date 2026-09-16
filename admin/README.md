# SRMU Research Admin Suite

This directory contains the complete Admin Suite for managing the University Research Repository:

```
admin/
├── frontend/    # React + Vite + TypeScript + Tailwind CSS Admin Dashboard
└── backend/     # Spring Boot + Spring Data JPA + MySQL REST API Backend
```

## Running the Application

### 1. Run the Backend (`admin/backend`)
```bash
cd admin/backend
./mvnw.cmd spring-boot:run
```
- API Base URL: `http://localhost:8080/api/v1`
- H2 Web Console: `http://localhost:8080/h2-console`
- MySQL Profile: `./mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql`

### 2. Run the Admin Frontend (`admin/frontend`)
```bash
cd admin/frontend
npm install
npm run dev
```
- Admin Dashboard URL: `http://localhost:5174` (or `http://localhost:5173`)

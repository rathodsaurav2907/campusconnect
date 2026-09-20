# CampusConnect

A student management, course registry, and academic enrollment platform built with Node.js, Express, and MongoDB.

Part of the **[Microservices & ML Data Platform Portfolio](../README.md)**.

---

## 🌟 Overview

CampusConnect provides academic administrative capabilities for university institutions, modeling intricate multi-collection relationships (Students, Courses, Department Registries, and Enrollment histories) with relational integrity in MongoDB.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js 22 (LTS)
* **Framework:** Express.js
* **Database:** MongoDB 8.0 with Mongoose ODM
* **Validation:** Joi schema validation
* **Testing:** Jest, Supertest, MongoMemoryServer
* **Containerization:** Docker & Docker Compose (Multi-stage Node Alpine)

---

## 🚀 Quick Start

### 1. Using Docker (Recommended)

```bash
# Start API (port 4002) and MongoDB (port 27019)
docker compose up --build -d

# Verify health status
curl http://localhost:4002/health

# View live logs
docker compose logs -f api
```

### 2. Running Locally

```bash
npm install
cp .env.example .env

# Seed initial courses, students, and enrollments
npm run seed

# Start development server
npm run dev

# Run automated tests
npm test
```

---

## 🔌 API Endpoints

### Health Check
* `GET /health` - Service health, uptime, and system status

### Students (`/api/students`)
* `POST /api/students` - Register new student profile
* `GET /api/students` - Query students (department, year, pagination)
* `GET /api/students/:id` - Fetch student profile and GPA
* `PUT /api/students/:id` - Update student profile
* `DELETE /api/students/:id` - Remove student record

### Courses (`/api/courses`)
* `POST /api/courses` - Create new academic course
* `GET /api/courses` - List available courses with capacity and credits
* `GET /api/courses/:id` - Get specific course syllabus and prerequisites
* `PUT /api/courses/:id` - Update course metadata

### Enrollments (`/api/enrollments`)
* `POST /api/enrollments` - Enroll student in course (validates prerequisites & capacity)
* `GET /api/enrollments` - Query enrollment histories
* `PATCH /api/enrollments/:id/grade` - Submit academic grade
* `DELETE /api/enrollments/:id` - Drop/withdraw from course

---

## 🧪 Testing

```bash
npm test
```
Executes Jest test suites against an in-memory MongoDB instance to validate constraint enforcement and error handling.

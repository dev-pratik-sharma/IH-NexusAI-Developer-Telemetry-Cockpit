# Nexus AI Engine — REST API Backend

A production-grade, asynchronous MVC backend infrastructure built to manage relational project workflows and task schedules. This subsystem serves as **Task 2: Users, Projects & Tasks REST API Backend Development** for the Innovation Hacks Internship Program.

## ⚙️ Core Technical Stack

- **Node.js & Express.js:** Fast, minimal web application router framework.
- **Sequelize ORM:** Object-Relational Mapping system facilitating programmatic PostgreSQL table integration.
- **PostgreSQL Hosting:** Managed cloud database engine physically deployed in the **Asia Pacific (Singapore)** region for sub-millisecond execution speeds.
- **CORS & Dotenv:** Cross-Origin Resource Sharing locks and environment token security filters.

## 📂 Architecture Mapping (MVC Flow)

- `src/db.js`: Contains the Sequelize engine abstraction layer managing encrypted cloud handshakes.
- `src/models.js`: Blueprints the physical relational entity tables (`Users`, `Projects`, `Tasks`) and maps foreign key constraints (`hasMany`, `belongsTo`).
- `src/controllers/`: Contains the logical query builders (`getAllProjects`, `createTask`, `updateTask`) to process and return datasets.
- `src/routes/`: Exposes secure API gateway paths (`/api/projects`, `/api/tasks`) binding standard HTTP status methods (GET, POST, PUT, DELETE).
- `src/middleware/`: Holds the central error interceptor (`errorHandler.js`) that safely formats unexpected exceptions into standardized JSON payloads instead of crashing the system runtime.

## 🧪 Active Route Matrix

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Diagnoses runtime and cluster synchronization. | `200 OK` |
| **GET** | `/api/projects` | Fetches active project suites with nested tasks. | `200 OK` |
| **POST** | `/api/projects` | Generates a new project entry with input validation. | `201 Created` |
| **GET** | `/api/tasks` | Retrieves the entire system operational task list. | `200 OK` |
| **POST** | `/api/tasks` | Appends a task to a verified parent project node. | `201 Created` |
| **PUT** | `/api/tasks/:id` | Modifies properties (status, priorities) of a task. | `200 OK` |
| **DELETE** | `/api/tasks/:id`| Destroys an active task sequence permanent entry. | `200 OK` |

## 💻 Native Backend Launch

To boot this Node environment locally:

```bash
# 1. Access the server directory
cd server

# 2. Synchronize dependency structures
npm install

# 3. Fire up the automatic live-reload listener loop
npm run dev
```

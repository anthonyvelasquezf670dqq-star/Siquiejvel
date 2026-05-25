## Plan: Sistema de administración de biblioteca

TL;DR - Crear una aplicación fullstack (backend + frontend) para gestión interna de libros y artículos con CRUD, gestión de usuarios y roles, y gestión de préstamos. Stack elegido: Node.js + Express + MongoDB (Mongoose) para backend, React + Vite para frontend, autenticación JWT con roles administrables. Despliegue en Docker (docker-compose).

**Steps**
1. Inicialización del repositorio y estructura de carpetas (`backend/`, `frontend/`).  
2. Configurar backend: servidor Express, conexión a MongoDB, Mongoose, estructura de carpetas, dotenv.  
3. Definir modelos y migraciones (si aplica): `User`, `Role`, `Book`, `Article`, `Loan` (préstamos).  
4. Implementar autenticación y autorización: registro, login, JWT, refresh tokens opcional, middleware de roles con interfaz para administrar roles.  
5. Endpoints CRUD del API: `/api/books`, `/api/articles`, `/api/users`, `/api/loans`.  
6. Validación y manejo de errores: usar Zod/Joi o express-validator, manejo centralizado de errores y respuestas.  
7. Tests backend: pruebas unitarias y de integración para auth y endpoints CRUD.  
8. Configurar frontend: React + Vite, rutas protegidas, estructura de componentes y servicios HTTP.  
9. Implementar UI: `Login`, `Register`, `Dashboard`, `BooksList`, `BookForm`, `ArticlesList`, `ArticleForm`, `UsersList`, `LoansManagement`.  
10. Integrar con API: servicios axios/fetch, manejo de tokens (localStorage), interceptor para refresh token.  
11. Añadir panel de administración de roles y usuarios (crear/editar roles).  
12. Añadir Dockerfile y `docker-compose.yml` para orquestar MongoDB + API + frontend.  
13. CI básico: pipeline para `lint`, `tests` y `build` (opcional).  
14. Documentación: README con instrucciones de instalación, ejecución y despliegue.

**Relevant files**
- `backend/` — Código del servidor Express, modelos Mongoose, controladores, rutas y tests.  
- `backend/src/models` — `user.model.js`, `role.model.js`, `book.model.js`, `article.model.js`, `loan.model.js`.  
- `backend/src/controllers` — `book.controller.js`, `article.controller.js`, `user.controller.js`, `loan.controller.js`.  
- `backend/src/routes` — `books.js`, `articles.js`, `users.js`, `auth.js`, `loans.js`.  
- `frontend/` — App React creada con Vite.  
- `frontend/src/pages` — `Login`, `Register`, `Dashboard`, `Books`, `BookForm`, `Articles`, `Users`, `Loans`.  
- `docker-compose.yml` — Orquestación de servicios (mongo, api, frontend).

**Verification**
1. Levantar servicios con `docker-compose up --build` y comprobar que MongoDB, API y frontend arrancan.  
2. Tests: ejecutar `npm test` en `backend` y revisar resultados.  
3. Flujo E2E manual: registro → login → crear libro → prestar libro → devolver libro → historial de préstamos.  
4. Linter/format: `eslint`/`prettier` configurados y pasados.

**Decisions / Assumptions**
- Stack confirmado por el usuario: Node.js + Express + MongoDB + React + Vite.  
- Autenticación: JWT con roles administrables.  
- Incluir gestión de préstamos (checkout) y historial.  
- Preparar Docker + docker-compose para desarrollo/despliegue local.

**Further Considerations / Preguntas**
1. ¿Quieres un panel de usuario público (consulta de catálogo sin login) o todo tras autenticación?  
2. ¿Necesitas permisos finos (ej. permisos por acción) o roles simples (`admin`, `librarian`, `user`) son suficientes?  
3. ¿Requieres integración con motores de búsqueda (Elasticsearch) o búsqueda básica en MongoDB es suficiente?  
4. ¿Deseas que implemente pruebas E2E automatizadas (Cypress/Playwright)?

# OwnLibrary

Sistema interno de administración de biblioteca con backend Node.js + Express + MongoDB y frontend React + Vite.

## Estructura

- `backend/` - API REST con autenticación JWT, roles, CRUD de libros, artículos, usuarios y préstamos.
- `frontend/` - Interfaz React para la gestión interna.
- `docker-compose.yml` - Orquestación de MongoDB, backend y frontend.

## Requisitos

- Docker
- Node.js (opcional para desarrollo local sin Docker)

## Ejecutar con Docker

```bash
docker compose up --build
```

Luego abre `http://localhost:5173`.

## Credenciales iniciales

- admin: `admin@ownlibrary.local` / `Admin123!`
- librarian: `librarian@ownlibrary.local` / `Lib12345!`

## Registro y administración

- La pantalla de registro permite crear un usuario `member` desde la UI.
- El panel de usuarios permite crear, editar y eliminar usuarios con roles `admin`, `librarian` o `member`.

## Desarrollo local

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Pruebas backend

```bash
cd backend
npm test
```

## Notas

- El backend expone la API en `http://localhost:5000/api`.
- El frontend usa el token JWT almacenado en `localStorage`.
- Docker usa `backend/.env.example` como referencia para variables de entorno.

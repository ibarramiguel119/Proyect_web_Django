# Plantilla Full-Stack: Django + React + Docker

**Descripción**

Esta carpeta contiene una plantilla base para proyectos full-stack que combinan un backend en **Django** y un frontend en **React**, orquestados con **Docker Compose**. Es una base lista para desarrollo y despliegue, incluyendo soporte para PostgreSQL/PostGIS, Nginx como proxy estático, Certbot para SSL y utilidades comunes (pgAdmin, Gunicorn, Channels).

**Estructura general**

- `Proyect_v1/` - Contenedor del proyecto (ejemplo de implementación)
  - `Backend/` - Proyecto Django
    - `proyect_web_v1/` - settings, manage.py, apps
    - `requirements.txt` - dependencias Python
  - `frontend/` - App React (Create React App)
    - `src/` - código fuente
    - `build/` - build de producción (generado por `npm run build`)
  - `config/` - configuraciones para Nginx y Gunicorn
  - `certbot/` - archivos relacionados con Certbot/SSL
  - `docker-compose.yml` - orquesta servicios: db, web, frontend, nginx, pgadmin

**Tecnologías incluidas**
- Backend: **Django**, Django REST Framework, Channels (WebSockets), djangorestframework-simplejwt
- Base de datos: **PostgreSQL** + **PostGIS**
- Frontend: **React** (Create React App)
- Contenerización: **Docker**, **Docker Compose**
- Web server / proxy: **Nginx**
- Gestión SSL: **Certbot** (Let's Encrypt)
- Administración BD: **pgAdmin**
- Producción Python server: **Gunicorn** (o Daphne/ASGI si usas Channels)

**Objetivo de la plantilla**
- Proveer una base reproducible que incluye lo necesario para iniciar rápidamente: autenticación (JWT), comunicación API REST, build del frontend, y despliegue con Nginx + Docker.
- Servir como referencia para integrar React y Django en desarrollo y producción.

**Requisitos previos**
- Docker y Docker Compose instalados
- Node.js + npm (solo necesaria para desarrollo local o para rebuild del `frontend` si no lo haces dentro de Docker)
- (Opcional) Acceso para añadir usuario al grupo `docker` o ejecutar comandos con `sudo`

**Uso rápido (desarrollo)**
1. Clonar el repo y entrar a la carpeta del proyecto:
```bash
git clone <repo_url>
cd Proyect_v1
```
2. Variables de entorno: crear `.env` en la raíz con al menos:
```env
DJANGO_SECRET_KEY=tu_clave_secreta
DOMAIN=localhost
```
3. Levantar servicios en modo desarrollo (usa `sudo` si tu usuario no tiene permisos Docker):
```bash
docker-compose up --build
```
4. Frontend en desarrollo (opcional fuera de Docker):
```bash
cd frontend
npm install
npm start
# abre http://localhost:3000
```

**Build y despliegue producción (estático)**
1. Generar la build de React (local o dentro del contenedor builder):
```bash
cd frontend
npm install
npm run build
```
2. Reiniciar Docker Compose para que Nginx sirva la carpeta `build/`:
```bash
docker-compose down
docker-compose up -d --build
```
3. Abrir http://localhost para ver la app servida por Nginx (puerto 80)

**Comandos útiles**
- Levantar todo: `docker-compose up --build`
- Levantar en background: `docker-compose up -d --build`
- Parar: `docker-compose down`
- Ver logs: `docker-compose logs -f [servicio]`
- Reconstruir solo frontend: `docker-compose build --no-cache frontend`
- Entrar al contenedor web (Django): `docker-compose exec web bash`

**Notas de seguridad y producción**
- No uses el servidor de desarrollo de Django en producción. Usa Gunicorn (u otro WSGI/ASGI) configurado con un proceso manager.
- Prefiere cookies `httpOnly` para tokens de autenticación en producción; si usas JWT en `localStorage`, asegúrate de mitigar riesgos CSRF/CS.
- Asegúrate de definir `ALLOWED_HOSTS` y de usar variables de entorno para secretos.
- Configura Certbot para emitir certificados y renueva automáticamente.

**Desarrollo local recomendado**
- Ejecuta frontend con `npm start` localmente para hot-reload.
- Ejecuta Django en contenedor o local según prefieras; recuerda sincronizar dependencias desde `requirements.txt`.

**Cómo contribuir**
- Crea una rama feature: `git checkout -b feature/nombre`
- Haz commits pequeños y claros
- Empuja la rama y abre un Pull Request

**Contacto / Autor**
Miguel Ibarra — `ibarramiguel119@gmail.com`

---

## CI/CD con GitHub Actions

Este proyecto incluye pipelines automatizados usando GitHub Actions para validar cambios en cada push y PR.

### Workflows disponibles

**1. CI Pipeline (`.github/workflows/ci.yml`)** — Ejecuta en cada push/PR

- **Backend (Django)**
  - Linting con `flake8`, `black`, `isort`
  - Tests unitarios con pytest
  - Chequeo de seguridad Django (`check --deploy`)
  - Base de datos: PostgreSQL 15 con PostGIS

- **Frontend (React)**
  - Linting con `eslint`
  - Formateo con `prettier`
  - Tests unitarios con Jest
  - Build de producción para validar que compila sin errores
  - Chequeo de tamaño de build (alerta si > 5MB)

- **Docker**
  - Construcción de imágenes backend y frontend

- **Seguridad**
  - Escaneo de vulnerabilidades con Trivy
  - Reportes subidos a GitHub Security tab

**2. Deploy Pipeline (`.github/workflows/deploy.yml`)** — Despliegue automático a producción (opcional)

- Se ejecuta al hacer push a la rama `Django-React`
- Copia código, actualiza imágenes Docker, aplica migraciones
- Requiere configurar secrets en GitHub (DEPLOY_KEY, DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH)

### Configurar CI/CD

1. **Habilitar Actions en GitHub**: ve a `Settings → Actions → General` y selecciona "Allow all actions and reusable workflows"

2. **Para Deploy (opcional)**: ve a `Settings → Secrets and variables → Actions` y agrega:
   - `DEPLOY_KEY`: tu clave SSH privada (para conectar al servidor)
   - `DEPLOY_HOST`: IP o dominio del servidor
   - `DEPLOY_USER`: usuario SSH
   - `DEPLOY_PATH`: ruta del proyecto en el servidor (ej. `/home/deploy/Proyect_web_Django/Proyect_v1`)

3. **Agregar tests**: ve a `Proyect_v1/Backend/proyect_web_v1/base_app/tests.py` y `Proyect_v1/frontend/src/App.test.js` para agregar tus tests. Verifica que pasan localmente antes de hacer push.

### Visualizar resultados

- Ve al tab **Actions** en GitHub para ver logs y estado de cada workflow
- Búscalos también en **Pull Requests** para validar que tu PR no rompe nada

---

Última actualización: Enero 2026



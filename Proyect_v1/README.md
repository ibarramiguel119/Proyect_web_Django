# Proyect Web Django - Documentación

##  Descripción General

Este es un proyecto full-stack que combina **Django** (backend) con **React** (frontend), utilizando **Docker** para containerización. Incluye autenticación, login y registro de usuarios.

---

## Estructura del Proyecto

```
Proyect_v1/
├── docker-compose.yml          # Configuración de contenedores Docker
├── Backend/                     # Backend en Django
│   └── proyect_web_v1/
│       ├── manage.py           # Gestor de Django
│       ├── requirements.txt    # Dependencias Python
│       ├── Dockerfile          # Imagen Docker del backend
│       ├── db.sqlite3          # Base de datos SQLite (desarrollo)
│       ├── base_app/           # Aplicación principal
│       │   ├── models.py       # Modelos de datos
│       │   ├── views.py        # Vistas de la aplicación
│       │   ├── urls.py         # URLs de la aplicación
│       │   └── migrations/     # Migraciones de BD
│       ├── proyect_web_v1/     # Configuración principal
│       │   ├── settings.py     # Configuración de Django
│       │   ├── urls.py         # URLs principales
│       │   ├── wsgi.py         # WSGI para producción
│       │   └── asgi.py         # ASGI para WebSockets
│       └── static/             # Archivos estáticos
├── frontend/                    # Frontend en React
│   ├── package.json            # Dependencias Node.js
│   ├── Dockerfile              # Imagen Docker del frontend
│   ├── public/                 # Archivos públicos
│   ├── src/                    # Código fuente
│   │   ├── App.js              # Componente principal
│   │   ├── index.js            # Punto de entrada
│   │   └── components/         # Componentes React
│   │       └── Login.js        # Componente de login
│   └── build/                  # Build optimizado para producción
├── config/                      # Configuración de servidores
│   ├── nginx/                  # Configuración Nginx
│   │   └── conf.d/
│   │       └── local.conf      # Configuración local
│   └── gunicorn/               # Configuración Gunicorn
│       └── conf.py
├── certbot/                     # Certificados SSL/TLS
│   ├── conf/                   # Configuración de Certbot
│   └── www/                    # Archivos de validación
└── README.md                    # Este archivo
```

---

## Servicios Docker

### 1. **db_postgres** - Base de Datos PostgreSQL con PostGIS
- **Imagen:** `postgis/postgis:15-3.3`
- **Contenedor:** `db_postgres_mk`
- **Puerto:** 5432 (interno)
- **Credenciales:**
  - Usuario: `postgres`
  - Contraseña: `Mikeadd`
  - Base de datos: `postgres`
- **Volumen:** `postgres_data` para persistencia de datos
- **Red:** `mk-network`

### 2. **pgadmin** - Administrador de PostgreSQL
- **Imagen:** `dpage/pgadmin4`
- **Contenedor:** `pgadmin_mk`
- **Puerto:** 5050 (acceso: http://localhost:5050)
- **Credenciales:**
  - Email: `ibarramiguel119@gmail.com`
  - Contraseña: `mkroot`
- **Depende de:** `db_postgres`
- **Red:** `mk-network`

### 3. **web** - Backend Django
- **Imagen:** Construida desde `./Backend/proyect_web_v1/Dockerfile`
- **Contenedor:** `web_mk`
- **Comando:** `python manage.py runserver 0.0.0.0:80`
- **Puerto:** 80 (interno)
- **Volúmenes:**
  - `./Backend/proyect_web_v1:/app` - Código fuente
  - `static:/app/static` - Archivos estáticos
  - `./certbot/www:/var/www/certbot:ro` - Validación SSL
- **Variables de Entorno:**
  - `GDAL_LIBRARY_PATH=/usr/lib/libgdal.so` - Para PostGIS
  - `DJANGO_SECRET_KEY` - Clave secreta de Django (desde .env)
  - `DJANGO_ALLOWED_HOSTS` - Hosts permitidos (desde .env)
- **Depende de:** `db_postgres`
- **Red:** `mk-network`

### 4. **frontend** - React Frontend
- **Imagen:** Construida desde `./frontend/Dockerfile`
- **Contenedor:** `frontend_mk`
- **Puerto:** 3000
- **Volumen:** `./frontend/build:/usr/share/nginx/html` - Build de React
- **Red:** `mk-network`

### 5. **nginx** - Servidor Proxy Reverso
- **Imagen:** `nginx:1.13`
- **Contenedor:** `proyect_v1-nginx-1`
- **Puertos:**
  - 80 (HTTP)
  - 443 (HTTPS)
- **Volumen:** `./frontend/build:/usr/share/nginx/html` - Servir React
- **Red:** `mk-network`

---

## Primeros Pasos

### Requisitos Previos
- Docker y Docker Compose instalados
- Git configurado
- Variables de entorno (`.env` en la raíz del proyecto)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/ibarramiguel119/Proyect_web_Django.git
cd Proyect_v1
```

### 2. Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
DJANGO_SECRET_KEY=tu_clave_secreta_aqui
DOMAIN=localhost
```

### 3. Construir y Levantar los Contenedores
```bash
docker-compose up --build
```

### 4. Acceder a los Servicios
- **Frontend (React):** http://localhost:3000
- **Backend (Django):** http://localhost:80
- **PgAdmin:** http://localhost:5050
  - Email: `ibarramiguel119@gmail.com`
  - Contraseña: `mkroot`

---

##  Desarrollo

### Backend (Django)

#### Instalar Dependencias
```bash
cd Backend/proyect_web_v1
pip install -r requirements.txt
```

#### Dependencias Principales
- **Django 5.0.4+** - Framework web
- **psycopg2-binary** - Adaptador PostgreSQL
- **djangorestframework** - API REST
- **djangorestframework-simplejwt** - Autenticación JWT
- **django-cors-headers** - CORS para React
- **channels** - WebSockets
- **Pillow** - Procesamiento de imágenes
- **gunicorn** - Servidor WSGI producción

#### Ejecutar Migraciones
```bash
python manage.py migrate
```

#### Crear Superusuario
```bash
python manage.py createsuperuser
```

#### Ejecutar Servidor de Desarrollo
```bash
python manage.py runserver
```

### Frontend (React)

#### Instalar Dependencias
```bash
cd frontend
npm install
```

#### Ejecutar en Desarrollo
```bash
npm start
```

#### Build para Producción
```bash
npm run build
```

---

##  Dependencias Principales

### Backend (Python)
- **Django 5.0.4+** - Framework web
- **PostgreSQL 15** - Base de datos
- **PostGIS** - Extensión geoespacial
- **djangorestframework** - API REST
- **Channels 4.1.0+** - WebSockets
- **Gunicorn 19.9.0** - Servidor WSGI

### Frontend (JavaScript)
- **React** - UI library
- **Node.js** - Runtime
- **Nginx** - Servidor web (producción)

---

##  Seguridad

### Autenticación
- **JWT (JSON Web Tokens)** con `djangorestframework-simplejwt`
- Login y Registro de usuarios
- CORS habilitado para comunicación frontend-backend

### SSL/TLS
- Certificados generados con Certbot
- Nginx como proxy reverso (puerto 443)

### Variables Sensibles
Almacenar en `.env`:
- `DJANGO_SECRET_KEY`
- `POSTGRES_PASSWORD`
- Credenciales de servicios externos

---

##  Redes Docker

**Red principal:** `mk-network` (bridge)
- Todos los contenedores están conectados en esta red
- Permite comunicación interna entre servicios

---

##  Volúmenes

| Volumen | Propósito |
|---------|-----------|
| `postgres_data` | Persistencia de datos PostgreSQL |
| `static` | Archivos estáticos de Django |
| `proxy-dhparams` | Parámetros DH para SSL/TLS |

---

##  Comandos Útiles

### Docker Compose
```bash
# Levantar servicios
docker-compose up

# Levantar en background
docker-compose up -d

# Ver logs
docker-compose logs -f [servicio]

# Detener servicios
docker-compose down

# Reconstruir imágenes
docker-compose up --build
```

### Django
```bash
# (Local / dentro del entorno virtual)
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Colectar archivos estáticos
python manage.py collectstatic

# Shell interactivo
python manage.py shell
```

### Usando Docker / docker-compose

Si estás usando Docker Compose (servicio `web` definido en `docker-compose.yml`) puedes ejecutar los comandos de Django desde el contenedor.

- Si los contenedores están en ejecución (más recomendado):
```bash
# Ejecutar dentro del servicio 'web'
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
docker-compose exec web python manage.py collectstatic
docker-compose exec web python manage.py shell
```

- Si el servicio no está en ejecución y quieres arrancar un contenedor temporal:
```bash
docker-compose run --rm web python manage.py migrate
```

Nota: en sistemas con la nueva CLI de Docker también puedes usar `docker compose exec` / `docker compose run --rm` (sin guion). Si tu servicio se llama distinto en `docker-compose.yml`, reemplaza `web` por el nombre correcto.

### PostgreSQL (dentro del contenedor)
```bash
# Acceder a psql
docker-compose exec db_postgres psql -U postgres -d postgres

# Consultas útiles
\dt              # Listar tablas
\d table_name    # Describir tabla
SELECT * FROM table_name;  # Ver datos
```

---

##  Troubleshooting

### Problema: La base de datos no se conecta
**Solución:**
```bash
docker-compose restart db_postgres
docker-compose logs db_postgres
```

### Problema: Puerto 3000 ya está en uso
**Solución:**
```bash
# Cambiar puerto en docker-compose.yml
# O liberar el puerto:
lsof -ti:3000 | xargs kill -9
```

### Problema: Errores de permisos en volúmenes
**Solución:**
```bash
sudo chown -R $USER:$USER ./Backend ./frontend
docker-compose down && docker-compose up --build
```

---

##  Documentación Adicional

### Django
- Docs: https://docs.djangoproject.com/
- DRF: https://www.django-rest-framework.org/

### React
- Docs: https://react.dev
- Create React App: https://create-react-app.dev/

### Docker
- Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/

### PostgreSQL
- Docs: https://www.postgresql.org/docs/
- PostGIS: https://postgis.net/documentation/

---

##  Autor
**Miguel Ibarra**
- GitHub: [@ibarramiguel119](https://github.com/ibarramiguel119)
- Email: ibarramiguel119@gmail.com

---


##  Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---



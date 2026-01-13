# CI/CD con GitHub Actions - Guía Completa

## Introducción

Este proyecto usa **GitHub Actions** para automatizar pruebas, validación y despliegue. Cada vez que hagas push o abras un Pull Request, se ejecutan automáticamente:

1. **Tests y linting** del backend (Django) y frontend (React)
2. **Build** de imágenes Docker
3. **Escaneo de seguridad** con Trivy
4. **(Opcional)** Despliegue automático a producción

---

## Workflows

### 1. CI Pipeline (`ci.yml`)

Se ejecuta en cada **push** a `main`, `develop`, o `Django-React-login-register` y en cada **PR**.

#### Jobs que corren en paralelo:

**Backend (Django)**
- Descarga Python 3.11 y dependencias del `requirements.txt`
- Inicia PostgreSQL 15 con PostGIS para tests
- Ejecuta linting: `flake8`, `black`, `isort`
- Ejecuta tests: `pytest`
- Chequea seguridad: `python manage.py check --deploy`

**Frontend (React)**
- Descarga Node 16 y dependencias del `package-lock.json`
- Ejecuta linting: `eslint`
- Formatea y verifica: `prettier`
- Ejecuta tests: `npm test`
- Construye: `npm run build`
- Alerta si build > 5MB

**Docker**
- Construye imágenes (sin push a registry)
- Valida que los Dockerfiles están correctos

**Seguridad**
- Escanea vulnerabilidades con Trivy
- Reporta en GitHub Security tab

---

### 2. Deploy Pipeline (`deploy.yml`) — Opcional

Se ejecuta **solo** al hacer push a `main`.

Pasos:
1. Conecta al servidor vía SSH
2. Hace `git pull origin main`
3. Actualiza imágenes Docker
4. Ejecuta migraciones: `python manage.py migrate`
5. Colecta estáticos: `python manage.py collectstatic`

**Requiere configurar Secrets en GitHub.**

---

## Configuración Inicial

### 1. Habilitar GitHub Actions

1. Ve a tu repo → **Settings**
2. Sidebar izq: **Actions** → **General**
3. En "Actions permissions" selecciona: **"Allow all actions and reusable workflows"**
4. Click en **Save**

### 2. Configurar Secrets (para Deploy — opcional)

Si quieres despliegue automático a producción:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Click en **"New repository secret"** y agrega:

```
DEPLOY_KEY
(tu clave SSH privada para conectar al servidor)

DEPLOY_HOST
(IP o dominio del servidor, ej: 192.168.1.100)

DEPLOY_USER
(usuario SSH que usarás para conectar, ej: deploy)

DEPLOY_PATH
(ruta del proyecto en el servidor, ej: /home/deploy/Proyect_web_Django/Proyect_v1)
```

Ejemplo de clave SSH privada (contenido de `~/.ssh/id_rsa`):
```
-----BEGIN OPENSSH PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCA...
...resto de la clave...
-----END OPENSSH PRIVATE KEY-----
```

### 3. (Opcional) Configurar Deploy en Servidor

En el servidor destino, asegúrate de:

1. Tener Docker y Docker Compose instalados
2. Que la clave SSH del usuario `DEPLOY_USER` está autorizada (en `~/.ssh/authorized_keys`)
3. Que el usuario tiene permisos para ejecutar Docker (`sudo usermod -aG docker $DEPLOY_USER`)

---

## Agregar Tests

### Backend (Django)

Edita `Proyect_v1/Backend/proyect_web_v1/base_app/tests.py`:

```python
from django.test import TestCase
from django.contrib.auth.models import User

class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='12345'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
```

Corre localmente:
```bash
cd Proyect_v1/Backend/proyect_web_v1
python manage.py test
```

### Frontend (React)

Edita `Proyect_v1/frontend/src/App.test.js`:

```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login component', () => {
  render(<App />);
  const loginElements = screen.getAllByText(/login/i);
  expect(loginElements.length).toBeGreaterThan(0);
});
```

Corre localmente:
```bash
cd Proyect_v1/frontend
npm test
```

---

## Visualizar Resultados

### En GitHub

1. Ve al tab **Actions** en tu repo
2. Verás un listado de workflows ejecutados
3. Click en uno para ver detalles:
   -  Jobs que pasaron
   -  Jobs que fallaron
   -  Logs completos de cada step

### En Pull Requests

Cuando creas un PR, GitHub mostrará:
- Estado del CI:  **All checks passed** o  **Some checks failed**
- Si falla, puedes hacer click para ver qué salió mal
- Los commits posteriores volverán a correr los tests

---

## Errores Comunes y Soluciones

### "Backend tests failed"

**Solución:**
1. Revisa los logs en GitHub Actions
2. Ejecuta tests localmente: `python manage.py test`
3. Asegúrate de que `requirements.txt` está actualizado

###  "Frontend build failed"

**Solución:**
1. Revisa los logs en GitHub Actions
2. Ejecuta localmente: `cd frontend && npm run build`
3. Chequea `src/` por errores de sintaxis

###  "Docker build failed"

**Solución:**
1. Valida Dockerfiles localmente: `docker build -f Frontend/Dockerfile .`
2. Asegúrate de que `requirements.txt` y `package.json` existen

###  "Deploy failed"

**Solución:**
1. Chequea que los Secrets están definidos correctamente
2. Verifica conectividad SSH: `ssh -i ~/.ssh/id_rsa deploy@HOST`
3. Comprueba que Docker está corriendo en el servidor

###  "Build size exceeds 5MB"

**Recomendación:**
- Analiza con `source-map-explorer`: `npm install source-map-explorer && npm run build && npx source-map-explorer 'build/static/js/*.js'`
- Reduce tamaño eliminando dependencias sin uso

---

## Personalizaciones

### Cambiar ramas que triggerean CI

En `.github/workflows/ci.yml`, modifica:

```yaml
on:
  push:
    branches: [ main, develop ]  # Solo estas ramas
  pull_request:
    branches: [ main, develop ]
```

### Agregar notificaciones (Slack, Discord, etc.)

Agrega al final de `ci.yml`:

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### Correr tests en schedule (cron)

```yaml
on:
  schedule:
    - cron: '0 2 * * 0'  # Cada domingo a las 2am UTC
```

---

## Archivo de ejemplo: `.github/workflows/ci.yml`

Ver la raíz del repo en `.github/workflows/ci.yml` para la configuración completa.

---

## Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Django Testing](https://docs.djangoproject.com/en/5.2/topics/testing/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Trivy Security Scanner](https://github.com/aquasecurity/trivy)

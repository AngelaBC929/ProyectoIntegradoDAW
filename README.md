
# 📸 RallyFotografico – Aplicación Web

Proyecto Integrado del ciclo formativo **Desarrollo de Aplicaciones Web (DAW)**.  
Desarrollado por **Ángela Borges Cantarino** – IES Velázquez.

---

## 🧠 Descripción General

**RallyFotografico** es una aplicación web de gestión de eventos fotográficos donde los usuarios pueden:

- Registrarse como participantes
- Subir fotografías
- Votar imágenes
- Visualizar resultados y rankings

Incluye un sistema de administración que permite validar fotos, gestionar usuarios y configurar los rallies.

---

## 🗂️ Estructura del Proyecto

### 🖥️ Frontend (Angular)
- **Framework:** Angular Standalone
- **Lenguajes:** TypeScript, HTML, CSS
- **Librerías:** Bootstrap, FontAwesome
- **Estructura modular:** componentes agrupados por funcionalidades

### 🔧 Backend (PHP)
- **Lenguaje:** PHP 7+
- **Base de datos:** MySQL (XAMPP)
- **Estilo API REST simulada:** peticiones POST con `action` en vez de PUT/DELETE (por limitaciones del hosting)
- **Despliegue:** InfinityFree

---

## 🧩 Funcionalidades Clave

### 👤 Participantes
- Registro y autenticación
- Gestión de perfil
- Subida de fotos con validaciones
- Consulta del estado de sus fotos
- Visualización del ranking

### 🔑 Administrador
- Validación o rechazo de fotografías
- Gestión de usuarios
- Creación y edición de rallies
- Configuración de fechas y límites
- Visualización de estadísticas

### 🌐 Público general (logueado)
- Visualización de la galería pública
- Votación de fotos
- Consulta del ranking de votaciones

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Clona el repositorio

```bash
git clone https://github.com/AngelaBC929/ProyectoIntegradoDAW.git
```

### 2. Instala dependencias de Angular

```bash
npm install
```

### 3. Levanta el servidor de desarrollo

```bash
ng serve
```

Abre en tu navegador: `http://localhost:4200`

### 4. Configura la conexión con el backend PHP
- Asegúrate de tener XAMPP levantado (Apache + MySQL)
- Configura la URL del backend en `src/environments/environment.ts`

---

## 📦 Estructura del Código

```plaintext
C:.
├───app
│   ├───admin
│   │   ├───admin
│   │   ├───create-rallies
│   │   ├───edit-rallies
│   │   ├───edit-user
│   │   ├───gestion-rallies
│   │   ├───user-control
│   │   └───user-photos
│   ├───gallery
│   ├───home
│   ├───login
│   ├───rallies
│   │   ├───proximos-rallies
│   │   ├───rallies-actuales
│   │   └───rallies-pasados
│   ├───register
│   ├───shared
│   │   ├───guards
│   │   ├───interceptors
│   │   ├───models
│   │   ├───navbar
│   │   ├───pipes
│   │   └───services
│   └───user
│       ├───dashboard
│       ├───faqs
│       ├───mis-fotos
│       └───mis-rallies
├───assets
└───environments

---

## 🛠️ Tecnologías Utilizadas

- **Angular 17+** (standalone components)
- **Bootstrap** 5
- **FontAwesome**
- **PHP 7+**
- **MySQL 8 (XAMPP)**
- **Git + GitHub**
- **Visual Studio Code**
- **InfinityFree** (hosting)

---

## 🧪 Notas Técnicas

- El backend no utiliza MVC formal, pero está modularizado en archivos como `usuarios.php`, `rallies.php`, `fotos.php`, etc.
- Se simulan métodos PUT/DELETE mediante POST con campo `action` y lógica `switch-case`.
- El entorno de desarrollo se basa en Visual Studio Code + extensiones útiles (Angular Essentials, GitLens, etc.)

---

## 🧾 Documentación Adjunta

- ✔️ Manual de Usuario (participante)
- ✔️ Manual de Administrador
- ✔️ Documentación técnica (ER, arquitectura, casos de uso, decisiones, ampliaciones)
- ✔️ Diagrama entidad-relación (adjunto)
- ✔️ README completo

---

## 📌 Créditos

Proyecto desarrollado por:  
**Ángela Borges Cantarino**  
IES Velázquez – Curso 2024/2025  
Módulo: Proyecto Integrado (Desarrollo de Aplicaciones Web)

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia educativa del IES Velázquez. Uso con fines formativos y de evaluación.

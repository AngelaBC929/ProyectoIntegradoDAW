
# 📸 RallyFotografico – Aplicación Web

Proyecto Integrado del ciclo formativo Desarrollo de Aplicaciones Web (DAW).  
Desarrollado por Ángela Borges Cantarino – IES Velázquez.

---

## 🧠 Descripción General

RallyFotografico es una aplicación web de gestión de eventos fotográficos donde los usuarios pueden:

- Registrarse como participantes  
- Subir fotografías  
- Votar imágenes  
- Visualizar resultados y rankings  

Incluye un sistema de administración que permite validar fotos, gestionar usuarios y configurar los rallies.

---

## 🗂️ Estructura del Proyecto

### 🖥️ Frontend (Angular)
- **Framework**: Angular Standalone  
- **Lenguajes**: TypeScript, HTML, CSS  
- **Librerías**: Bootstrap, FontAwesome  
- **Estructura modular**: componentes agrupados por funcionalidades

### 🔧 Backend (PHP)
- **Lenguaje**: PHP 7+  
- **Base de datos**: MySQL (XAMPP)  
- **Estilo**: API REST simulada (POST + action)  
- **Despliegue**: InfinityFree (Wuaze)

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

1. Clona el repositorio:
```bash
git clone https://github.com/AngelaBC929/ProyectoIntegradoDAW.git
```

2. Instala dependencias de Angular:
```bash
npm install
```

3. Levanta el servidor de desarrollo:
```bash
ng serve
```

4. Abre en tu navegador:  
`http://localhost:4200`

5. Configura la conexión con el backend PHP:
- Asegúrate de tener XAMPP levantado (Apache + MySQL)
- Modifica `src/environments/environment.ts` con la URL correspondiente

---

## 📦 Estructura del Código

```
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
```

---

## 🛠️ Tecnologías Utilizadas

- **Angular 17+** (standalone components)  
- **Bootstrap** 5  
- **FontAwesome**  
- **PHP 7+**  
- **MySQL 8 (XAMPP)**  
- **Git + GitHub**  
- **Visual Studio Code**  
- **InfinityFree (Wuaze)**

---

## 🧪 Notas Técnicas

- El backend no utiliza un patrón MVC formal, pero está modularizado en archivos como `usuarios.php`, `rallies.php`, `fotos.php`, etc.  
- Se simulan métodos `PUT`/`DELETE` mediante `POST` con campo `action` y lógica `switch-case`.  
- El entorno de desarrollo se basa en **Visual Studio Code** con extensiones útiles como Angular Essentials, GitLens, etc.

---

## 📤 Despliegue en Producción

Este proyecto ha sido desplegado en producción usando el hosting gratuito **Wuaze.com (InfinityFree)**. A continuación se explica cómo se realiza el despliegue completo:

### 🔧 1. Preparar el frontend (Angular)

1. Ejecuta el build de producción:
```bash
ng build --configuration production
```

2. Esto generará una carpeta `dist/`. Entra a `dist/` y copia **todo el contenido** de la subcarpeta del proyecto (por ejemplo `dist/rally-fotografico/`) directamente a la raíz de `htdocs/` en el servidor.

### 🗂️ 2. Subir archivos al servidor

1. Abre **FileZilla** y conéctate a tu hosting de **Wuaze (InfinityFree)**.
2. En la carpeta `htdocs/`:
   - **Sube los archivos del frontend** generados en `dist/`.
   - **Sube también todos los archivos PHP del backend** (como `usuarios.php`, `login.php`, `rallies.php`, etc.).

> ⚠️ Asegúrate de que todos los archivos queden sueltos en la raíz de `htdocs/`, tanto frontend como backend.

### 🗄️ 3. Configurar la base de datos

1. En XAMPP, entra a **phpMyAdmin** y exporta tu base de datos como `.sql`.
2. En InfinityFree (Wuaze):
   - Crea una nueva base de datos.
   - Accede a su **phpMyAdmin** y usa la pestaña **Importar** para subir tu `.sql`.

### ⚙️ 4. Configurar URL del backend

Edita el archivo `src/environments/environment.prod.ts` para apuntar al servidor de producción:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://tusitio.wuaze.com' // sin barra final
};
```

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

# 📸 RallyFotografico

Proyecto Integrado de Desarrollo de Aplicaciones Web.

## 🧠 Descripción General

**RallyFotografico** es una aplicación web desarrollada con Angular (frontend) y Spring Boot (backend), pensada para la gestión de eventos de fotografía donde los usuarios pueden registrarse, iniciar sesión, subir fotos, ver galerías y gestionar su perfil.

## 🗂️ Estructura del Proyecto

### Frontend
- **Framework**: Angular
- **Lenguajes**: TypeScript, HTML, CSS
- **Estructura Modular**: Componentes standalone y carpetas organizadas por funcionalidad (auth, shared, gallery, etc.)

### Backend (por desarrollar)
- **Framework**: Spring Boot
- **Lenguaje**: Java
- **API RESTful** para autenticación y gestión de recursos

## 🎯 Funcionalidades Clave

- Autenticación de usuarios (login y registro)
- Navegación por rutas protegidas
- Visualización de galería de fotos
- Gestión del perfil de usuario
- Preparado para integración con backend REST

## 🚀 Cómo Ejecutar el Proyecto

1. Clona el repositorio:
   ```bash
   git clone https://github.com/IES-Velazquez/rallyFotografico.git
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   ng serve
   ```

4. Abre tu navegador en `http://localhost:4200`

## 🛠️ Tecnologías Utilizadas

- Angular CLI
- Angular 17+ (con routing y CSS standalone)
- Git + GitHub
- Visual Studio Code

## 📦 Estructura del Código

```
src/
├── app/
│   ├── login/
│   ├── register/
│   ├── gallery/
│   ├── shared/
│   └── app.routes.ts
├── assets/
├── environments/
└── index.html
```

## 📌 Notas

- Se usa `environment.ts` para gestionar la URL base del backend.
- Los archivos `node_modules`, `.vscode/`, y `dist/` están ignorados en `.gitignore`.
- El proyecto ya está versionado en GitHub.

---

🎓 *Proyecto creado y desarrollado por Angela Borges Cantarino como parte del módulo de Proyecto Integrado en el IES Velázquez*.
# Cliente de Gestión de Empleados

Interfaz de usuario para el Sistema de Gestión de Empleados, que permite a los administradores gestionar empleados y horarios, y a los empleados revisar su horario y solicitar cambios. Este proyecto está construido con React y utiliza Bootstrap para el diseño.

## Estructura del Proyecto

```
employee-management-client/
├── public/               # Archivos públicos y plantilla HTML
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Contexto para manejo de autenticación
│   ├── pages/            # Páginas principales de la aplicación
│   ├── services/         # Servicios para interactuar con la API
│   └── App.js            # Componente principal de la aplicación
└── .env                  # Variables de entorno
```

## Tecnologías

- **React**: Framework de frontend para construir la interfaz de usuario
- **Bootstrap**: Framework CSS para estilos y diseño responsivo
- **React Router**: Manejo de rutas y navegación en la aplicación
- **Context API**: Gestión de estado para la autenticación

## Inicio Rápido

### Requisitos

Asegúrate de tener instalado Node.js.

### Instalación

1. Clona el repositorio:
   ```bash
   https://github.com/lucassalzotto-dat/employee-management-client.git
   cd employee-management-client
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno (ver [Variables de Entorno](#variables-de-entorno)).

4. Inicia la aplicación:
   ```bash
   npm start
   ```

   La aplicación debería estar corriendo en `http://localhost:3001`.

## Variables de Entorno

Crea un archivo `.env` en el directorio raíz con las siguientes variables:

```env
REACT_APP_API_URL=http://localhost:3000
```

Asegúrate de que `REACT_APP_API_URL` apunte al servidor backend `employee-management-server` que configuraste.

## Características Principales

### Roles y Autenticación

- **Inicio de Sesión**: Autenticación de usuarios (admin o empleado) con JWT.
- **Roles**:
  - **Admin**: Puede gestionar empleados, asignar y editar horarios, y aprobar o rechazar solicitudes de cambio de horario.
  - **Empleado**: Puede visualizar su propio horario y realizar solicitudes de cambio de horario.

### Funcionalidades

- **Gestión de Empleados** (solo para admin):
  - Listar todos los empleados
  - Agregar, editar y eliminar empleados
- **Gestión de Horarios** (solo para admin):
  - Asignar y editar horarios de empleados
- **Solicitudes de Cambio de Horario**:
  - Los empleados pueden solicitar cambios de horario
  - Los administradores pueden aprobar o rechazar solicitudes

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm start`

Inicia la aplicación en modo de desarrollo.<br>
Abre [http://localhost:3001](http://localhost:3001) para ver la aplicación en el navegador.

### `npm test`

Ejecuta las pruebas disponibles en el proyecto (si existen).

### `npm run build`

Construye la aplicación para producción en la carpeta `build`.

## Licencia

Lucas Salzotto & Valentin Hildmann
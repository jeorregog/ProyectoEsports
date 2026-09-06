# ProyectoEsports

Aplicación web SPA desarrollada con Vue 3 para la gestión y consulta de información de un entorno competitivo de deportes electrónicos.

La aplicación permite consultar equipos, jugadores, partidas y rankings, además de ofrecer funcionalidades administrativas para la gestión de usuarios y jugadores.

## Tecnologías utilizadas

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Tailwind CSS
- Chart.js
- Lucide Vue Next
- ESLint
- Prettier
- LocalStorage

## Requisitos

Antes de ejecutar el proyecto se debe tener instalado:

- Node.js
- npm

## Instalación

Clonar el repositorio y acceder al directorio del proyecto:

```bash
git clone <URL_DEL_REPOSITORIO>
cd ProyectoEsports
```

Instalar las dependencias:

```bash
npm install
```

## Ejecución en desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Después de iniciar Vite, se debe abrir en el navegador la dirección indicada por la terminal.

## Construcción del proyecto

Para generar la versión de producción:

```bash
npm run build
```

## Verificación del código

El proyecto dispone de comandos para comprobar el tipado, analizar el código y verificar el formato.

### TypeScript

```bash
npm run type-check
```

### ESLint

```bash
npm run lint
```

### Formatear el código

```bash
npm run format
```

### Verificar el formato

```bash
npm run format:check
```

## Ruta principal

La ruta principal de la aplicación es:

```text
/
```

Esta corresponde a la página de inicio de ProyectoEsports.

## Rutas principales

| Ruta | Descripción | Acceso |
| --- | --- | --- |
| `/` | Página de inicio | Público |
| `/login` | Inicio de sesión | Público |
| `/dashboard` | Panel principal | Usuario autenticado |
| `/players` | Consulta de jugadores | Usuario autenticado |
| `/teams` | Consulta de equipos | Usuario autenticado |
| `/matches` | Consulta de partidas | Usuario autenticado |
| `/leaderboard` | Rankings | Usuario autenticado |
| `/admin/users` | Administración de usuarios | Administrador |
| `/admin/players` | Administración de jugadores | Administrador |

## Persistencia de datos

La primera versión de la aplicación utiliza `LocalStorage` como mecanismo de persistencia en el navegador.

En el primer inicio, el sistema crea datos ficticios iniciales para facilitar la navegación y demostración de la aplicación.

Los datos existentes en `LocalStorage` no se sobrescriben cuando la aplicación vuelve a iniciar.

## Arquitectura

La aplicación sigue una arquitectura por capas dentro del Front-end SPA.

El flujo principal de datos es:

```text
View
  ↓
Pinia Store
  ↓
Service
  ↓
LocalStorage
```

Las Views utilizan los Stores para consultar o modificar información. Los Stores utilizan Services, y únicamente los Services realizan operaciones de lectura y escritura sobre `LocalStorage`.

La aplicación utiliza Vue Router para la navegación y guards para controlar el acceso a las rutas protegidas.

## Funcionalidades principales

- Autenticación de usuarios.
- Gestión de usuarios mediante CRUD administrativo.
- Gestión de jugadores mediante CRUD administrativo.
- Consulta de equipos.
- Consulta de partidas.
- Rankings de jugadores y equipos.
- Filtros para facilitar la consulta de información.
- Tablas de datos.
- Gráficos estadísticos mediante Chart.js.
- Componentes reutilizables.
- Control de acceso para funcionalidades administrativas.

## Desarrollo y calidad

El proyecto utiliza TypeScript con tipado estricto, ESLint para análisis estático y Prettier para mantener un formato uniforme.

Antes de integrar cambios al proyecto se recomienda comprobar:

```bash
npm run type-check
npm run lint
npm run build
```

Las reglas arquitectónicas y de programación del proyecto se encuentran documentadas en la Wiki del repositorio.

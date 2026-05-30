Proyecto

Este repositorio contiene una aplicación Next.js (versión 16) creada como base para tareas y pruebas. Está organizada con la carpeta `src/` usando la nueva estructura de aplicación (`app/`).

**Requisitos**
- Node.js 18+ (recomendado)
- npm, pnpm o bun (según tu preferencia)

**Instalación**
1. Clona el repositorio:

```bash
git clone <repo-url>
cd nextjs16-task-elysia
```
2. Instala dependencias:

```bash
npm install
# o: pnpm install
# o: bun install
```

**Scripts útiles**
- `npm run dev` — Inicia el servidor de desarrollo (Next dev).
- `npm run build` — Compila la app para producción.
- `npm start` — Inicia la versión de producción (después de `build`).
- `npm run lint` — Ejecuta Biome para chequeos de lint.
- `npm run format` — Formatea el código con Biome.

Abre http://localhost:3000 en tu navegador tras ejecutar `npm run dev`.

**Estructura principal**
- `src/app/` — Rutas y layouts de la app (incluye `login`, `register`, y área protegida).
- `src/components/` — Componentes UI reutilizables (`card`, `input`, `form`, etc.).
- `src/utils/` — Utilidades y helpers (`parse-cookie.ts`, `validator.ts`, `refresh_tokens.ts`).
- `src/proxy.ts` — Proxy / helpers para llamadas a APIs.

**Rutas importantes (ejemplos)**
- `/` — Landing o página pública.
- `/auth/login` — Formulario de login.
- `/auth/register` — Registro de usuarios.
- `/protected` — Zona protegida (requiere autenticación).

**Notas de desarrollo**
- Este proyecto usa `next` v16 y React 19.
- Linter y formateador configurados con Biome (`biome check`, `biome format`).
- Tailwind y PostCSS están presentes en la configuración del proyecto.

**Despliegue**
Puedes desplegar en Vercel o en cualquier servicio que soporte aplicaciones Node/Next.js. Para Vercel, la configuración por defecto suele funcionar: conecta el repositorio y Vercel detectará Next.js.

**Contribuir**
1. Crea una rama feature/bugfix.
2. Añade cambios y tests si aplica.
3. Abre un PR con descripción clara.

**Licencia**
Revisa la licencia del proyecto o añádela si es necesario.

---

Archivos clave: consulta `src/` para ver componentes, rutas y utilidades.

Si quieres, puedo: mejorar la documentación de una carpeta específica, añadir ejemplos de uso, o traducir el README al inglés.

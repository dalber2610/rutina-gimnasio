# AGENTS.md · Reglas para asistentes de IA

Este archivo lo leen los asistentes de programación (Copilot, Claude Code, Cursor, Codex y otros)
antes de trabajar en este repositorio. Cualquier persona también puede leerlo: resume cómo
está organizado el proyecto y qué reglas sigue.

## Contexto

- Proyecto académico de **Lenguaje de Programación** (6.º semestre, Ingeniería de Sistemas).
- La persona que programa es **estudiante**: está aprendiendo. Tu rol es enseñar y revisar, no
  resolverle la materia.
- Producto: **Rutina Gimnasio** es una aplicación web de seguimiento de entrenamientos de fuerza. Permite a los usuarios crear y gestionar rutinas de gimnasio, registrar sus sesiones (series, repeticiones y pesos), visualizar su evolución mediante **gráficos de progreso** y controlar sus descansos con un **temporizador integrado con alerta por vibración**.

## Reglas obligatorias

1. **No escribas el código de `src/shared/structures/` ni de `src/shared/algorithms/`** (épicas E3 y E4).
   Esas estructuras y algoritmos los escribe el estudiante a mano. Puedes explicar el concepto,
   dar pistas, revisar su código o señalar errores, pero no entregues la implementación.
2. **SQL escrito a mano, sin ORM.** Toda consulta va en un repositorio (`*.repository.ts`) y es
   parametrizada (`$1`, `$2`). Nunca concatenes texto del usuario dentro de una consulta.
3. **Cambios a la base = migración nueva** en `db/migrations/NNN_descripcion.sql`.
   Nunca edites una migración existente.
4. **Valida toda entrada** a la API con el esquema Zod del `*.model.ts` de la funcionalidad y responde con el código HTTP correcto.
5. **Cada cambio lleva pruebas.** Unitarias en `tests/unit`, de API en `tests/integration`.
6. **Explica lo que propones.** Cada bloque de código que sugieras debe venir con una explicación
   breve de qué hace y por qué, para que el estudiante pueda defenderlo en vivo.
7. **No subas secretos.** Nada de contraseñas ni `.env` en el código.
8. **Screaming architecture.** Una carpeta por funcionalidad del negocio en `src/` (`src/sales`, `src/products`…),
   con su `*.model.ts`, `*.repository.ts`, `*.routes.ts`, `*.api.ts` y `*.view.ts`. Nunca crees carpetas
   por capa técnica (`controllers`, `models`, `services`, `routes`, `utils`…). `src/shared` no importa
   funcionalidades; las funcionalidades no importan `src/app`. Ver `docs/arquitectura.md`.
9. **Idioma:** La interfaz de usuario, la documentación del producto y los mensajes de negocio van en **español**. El código (variables, funciones, tablas, commits técnicos) sigue convenciones consistentes del proyecto.
10. **Calidad:** Mantener tipado estricto en TypeScript y respetar la arquitectura modular dentro de `src/`.
11. **Flujo de trabajo:** Nunca hacer cambios directos a `main`; todo cambio debe pasar por una rama y un Pull Request con la CI en verde.
12. **Foco en el producto:** Priorizar la rapidez de registro durante el entrenamiento (menos clics, respuesta inmediata y soporte móvil para el temporizador con vibración).

## Convenciones

- Código, nombres, commits y PR en **inglés**; comentarios y documentación pueden ir en español.
- TypeScript en modo `strict`, sin `any`. Solo sintaxis que Node.js puede ejecutar directamente:
  nada de `enum`, `namespace` ni propiedades en parámetros de constructor.
- Los imports locales llevan la extensión `.ts` (ejemplo: `import { x } from './x.ts'`).
- Commits con Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`.

## Estructura

```
src/<funcionalidad>/   una carpeta por funcionalidad del negocio (screaming architecture):
                       *.model.ts · *.repository.ts · *.routes.ts · *.api.ts · *.view.ts
src/tasks/             funcionalidad de ejemplo de la plantilla
src/shared/            lo técnico y reutilizable: config, db, logger, http-client, operation-log
src/shared/structures/ estructuras de datos propias (las escribe el estudiante)
src/shared/algorithms/ ordenamiento y búsqueda propios (los escribe el estudiante)
src/app/               arranque: server.ts (API y señales), create-app.ts (rutas), web/ (index.html, main.ts)
db/                    migraciones SQL, semillas y ejecutor de migraciones
tests/                 unit · integration · e2e (architecture.test.ts revisa la estructura)
docs/                  PRD, arquitectura, decisiones (ADR), ingeniería inversa, seguridad
```

## Funcionalidades Principales (MVP)
- **Gestión de rutinas:** Creación, edición y organización de rutinas personalizadas sin límites artificiales.
- **Registro de entrenamiento en vivo:** Seguimiento de ejercicios, series, peso, repeticiones y estado de completado.
- **Temporizador de descanso con vibración:** Cuenta regresiva automática o manual entre series con notificación háptica (vibración) al finalizar.
- **Gráficos de progreso:** Visualización histórica de volumen, peso máximo (1RM estimado) y evolución por ejercicio.
- **Catálogo de ejercicios:** Listado estructurado por grupo muscular y equipo.

## Stack Tecnológico y Entorno Local
- **Runtime / Lenguaje:** Node.js + TypeScript.
- **Base de datos:** PostgreSQL (gestionado localmente con Docker Compose y cliente `pg`).
- **Control de versiones y CI:** GitHub (flujo basado en ramas, Pull Requests y CI en verde).


## Comandos

| Comando | Qué hace |
| --- | --- |
| `docker compose up -d` | Levanta PostgreSQL |
| `npm run migrate` | Aplica migraciones |
| `npm run dev` | API + frontend en modo desarrollo |
| `npm run check` | Lint + tipos + pruebas unitarias (correr antes de cada commit) |
| `npm run test:integration` | Pruebas de API contra PostgreSQL |
| `npm run test:e2e` | Pruebas en navegador con Playwright |

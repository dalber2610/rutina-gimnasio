# PRD · <Nombre de tu producto>

> Documento de requisitos del producto (Product Requirements Document).
> Complétalo en el Sprint 0 (historia H0.3) y pide la aprobación del profesor en un Issue.
> Cada requisito funcional (RF) se convierte en un Issue con la plantilla "Historia de usuario".

| Campo | Valor |
| --- | --- |
| Alumno |Dalber Escalona |
| Proyecto n.º |17 |
| Sitio de referencia |[Hevy](https://www.hevyapp.com/)| 
| Compañero revisor | |
| URL desplegada | (se completa en el Sprint 5) |

## 1. Problema

¿Qué problema real resuelve y a quién le duele? (3 a 5 líneas)
Las personas que entrenan fuerza en el gimnasio necesitan registrar sus rutinas, cargas, repeticiones y descansos para lograr una sobrecarga progresiva real. Aunque aplicaciones como Hevy resuelven parte de esto, limitan la cantidad de rutinas gratuitas, bloquean gráficos de progreso avanzados detrás de muros de pago y ofrecen poca flexibilidad en sus alertas de descanso. **Rutina Gimnasio** elimina esas restricciones ofreciendo una app web rápida, sin límites artificiales, con gráficos de progreso claros y un temporizador de descanso con vibración.
## 2. Usuarios

## 2. Usuarios

- **Usuario principal:** Persona que entrena fuerza en el gimnasio de 3 a 6 veces por semana (nivel intermedio o recreativo). Necesita registrar peso y repeticiones en segundos entre series, controlar sus tiempos de descanso y ver si está progresando semana a semana. Entra principalmente desde su **teléfono móvil** mientras entrena.
- **Usuario secundario:** Principiante que sigue una rutina estructurada y entra desde **móvil o computador** para organizar sus ejercicios, consultar su historial y mantener la constancia.

## 3. Objetivo y métrica de éxito

«Un usuario inicia una rutina y registra una serie completa (peso, repeticiones y arranque automático del temporizador de descanso) en menos de 8 segundos desde el móvil».

## 4. Alcance del MVP

Entre 5 y 8 funcionalidades que SÍ entran este semestre.

1. **Catálogo de ejercicios:** Crear, consultar, editar, eliminar y filtrar ejercicios por grupo muscular y equipo.
2. **Gestión de rutinas:** Crear, editar, duplicar y eliminar plantillas de rutinas sin límite de cantidad, definiendo ejercicios, series y repeticiones objetivo.
3. **Sesiones de entrenamiento en vivo:** Iniciar un entrenamiento desde una rutina (o en blanco), registrar series reales (peso, repeticiones, estado de completado) y guardar la sesión en el historial.
4. **Temporizador de descanso con vibración:** Cuenta regresiva automática al completar una serie (o manual), con tiempo configurable y alerta por vibración + aviso visual al terminar.
5. **Gráficos de progreso:** Visualización histórica por ejercicio del volumen total levantado, peso máximo y 1RM estimado.
6. **Historial y exportación básica:** Consulta de sesiones pasadas con detalle de cada serie y búsqueda rápida.

### Funcionalidades → carpetas de `src/` (screaming architecture)

Cada funcionalidad del alcance será una carpeta en `src/`. Nómbralas en inglés y en plural.

| Funcionalidad | Carpeta |
| --- | --- |
| Catálogo de ejercicios | `src/exercises` |
| Gestión de rutinas | `src/routines` |
| Sesiones de entrenamiento e historial | `src/workouts` |
| Gráficos y métricas de progreso | `src/progress` |
| Temporizador de descanso con vibración | `src/timers` |

## 5. Fuera de alcance

- Red social (seguidores, feed de amigos, comentarios y "me gusta").
- Aplicaciones nativas para iOS y Android (el producto es web-first y responsivo).
- Integración con relojes inteligentes (Apple Watch / Wear OS) o sensores externos.
- Planes de alimentación, conteo de calorías o macronutrientes.
- Autenticación con redes sociales (OAuth) o pagos/suscripciones.
-

## 6. Requisitos funcionales

| ID | Requisito | Prioridad (alta, media, baja) |
| --- | --- | --- |
| RF-01 | El usuario puede crear, listar, editar, eliminar y buscar ejercicios filtrando por grupo muscular y equipo. | Alta |
| RF-02 | El usuario puede crear, editar, duplicar y eliminar rutinas asignando ejercicios en orden con series y repeticiones objetivo. | Alta |
| RF-03 | El usuario puede iniciar una sesión de entrenamiento desde una rutina o en blanco y registrar peso, repeticiones y estado de completado por cada serie. | Alta |
| RF-04 | El sistema inicia automáticamente un temporizador de descanso configurable al marcar una serie como completada, activando vibración y alerta visual al llegar a cero. | Alta |
| RF-05 | El usuario puede consultar el historial completo de entrenamientos ordenados por fecha y ver el detalle de cada sesión. | Media |
| RF-06 | El usuario puede visualizar gráficos de progreso por ejercicio mostrando evolución de peso máximo, volumen total y 1RM estimado. | Alta |
| RF-07 | El usuario puede ajustar el tiempo del temporizador en curso (+15 s / -15 s / omitir) sin perder los datos de la sesión activa. | Media |

## 7. Requisitos no funcionales

- Responsive, móvil primero (375 px y 1280 px).
- Lighthouse ≥ 90 en Accesibilidad y Buenas prácticas.
- 0 errores en la consola del navegador.
- Funciona con 10.000 registros sin congelarse.
- Persistencia en PostgreSQL con SQL escrito a mano y consultas parametrizadas (`$1`, `$2`), sin ORM.
- TypeScript en modo `strict` (sin `any`) y validación de entradas con esquemas Zod.
- Degradación elegante del temporizador: si el navegador/dispositivo no soporta `navigator.vibrate()`, se muestra una alerta visual y sonora alternativa.
## 8. Modelo de datos

Diagrama entidad-relación y tablas PostgreSQL con tipos, claves y restricciones.
GitHub dibuja diagramas Mermaid; edita este ejemplo:

```mermaid
erDiagram
  EXERCISES ||--o{ ROUTINE_EXERCISES : incluye
  ROUTINES ||--o{ ROUTINE_EXERCISES : contiene
  ROUTINES ||--o{ WORKOUTS : origina
  WORKOUTS ||--|{ WORKOUT_SETS : registra
  EXERCISES ||--o{ WORKOUT_SETS : ejecutado_en

  EXERCISES {
    int id PK
    text name
    text muscle_group
    text equipment
    timestamptz created_at
  }

  ROUTINES {
    int id PK
    text name
    text notes
    timestamptz created_at
  }

  ROUTINE_EXERCISES {
    int id PK
    int routine_id FK
    int exercise_id FK
    int position
    int target_sets
    int target_reps
    int default_rest_seconds
  }

  WORKOUTS {
    int id PK
    int routine_id FK
    text name
    timestamptz started_at
    timestamptz finished_at
  }

  WORKOUT_SETS {
    int id PK
    int workout_id FK
    int exercise_id FK
    int set_number
    numeric weight_kg
    int reps
    boolean completed
    timestamptz completed_at
  }

## 9. Reto técnico distintivo

Gráfico de progreso + Temporizador de descanso con vibración:

Gráficos de progreso: Calcular métricas agregadas en PostgreSQL y/o cliente (volumen por sesión = $\sum(\text{peso} \times \text{reps})$, peso máximo y 1RM estimado con la fórmula de Epley) y renderizar gráficos responsivos y fluidos que soporten miles de registros sin degradar el rendimiento.

Temporizador con vibración confiable: Evitar el desfase clásico de setInterval cuando el navegador pasa a segundo plano calculando el tiempo restante contra una marca de tiempo real (Date.now()). Al finalizar, disparar un patrón háptico mediante la Web Vibration API (navigator.vibrate([200, 100, 200])) con respaldo visual/sonoro en dispositivos sin soporte (como iOS Safari o navegadores de escritorio).

## 10. Riesgos y preguntas abiertas

-Soporte de vibración en iOS: Safari en iOS no soporta la Web Vibration API; se mitigará con notificación visual destacada y señal sonora opcional.

Pérdida de sesión en curso: Si el usuario recarga la página en medio del entrenamiento, ¿debe guardarse el borrador en localStorage además de sincronizarse con PostgreSQL?

Rendimiento con 10.000 registros: Habrá que indexar workout_sets(exercise_id, completed_at) y paginar el historial para mantener tiempos de respuesta bajos.

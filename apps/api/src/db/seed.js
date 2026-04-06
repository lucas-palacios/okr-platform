import { teams, objectives, keyResults, checkIns, members } from "./schema/index.js";
import { v4 as uuidv4 } from "uuid";

// ─── Seed data ────────────────────────────────────────────────────────────────
export async function seedDatabase(db) {
  console.log("Seeding database with Q2 2026 OKRs...");

  // ─── IDs (stable, so re-runs are idempotent) ─────────────────────────────
  const ID = {
    // members (stable uuids)
    M_LUCAS_P: "00000000-0000-0000-0000-000000000001",
    M_LUCAS_A: "00000000-0000-0000-0000-000000000002",
    M_JUAN_F:  "00000000-0000-0000-0000-000000000003",

    // teams
    T_INFRA: "infra",
    T_CS: "cs",

    // infra objectives
    O_INFRA_1: uuidv4(),
    O_INFRA_2: uuidv4(),
    O_INFRA_3: uuidv4(),
    O_INFRA_4: uuidv4(),

    // cs objectives
    O_CS_1: uuidv4(),
    O_CS_2: uuidv4(),
    O_CS_3: uuidv4(),

    // infra key results
    KR_INFRA_1_1: uuidv4(),
    KR_INFRA_1_2: uuidv4(),
    KR_INFRA_1_3: uuidv4(),
    KR_INFRA_2_1: uuidv4(),
    KR_INFRA_2_2: uuidv4(),
    KR_INFRA_2_3: uuidv4(),
    KR_INFRA_3_1: uuidv4(),
    KR_INFRA_3_2: uuidv4(),
    KR_INFRA_3_3: uuidv4(),
    KR_INFRA_4_1: uuidv4(),
    KR_INFRA_4_2: uuidv4(),

    // cs key results
    KR_CS_1_1: uuidv4(),
    KR_CS_1_2: uuidv4(),
    KR_CS_2_1: uuidv4(),
    KR_CS_2_2: uuidv4(),
    KR_CS_3_1: uuidv4(),
    KR_CS_3_2: uuidv4(),
    KR_CS_3_3: uuidv4(),
    KR_CS_3_4: uuidv4(),
  };

  // ─── Members ───────────────────────────────────────────────────────────────
  await db.insert(members).values([
    {
      id: ID.M_LUCAS_P,
      name: "Lucas Palacios",
      email: "lucas.palacios@smfconsulting.es",
      area: "all",
      avatarInitials: "LP",
    },
    {
      id: ID.M_LUCAS_A,
      name: "Lucas Aguirre",
      email: "lucas.aguirre@smfconsulting.es",
      area: "infra",
      avatarInitials: "LA",
    },
    {
      id: ID.M_JUAN_F,
      name: "Juan Funes",
      email: "juan.funes@smfconsulting.es",
      area: "cs",
      avatarInitials: "JF",
    },
  ]);

  // ─── Teams ─────────────────────────────────────────────────────────────────
  await db.insert(teams).values([
    {
      id: ID.T_INFRA,
      name: "Infraestructura",
      description:
        "Equipo responsable de CI/CD, deploy, observabilidad, resiliencia y seguridad de la plataforma Etendo Go.",
    },
    {
      id: ID.T_CS,
      name: "Customer Success",
      description:
        "Equipo responsable de soporte, onboarding, medición de salud del cliente y expansión de Etendo Go.",
    },
  ]);

  // ─── Infra Objectives ──────────────────────────────────────────────────────
  await db.insert(objectives).values([
    {
      id: ID.O_INFRA_1,
      teamId: ID.T_INFRA,
      code: "O1",
      title: "Implementar un pipeline de CI/CD para la entrega continua de Etendo Go",
      focus: "Que el código viaje solo y rápido desde el desarrollador al cliente.",
      quarter: "Q2",
      year: 2026,
      status: "active",
    },
    {
      id: ID.O_INFRA_2,
      teamId: ID.T_INFRA,
      code: "O2",
      title: "Garantizar la capacidad de reversión (Rollback) inmediata ante fallos de deploy",
      focus:
        "No es recuperación de un terremoto, es: \"Subimos una versión que rompió un botón, ¡vuelve atrás ya!\". Esto mide el MTTR táctico.",
      quarter: "Q2",
      year: 2026,
      status: "active",
    },
    {
      id: ID.O_INFRA_3,
      teamId: ID.T_INFRA,
      code: "O3",
      title: "Asegurar la continuidad del negocio y resiliencia de los datos en AWS",
      focus: "Si AWS se cae o borran la base de datos, ¿qué pasa? Aquí vive el RPO y el RTO.",
      quarter: "Q2",
      year: 2026,
      status: "active",
    },
    {
      id: ID.O_INFRA_4,
      teamId: ID.T_INFRA,
      code: "O4",
      title: "Implementar observabilidad proactiva para detectar fallos antes que el usuario",
      focus:
        "El éxito no es solo arreglar rápido, sino que el sistema nos avise a nosotros (vía Slack/Alertas) antes de que el cliente llame a Soporte.",
      quarter: "Q2",
      year: 2026,
      status: "active",
    },
  ]);

  // ─── CS Objectives ─────────────────────────────────────────────────────────
  await db.insert(objectives).values([
    {
      id: ID.O_CS_1,
      teamId: ID.T_CS,
      code: "O1",
      title: "El soporte existente se mantiene estable y el agente de IA resuelve más de forma autónoma",
      focus: "Este objetivo protege lo que ya funciona y sigue mejorando el músculo principal del área.",
      quarter: "Q2",
      year: 2026,
      status: "active",
    },
    {
      id: ID.O_CS_2,
      teamId: ID.T_CS,
      code: "O2",
      title: "El cliente puede empezar a usar Etendo Go solo, con el mínimo de fricción posible",
      focus:
        "El onboarding no está definido aún — Q2 es para diseñarlo y validarlo antes de que llegue el primer cliente.",
      quarter: "Q2",
      year: 2026,
      status: "active",
    },
    {
      id: ID.O_CS_3,
      teamId: ID.T_CS,
      code: "O3",
      title: "El sistema de medición de éxito del cliente está listo antes de Q3",
      focus:
        "No podemos gestionar lo que no medimos. En Q2 debemos construir el radar que nos avisará quién está en riesgo y quién está listo para crecer.",
      quarter: "Q2",
      year: 2026,
      status: "active",
    },
  ]);

  // ─── Infra Key Results ─────────────────────────────────────────────────────
  await db.insert(keyResults).values([
    {
      id: ID.KR_INFRA_1_1,
      objectiveId: ID.O_INFRA_1,
      code: "KR 1.1",
      title: "100% de merges a main disparan deploy a staging sin intervención manual",
      category: "Automatización",
      targetValue: 100,
      targetUnit: "%",
      currentValue: 0,
      targetText:
        "100% de los merges a main disparan automáticamente el deploy a staging sin intervención manual, y el deploy a producción se activa con un único paso de aprobación manual tras validar en staging.",
      status: "not-started",
      owner: "infra",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_INFRA_1_2,
      objectiveId: ID.O_INFRA_1,
      code: "KR 1.2",
      title: "Tiempo total del pipeline (merge → staging) < 15 minutos",
      category: "Velocidad",
      targetValue: 15,
      targetUnit: "min",
      currentValue: null,
      targetText: "Reducir el tiempo total del pipeline desde el merge hasta que el código corre en staging a < 15 minutos.",
      status: "not-started",
      owner: "infra",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_INFRA_1_3,
      objectiveId: ID.O_INFRA_1,
      code: "KR 1.3",
      title: "Primer deploy a producción usando exclusivamente el pipeline automatizado antes del 30 de junio",
      category: "Hito",
      targetValue: null,
      targetUnit: null,
      currentValue: null,
      targetText: "Realizar el primer deploy a producción utilizando exclusivamente el pipeline automatizado antes del 30 de junio.",
      status: "not-started",
      owner: "infra",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_INFRA_2_1,
      objectiveId: ID.O_INFRA_2,
      code: "KR 2.1",
      title: "Tiempo de rollback del frontend (re-deploy versión anterior) < 2 minutos",
      category: "Frontend",
      targetValue: 2,
      targetUnit: "min",
      currentValue: null,
      targetText: "Tiempo de rollback de la interfaz (re-deploy de versión anterior) < 2 minutos.",
      status: "not-started",
      owner: "infra",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_INFRA_2_2,
      objectiveId: ID.O_INFRA_2,
      code: "KR 2.2",
      title: "Tiempo de reversión de servicios de lógica (imagen anterior) < 5 minutos",
      category: "Backend",
      targetValue: 5,
      targetUnit: "min",
      currentValue: null,
      targetText: "Tiempo de reversión de servicios de lógica (imagen anterior) < 5 minutos.",
      status: "not-started",
      owner: "infra",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_INFRA_2_3,
      objectiveId: ID.O_INFRA_2,
      code: "KR 2.3",
      title: "Tiempo de restauración de snapshot de BD pre-deploy (errores de esquema) < 30 minutos",
      category: "Base de Datos",
      targetValue: 30,
      targetUnit: "min",
      currentValue: null,
      targetText: "Tiempo de restauración de snapshot de BD pre-deploy (para errores de esquema) < 30 minutos.",
      status: "not-started",
      owner: "infra",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_INFRA_3_1,
      objectiveId: ID.O_INFRA_3,
      code: "KR 3.1",
      title: "RPO < x horas garantizado mediante backups automatizados y validados",
      category: "RPO",
      targetValue: null,
      targetUnit: "hours",
      currentValue: null,
      targetText: "Garantizar un RPO < x horas (máximo de datos perdibles) mediante backups automatizados y validados.",
      status: "not-started",
      owner: "infra",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_INFRA_3_2,
      objectiveId: ID.O_INFRA_3,
      code: "KR 3.2",
      title: "RTO < x horas validado mediante ejercicio de DR",
      category: "RTO",
      targetValue: null,
      targetUnit: "hours",
      currentValue: null,
      targetText: "Definir y validar mediante un ejercicio de DR (Disaster Recovery) un RTO < x horas para levantar el servicio desde cero.",
      status: "not-started",
      owner: "infra",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_INFRA_3_3,
      objectiveId: ID.O_INFRA_3,
      code: "KR 3.3",
      title: "100% de credenciales centralizadas en AWS Secrets Manager y rotables automáticamente",
      category: "Seguridad",
      targetValue: 100,
      targetUnit: "%",
      currentValue: 0,
      targetText: "Lograr que el 100% de las credenciales del sistema estén centralizadas en AWS Secrets Manager y sean rotables automáticamente.",
      status: "not-started",
      owner: "infra",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_INFRA_4_1,
      objectiveId: ID.O_INFRA_4,
      code: "KR 4.1",
      title: "100% de alertas críticas de infraestructura configuradas con notificaciones automáticas",
      category: "Monitoreo",
      targetValue: 100,
      targetUnit: "%",
      currentValue: 0,
      targetText:
        "Configurar el 100% de las alertas críticas de infraestructura (CPU, memoria, base de datos) con notificaciones automáticas al equipo técnico.",
      status: "not-started",
      owner: "infra",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_INFRA_4_2,
      objectiveId: ID.O_INFRA_4,
      code: "KR 4.2",
      title: "≥ 100% de incidencias técnicas detectadas por monitoreo interno antes de ticket manual en Soporte",
      category: "Proactividad",
      targetValue: 100,
      targetUnit: "%",
      currentValue: 0,
      targetText:
        "Lograr que el ≥ 100% de las incidencias técnicas sean detectadas por el sistema de monitoreo interno antes de que se genere un ticket manual en Soporte.",
      status: "not-started",
      owner: "infra",
      dueDate: "2026-06-30",
    },
  ]);

  // ─── CS Key Results ────────────────────────────────────────────────────────
  await db.insert(keyResults).values([
    {
      id: ID.KR_CS_1_1,
      objectiveId: ID.O_CS_1,
      code: "KR 1.1",
      title: "≥ 99% de tickets de Etendo Classic resueltos dentro del SLO de tiempo de resolución",
      category: "SLO",
      targetValue: 99,
      targetUnit: "%",
      currentValue: 98,
      targetText: "Mantener el % de tickets de Etendo Classic resueltos dentro del SLO de tiempo de resolución en ≥ 99% (hoy: 98%).",
      status: "on-track",
      owner: "cs",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_CS_1_2,
      objectiveId: ID.O_CS_1,
      code: "KR 1.2",
      title: "% de tickets cerrados autónomamente por el agente de IA del 20% actual a ≥ 50%",
      category: "IA",
      targetValue: 50,
      targetUnit: "%",
      currentValue: 20,
      targetText: "Aumentar el % de tickets cerrados de forma autónoma por el agente de IA (sin intervención humana) del 20% actual a ≥ 50%.",
      status: "on-track",
      owner: "cs",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_CS_2_1,
      objectiveId: ID.O_CS_2,
      code: "KR 2.1",
      title: "Onboarding reducido a ≤ X pasos obligatorios para primera transacción real",
      category: "Diseño",
      targetValue: null,
      targetUnit: "steps",
      currentValue: null,
      targetText:
        "Reducir la complejidad del onboarding a un máximo de ≤ X pasos obligatorios para que un usuario realice su primera transacción real.",
      status: "not-started",
      owner: "cs",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_CS_2_2,
      objectiveId: ID.O_CS_2,
      code: "KR 2.2",
      title: "100% de dry-runs exitosos completados por personal no experto sin asistencia de CS",
      category: "Validación",
      targetValue: 100,
      targetUnit: "%",
      currentValue: 0,
      targetText:
        "Lograr que el 100% de las pruebas de usuario (dry-runs) sean exitosas con personal no experto de otras áreas, donde completen el flujo de configuración inicial al 100% sin asistencia del equipo de Customer Success.",
      status: "not-started",
      owner: "cs",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_CS_3_1,
      objectiveId: ID.O_CS_3,
      code: "KR 3.1",
      title: "100% de encuestas NPS/CSAT disparadas automáticamente según comportamiento del usuario",
      category: "Automatización de Feedback",
      targetValue: 100,
      targetUnit: "%",
      currentValue: 0,
      targetText:
        "Lograr que el 100% de las encuestas (NPS/CSAT) se disparen de forma automática en el producto según el comportamiento del usuario, sin intervención manual de Customer Success.",
      status: "not-started",
      owner: "cs",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_CS_3_2,
      objectiveId: ID.O_CS_3,
      code: "KR 3.2",
      title: "100% de fuentes críticas (Mixpanel, Soporte, Login) enviando datos en tiempo real al modelo de salud",
      category: "Integración de Datos",
      targetValue: 100,
      targetUnit: "%",
      currentValue: 0,
      targetText:
        "Asegurar que el 100% de las fuentes críticas (Mixpanel para uso, Soporte para tickets y Login para frecuencia) envíen datos en tiempo real al modelo de salud.",
      status: "not-started",
      owner: "cs",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_CS_3_3,
      objectiveId: ID.O_CS_3,
      code: "KR 3.3",
      title: "Dashboard de Salud (Health Score) activo con estado de test account actualizado cada 24 horas",
      category: "Visibilidad de Salud",
      targetValue: null,
      targetUnit: null,
      currentValue: null,
      targetText:
        "Tener un Dashboard de Salud (Health Score) activo que muestre el estado de una cuenta de prueba (test account) actualizado automáticamente cada 24 horas.",
      status: "not-started",
      owner: "cs",
      dueDate: "2026-06-30",
    },
    {
      id: ID.KR_CS_3_4,
      objectiveId: ID.O_CS_3,
      code: "KR 3.4",
      title: "100% de triggers de alerta para casos de riesgo configurados y probados exitosamente",
      category: "Sistema de Alertas",
      targetValue: 100,
      targetUnit: "%",
      currentValue: 0,
      targetText:
        "Configurar y probar con éxito el 100% de los disparadores de alerta (Triggers) para casos de riesgo (ej. 48hs sin login o error crítico detectado en logs).",
      status: "not-started",
      owner: "cs",
      dueDate: "2026-06-30",
    },
  ]);

  console.log("Seed complete.");
  console.log("  Members:     3 (Lucas Palacios, Lucas Aguirre, Juan Funes)");
  console.log("  Teams:       2");
  console.log("  Objectives:  7 (4 Infra + 3 CS)");
  console.log("  Key Results: 19 (11 Infra + 8 CS)");
}

// ─── Standalone execution (npm run db:seed) ───────────────────────────────────
// Detects if this file is the entry point (not imported as a module)
async function runStandalone() {
  const { db, client } = await import("./client.js");
  const { sql } = await import("drizzle-orm");
  const { teams: teamsTable } = await import("./schema/index.js");

  const [{ count }] = await db.select({ count: sql`count(*)` }).from(teamsTable);
  if (Number(count) > 0) {
    console.log("Database already has data — skipping seed.");
  } else {
    await seedDatabase(db);
  }
  await client.end();
}

// ESM-safe "is main module" check
const selfUrl = new URL(import.meta.url).pathname;
const argPath = process.argv[1] ? new URL(process.argv[1], "file://").pathname : "";
if (selfUrl === argPath) {
  runStandalone().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

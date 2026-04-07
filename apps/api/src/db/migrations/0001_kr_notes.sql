-- Add brief descriptions (notes) to all existing key results
--> statement-breakpoint

UPDATE key_results SET notes = 'Cada merge a main dispara el deploy a staging automáticamente, sin que nadie ejecute un comando. El deploy a producción requiere solo un clic de aprobación.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'infra' AND o.code = 'O1' AND kr.code = 'KR 1.1');
--> statement-breakpoint

UPDATE key_results SET notes = 'Desde que el código entra hasta que corre en staging deben pasar menos de 15 minutos. Pipelines lentos bloquean la cadencia de entrega del equipo.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'infra' AND o.code = 'O1' AND kr.code = 'KR 1.2');
--> statement-breakpoint

UPDATE key_results SET notes = 'Hito que marca el primer deploy real a producción usando el pipeline completo, sin intervención manual. El punto de no retorno del CI/CD.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'infra' AND o.code = 'O1' AND kr.code = 'KR 1.3');
--> statement-breakpoint

UPDATE key_results SET notes = 'Si el frontend tiene un bug en producción, revertir a la versión anterior debe tardar menos de 2 minutos. Se mide con un re-deploy de la imagen anterior.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'infra' AND o.code = 'O2' AND kr.code = 'KR 2.1');
--> statement-breakpoint

UPDATE key_results SET notes = 'Lo mismo para los servicios de backend: ante cualquier fallo tras un deploy, la imagen anterior debe estar corriendo en menos de 5 minutos.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'infra' AND o.code = 'O2' AND kr.code = 'KR 2.2');
--> statement-breakpoint

UPDATE key_results SET notes = 'Si una migración de base de datos rompe el esquema, restaurar el snapshot de antes del deploy debe tomar menos de 30 minutos para limitar la pérdida de datos.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'infra' AND o.code = 'O2' AND kr.code = 'KR 2.3');
--> statement-breakpoint

UPDATE key_results SET notes = 'RPO (Recovery Point Objective) define cuántos datos máximo podemos perder. Con backups automáticos y validados, garantizamos que ese número sea menor a X horas.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'infra' AND o.code = 'O3' AND kr.code = 'KR 3.1');
--> statement-breakpoint

UPDATE key_results SET notes = 'RTO (Recovery Time Objective) define cuánto tarda en volver el servicio tras un desastre total. Se valida haciendo un drill de recuperación real desde cero.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'infra' AND o.code = 'O3' AND kr.code = 'KR 3.2');
--> statement-breakpoint

UPDATE key_results SET notes = 'Cero credenciales hardcodeadas en código o archivos de config. Todo en AWS Secrets Manager, rotable automáticamente sin necesidad de tocar el código.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'infra' AND o.code = 'O3' AND kr.code = 'KR 3.3');
--> statement-breakpoint

UPDATE key_results SET notes = 'CPU alta, memoria llena, base de datos caída — todas estas alertas críticas deben llegar automáticamente al equipo antes de que el cliente note algún problema.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'infra' AND o.code = 'O4' AND kr.code = 'KR 4.1');
--> statement-breakpoint

UPDATE key_results SET notes = 'La meta es que el monitoreo detecte el 100% de los incidentes antes de que CS reciba un ticket. Si el cliente avisa primero, el sistema falló.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'infra' AND o.code = 'O4' AND kr.code = 'KR 4.2');
--> statement-breakpoint

UPDATE key_results SET notes = 'El SLO de resolución ya está en 98%. La meta es llevarlo al 99% y mantenerlo durante todo Q2, sin degradación frente al crecimiento del volumen.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'cs' AND o.code = 'O1' AND kr.code = 'KR 1.1');
--> statement-breakpoint

UPDATE key_results SET notes = 'Hoy el agente de IA cierra el 20% de los tickets sin intervención humana. La meta es llegar al 50%: uno de cada dos tickets resueltos solos.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'cs' AND o.code = 'O1' AND kr.code = 'KR 1.2');
--> statement-breakpoint

UPDATE key_results SET notes = 'El flujo actual para hacer la primera transacción tiene demasiados pasos opcionales y confusos. La meta es definir el mínimo indispensable y forzar solo esos.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'cs' AND o.code = 'O2' AND kr.code = 'KR 2.1');
--> statement-breakpoint

UPDATE key_results SET notes = 'El onboarding se valida con personas de otras áreas (no expertas en el producto) que completen el flujo de configuración inicial sin asistencia de CS.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'cs' AND o.code = 'O2' AND kr.code = 'KR 2.2');
--> statement-breakpoint

UPDATE key_results SET notes = 'Las encuestas NPS/CSAT no se envían a mano. Se disparan solas según el comportamiento del usuario en el producto, en el momento de mayor relevancia.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'cs' AND o.code = 'O3' AND kr.code = 'KR 3.1');
--> statement-breakpoint

UPDATE key_results SET notes = 'El modelo de salud del cliente no sirve si los datos son viejos. Mixpanel (uso), Soporte (tickets) y Login (frecuencia) deben alimentarlo en tiempo real.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'cs' AND o.code = 'O3' AND kr.code = 'KR 3.2');
--> statement-breakpoint

UPDATE key_results SET notes = 'Un dashboard que cualquiera del equipo pueda abrir y ver al instante cómo está una cuenta de prueba, actualizado automáticamente cada 24 horas.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'cs' AND o.code = 'O3' AND kr.code = 'KR 3.3');
--> statement-breakpoint

UPDATE key_results SET notes = 'Alertas automáticas que avisan cuando un cliente lleva 48hs sin loguearse o cuando hay un error crítico en sus logs. No esperar a que el cliente llame.'
WHERE id = (SELECT kr.id FROM key_results kr JOIN objectives o ON kr.objective_id = o.id WHERE o.team_id = 'cs' AND o.code = 'O3' AND kr.code = 'KR 3.4');

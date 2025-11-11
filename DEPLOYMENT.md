# Guía de Deployment en Dokploy

## Variables de Entorno Requeridas

En Dokploy, configura las siguientes variables de entorno:

### Base de Datos
```
POSTGRES_USER=djvoting
POSTGRES_PASSWORD=TU_PASSWORD_SEGURO_AQUI
POSTGRES_DB=djvoting
```

### Aplicación
```
NODE_ENV=production
APP_PORT=5000
DOMAIN=tu-dominio.com
SESSION_SECRET=TU_SECRET_AQUI_GENERA_CON_openssl_rand_-base64_32
```

### Variables PostgreSQL (automáticas)
Estas se generan automáticamente basándose en las anteriores, pero si necesitas especificarlas:
```
DATABASE_URL=postgresql://djvoting:TU_PASSWORD@postgres:5432/djvoting
PGHOST=postgres
PGPORT=5432
PGUSER=djvoting
PGPASSWORD=TU_PASSWORD
PGDATABASE=djvoting
```

## Pasos para Deployment

1. **Clonar el repositorio en Dokploy**
   - URL: https://github.com/Mengi00/JWAwardsComposte.git
   - Branch: main

2. **Configurar Variables de Entorno**
   - Ir a la sección de Variables de Entorno
   - Agregar todas las variables mencionadas arriba
   - ⚠️ **IMPORTANTE**: Usar contraseñas seguras en producción

3. **Configurar Docker Compose**
   - Dokploy detectará automáticamente el `docker-compose.yml`
   - El servicio de PostgreSQL se iniciará primero y esperará estar "healthy"
   - La aplicación se iniciará después y ejecutará migraciones automáticamente

4. **Verificar el Health Check**
   - PostgreSQL tiene un health check que verifica cada 10 segundos
   - Período inicial de espera: 30 segundos
   - La aplicación no se iniciará hasta que PostgreSQL esté saludable

5. **Acceder a la Aplicación**
   - La aplicación estará disponible en el dominio configurado
   - Credenciales de admin por defecto:
     - Usuario: `admin`
     - Contraseña: `admin123`
   - ⚠️ **CAMBIAR LA CONTRASEÑA INMEDIATAMENTE DESPUÉS DEL PRIMER LOGIN**

## Troubleshooting

### Error: "dependency failed to start: container is unhealthy"

**Solución aplicada:**
- Se actualizó el health check de PostgreSQL para usar `$$POSTGRES_USER` en lugar de `${POSTGRES_USER:-djvoting}`
- Se agregó `start_period: 30s` para dar tiempo inicial a PostgreSQL
- Se removió la línea obsoleta `version: '3.8'`

### Si PostgreSQL falla al iniciar:

1. Verifica los logs del contenedor de PostgreSQL:
   ```bash
   docker logs awardsjw-frontend-48sfnv-postgres-1
   ```

2. Verifica que las variables de entorno estén configuradas correctamente en Dokploy

3. Asegúrate de que el volumen de datos no esté corrupto:
   - En Dokploy, elimina el volumen `postgres_data` y vuelve a deployar

### Si las migraciones fallan:

El script de entrypoint (`docker-entrypoint.sh`) maneja esto automáticamente:
- Primero intenta `npm run db:push`
- Si falla, intenta con `--force`
- Los errores de seed son no-críticos (por si los datos ya existen)

### Verificar que la aplicación esté corriendo:

```bash
docker ps | grep awardsjw
docker logs awardsjw-frontend-48sfnv-app-1
```

## Comandos Útiles

### Regenerar Session Secret
```bash
openssl rand -base64 32
```

### Ver logs en tiempo real
En Dokploy, usa la sección de Logs o:
```bash
docker logs -f awardsjw-frontend-48sfnv-app-1
```

### Acceder al contenedor
```bash
docker exec -it awardsjw-frontend-48sfnv-app-1 sh
```

### Resetear la base de datos
```bash
# En Dokploy, detén el servicio primero
docker volume rm awardsjw-frontend-48sfnv_postgres_data
# Luego vuelve a deployar
```

## Arquitectura

```
┌─────────────────────────────────────┐
│         Traefik (Dokploy)           │
│    (SSL/TLS con Let's Encrypt)      │
└─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│         App Container               │
│  - Node.js 20 Alpine                │
│  - Express Server                   │
│  - React Frontend (built)           │
│  - Puerto: 5000                     │
└─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│      PostgreSQL Container           │
│  - PostgreSQL 16 Alpine             │
│  - Puerto: 5432 (interno)           │
│  - Volumen persistente              │
└─────────────────────────────────────┘
```

## Notas de Seguridad

1. **Cambiar credenciales por defecto**: El usuario admin tiene contraseña `admin123` por defecto
2. **Variables de entorno**: Nunca commitear archivos `.env` con credenciales reales
3. **Session secret**: Usar un valor aleatorio y único para cada ambiente
4. **PostgreSQL password**: Usar una contraseña fuerte y única
5. **Backups**: Configurar backups regulares del volumen `postgres_data` en Dokploy

## Actualizaciones

Para actualizar la aplicación:

1. Push los cambios al repositorio en GitHub
2. En Dokploy, haz clic en "Rebuild & Redeploy"
3. Dokploy descargará los cambios y reconstruirá la imagen
4. Las migraciones se ejecutarán automáticamente

# Johnnie Walker DJ Awards 2024 - Voting Platform

## Project Overview
A voting platform for the Johnnie Walker DJ Awards 2024, featuring a neobrutalist design with Johnnie Walker's signature gold, black, and red color scheme. Users can vote for their favorite electronic music DJs across 8 categories.

## Features
- **Hero Section**: Full-screen hero with dramatic DJ festival imagery and geometric overlays
- **Participants Gallery**: Grid showcase of all 32 nominated DJs with professional photos and category labels
- **8 Voting Categories**: House, Techno, Progressive, Melodic Techno, Bass, Newcomer, Live Set, DJ of the Year
- **Voter Registration**: Form capturing nombre, RUT (Chilean ID), correo electrónico, teléfono
- **Vote Summary**: Review selections before submission
- **RUT Validation**: Prevents duplicate votes by validating unique Chilean RUT numbers
- **Dark/Light Mode**: Theme toggle with Johnnie Walker branding in both modes
- **Success Confirmation**: Post-vote confirmation page with trophy imagery
- **Real-Time Statistics**: Live voting statistics with Recharts pie charts showing percentages, auto-refresh every 5 seconds
- **Single-Page Flow**: Continuous scroll experience from Hero → Participants → Voting → Statistics

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query
- **Charts**: Recharts (Pie charts for statistics)

## Design System
- **Colors**: Gold (#F5A623), Black (#0A0A0A), White (#FAFAFA), Red accent
- **Typography**: Montserrat (900 weight for headings, 700 for body)
- **Borders**: 4px thick borders (neobrutalist style)
- **Border Radius**: 0 (sharp corners throughout)
- **Spacing**: Generous padding (8, 12, 16, 24 units)

## Project Structure
```
client/
  src/
    components/
      Hero.tsx - Full-screen hero section
      ParticipantsSection.tsx - Gallery of all 32 DJs with photos
      CategoryCard.tsx - Voting category with artist selection
      VoterForm.tsx - Registration form with RUT validation
      VoteSummary.tsx - Vote review before submission
      StatsSection.tsx - Real-time pie charts with voting statistics
      SuccessMessage.tsx - Post-vote confirmation
      ThemeToggle.tsx - Dark/light mode switcher
    pages/
      Home.tsx - Single-page continuous flow orchestration
server/
  routes.ts - API endpoints for vote submission and statistics
  storage.ts - Vote storage interface
shared/
  schema.ts - Database schema and Zod validators
attached_assets/
  stock_images/ - 32 DJ photos from stock image library
```

## API Endpoints
- `POST /api/votes` - Submit a vote (validates RUT uniqueness)
- `GET /api/votes/check/:rut` - Check if RUT has already voted
- `GET /api/votes` - Get all votes (admin)
- `GET /api/stats` - Get real-time voting statistics aggregated by category and artist

## Database Schema
```typescript
votes {
  id: uuid (primary key)
  nombre: text
  rut: text (unique)
  correo: text
  telefono: text
  voteData: text (JSON string of category votes)
  createdAt: timestamp
}
```

## User Flow
1. Land on hero section
2. Click "Votar Ahora" to start
3. View all 32 participants in photo gallery
4. Scroll to voting section and select favorite artist in each of 8 categories
5. Fill out voter registration form (nombre, RUT, correo, teléfono)
6. Review vote summary
7. Confirm and submit
8. See success message with trophy
9. View live statistics with pie charts showing vote distribution

## Validation Rules
- **Nombre**: Minimum 2 characters
- **RUT**: Format `12345678-9` (7-8 digits, dash, check digit)
- **Correo**: Valid email format
- **Teléfono**: 8-12 digits, optional + prefix
- **Vote Data**: Must vote in all 8 categories

## Running the Application
```bash
npm run dev
```
Application runs on port 5000 with Vite HMR.

## Implemented Features
✅ PostgreSQL database with full persistence
✅ RUT uniqueness validation preventing duplicate votes
✅ Complete end-to-end voting flow with confirmation
✅ Dark/light mode theming
✅ Responsive design for mobile and desktop
✅ Real-time voting statistics with Recharts pie charts and auto-refresh (5s interval)
✅ Single-page continuous scroll layout: Hero → Participants → Voting → Statistics
✅ Professional DJ photo gallery with 32 stock images mapped to nominees
✅ Percentage-based visualizations with legends and tooltips

## Deployment con Dokploy

### Requisitos Previos
- Servidor con Docker y Docker Compose instalados
- Dokploy configurado en tu servidor
- Acceso SSH al servidor

### Archivos de Configuración
El proyecto incluye:
- `Dockerfile` - Build multi-stage optimizado
- `docker-compose.yml` - PostgreSQL + aplicación
- `.dockerignore` - Optimización del build
- `.env.example` - Variables de entorno requeridas

### Pasos para Deployment

#### 1. Preparar Variables de Entorno
Copia `.env.example` a `.env` y configura:

```bash
# PostgreSQL Database Configuration
POSTGRES_USER=djvoting
POSTGRES_PASSWORD=tu_password_seguro_aqui
POSTGRES_DB=djvoting
POSTGRES_PORT=5432

# Application Configuration
APP_PORT=5000
NODE_ENV=production

# Database URL
DATABASE_URL=postgresql://djvoting:tu_password_seguro_aqui@postgres:5432/djvoting

# Session Secret (generar con: openssl rand -base64 32)
SESSION_SECRET=tu_session_secret_aqui
```

#### 2. Deployment en Dokploy

**Opción A: Usando Git Repository**
1. Sube el código a tu repositorio Git (GitHub, GitLab, etc.)
2. En Dokploy, crea una nueva aplicación
3. Conecta tu repositorio
4. Selecciona "Docker Compose" como tipo de deploy
5. Configura las variables de entorno desde el panel de Dokploy
6. Deploy automático

**Opción B: Deployment Manual**
1. Clona el repositorio en tu servidor:
```bash
git clone <tu-repo-url>
cd djvoting
```

2. Copia y configura el archivo de entorno:
```bash
cp .env.example .env
nano .env  # Edita las variables
```

3. Genera un SESSION_SECRET seguro:
```bash
openssl rand -base64 32
```

4. Ejecuta con Docker Compose:
```bash
docker-compose up -d
```

#### 3. Configurar Base de Datos
El primer deploy, ejecuta las migraciones:

```bash
# Accede al contenedor de la aplicación
docker exec -it djvoting-app sh

# Ejecuta push del schema
npm run db:push
```

#### 4. Verificar Deployment
```bash
# Ver logs
docker-compose logs -f app

# Verificar servicios
docker-compose ps

# Test de salud
curl http://tu-dominio:5000/api/votes
```

### Configuración de Dokploy

#### Variables de Entorno en Dokploy
En el panel de Dokploy, configura estas variables:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `DATABASE_URL`
- `SESSION_SECRET`
- `NODE_ENV=production`

#### Puertos y Dominio
- Puerto de la aplicación: `5000`
- Configura un dominio personalizado en Dokploy
- Dokploy manejará automáticamente SSL/TLS

### Mantenimiento

#### Actualizar la Aplicación
```bash
# Pull nuevos cambios
git pull origin main

# Rebuild y restart
docker-compose up -d --build
```

#### Backup de Base de Datos
```bash
# Crear backup
docker exec djvoting-postgres pg_dump -U djvoting djvoting > backup.sql

# Restaurar backup
docker exec -i djvoting-postgres psql -U djvoting djvoting < backup.sql
```

#### Ver Logs
```bash
# Logs de la aplicación
docker-compose logs -f app

# Logs de PostgreSQL
docker-compose logs -f postgres
```

#### Reiniciar Servicios
```bash
# Reiniciar solo la app
docker-compose restart app

# Reiniciar todo
docker-compose restart
```

### Troubleshooting

**Error de conexión a base de datos**
- Verifica que `DATABASE_URL` esté correctamente configurado
- Asegúrate que el servicio postgres esté healthy:
  ```bash
  docker-compose ps
  ```

**Puerto ya en uso**
- Cambia `APP_PORT` en `.env`
- Actualiza el mapping en `docker-compose.yml`

**Build falla**
- Verifica que node_modules esté en `.dockerignore`
- Limpia cache de Docker:
  ```bash
  docker-compose down
  docker system prune -a
  docker-compose up -d --build
  ```

### Seguridad en Producción

1. **Cambia todos los secretos** en `.env`
2. **Usa contraseñas fuertes** para PostgreSQL
3. **Configura firewall** para exponer solo puertos necesarios
4. **Habilita SSL** en Dokploy para el dominio
5. **Backups regulares** de la base de datos
6. **Monitoreo** de logs para detectar actividad sospechosa

### Recursos
- PostgreSQL Data: Volume persistente `postgres_data`
- Logs de aplicación: `./logs` (montado como volumen)
- Network: `djvoting-network` (bridge)

## Future Enhancements
- Admin dashboard with authentication
- Email confirmation system
- Anti-fraud measures beyond RUT validation
- Vote editing within time window

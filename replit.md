# Johnnie Walker DJ Awards 2024 - Voting Platform

## Project Overview
A voting platform for the Johnnie Walker DJ Awards 2024, featuring a neobrutalist design with Johnnie Walker's signature gold, black, and red color scheme. Users can vote for their favorite electronic music DJs across 8 categories.

## Features
- **Landing Page (/)**: Full-screen hero + participants collage + live statistics
- **Hero Section**: Dramatic DJ festival imagery with "VOTAR AHORA" button linking to voting page
- **Participants Collage**: Dynamic vertical stripe layout showing DJs grouped by category, fetched from database with hover effects revealing DJ names and bios
- **Real-Time Statistics**: Simplified live voting statistics with big numbers, progress bars, and leader badges, auto-refresh every 5 seconds
- **Voting Page (/votar)**: Dedicated page for voting flow
- **8 Voting Categories**: House, Techno, Progressive, Melodic Techno, Bass, Newcomer, Live Set, DJ of the Year
- **Voter Registration**: Form capturing nombre, RUT (Chilean ID), correo electrónico, teléfono
- **Vote Summary**: Review selections before submission
- **RUT Validation**: Prevents duplicate votes by validating unique Chilean RUT numbers
- **Dark/Light Mode**: Theme toggle with Johnnie Walker branding in both modes
- **Success Confirmation**: Post-vote confirmation page with trophy imagery

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query
- **Visualizations**: Progress bars and simplified stats (no heavy charting libraries)

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
      Hero.tsx - Full-screen hero with voting status conditional button
      ParticipantsSection.tsx - Vertical stripe collage of DJs grouped by category from database
      CategoryCard.tsx - Voting category with artist selection
      VoterForm.tsx - Registration form with RUT validation
      VoteSummary.tsx - Vote review before submission
      StatsSection.tsx - Simplified real-time stats with progress bars and leader badges
      WinnersSection.tsx - Winners display (shown when voting closed)
      SuccessMessage.tsx - Post-vote confirmation
      ThemeToggle.tsx - Dark/light mode switcher
    pages/
      Home.tsx - Landing page with voting status awareness
      Voting.tsx - Voting flow with closed status handling
      admin/
        Login.tsx - Admin authentication page
        AdminLayout.tsx - Admin pages layout with sidebar
        Dashboard.tsx - Main admin dashboard
        Categories.tsx - Category CRUD management
        DJs.tsx - DJ CRUD management
        Assignments.tsx - DJ-Category assignment interface
        Voters.tsx - Voters table with pagination and export
      not-found.tsx - 404 page
server/
  routes.ts - All API endpoints (public + admin)
  storage.ts - Complete storage interface
  middleware/
    auth.ts - Authentication middleware
  seed.ts - Database seed script (admin user)
shared/
  schema.ts - Complete database schema and validators
attached_assets/
  stock_images/ - 32 DJ photos from stock image library
```

## API Endpoints

### Public Endpoints
- `GET /api/settings` - Get voting status (votingOpen: boolean)
- `POST /api/votes` - Submit a vote (validates RUT uniqueness and voting status)
- `GET /api/votes/check/:rut` - Check if RUT has already voted
- `GET /api/stats` - Get real-time voting statistics aggregated by category and artist
- `GET /api/categories` - Get all categories
- `GET /api/djs` - Get all DJs
- `GET /api/djs/category/:categoryId` - Get DJs by category
- `GET /api/dj-categories` - Get all DJ-category assignments (for building voting ballot)

### Admin Endpoints (require authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Check authentication status
- `PUT /api/admin/settings` - Update voting status
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/djs` - Get all DJs
- `POST /api/admin/djs` - Create DJ
- `PUT /api/admin/djs/:id` - Update DJ
- `DELETE /api/admin/djs/:id` - Delete DJ
- `GET /api/admin/dj-categories` - Get all DJ-category assignments
- `POST /api/admin/dj-categories` - Assign DJ to category
- `DELETE /api/admin/dj-categories` - Remove DJ from category
- `GET /api/admin/voters?page=1&limit=10` - Get paginated voters
- `GET /api/admin/voters/export` - Export voters to Excel

## Database Schema
```typescript
votes {
  id: varchar (uuid primary key)
  nombre: text
  rut: text (unique)
  correo: text
  telefono: text
  voteData: text (JSON string of category votes)
  createdAt: timestamp
}

admins {
  id: varchar (uuid primary key)
  username: text (unique)
  passwordHash: text
  createdAt: timestamp
}

settings {
  id: varchar (uuid primary key)
  key: text (unique)
  value: text
  updatedAt: timestamp
}

categories {
  id: varchar (uuid primary key)
  name: text
  description: text
  order: integer
  createdAt: timestamp
}

djs {
  id: varchar (uuid primary key)
  name: text
  photo: text (nullable)
  bio: text (nullable)
  createdAt: timestamp
}

djCategories {
  id: varchar (uuid primary key)
  djId: varchar (foreign key -> djs.id)
  categoryId: varchar (foreign key -> categories.id)
  createdAt: timestamp
}
```

## User Flow

### Landing Page (/)
1. Land on hero section with "VOTAR AHORA" button
2. Scroll down to view all 32 participants in photo gallery
3. Continue scrolling to see live statistics with progress bars and leader badges

### Voting Page (/votar)
1. Click "Votar Ahora" to navigate to voting page
2. Select favorite artist in each of 8 categories
3. Fill out voter registration form (nombre, RUT, correo, teléfono)
4. Review vote summary
5. Confirm and submit
6. See success message with trophy
7. Return to home page

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
✅ Real-time voting statistics with simplified progress bars and auto-refresh (5s interval)
✅ Two-page architecture: Landing page (/) and Voting page (/votar)
✅ Landing page with Hero + Participants + Statistics
✅ Dedicated voting page with complete flow
✅ Professional DJ photo gallery with 32 stock images mapped to nominees
✅ Percentage-based visualizations with legends and tooltips
✅ Wouter routing for client-side navigation

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

## Admin Panel

### Access
- URL: `/admin/login`
- Default credentials:
  - Username: `admin`
  - Password: `admin123`

### Features
1. **Dashboard** (`/admin`)
   - Total votes, DJs, categories statistics
   - Voting control: Open/Close voting with toggle switch
   - Quick navigation to all sections

2. **Categories Management** (`/admin/categories`)
   - Create, edit, delete categories
   - Set display order
   - Categories table with inline actions

3. **DJs Management** (`/admin/djs`)
   - Create, edit, delete DJs
   - Add DJ photos (URL), bio
   - Avatar preview in table

4. **DJ-Category Assignments** (`/admin/assignments`)
   - Assign DJs to categories
   - Two-column interface: categories + DJs
   - Add/remove assignments

5. **Voters Table** (`/admin/voters`)
   - Paginated table (10 per page)
   - View all voter information
   - Export to Excel (downloadable .xlsx file)

### Voting Control
- When voting is CLOSED:
  - "Votar Ahora" button hidden on home page
  - Voting page shows "Votaciones Cerradas" message
  - Winners section appears on home page showing top voted DJ per category
  - Vote submission API blocked (403 error)

- When voting is OPEN:
  - Normal voting flow enabled
  - Winners section hidden
  - Public can submit votes

## Future Enhancements
- Email confirmation system
- Anti-fraud measures beyond RUT validation
- Vote editing within time window
- Image upload for DJ photos (currently URL-based)

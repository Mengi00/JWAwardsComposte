# Johnnie Walker DJ Awards 2024 - Voting Platform

## Project Overview
A voting platform for the Johnnie Walker DJ Awards 2024, featuring a neobrutalist design with Johnnie Walker's signature gold, black, and red color scheme. Users can vote for their favorite electronic music DJs across 8 categories.

## Features
- **Hero Section**: Full-screen hero with dramatic DJ festival imagery and geometric overlays
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
      CategoryCard.tsx - Voting category with artist selection
      VoterForm.tsx - Registration form with RUT validation
      VoteSummary.tsx - Vote review before submission
      SuccessMessage.tsx - Post-vote confirmation
      ThemeToggle.tsx - Dark/light mode switcher
    pages/
      Home.tsx - Main voting flow orchestration
server/
  routes.ts - API endpoints for vote submission
  storage.ts - Vote storage interface
shared/
  schema.ts - Database schema and Zod validators
```

## API Endpoints
- `POST /api/votes` - Submit a vote (validates RUT uniqueness)
- `GET /api/votes/check/:rut` - Check if RUT has already voted
- `GET /api/votes` - Get all votes (admin)

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
3. Select favorite artist in each of 8 categories
4. Fill out voter registration form (nombre, RUT, correo, teléfono)
5. Review vote summary
6. Confirm and submit
7. See success message with trophy

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

## Future Enhancements
- Admin dashboard for viewing vote statistics
- Real-time vote count updates
- Email confirmation system
- Anti-fraud measures beyond RUT validation
- Vote editing within time window

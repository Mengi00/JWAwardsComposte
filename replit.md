# Johnnie Walker DJ Awards 2024 - Voting Platform

## Overview
This project is a voting platform for the Johnnie Walker DJ Awards 2024, designed with a neobrutalist aesthetic incorporating Johnnie Walker's signature gold, black, and red colors. Its primary purpose is to allow users to vote for their favorite electronic music DJs across 8 distinct categories. The platform features a dynamic landing page with real-time statistics, a comprehensive voting flow with voter registration and RUT validation, and an administrative panel for managing content and voting status.

## User Preferences
I prefer iterative development, with a focus on delivering core functionality first. I appreciate clear, concise explanations and prefer that you ask before making major architectural changes or introducing new dependencies.

## System Architecture

### UI/UX Decisions
The platform utilizes a neobrutalist design characterized by a gold, black, and red color scheme, 4px thick borders, and sharp, zero-radius corners. Typography is Montserrat, with 900 weight for headings and 700 for body text. Generous spacing is applied throughout. The design includes a dark/light mode toggle.

### Technical Implementations
The frontend is built with React and TypeScript, styled using Tailwind CSS and Shadcn UI. State management is handled by TanStack Query, and forms utilize React Hook Form with Zod validation. Routing is managed by Wouter. The backend is an Express.js and Node.js application. Data persistence is managed with PostgreSQL using Drizzle ORM. Real-time statistics are simplified with progress bars and badges, refreshing every 5 seconds.

### Feature Specifications
-   **Landing Page**: Displays a hero section, a dynamic collage of participants grouped by category, and simplified live voting statistics.
-   **Voting Page**: Guides users through selecting a DJ in each of 8 categories (House, Techno, Progressive, Melodic Techno, Bass, Newcomer, Live Set, DJ of the Year), followed by a registration form (nombre, RUT, correo electrónico, teléfono), a vote summary, and submission.
-   **Voter Validation**: Implements unique Chilean RUT validation to prevent duplicate votes.
-   **Admin Panel**: Provides a secure interface for administrators to manage categories, DJs, DJ-category assignments, view voter data, and control the voting status (open/closed).
-   **Voting Control**: The platform dynamically adjusts its public-facing features based on whether voting is open or closed, displaying winners when closed.

### System Design Choices
The application follows a client-server architecture with a clear separation of concerns. The backend exposes both public and authenticated admin API endpoints. Database schema includes tables for `votes`, `admins`, `settings`, `categories`, `djs`, and `djCategories`. Deployment is facilitated via Docker and Docker Compose, with Dokploy integration for automated builds, environment management, and Traefik for routing and SSL. Migrations and seeding are automated on container startup.

## External Dependencies
-   **Database**: PostgreSQL
-   **ORM**: Drizzle ORM
-   **Deployment**: Docker, Docker Compose, Dokploy (for CI/CD, Traefik integration, Let's Encrypt SSL)
-   **Frontend Libraries**: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter, React Hook Form, Zod, TanStack Query
-   **Backend Libraries**: Express.js, Node.js
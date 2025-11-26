# ProManage - Business Management Application

## Overview

ProManage is a comprehensive business management platform designed for service professionals. The application provides tools for managing appointments, clients, invoices, and financial transactions. Built as a full-stack TypeScript application, it uses a modern tech stack with React on the frontend and Express on the backend, connected to a PostgreSQL database through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Client-side routing using Wouter (lightweight alternative to React Router)

**UI Component System**
- Radix UI primitives for accessible, headless components
- shadcn/ui design system with the "new-york" style variant
- Tailwind CSS v4 for styling with custom design tokens
- Lucide React for iconography

**State Management**
- TanStack Query (React Query) for server state management
- Custom hooks for local UI state
- Form state managed through React Hook Form with Zod validation

**Project Structure**
- `/client/src/pages` - Route components (Dashboard, Calendar, Clients, Finances, Invoices)
- `/client/src/components` - Reusable UI components
- `/client/src/lib` - Utility functions and API client
- `/client/src/hooks` - Custom React hooks

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Separate entry points for development (`index-dev.ts`) and production (`index-prod.ts`)
- Development mode integrates Vite middleware for HMR
- Production mode serves pre-built static assets

**API Design**
- RESTful API endpoints under `/api` prefix
- CRUD operations for appointments, clients, invoices, and transactions
- Request validation using Zod schemas
- Centralized error handling

**Database Layer**
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL as the database provider
- WebSocket connection pooling for serverless compatibility
- Schema-first approach with TypeScript types inferred from database schema

### Data Storage

**Database Schema**
The application uses four main tables:

1. **Appointments** - Scheduling and appointment tracking
   - Fields: title, client name, date, time, duration, location, type, status
   - Default status: "Pending"

2. **Clients** - Customer relationship management
   - Fields: name, company, email, phone, location, status, tags
   - Default status: "Lead"
   - Tags stored as PostgreSQL array

3. **Invoices** - Billing and invoice management
   - Fields: invoice number, client, amount, status, due date, items
   - Status tracking (Draft, Sent, Paid, Overdue)

4. **Transactions** - Financial transaction records
   - Fields: title, amount, type (income/expense), client reference
   - Date tracking with automatic timestamps

**Data Access Pattern**
- Repository pattern through `DatabaseStorage` class
- All queries return promises for async/await usage
- Automatic timestamp management on creation

### Code Organization

**Shared Code**
- `/shared/schema.ts` - Database schema definitions and Zod validators
- Shared types between frontend and backend for type safety
- Insert schemas auto-generated from table definitions

**Type Safety**
- Path aliases configured for cleaner imports (`@/`, `@shared/`)
- Strict TypeScript configuration
- Runtime validation with Zod matching compile-time types

**Development Workflow**
- Hot module replacement in development
- Separate build processes for client and server
- Database migrations managed through Drizzle Kit

## External Dependencies

**Database & ORM**
- Neon Serverless PostgreSQL - Cloud-hosted PostgreSQL database
- Drizzle ORM - TypeScript ORM with type inference
- Drizzle Kit - Schema migrations and management
- WebSocket support via `ws` package for Neon connection

**UI Component Libraries**
- Radix UI - Comprehensive set of accessible component primitives
- Recharts - Chart visualization library
- date-fns - Date manipulation and formatting
- Embla Carousel - Carousel/slider functionality
- Vaul - Drawer component library

**Development Tools**
- Replit-specific plugins for Vite (runtime error modal, dev banner, cartographer)
- Custom Vite plugin for meta image URL updates
- ESBuild for production server bundling

**Form & Validation**
- React Hook Form - Form state management
- Zod - Schema validation
- @hookform/resolvers - Integration between React Hook Form and Zod

**Styling**
- Tailwind CSS v4 - Utility-first CSS framework
- PostCSS with Autoprefixer
- class-variance-authority - Type-safe variant generation
- tailwind-merge & clsx - Class name utilities
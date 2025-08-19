# Reply Baba - AI-Powered Text Reply Generator

## Overview

Reply Baba is an AI-powered web application that helps users generate contextually appropriate text message replies. Users paste incoming messages, select the sender relationship and desired mood, then receive AI-generated responses they can copy instantly. The application features a modern React frontend with a Node.js/Express backend that integrates with OpenAI's API for intelligent reply generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses **React with TypeScript** built on Vite for fast development and optimized builds. The architecture follows modern React patterns:

- **Component Library**: shadcn/ui components built on Radix UI primitives provide accessible, customizable UI elements
- **Styling**: Tailwind CSS with custom CSS variables for consistent theming and responsive design
- **State Management**: TanStack React Query handles server state management and caching
- **Routing**: Wouter provides lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation ensures type-safe form processing

### Backend Architecture
The server uses **Express.js with TypeScript** in an ESM configuration:

- **API Layer**: RESTful endpoints handle reply generation and health checks
- **Service Layer**: Dedicated OpenAI service manages AI interaction and prompt engineering
- **Storage Layer**: Modular storage interface with in-memory implementation (ready for database integration)
- **Middleware**: Custom logging middleware tracks API performance and responses

### Data Layer
Currently uses **in-memory storage** with interfaces designed for easy database migration:

- **Schema Definition**: Drizzle ORM with Zod validation defines PostgreSQL-ready schemas
- **Database Configuration**: Pre-configured for Neon Database with connection pooling
- **Type Safety**: Full TypeScript integration from database to API responses

### Authentication & Security
Basic security patterns are established:

- **Input Validation**: Zod schemas validate all API inputs
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Environment Configuration**: Secure API key management for OpenAI integration

### AI Integration
OpenAI GPT-4o integration powers intelligent reply generation:

- **Prompt Engineering**: Context-aware prompts consider relationship dynamics and mood requirements
- **Response Processing**: Structured response handling with fallback error management
- **Rate Limiting**: Ready for production rate limiting and usage monitoring

### Development & Build
Modern development tooling ensures code quality and deployment readiness:

- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Type Checking**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Development Server**: Hot reloading with Vite development server integration
- **Static Assets**: Organized asset management with path resolution

## External Dependencies

### Core Services
- **OpenAI API**: GPT-4o model for intelligent text reply generation
- **Neon Database**: PostgreSQL hosting with serverless scaling (configured but not yet utilized)

### UI & Styling
- **Radix UI**: Headless component primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library for UI elements

### Development Tools
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form handling with validation integration
- **Zod**: Runtime type validation and schema definition

### Build & Deployment
- **Vite**: Frontend build tool with development server
- **esbuild**: Fast TypeScript compilation for backend
- **tsx**: TypeScript execution for development workflow
# CleanAI - Data Cleansing Platform

## Overview

CleanAI is a comprehensive full-stack data cleansing and deduplication web application with a modern, futuristic UI design. The platform enables users to connect to various data sources, upload files, inspect schemas, define cleansing rules, configure deduplication logic, and monitor processing jobs. Built with a focus on production-ready architecture, the application features a clean, gradient-enhanced design with both light and dark theme support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using **React 18** with **TypeScript** and **Vite** for fast development and optimized builds. The architecture follows a component-based design pattern with clear separation of concerns:

- **UI Framework**: Radix UI components with shadcn/ui styling system for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas
- **Typography**: Custom font system using Roboto Slab for headings and Open Sans for body text
- **Theme System**: Built-in light/dark mode toggle with CSS custom properties

The frontend features a responsive shell layout with a sidebar navigation, header with breadcrumbs, and main content area. Key pages include Dashboard, Data Sources, File Upload, Schema Inspector, Cleansing Rules, Deduplication, and Jobs monitoring.

### Backend Architecture
The server is built with **Express.js** and **TypeScript** following a RESTful API design:

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js with middleware for JSON parsing, CORS, and error handling
- **API Design**: RESTful endpoints organized by resource (data sources, datasets, rules, jobs)
- **Development**: Hot reloading with Vite integration for seamless full-stack development
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

API endpoints are organized around core entities:
- Data Sources: CRUD operations and connection testing
- Datasets: File management and schema inspection
- Cleansing Rules: Data transformation rule configuration
- Deduplication Rules: Duplicate detection logic setup
- Jobs: Processing task management and monitoring

### Data Storage Solutions
The application uses **Drizzle ORM** with **PostgreSQL** as the primary database:

- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Database**: PostgreSQL with Neon serverless driver for production deployment
- **Schema Management**: Centralized schema definitions in TypeScript with automatic type generation
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Migration System**: Drizzle Kit for database schema migrations

The database schema includes tables for users, data sources, datasets, cleansing rules, deduplication rules, and processing jobs, with proper relationships and indexing.

### Authentication and Authorization
The system implements a token-based authentication mechanism:

- **Strategy**: JWT-based authentication for stateless session management
- **User Management**: User registration and login with encrypted password storage
- **Session Handling**: Token-based authentication with proper expiration and refresh logic
- **Security**: Password hashing and secure credential storage for data source connections

### Design System and UI Architecture
The application features a comprehensive design system built on modern CSS practices:

- **Color System**: CSS custom properties with primary, secondary, and tertiary color schemes
- **Gradient System**: Utility classes for hero sections, buttons, and accent elements
- **Border Radius**: Consistent 2xl (1.5rem) radius throughout the application
- **Typography**: Font hierarchy with Roboto Slab for headings and Open Sans for body text
- **Spacing**: Grid-based responsive layout with consistent spacing tokens
- **Shadows**: Subtle shadow system for depth without heavy drop shadows
- **Animations**: Smooth transitions and hover effects using CSS transitions

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching layer
- **wouter**: Lightweight routing library for single-page application navigation
- **react-hook-form** with **@hookform/resolvers**: Form handling and validation
- **zod**: Runtime type validation and schema definition

### UI and Styling Dependencies
- **@radix-ui/react-***: Comprehensive suite of accessible UI primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework for responsive design
- **class-variance-authority**: Type-safe variant API for component styling
- **clsx**: Conditional className utility for dynamic styling

### Database and ORM
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Integration between Drizzle schema and Zod validation
- **@neondatabase/serverless**: PostgreSQL driver optimized for serverless environments
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Development and Build Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking and enhanced developer experience
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution engine for development

### Additional Utilities
- **date-fns**: Date manipulation and formatting library
- **cmdk**: Command palette component for enhanced user experience
- **embla-carousel-react**: Carousel component for image and content galleries
- **lucide-react**: Modern icon library with consistent design

### Replit-Specific Integrations
- **@replit/vite-plugin-cartographer**: Development tooling integration
- **@replit/vite-plugin-dev-banner**: Development environment indicators
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting during development

The application is designed to be deployed on Replit with seamless integration of development tools while maintaining production-ready architecture patterns.
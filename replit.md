# Overview

MaterialMart is a construction materials marketplace MVP that connects material owners (sellers/disposers) with material seekers (buyers). The platform enables users to list construction materials they want to sell or dispose of, while allowing others to browse, search, and contact sellers directly. Built as a full-stack web application with React frontend and Express backend, it focuses on facilitating offline transactions through initial online connections.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for home, browse materials, material details, add listings, dashboard, and authentication
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS styling
- **State Management**: TanStack Query (React Query) for server state management with custom query client configuration
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with custom CSS variables for theming and design system consistency

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with routes for authentication, materials CRUD operations, and user management
- **Data Storage**: In-memory storage implementation (MemStorage class) with interface for future database integration
- **Middleware**: Custom request logging middleware for API monitoring and debugging
- **Error Handling**: Centralized error handling with proper HTTP status codes and JSON responses

## Database Schema
- **Users Table**: Stores user authentication and profile information (username, email, password, name, phone, location)
- **Materials Table**: Contains material listings with details like title, description, category, condition, quantity, pricing, and seller relationship
- **Schema Validation**: Drizzle ORM with Zod for runtime validation and type safety
- **Database Config**: Configured for PostgreSQL with Drizzle migrations support

## Authentication & Authorization
- **Authentication**: Simple email/password authentication with user registration and login endpoints
- **Session Management**: Basic user state management without persistent sessions (development phase)
- **Authorization**: Seller-based authorization for material CRUD operations
- **Security**: Basic validation and error handling without advanced security features in MVP

## Component Architecture
- **Layout Components**: Reusable header and footer components with consistent navigation
- **Material Components**: Specialized components for material cards, category grids, and search filters
- **UI Components**: Comprehensive design system with buttons, forms, cards, dialogs, and other interactive elements
- **Page Components**: Route-specific components handling different application views and user flows

# External Dependencies

## Core Technologies
- **Neon Database**: PostgreSQL database service for production data storage
- **Drizzle ORM**: Type-safe database ORM with schema management and migrations
- **TanStack Query**: Server state management and caching for efficient data fetching
- **Shadcn/ui**: Design system and component library built on Radix UI

## Development Tools
- **Vite**: Fast build tool and development server with HMR support
- **TypeScript**: Type safety across frontend and backend with shared schema definitions
- **Tailwind CSS**: Utility-first CSS framework for responsive design and theming
- **ESBuild**: Fast JavaScript bundler for production builds

## UI and Styling
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating component variants with Tailwind
- **Font Awesome**: Icon library for material category representations

## Form and Validation
- **React Hook Form**: Performant form library with validation integration
- **Zod**: TypeScript-first schema validation for runtime type checking
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

## Replit Integration
- **Replit Plugins**: Development environment enhancements including error modal, cartographer, and dev banner
- **Runtime Error Overlay**: Enhanced development experience with better error reporting
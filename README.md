# Task Manager

A modern, feature-rich task management application built with Next.js 16, Clean Architecture principles, and Docker support.

## Short Demo Video

https://www.loom.com/share/cd413ab42fd84312b935796f59bf10af

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Task Management**: Create, read, update, delete, and filter tasks
- **Status Management**: Visual task status with colored indicators (To Do, In Progress, Done)
- **Clean Architecture**: Domain-driven design with separated concerns
- **Modern UI**: Beautiful interface using shadcn/ui components
- **Dark/Light Theme**: Built-in theme switching
- **Docker Support**: Full containerization for development and production
- **Type Safety**: Complete TypeScript implementation
- **Testing**: Unit tests for domain logic

## 🏗️ Architecture

This application follows Clean Architecture principles:

### **Domain Layer** (`src/domain/`)

- **Entities**: Core business models (User, Task)
- **Use Cases**: Application business logic (CreateTaskUseCase, LoginUseCase)
- **Repository Interfaces**: Contracts for data access

### **Data Layer** (`src/data/`)

- **Repository Implementations**: Concrete implementations using Prisma
- **Data Source**: Database connection and configuration
- **Authentication Service**: JWT token management

### **Presentation Layer** (`src/app/`)

- **API Routes**: Next.js API endpoints
- **UI Components**: React components with shadcn/ui
- **Pages**: Application pages and layouts

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **UI Framework**: shadcn/ui (New York style)
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **Testing**: Vitest with React Testing Library
- **Containerization**: Docker with multi-stage builds

## 📋 Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun
- Docker and Docker Compose (for containerized development)
- Git

## 🚀 Getting Started

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Docker Development

1. **Start the development environment**

   ```bash
   npm run docker:dev
   ```

2. **Stop the development environment**
   ```bash
   npm run docker:dev:down
   ```

### Docker Production

1. **Set up production environment**

   ```bash
   cp .env.docker .env
   # Edit .env with secure JWT_SECRET
   ```

2. **Start production environment**

   ```bash
   npm run docker:prod
   ```

3. **Stop production environment**
   ```bash
   npm run docker:prod:down
   ```

## 📱 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Run tests with UI

# Docker
npm run docker:dev       # Start development container
npm run docker:dev:down  # Stop development container
npm run docker:prod      # Start production container
npm run docker:prod:down # Stop production container
npm run docker:logs      # View container logs
npm run docker:clean     # Clean up containers and volumes
```

## 🎯 Application Features

### Authentication

- **User Registration**: Sign up with email and password
- **User Login**: Secure authentication with JWT tokens
- **Session Management**: HTTP-only cookies for security
- **Auto-logout**: Token-based session handling

### Task Management

- **Create Tasks**: Add new tasks with title and optional description
- **Edit Tasks**: Update task details through modal interface
- **Delete Tasks**: Remove tasks with confirmation dialog
- **Status Management**: Visual status selector with color coding
  - 🟡 **To Do**: Pending tasks
  - 🔵 **In Progress**: Active tasks
  - 🟢 **Done**: Completed tasks
- **Task Filtering**: Filter tasks by status (All, To Do, In Progress, Done)

### User Interface

- **Responsive Design**: Works on all screen sizes
- **Dark/Light Theme**: Toggle between themes
- **Modern Components**: shadcn/ui component library
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── tasks/         # Task management endpoints
│   │   └── health/        # Health check endpoint
│   ├── components/        # React components
│   │   ├── auth/          # Authentication components
│   │   ├── tasks/         # Task management components
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── navigation-header.tsx
│   └── lib/               # Utility functions
├── domain/                # Clean Architecture Domain Layer
│   ├── entities/          # Business entities
│   ├── repositories/      # Repository interfaces
│   └── usecases/          # Application use cases
├── data/                  # Clean Architecture Data Layer
│   ├── datasource/        # Database connections
│   └── repositories/      # Repository implementations
└── test/                  # Test configuration
```

## 🧪 Testing

The application includes comprehensive unit tests for the domain layer:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI interface
npm run test:ui
```

Tests focus on:

- Authentication use cases
- Task management use cases
- Business logic validation
- Error handling

## 🐳 Docker Configuration

### Development Dockerfile

- Node.js 20 Alpine base image
- Development dependencies
- Hot reload support
- Automatic database initialization

### Production Dockerfile

- Multi-stage build optimization
- Minimal production image
- Security best practices
- Health checks

### Environment Variables

- `DATABASE_URL`: SQLite database path
- `JWT_SECRET`: Secret for JWT token signing
- `NODE_ENV`: Environment mode (development/production)

## 🔧 Configuration

### Database Configuration

- **Type**: SQLite
- **ORM**: Prisma
- **Migrations**: Automatic schema synchronization
- **Location**: `./prisma/dev.db`

### Authentication Configuration

- **Token Type**: JWT
- **Storage**: HTTP-only cookies
- **Expiration**: 7 days
- **Security**: Secure and HttpOnly flags

## 📝 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```bash
# Build and run production container
npm run docker:prod
```

### Environment Requirements

- Node.js 20+
- SQLite support
- Secure JWT_SECRET in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or issues, please:

1. Check the [documentation](./docs/)
2. Search [existing issues](../../issues)
3. Create a [new issue](../../issues/new)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://www.prisma.io/) - Database toolkit
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library

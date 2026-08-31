# CrestWood School Management Dashboard

CrestWood is a comprehensive school management system built with modern web technologies. It provides a complete platform for managing students, teachers, classes, assignments, exams, attendances, and more.

## Overview

CrestWood is a full-stack school management dashboard that enables educational institutions to efficiently manage their academic operations. The system features role-based access control, allowing different users (administrators, teachers, students, and parents) to access tailored views and functionality.

To be able to see what was built live , you have to assume a role 
each role represents its respective username and password (these credentials are just dummy user accounts that let you view and understand what was built)

ADMIN --> username: admin , password: admin 
TEACHER --> username: teacher , password: teacher
PARENT --> username: parent , password: parent 
STUDENT --> username: student , password: student 


## Technology Stack

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **State Management**: React hooks and Context API
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Calendar**: React Big Calendar and React Calendar
- **Authentication**: Clerk for Next.js

### Backend
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Runtime**: Next.js API Routes

## Features

### User Roles
- **Administrator**: Full system access including user management, analytics, and configuration
- **Teacher**: Manage classes, subjects, grades, and student progress
- **Student**: View assignments, grades, and attendance records
- **Parent**: Monitor child progress and communicate with teachers

### Core Modules

#### Student Management
- Student enrollment and profile management
- Academic records tracking
- Attendance monitoring
- Grade and performance history
- Parent/guardian association

#### Teacher Management
- Teacher profiles and subject assignments
- Class supervision
- Lesson scheduling
- Grade submission

#### Academic Management
- Class and grade organization
- Subject management
- Lesson scheduling with calendar integration
- Assignment and exam scheduling

#### Assessment
- Exam creation and scheduling
- Assignment management
- Grade recording and analytics
- Performance tracking

#### Communication
- Announcements system
- Class-wide and global announcements
- Event calendar

## Project Structure

```
DASHBOARD_UI/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/       # Database migrations
├── public/
│   ├── logo.png         # Application logo
│   └── *.png           # Icon assets
└── src/
    ├── app/
    │   ├── (dashboard)/  # Main dashboard pages
    │   │   ├── admin/     # Admin dashboard
    │   │   ├── list/      # Data list pages
    │   │   ├── parent/    # Parent view
    │   │   ├── student/   # Student view
    │   │   └── teacher/   # Teacher view
    │   ├── [[...sign-in]]/  # Authentication
    │   └── globals.css   # Global styles
    ├── components/
    │   ├── forms/      # Form components
    │   └── *.tsx     # UI components
    ├── lib/
    │   ├── actions.ts     # Server actions
    │   ├── data.ts       # Data fetching
    │   ├── prisma.ts    # Prisma client
    │   └── utils.ts    # Utility functions
    └── generated/
        └── prisma/     # Generated Prisma client
```

## Database Schema

### Core Entities
- **Admin**: System administrators
- **Student**: Enrolled students
- **Teacher**: Faculty members
- **Parent**: Guardians
- **Grade**: Academic year levels
- **Class**: Scheduled classes
- **Subject**: Academic subjects
- **Lesson**: Scheduled lessons
- **Exam**: Scheduled examinations
- **Assignment**: Homework and projects
- **Result**: Student grades
- **Attendance**: Attendance records
- **Event**: School events
- **Announcement**: Public notices

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DASHBOARD_UI
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://user:password@localhost:5432/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## Authentication

The application uses Clerk for authentication. Users must sign in through the Clerk-powered authentication system. Role-based access is determined by the user's metadata set in Clerk.

## Building for Production

To create a production build:

```bash
npm run build
```

The built application can be started with:

```bash
npm start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Support

For issues or questions, please refer to the project documentation or contact the development team.

# Train Reservation System

A modern full-stack application for searching, booking, and managing train tickets. This project includes a **.NET backend API** and a **React + Vite frontend**, along with automated tests and an optional email notification service.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Getting Started](#getting-started)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
4. [Folder Structure](#folder-structure)
5. [Testing](#testing)
6. [Technology Stack](#technology-stack)
7. [Contributing](#contributing)
8. [License](#license)

## Features

- User registration & authentication (JWT)
- Search available trains by origin, destination, and date
- Book multiple passenger tickets in one request
- Download PDF tickets after booking
- Cancel individual passengers and calculate refund
- Check PNR status
- Admin endpoints for adding and managing trains
- Email notifications on booking and cancellation (feature branch)

## Prerequisites

- [.NET 8 SDK or later](https://dotnet.microsoft.com/download)
- [Node.js 16+](https://nodejs.org/) and npm (or yarn)
- Optional: PostgreSQL or SQL Server for database (configured via `appsettings.json`)

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Shreyansh284/Train_Reservation_System.git
cd Train_Reservation_System
```

### Backend Setup

1. Navigate to the `Backend` folder:
   ```bash
   cd Backend/WebApi
   ```
2. Restore NuGet packages and run the API:
   ```bash
   dotnet restore
   dotnet run --project WebApi.csproj
   ```
3. The backend will start on `https://localhost:5001` (or as configured).

### Frontend Setup

1. Navigate to the `Frontend` folder:
   ```bash
   cd ../../Frontend
   ```
2. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
3. The frontend will be available at `http://localhost:5173` by default.

## Folder Structure

```
Train_Reservation_System/
├── Backend/
│   ├── Application/        # Core application logic (CQRS, DTOs, mappings)
│   ├── Core/               # Domain entities, interfaces, options
│   ├── Infrastructure/     # Persistence (EF Core), repositories, services
│   └── WebApi/             # ASP.NET Core controllers, middleware, Program.cs
├── Frontend/               # React + Vite application
│   ├── public/             # Static assets
│   └── src/                # UI components, pages, hooks, utils
└── Tests/                  # Unit and integration test projects
	 ├── Application.Tests/
	 ├── Core.Tests/
	 ├── Infrastructure.Tests/
	 └── WebApi.Tests/
```

## Testing

Run all test suites from the solution root:

```bash
cd Backend
dotnet test Train_Reservation_System.sln
```

## Technology Stack

- Backend: ASP.NET Core 8, Entity Framework Core, SQL Server/PostgreSQL
- Frontend: React, TypeScript, Vite, Tailwind CSS
- PDF generation: `pdf-lib` utility in `frontend/src/utils/ticketPdf.ts`
- Authentication: JWT
- Email service: SMTP integration (feature branch)

## Notes

- Active refactoring is in progress across both backend and frontend modules.
- Unit test coverage is continuously being expanded and improved.

## Contributing

Contributions, issues, and feature requests are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

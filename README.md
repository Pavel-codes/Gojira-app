# Gojira - Task Management System

Gojira is a modern task management system built with React and Vite, inspired by Jira. It provides a clean and intuitive interface for managing tasks and projects.

## Features

- User authentication (AWS Cognito integration ready)
- Kanban board for task management
- Task creation and editing
- Priority levels (Low, Medium, High, Critical)
- Task status tracking (To Do, In Progress, Done)
- Responsive design
- Modern UI with Material-UI components

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd gojira-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── context/       # React context providers
  ├── utils/         # Utility functions
  └── assets/        # Static assets
```

## AWS Cognito Integration

To integrate AWS Cognito authentication:

1. Create an AWS Cognito User Pool
2. Configure the authentication settings in your AWS Console
3. Update the authentication configuration in the application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

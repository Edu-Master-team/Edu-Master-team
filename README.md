# Admin Dashboard

A production-ready, responsive admin dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Desktop sidebar + mobile drawer navigation
- **Dark Mode**: Toggle between light and dark themes with system preference detection
- **Modern UI**: Clean, accessible interface with rounded corners and soft shadows
- **Routing**: React Router DOM with nested routes
- **Components**: Modular, reusable components
- **Accessibility**: ARIA labels, keyboard navigation, and focus management

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** for styling
- **React Router DOM** for routing
- **Headless UI** for accessible components
- **Heroicons** for icons

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── Topbar.tsx      # Top navigation bar
├── pages/
│   ├── Dashboard.tsx   # Dashboard overview
│   ├── Orders.tsx      # Orders management
│   ├── Products.tsx    # Product catalog
│   ├── Customers.tsx   # Customer database
│   └── Settings.tsx    # Application settings
└── App.tsx             # Main app with routing
```

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Start the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Navigation

- **Desktop**: Fixed left sidebar (256px width)
- **Mobile**: Slide-over sidebar with backdrop
- **Active Route Highlighting**: Current page is highlighted in navigation

### Top Bar

- **Search**: Global search functionality
- **Dark Mode Toggle**: Switch between light/dark themes
- **Notifications**: Notification bell icon
- **User Menu**: Profile dropdown with sign out option

### Pages

- **Dashboard**: Overview with stats cards and recent activity
- **Orders**: Order management table with status indicators
- **Products**: Product catalog with inventory tracking
- **Customers**: Customer database with contact information
- **Settings**: Application configuration with form controls

### Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader friendly
- High contrast support

## Customization

The dashboard is built with Tailwind CSS utility classes, making it easy to customize:

- Colors: Modify the color scheme in component classes
- Spacing: Adjust padding and margins using Tailwind spacing utilities
- Typography: Change fonts and text sizes
- Components: Extend or modify existing components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

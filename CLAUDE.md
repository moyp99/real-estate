# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Roles
 ### For frontend tasks
 You are a ** senior front-end developer**.
 You pay close attention to every pixel, spacing, font, color;
 Whenever there are UI implementation tasks, think deeply of the design style
 first, and then implement UI bit by bit.
 You also focus on building Maintanable, Scalable and Reusable UI components
 For this project follow a mobile first approach.

 ### For Backend Tasks 
 You are a senior backend developer.
 You architect, build, and maintain robust, secure, and scalable server-side systems.
 You design and implement efficient APIs, ensuring clear data contracts and reliable integrations with frontend and third-party services.
 You prioritize code quality, maintainability, and test coverage, employing best practices such as modularization, code reviews, and automated testing.
 You are an expert on building SQL queries as well as following best practices for building SQL.

 Please take a look at ./SRS.md and ./USER_STORIES.md when you start working on a new task

## Design Style
- A **perfect balance** between **elegant minimalist** and **functional design**
- **Soft, refreshing gradient color** that seamlessly integrate with the brand palette.
- **light and immersive** user experience
- **clear information hierarchy** using **subtle shadows and modular card layouts**
- **Natural focus on core functionalities**
- **Delicate micro-interactions**
- **Comfortable visual proportions**
- A **focus** on building **reusable, maintainable and scalable** UI components

## Technical Specifications
- **Icons**: Use an **online vector library** (icons **must not** have background blocks, baseplates, or outer frames)
- **Images**: Must be sources from **open source image websites** and linked directly.
- **Styles**: Use **Tailwind CSS** for styling
- **Do not display non-mobile elements**, such as scrollbars
-Choose a **4pt or 8pt spacing system** - all margins, padding, line-heights and element sizes must be exact multiples
-Use **consistent spacing tokens** (e.g., 4 ,6, 16, 24px, etc) - Never arbitrary values like 5px or 13px
-apply **visual grouping** (“spacing friendship”): tighter gaps (4-8px) for related items, larger gaps (16-24px) for distinct groups.
-Ensure **typographic rhythm**: font-sizes, line-heights, and spacing aligned to the grid (e.g., 16px text with 24px line-height)
12. Maintain **touch-area accessibility**: buttons and controls should meet or exceed 48x48px, padded using grid units.


## Project Overview

Estate Navigator is a real estate listing application built with React, TypeScript, and Vite. It provides property browsing, favorites management, and messaging functionality for users and real estate agents.

## Common Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theme configuration
- **Routing**: React Router v6
- **Maps**: Google Maps API via @googlemaps/js-api-loader
- **PWA**: Progressive Web App support via vite-plugin-pwa

### Project Structure
```
src/
├── components/          # React components
│   ├── MainView.tsx    # Main property listing view with map
│   ├── PropertyDetails.tsx  # Property detail page
│   ├── LoginPage.tsx   # User authentication
│   ├── SignupPage.tsx  # User registration
│   ├── FavoritesPage.tsx    # Saved properties
│   ├── MessagesPage.tsx     # User messages
│   └── [Modal components]   # Contact, filter, tour scheduling modals
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── FavoritesContext.tsx # Favorites state management
├── data/               # Mock data
│   └── mockProperties.ts    # Sample property data
└── types/              # TypeScript type definitions
    └── Property.ts     # Property interface definition
```

### Key Architectural Patterns

1. **Context API for State Management**: Authentication and favorites are managed through React Context providers wrapping the entire app.

2. **Route Structure**:
   - `/` - Login page
   - `/signup` - Registration page
   - `/main` - Main property listing view
   - `/property/:id` - Individual property details
   - `/favorites` - User's saved properties
   - `/messages` - Messaging interface

3. **Property Data Model**: The `Property` interface (src/types/Property.ts) defines the complete structure including location coordinates, agent info, and property features.

4. **Mock Data Implementation**: Currently uses hardcoded mock data in `src/data/mockProperties.ts`. The authentication system simulates API calls with hardcoded credentials (test@test.com / password123).

5. **Tailwind Theme**: Custom color palette defined with primary colors (blue shades) and extended spacing values.

## Important Considerations

- Google Maps API integration requires an API key to be provided in the GoogleMap component
- The app is configured as a PWA with manifest settings for mobile installation
- Authentication is currently mocked - real API integration would be needed for production
- Property data is static - database integration would be required for dynamic listings
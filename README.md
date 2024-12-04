# SERP - Search Engine Results Page Application

A modern web application built with Next.js that allows users to perform location-based searches and view search engine results. The application features a clean, responsive interface with location suggestions and real-time search capabilities.

## Features

- 🔍 Real-time search functionality
- 📍 Location-based searching with popular location suggestions
- 🎯 Dynamic result filtering
- 💫 Modern, responsive UI built with Tailwind CSS
- 🚀 Built with Next.js 15 and TypeScript for optimal performance
- 🔄 Auto-updating search results
- 📱 Mobile-friendly design

## Tech Stack

- **Framework:** Next.js 15.0.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Heroicons
- **API Integration:** Axios, SerpAPI
- **UI Components:** React Select

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd serp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
SERPAPI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app` - Main application code
  - `/api` - API route handlers
  - `/fonts` - Custom font configurations
  - `page.tsx` - Main search interface
  - `layout.tsx` - Root layout component
- `/public` - Static assets
- `tailwind.config.ts` - Tailwind CSS configuration

## Development

The application uses Next.js App Router and React Server Components. The main search interface is located in `app/page.tsx` and includes:

- Location-based search functionality
- Popular location suggestions
- Dynamic search results display
- Error handling and loading states

## Deployment

The application can be easily deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/serp)

For other deployment options, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

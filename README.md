# EdPsychConnect

An advanced educational platform connecting educational psychologists, educators, and students.

## Features

- AI-powered resource generation and personalization
- Comprehensive assessment engine
- Role-based access control
- Learning analytics
- FERPA & COPPA compliant
- Subscription-based access

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API
- **Payment Processing**: Stripe
- **Error Monitoring**: Sentry
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/edpsychconnect.git
cd edpsychconnect
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy the `.env.local.example` file to `.env.local` and fill in the required values:

```bash
cp .env.local.example .env.local
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Next.js app directory with routes and API endpoints
- `/components`: Reusable React components
- `/lib`: Utility functions and services
- `/prisma`: Database schema and client
- `/public`: Static assets
- `/types`: TypeScript type definitions

## Deployment

This project is configured for deployment on Vercel. Connect your GitHub repository to Vercel and it will automatically deploy when you push to the main branch.

Make sure to set up the required environment variables in the Vercel dashboard.

## License

[MIT](LICENSE)
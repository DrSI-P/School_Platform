# EdPsychConnect

An advanced educational platform connecting educational psychologists, educators, and students with AI-powered tools for enhanced learning.

## Features

- **AI Lab**: Interactive environment for building and experimenting with AI tools for education
- **Collaborative Projects**: Team-based development of educational AI tools
- **AI-powered Resource Generation**: Create personalized educational materials
- **Comprehensive Assessment Engine**: Create, administer, and analyze assessments
- **Learning Analytics Dashboard**: Track progress with detailed insights
- **Role-based Access Control**: Tailored experiences for different user types
- **FERPA & COPPA Compliant**: Built with privacy and security at its core
- **Subscription-based Access**: Flexible pricing options

## AI Lab

The AI Lab is a key feature that allows students and educators to:

- Experiment with different AI models (GPT-4o, Claude, Llama, etc.)
- Write and run code in a sandboxed environment
- Get AI assistance for coding and educational tool development
- Save and share projects with the community
- Learn AI concepts through hands-on experience

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API, Anthropic API, Hugging Face
- **Code Execution**: VM2 for sandboxed JavaScript execution
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Payment Processing**: Stripe
- **Error Monitoring**: Sentry
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- PostgreSQL database
- OpenAI API key (for AI features)

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

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your site URL (http://localhost:3000 for local development)
- `NEXTAUTH_SECRET`: Random string for NextAuth.js (generate with `openssl rand -base64 32`)
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_API_MODEL`: Default model to use (e.g., "gpt-4o")

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
  - `/ai-lab`: AI Lab components (CodeEditor, AIAssistant, etc.)
  - `/ui`: UI components (Button, Card, etc.)
  - `/layout`: Layout components (Navigation, etc.)
- `/lib`: Utility functions and services
  - `/ai`: AI-related services
  - `/api`: API client functions
  - `/db`: Database client and utilities
- `/prisma`: Database schema and client
- `/public`: Static assets
- `/types`: TypeScript type definitions

## Key Routes

- `/`: Home page
- `/ai-lab`: AI Lab for building educational tools
- `/projects`: Collaborative projects
- `/resources`: Educational resources
- `/assessments`: Assessment tools
- `/analytics`: Learning analytics dashboard
- `/community`: Community forum and showcase

## Deployment

This project is configured for deployment on Vercel. Connect your GitHub repository to Vercel and it will automatically deploy when you push to the main branch.

Make sure to set up the required environment variables in the Vercel dashboard.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)
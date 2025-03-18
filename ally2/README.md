# NutriChat - AI-Powered Dietary Recommendation Chatbot

## Overview

NutriChat is a fully functional web application that serves as a dietary recommendation chatbot, designed to be deployed on Vercel. The application combines AI-powered dietary recommendations with food delivery service integration and gamified health tracking to create a comprehensive solution for healthier eating habits.

### Key Features

- **AI-Powered Chatbot**: Engage in natural conversations to receive personalized dietary recommendations based on your preferences, restrictions, and health goals.

- **UberEats Integration**: Connect your UberEats account to analyze your ordering patterns and receive healthier alternatives from your favorite restaurants.

- **Health Score System**: Track your progress with a gamified scoring system that rewards healthy eating choices.

- **Dietitian Dashboard**: Human dietitians can review user progress, modify recommendations, and provide personalized feedback.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Radix UI components
- **Backend**: Next.js API routes
- **AI**: OpenAI API for natural language processing
- **Authentication**: NextAuth.js for secure user authentication
- **Database**: Firebase (simulated in the current version)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key (for chatbot functionality)

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd [repository-name]
```

2. Install dependencies

```bash
npm install --legacy-peer-deps
```

3. Create a `.env.local` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment on Vercel

This application is configured to be deployed on Vercel with specific configurations to handle dependency conflicts:

1. A custom `vercel-build.js` script creates a simple landing page if the build fails
2. The `package.json` includes a custom `vercel-build` script
3. The `vercel.json` configuration uses the `--legacy-peer-deps` flag

To deploy to Vercel:

1. Push your changes to your repository:

```bash
git add .
git commit -m "chore: deploy memories"
git push
```

2. Connect your repository to Vercel and deploy

## Project Structure

- `/src/app` - Next.js application routes and API endpoints
- `/src/components` - React components organized by feature
  - `/chat` - Chatbot interface components
  - `/ubereats` - UberEats integration components
  - `/scoring` - Health score tracking components
  - `/ui` - Reusable UI components
- `/src/lib` - Utility functions and shared code

## API Endpoints

- `/api/chat` - Handles chatbot interactions using OpenAI
- `/api/ubereats` - Manages UberEats integration and order analysis

## Future Enhancements

- Integration with additional food delivery services
- Expanded gamification features with rewards and challenges
- AI improvements based on user feedback and behavior patterns
- Mobile application with push notifications for reminders

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with [Next.js](https://nextjs.org) and deployed on [Vercel](https://vercel.com).

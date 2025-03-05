# YouTube Shorts Micropayment System

A full-stack application that allows users to watch YouTube Shorts videos and pay per second of playback using a micropayment system powered by Radius Technology.

## Features

- Embedded YouTube Shorts player
- Per-second micropayment system
- Real-time transaction processing
- Wallet integration for payments
- Automatic payment pausing when video is paused or tab is closed

## Technology Stack

- **Frontend**: Next.js with TypeScript and Chakra UI
- **Backend**: Next.js API routes
- **Payment Processing**: Radius SDK for high-throughput, low-latency transactions
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js >= 20.12.2

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd youtube-shorts-micropay

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_RADIUS_ENDPOINT=https://your-radius-endpoint
```

## Deployment

This application is configured for easy deployment on Vercel:

```bash
vercel
```

## License

MIT

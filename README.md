# V0 Revive - Sustainable Marketplace Application

V0 Revive is a sustainable marketplace application built on Next.js that enables users to buy and sell pre-owned items while encouraging sustainable practices through a token incentive system.

## Features

- **Authentication System**: Email, social, and wallet-based authentication
- **Marketplace**: Browse, filter, and purchase pre-owned items
- **Token Economy**: Earn B3TR tokens for sustainable behaviors
- **VeChain Integration**: Blockchain wallet support for seamless transactions
- **User Profiles**: Manage account details, transaction history, and saved items
- **Dashboard**: Track sustainability impact and token earnings

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: React Context API
- **Authentication**: Custom auth provider with blockchain wallet support
- **Blockchain**: VeChain integration for wallet operations

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Y0EL/v0-revive.git
   cd v0-revive
   ```

2. Install dependencies
   ```
   npm install
   # or
   pnpm install
   ```

3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```

4. Start the development server
   ```
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/`: Next.js application routes and pages
- `components/`: Reusable UI components
- `contexts/`: React context providers for state management
- `providers/`: Service providers and application wrappers
- `hooks/`: Custom React hooks
- `lib/`: Utility functions and shared logic
- `public/`: Static assets
- `styles/`: Global styles and Tailwind configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
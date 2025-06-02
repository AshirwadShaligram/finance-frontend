# FinTrack - Finance Tracker Frontend
GitHub React Next.js

FinTrack Frontend is a modern, responsive web application built with Next.js and React 19 for tracking personal finances. It connects to the FinTrack backend to provide a seamless money management experience.

## Features
- 📊 Interactive financial dashboards with Recharts

- 🔐 Secure authentication flow

- 🌙 Dark/light mode support (via Next Themes)

- 📱 Mobile-responsive design

- 📅 Date picker for transaction filtering

- 🚀 Optimized performance with Next.js

- 🛒 Radix UI components for accessibility

- 📦 State management with Redux Toolkit

- 💾 Persistent state with Redux Persist

- 🔄 Real-time data fetching

- 💬 Toast notifications with Sonner

## Technologies Used
- Framework: Next.js 15 (App Router)

- UI Library: React 19

- Styling: Tailwind CSS + Tailwind Merge

- UI Components: Radix UI Primitives

- Icons: Lucide React

- Charts: Recharts

- State Management: Redux Toolkit + Redux Persist

- Date Handling: date-fns

- HTTP Client: Axios

- Animations: Embla Carousel

- Form Handling: Class Variance Authority (CVA)

- Toasts: Sonner

## Prerequisites
- Node.js (v18 or higher recommended)

- FinTrack Backend running (or API endpoint configured)

- NPM or Yarn

## Installation
1. Clone the repository:
```
git clone https://github.com/your-username/finance-tracker-frontend.git
cd finance-tracker-frontend
```
2. Install dependencies:

```
npm install
# or
yarn install
```
3. Create a .env.local file in the root directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ENV=development
```
4. Run the development server:

```
npm run dev
# or
yarn dev
```
Open http://localhost:3000 in your browser.

## Available Scripts
|    Script    |  Description   | 
|:-------------|:--------------:|
| ` dev `       | Starts the development server |
| ` build `       | Builds for production |
| ` start `       | Runs the built production app |
| ` lint `       | Runs ESLints |

## Environment Variables
|  Variable  | 	Description |	Required |
|:-------------|:--------------:|:------------:|
| NEXT_PUBLIC_API_URL |	URL of the FinTrack backend API |	Yes
| NEXT_PUBLIC_ENV | 	Environment (development/production) |	No
## Deployment
To deploy this project:

1. Build the production version:

```
npm run build
```
2. Start the production server:
```
npm run start
```
For Vercel deployment, connect your GitHub repository and the deployment will happen automatically.


## License
Distributed under the MIT License. See LICENSE for more information.

## Contact
Ashirwad Ghode - ashirwadghode20@gmail.com

Project Link: https://github.com/AshirwadShaligram/finance-tracker-frontend

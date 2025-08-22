# Message Guru

A professional AI-powered message reply generator that helps you craft perfect responses for any situation.

## 🚀 Features

- **Smart AI Replies**: Generate contextual message responses using free Hugging Face AI
- **Multiple Relationships**: Friend, Girlfriend, Boyfriend, Family, Colleague, Stranger
- **Various Moods**: Funny, Witty, Serious, Romantic, Flirty, Sarcastic
- **Professional Design**: Clean, responsive UI with ad placement spaces
- **Free to Use**: No signup required, completely free AI service

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- TanStack Query for API calls

**Backend:**
- Node.js with Express
- Hugging Face Inference API
- CORS enabled for cross-origin requests

## 📁 Project Structure

```
message-guru/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── shared/        # Shared types and schemas
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/               # Express backend server
│   ├── shared/            # Shared schemas
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── vercel.json            # Vercel deployment config
└── README.md
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ installed
- Hugging Face account (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd message-guru
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   npm install --prefix frontend
   
   # Install backend dependencies
   npm install --prefix backend
   ```

3. **Set up environment variables**
   
   Create `.env` file in the backend directory:
   ```
   HUGGINGFACE_API_KEY=your_hugging_face_token_here
   ```
   
   Get your free Hugging Face token:
   - Go to https://huggingface.co/
   - Sign up for free
   - Go to Settings → Access Tokens
   - Create a new token

### Development

**Run both frontend and backend simultaneously:**
```bash
npm run dev
```

**Or run them separately:**
```bash
# Frontend only (http://localhost:5173)
npm run frontend:dev

# Backend only (http://localhost:3001)
npm run backend:dev
```

### Building for Production

```bash
# Build frontend for production
npm run build
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect your GitHub repo to Vercel**
2. **Set environment variables in Vercel dashboard:**
   - `HUGGINGFACE_API_KEY`: Your Hugging Face token

3. **Deploy**: Vercel will automatically build and deploy your app

The `vercel.json` configuration is already set up to handle both frontend and backend deployment.

### Environment Variables

**Backend (.env file):**
- `HUGGINGFACE_API_KEY`: Your Hugging Face API token (required)
- `PORT`: Server port (default: 3001)

## 🎯 API Endpoints

**POST** `/api/generate-reply`
```json
{
  "message": "Hey, how are you?",
  "relationship": "friend",
  "mood": "funny"
}
```

**GET** `/api/health`
- Health check endpoint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 💰 Monetization

The app includes designated ad placement spaces:
- Sidebar ads (300x250)
- Banner ads (728x90)
- Mobile banner ads (320x100)

Perfect for Google AdSense integration!

## 🆘 Support

If you encounter any issues:
1. Check that your Hugging Face API key is correctly set
2. Ensure all dependencies are installed
3. Verify that both frontend and backend are running

For additional help, please open an issue on GitHub.
# 3D-AI-Interior-Design-and-Construction-Builder
# ArchGen - AI-Powered Floorplan & Interior Design Platform

ArchGen is a comprehensive web platform that allows users to create, customize, and explore 2D, 3D, and 360° floorplans with AI-assisted interior design, real-time cost estimation, and professional-grade insights.

## 🚀 Features

### Core Functionality
- **2D Floorplan Editor**: Drag-and-drop room creation with interactive dimension arrows
- **3D Visualization**: Realistic extruded walls and furniture placement with camera controls
- **360° Immersive View**: Equirectangular panoramic navigation with hotspots
- **AI-Powered Interior Design**: Style matching, furniture suggestions, and color schemes
- **Real-Time Cost Estimation**: Instant price estimates with material breakdowns
- **Collaboration Tools**: Multi-user editing with real-time updates
- **Professional Insights**: Engineer directory, sustainability scoring, compliance checking

### Advanced Features
- **Interactive Dimension Editing**: Pull arrows to resize rooms in real-time
- **AI Assistant**: Chat-based design recommendations and optimization
- **Material Marketplace**: Integration with suppliers for instant purchasing
- **BOQ Generation**: Automatic Bill of Quantities creation
- **AR/VR Support**: Mobile and desktop AR/VR walkthroughs
- **Daylight Simulation**: Natural light optimization
- **Voice Commands**: Hands-free design modifications
- **Smart Scaling**: Proportional room adjustments

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Three.js & React Three Fiber** - 3D graphics and visualization
- **Fabric.js** - 2D canvas manipulation
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations and transitions
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Socket.io Client** - Real-time collaboration

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Stripe** - Payment processing
- **OpenAI API** - AI integration
- **Sharp** - Image processing

### Development Tools
- **Concurrently** - Run multiple scripts
- **Nodemon** - Development server
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/archgen.git
   cd archgen
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration
   MONGODB_URI=mongodb://localhost:27017/archgen
   JWT_SECRET=your_jwt_secret_key_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   OPENAI_API_KEY=your_openai_api_key
   CLIENT_URL=http://localhost:3000
   PORT=5000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🏗️ Project Structure

```
archgen/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Auth/      # Authentication components
│   │   │   ├── Editor/    # Floorplan editor components
│   │   │   ├── AI/        # AI assistant components
│   │   │   └── Layout/    # Layout components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   ├── api/           # API client functions
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── index.js          # Server entry point
├── package.json          # Root package.json
└── README.md
```

## 🎯 Usage

### Getting Started

1. **Create an Account**
   - Visit the registration page
   - Choose your account type (Homeowner/Designer or Engineer/Contractor)
   - Verify your email address

2. **Create Your First Floorplan**
   - Click "Create New Plan" from the dashboard
   - Choose from templates or start with a blank canvas
   - Use the 2D editor to draw rooms and add elements

3. **Design and Customize**
   - Switch to 3D view to see your design in three dimensions
   - Use the AI assistant for design suggestions
   - Apply different styles and color schemes
   - Add furniture and fixtures

4. **Collaborate and Share**
   - Invite team members to collaborate
   - Share your designs with clients
   - Export in various formats

### Key Features Guide

#### 2D Editor
- **Select Tool**: Click and drag to select objects
- **Wall Tool**: Draw walls by clicking and dragging
- **Room Tool**: Create rooms by clicking on the canvas
- **Door/Window Tools**: Add doors and windows to walls
- **Dimension Arrows**: Pull arrows to resize rooms interactively

#### 3D Viewer
- **Orbit Controls**: Click and drag to rotate the view
- **Zoom**: Scroll to zoom in/out
- **Pan**: Right-click and drag to pan
- **View Modes**: Switch between top, isometric, and walkthrough views

#### AI Assistant
- **Chat Interface**: Ask questions about your design
- **Quick Actions**: Use predefined prompts for common tasks
- **Suggestion Cards**: Apply AI recommendations with one click
- **Style Matching**: Upload reference images for style suggestions

#### Cost Estimation
- **Real-time Updates**: Costs update as you modify your design
- **Detailed Breakdown**: See costs by category (materials, labor, etc.)
- **Regional Pricing**: Adjust for different geographic locations
- **Quality Levels**: Choose from budget to luxury options

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Floorplan Endpoints
- `GET /api/floorplans` - Get user's floorplans
- `POST /api/floorplans` - Create new floorplan
- `GET /api/floorplans/:id` - Get specific floorplan
- `PUT /api/floorplans/:id` - Update floorplan
- `DELETE /api/floorplans/:id` - Delete floorplan

### AI Endpoints
- `POST /api/ai/suggestions` - Generate AI suggestions
- `POST /api/ai/interior-design` - Generate interior design
- `POST /api/ai/cost-estimate` - Calculate cost estimates

## 🚀 Deployment

### Production Build
```bash
# Build the frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Environment Variables
Set the following environment variables in production:
- `NODE_ENV=production`
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Secure JWT secret
- `STRIPE_SECRET_KEY` - Production Stripe key
- `OPENAI_API_KEY` - OpenAI API key
- `CLIENT_URL` - Production frontend URL

### Docker Deployment
```bash
# Build Docker image
docker build -t archgen .

# Run container
docker run -p 5000:5000 archgen
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure responsive design for all components

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.archgen.com](https://docs.archgen.com)
- **Community**: [community.archgen.com](https://community.archgen.com)
- **Email**: support@archgen.com
- **Discord**: [Join our Discord](https://discord.gg/archgen)

## 🙏 Acknowledgments

- Three.js community for 3D graphics libraries
- Fabric.js for canvas manipulation
- OpenAI for AI capabilities
- All contributors and beta testers

## 🔮 Roadmap

### Upcoming Features
- [ ] Mobile app (iOS/Android)
- [ ] Advanced AR/VR support
- [ ] Machine learning model training
- [ ] International localization
- [ ] Advanced analytics dashboard
- [ ] Plugin system for third-party integrations

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - AI assistant and collaboration tools
- **v1.2.0** - Cost estimation and material marketplace
- **v2.0.0** - 360° views and advanced 3D features

---

**Built with ❤️ by the ArchGen Team**

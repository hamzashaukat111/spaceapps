# 🌍 Exoplanet Lab - A World Away: Hunting Exoplanets with AI

An interactive web application for discovering and exploring exoplanets using AI-powered analysis and immersive 3D visualizations. Originally developed for the NASA Space Apps Challenge 2025.

> "The universe is not only stranger than we imagine, it is stranger than we can imagine." - J.B.S. Haldane

## 🚀 Features

### 🎯 MVP (Launch Ready)

- **Light-Curve Explorer & AI Sandbox**: Upload and analyze stellar brightness data with AI-powered transit detection
- **Transit Simulator & Orbit Visualizer**: Interactive 3D orbital mechanics with real-time light curve generation
- **Dataset Dashboard**: Compare data from NASA missions (TESS, Kepler, K2, PLATO) with advanced filtering
- **Mission Narratives**: Each analysis comes with immersive storytelling elements

### 🌟 Advanced Features

- **Interactive Storytelling**: Choice-driven narratives about exoplanet discovery with branching storylines
- **Gamified Exoplanet Hunt**: Real-time transit detection challenge with scoring and achievements
- **3D Star Explorer**: Navigate interactive star maps and explore real exoplanetary systems
- **Interactive Hub**: Centralized portal for all interactive experiences with progress tracking
- **Real-time Analysis**: AI highlights potential transits with confidence scoring
- **Responsive Design**: Seamless experience from mobile to desktop

### ✨ Standout Features

- **Interactive 3D Visualizations**: Pure CSS 3D transforms for optimal performance
- **Gamification Elements**: Achievement system, progress tracking, and competitive scoring
- **Immersive Storytelling**: Multi-path narratives with scientific accuracy
- **Educational Gaming**: Learn through interactive challenges and exploration
- **Cross-Platform**: Mobile-first design that scales to desktop

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0, React Router DOM
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Styling**: CSS3 with CSS Variables, Responsive Grid/Flexbox
- **AI Integration**: Custom algorithms for transit detection
- **Data Visualization**: Custom SVG charts and 3D representations

## 🎮 Interactive Components

### 3D Planet Visualization

- Real-time rotating planets with procedural textures
- Atmospheric effects and lighting
- Interactive controls for exploration

### Solar System Simulator

- Multi-planet orbital mechanics
- Customizable system parameters
- Real-time transit visualization

### AI Analysis Dashboard

- Upload light curve data (CSV, TXT, FITS)
- AI-powered transit detection
- Confidence scoring and detailed analysis

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

   _Note: We use `--legacy-peer-deps` due to some compatibility issues with Three.js dependencies_

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development Notes

- The app uses React 18 with concurrent features
- Three.js integration requires specific peer dependency handling
- All 3D visualizations are optimized for performance on mobile devices

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🏆 NASA Space Apps Challenge

This project was developed for the NASA Space Apps Challenge, addressing the challenge of making exoplanet science accessible and engaging through:

- Interactive data visualization
- AI-powered analysis tools
- Immersive 3D experiences
- Educational storytelling
- Citizen science participation

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ for space exploration and scientific discovery**

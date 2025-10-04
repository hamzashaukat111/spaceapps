import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Core components
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import SpaceBackground from './components/SpaceBackground';

// Page imports - organized by functionality
import Home from './pages/Home';
import ExoplanetCatalog from './pages/ExoplanetCatalog';
import DiscoveryCards from './pages/DiscoveryCards';
import LightCurveExplorer from './pages/LightCurveExplorer';
import TransitSimulator from './pages/TransitSimulator';
import MissionLog from './pages/MissionLog';
import InteractiveHub from './pages/InteractiveHub';
import './App.css';

function App() {
  // TODO: Add error boundary for better error handling
  // TODO: Consider adding loading states for better UX
  
  return (
    <Router>
      <div className="App">
        {/* Background should render first for proper layering */}
        <SpaceBackground />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<ExoplanetCatalog />} />
            <Route path="/discovery" element={<DiscoveryCards />} />
            <Route path="/explorer" element={<LightCurveExplorer />} />
            <Route path="/simulator" element={<TransitSimulator />} />
            <Route path="/missions" element={<MissionLog />} />
            <Route path="/interactive" element={<InteractiveHub />} />
          </Routes>
        </main>
        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
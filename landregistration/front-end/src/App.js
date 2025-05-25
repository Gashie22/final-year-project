import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WalletProvider } from './components/WalletContext';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import FeaturesPage from './components/FeaturesPage';
import ContactPage from './components/ContactPage';
import ManageLandPage from './components/ManageLandPage';
import AdminPanel from './components/AdminPanel';
import AiPage from './components/AiPage';
// This is the main App component of the React application.
function App() {
  return (
    // WalletProvider is a custom component that provides Ethereum wallet context
    // to all its child components. This allows components to easily interact
    // with the user's wallet and the blockchain.
    <WalletProvider>
      {/* BrowserRouter enables client-side routing in the React application.
          The 'basename' prop is set to "/Gashirai-Final-Year-Project", which
          is useful if the application is deployed to a subdirectory on a server. */}
      <Router basename="/projectUI" >
        {/* Routes is a container for individual Route components. It ensures that
            only one route matches the current URL at a time. */}
        <Routes>
          {/* Each Route component defines a specific path and the component
              that should be rendered when that path is matched. */}
          {/* The root path ("/") will render the LandingPage component. */}
          <Route path="/" element={<LandingPage />} />
          {/* The "/about" path will render the AboutPage component. */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/assist" element={<AiPage />} />
          {/* The "/features" path will render the FeaturesPage component. */}
          <Route path="/features" element={<FeaturesPage />} />
          {/* The "/manage-land" path will render the ManageLandPage component,
              likely providing functionalities for users to manage their land records. */}
          <Route path="/manage-land" element={<ManageLandPage />} />
          {/* The "/contact" path will render the ContactPage component. */}
          <Route path="/contact" element={<ContactPage />} />
          {/* The "/admin" path will render the AdminPanel component, which is
              likely accessible only to administrators for managing the application
              or the land registry system. */}
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

// Exports the App component, making it the entry point for rendering the application.
export default App;
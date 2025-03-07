import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import HowItWorks from './components/pages/HowItWorks';
import Contact from './components/pages/Contact';
import Consent from './components/pages/Consent';
import Experience from './components/pages/Experience';
import AfterParty from './components/pages/AfterParty';
import Testimonials from './components/pages/Testimonials';
import { AppProvider } from './context/AppContext';
import './styles/global.css';

const App = (): React.ReactElement => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/after-party" element={<AfterParty />} />
            <Route path="/testimonials" element={<Testimonials />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from './components/ui/toaster';
import { ServiceManagerProvider } from './contexts/service-manager-context';

function App() {
  return (
    <Router>
      <ServiceManagerProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </ServiceManagerProvider>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './contexts/AppProviders';
import App from './App';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<App />} />
          
          {/* Chat with specific session ID */}
          <Route path="/chat/:sessionId" element={<App />} />
          
          {/* Shared conversation (read-only) */}
          <Route path="/shared/:shareId" element={<App />} />
          
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProviders>
    </BrowserRouter>
  );
};

export default Router;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import FaceVerification from './pages/FaceVerification';

import Navbar from './components/Navbar';
import Vote from './pages/Vote';
import Dashboard from './pages/Dashboard';
import Help from './pages/Help';
import Terms from './pages/Terms';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/face-verify" element={<FaceVerification />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/help" element={<Help />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;

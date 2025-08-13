import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import InteractiveCompiler from './components/InteractiveCompiler';
import TextCompiler from './components/TextCompiler';
import BatchCompiler from './components/BatchCompiler';

function App() {
  return (
    <Router>
      <Header />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<InteractiveCompiler />} />
          <Route path="/text" element={<TextCompiler />} />
          <Route path="/batch" element={<BatchCompiler />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

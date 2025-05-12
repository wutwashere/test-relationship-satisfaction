import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SatisfactionTest from './SatisfactionTest';
import Results from './Results';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SatisfactionTest />}/>
        <Route path="/results" element={<Results />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

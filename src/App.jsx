import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SatisfactionTest from './SatisfactionTest';
import Results from './Results';
import TitleScreen from './TitleScreen';
import Qsection from './Qsection';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TitleScreen />}/>
        <Route path="/section/:id" element={<Qsection/>}/>
        <Route path="/results" element={<Results />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

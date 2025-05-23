import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TitleScreen from './components/TitleScreen';
import Qsection from './components/Qsection';
import Results from './components/Results';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TitleScreen />} />
        <Route path="/start/:id" element={<TitleScreen />} />
        <Route path="/section/:id/:index" element={<Qsection />} />
        <Route path="/results/:id" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
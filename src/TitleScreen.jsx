import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TitleScreen.css';

const TitleScreen = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (!name.trim()) {
      setError('Por favor, escribe tu nombre antes de comenzar.');
      return;
    }
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('scores', JSON.stringify([]));
    navigate('/section/0', { state: { name, scores: [] } });
  };

  return (
    <div className="title-container">
      <h1 className="title-heading">Test de Relación de Pareja</h1>
      <p className="title-paragraph">
        Responde este cuestionario para conocer el nivel de satisfacción en tu relación.
      </p>

      <input
        type="text"
        placeholder="Ingresa tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="title-input"
      />
      {error && <p className="title-error">{error}</p>}

      <button onClick={handleStart} className="title-button">
        Empezar test
      </button>
    </div>
  );
};

export default TitleScreen;
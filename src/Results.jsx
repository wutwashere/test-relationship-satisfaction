import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './Results.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, scores, total, interpretation } = location.state || {};
  console.log("Datos recibidos en Results:", location.state);

  useEffect(() => {
    if (!scores || !name) {
      navigate('/', { replace: true });
    }
  }, [name, scores, navigate]);

  console.log(location.state); 

  const chartData = Array.isArray(scores) && scores.length > 0
    ? scores.map((value, index) => ({
        pregunta: `${index + 1}`,
        valor: value,
      }))
    : [];

  const handleRestart = () => {
    navigate('/', { replace: true, state: null });
  };

  return (
    <div className="results-container">
      <h2>Resultados del Test</h2>
      <p><strong></strong>Tu puntaje total es: <strong>{total}</strong></p>
      <p><strong>Interpretación:</strong> {interpretation}</p>

      <h3>Tus respuestas:</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="pregunta" label={{ value: "Preguntas", position: "insideBottom", offset: -5 }} />
          <YAxis domain={[1, 5]} />
          <Tooltip />
          <Bar dataKey="valor" fill="#959595" />
        </BarChart>
      </ResponsiveContainer>

      <h3>Interpretación de resultados:</h3>
      <table className="interpretation-table">
        <thead>
          <tr>
            <th>Puntaje</th>
            <th>Interpretación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>55 a 65</td>
            <td>Relación muy satisfactoria (Excelente conexión, áreas sólidas)</td>
          </tr>
          <tr>
            <td>40 a 54</td>
            <td>Relación satisfactoria (Algunas áreas pueden mejorar)</td>
          </tr>
          <tr>
            <td>25 a 39</td>
            <td>Relación con dificultades (Necesita trabajo en varias áreas)</td>
          </tr>
          <tr>
            <td>0 a 24</td>
            <td>Relación insatisfactoria (Revisión profunda o apoyo profesional recomendado)</td>
          </tr>
        </tbody>
      </table>

      <button onClick={handleRestart} className="retry-button">
        Hacer otro test
      </button>
    </div>
  );
};

export default Results;
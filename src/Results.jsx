import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Results.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { name, scores } = state || {};
  const [totalScore, setTotalScore] = useState(0);
  const [balanceMessage, setBalanceMessage] = useState('');
  const [openAnswers, setOpenAnswers] = useState({
    dream: '',
    habit: '',
    aspect: ''
  });
  const [actionPlan, setActionPlan] = useState({ area1: '', area2: '', commitment: '' });
  const [importance, setImportance] = useState({});
  const [avgSection1, setAvgSection1] = useState(0);
  const [avgSection3, setAvgSection3] = useState(0);

  useEffect(() => {
    if (!name || !scores) {
      navigate('/', { replace: true });
      return;
    }

    const total = scores.reduce((a, b) => a + b, 0);
    setTotalScore(total);

    const section1 = scores.slice(0, 17);
    const section3 = scores.slice(23);
    const avgSection1 = section1.reduce((a, b) => a + b, 0) / section1.length;
    const avgSection3 = section3.reduce((a, b) => a + b, 0) / section3.length;
    setAvgSection1(avgSection1);
    setAvgSection3(avgSection3);

    if (Math.abs(avgSection1 - avgSection3) > 1) {
      setBalanceMessage('Hay una diferencia importante entre lo que das y lo que recibes.');
    } else {
      setBalanceMessage('Tu percepción y aporte están equilibrados.');
    }
  }, [name, scores, navigate]);

  const handleOpenAnswerChange = (e) => {
    setOpenAnswers({ ...openAnswers, [e.target.name]: e.target.value });
  };

  const handleActionPlanChange = (e) => {
    setActionPlan({ ...actionPlan, [e.target.name]: e.target.value });
  };

  const handleImportanceChange = (e) => {
    setImportance({ ...importance, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('¡Resultados guardados!');
  };

  let interpretation = '';
  if (totalScore >= 120) {
    interpretation = 'Relación sólida y proyectada a futuro.';
  } else if (totalScore >= 80) {
    interpretation = 'Bien, pero requiere ajustes en áreas clave.';
  } else {
    interpretation = 'Necesita reevaluación profunda.';
  }

  const chartData = {
    labels: ['Sección 1', 'Sección 3'],
    datasets: [
      {
        label: 'Satisfacción vs Aporte',
        data: [avgSection1, avgSection3],
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="results-container">
      <h2>Resultados de {name}</h2>
      
      {/* Puntuación Total */}
      <div className="total-score">
        <h3>Puntuación Total: </h3>
        <p>{totalScore} puntos</p>  
        <p>{interpretation}</p>
      </div>
      <div>
            <button
            className="new-survey-button"
            onClick={() => {
              sessionStorage.clear(); // Limpiar los datos anteriores
              navigate('/'); // Volver al inicio
            }}
          >
            Hacer otra encuesta
          </button>
      </div>
      {/* Balance Pareja/Aporte Personal */}
      <div className="balance">
        <h3>Balance Pareja / Aporte Personal</h3>
        <p>{balanceMessage}</p>
      </div>

      {/* Gráfico de Comparación */}
      <div className="chart-container">
        <h3>Gráfico de Satisfacción vs Aporte</h3>
        <Line data={chartData} />
      </div>

      {/* Formulario con preguntas abiertas y plan de acción */}
      <form onSubmit={handleSubmit} className="results-form">
        <div className="open-answers">
          <h3>Preguntas Abiertas</h3>
          <label>
            ¿Qué sueñas para esta relación?
            <textarea
              type="text"
              name="dream"
              value={openAnswers.dream}
              onChange={handleOpenAnswerChange}
              placeholder="Escribe tu respuesta..."
            />
          </label>
          <label>
            ¿Qué hábito o acción podrías cambiar para fortalecer la relación?
            <textarea
              type="text"
              name="habit"
              value={openAnswers.habit}
              onChange={handleOpenAnswerChange}
              placeholder="Escribe tu respuesta..."
            />
          </label>
          <label>
            ¿Algún aspecto no mencionado que sea clave para tu satisfacción?
            <textarea
              type="text"
              name="aspect"
              value={openAnswers.aspect}
              onChange={handleOpenAnswerChange}
              placeholder="Escribe tu respuesta..."
            />
          </label>
        </div>

        <div className="action-plan">
          <h3>Plan de Acción</h3>
          <label>
            Área de mejora 1
            <input
              type="text"
              name="area1"
              value={actionPlan.area1}
              onChange={handleActionPlanChange}
              placeholder="Ejemplo: Valores"
            />
          </label>
          <label>
            Área de mejora 2
            <input
              type="text"
              name="area2"
              value={actionPlan.area2}
              onChange={handleActionPlanChange}
              placeholder="Ejemplo: Comunicación"
            />
          </label>
          <label>
            Compromiso personal
            <textarea
              type="text"
              name="commitment"
              value={actionPlan.commitment}
              onChange={handleActionPlanChange}
              placeholder="Escribe tu compromiso..."
            />
          </label>
        </div>

        <div className="importance">
          <h3>Escala de Importancia</h3>
          <label>
            ¿Qué tan importante es para ti la relación?
            <p> </p>
            <input
              type="number"
              name="importance1"
              value={importance.importance1 || ''}
              onChange={handleImportanceChange}
              min="1"
              max="5"
              placeholder="1 a 5"
            />
          </label>
        </div>
        <button type="submit" className="submit-button">Guardar Resultados</button>
      </form>

      {/* Reflexión Post-Test */}
      <div className="reflection">
        <h3>Reflexión Post-Test</h3>
        <p>Ejemplo de preguntas para discutir con tu pareja:</p>
        <ul>
          <li>¿En qué proyecto futuro podemos trabajar juntos este año?</li>
          <li>¿Cómo puedo mejorar mi aporte en la relación?</li>
        </ul>
      </div>
    </div>
  );
};

export default Results;
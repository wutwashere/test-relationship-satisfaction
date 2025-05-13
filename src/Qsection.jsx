import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Qsection.css';

const sections = [
  {
    title: "Satisfacción General",
    questions: [
      "¿Qué tan satisfecho(a) está con la muestra de amor y ternura de su pareja?",
      "¿Cuánto admira a su pareja como persona?",
      "¿Qué tan fuerte es su sentido de \"equipo\" en la relación?",
      "¿Cómo evalúa la calidad de las conversaciones diarias?",
      "¿Su pareja resuelve conflictos de manera constructiva?",
      "¿Se siente escuchado(a) y comprendido(a)?",
      "¿La dedicación mutua es suficiente y significativa?",
      "¿Disfrutan juntos actividades recreativas?",
      "¿Avanzan hacia objetivos compartidos?",
      "¿Cómo calificaría la conexión íntima?",
      "¿La cantidad de encuentros satisface sus necesidades?",
      "¿Hay creatividad y reciprocidad en la intimidad?",
      "¿Hay equidad en las responsabilidades del hogar?",
      "¿Cómo evalúa la administración conjunta de recursos?",
      "¿Su pareja cumple sus expectativas como padre/madre?",
      "¿Cómo es la relación de su pareja con su familia?",
      "¿Respetan tiempos sociales separados?"
    ]
  },
  {
    title: "Valores Compartidos y Proyectos Futuros",
    questions: [
      "¿Qué tan alineados están sus valores fundamentales?",
      "¿Su pareja respeta sus creencias personales?",
      "¿Comparten una visión similar sobre qué hace significativa la vida?",
      "¿Tienen planes concretos a corto/mediano plazo?",
      "¿Cómo evalúa la capacidad de su pareja para cumplir compromisos a futuro?",
      "¿Se siente apoyado(a) en sus metas personales?"
    ]
  },
  {
    title: "Autoevaluación (Qué aporto a la relación)",
    questions: [
      "¿Con qué frecuencia expresa aprecio y gratitud hacia su pareja?",
      "¿Cómo calificaría su empatía ante las necesidades de su pareja?",
      "¿Contribuye equitativamente en tareas del hogar y responsabilidades?",
      "¿Cómo maneja sus finanzas personales para no afectar la relación?",
      "¿Busca activamente mejorar la relación?",
      "¿Reconoce y trabaja en sus defectos que afectan a la pareja?"
    ]
  }
];

const Qsection = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const sectionIndex = parseInt(id, 10);
  const section = sections[sectionIndex] || null;

  const name = sessionStorage.getItem("name");
  const [answers, setAnswers] = useState(() => {
    const stored = sessionStorage.getItem("scores");
    return stored ? JSON.parse(stored) : [];
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    if (!name || !section) {
      navigate("/", { replace: true });
    }
    else {
      setCurrentQuestion(0);
    }
  }, [sectionIndex, name, section, navigate]);

  const handleAnswer = (value) => {
    const updatedAnswers = [...answers, value];
    setAnswers(updatedAnswers);
    sessionStorage.setItem("scores", JSON.stringify(updatedAnswers));
    setAnimateKey((prev) => prev + 1);

    if (currentQuestion < section.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 150);
    } else {
      if (sectionIndex < sections.length - 1) {
        navigate(`/section/${sectionIndex + 1}`, {
          state: { name, scores: updatedAnswers }
        });
      } else {
        const total = updatedAnswers.reduce((a, b) => a + b, 0);
        let interpretation = "";
        if (total >= 55) {
          interpretation = "Relación muy satisfactoria (Excelente conexión, áreas sólidas)";
        } else if (total >= 40) {
          interpretation = "Relación satisfactoria (Algunas áreas pueden mejorar)";
        } else if (total >= 25) {
          interpretation = "Relación con dificultades (Necesita trabajo en varias áreas)";
        } else {
          interpretation = "Relación insatisfactoria (Revisión profunda o apoyo profesional recomendado)";
        }

        sessionStorage.setItem("scores", JSON.stringify(updatedAnswers));
        navigate("/results", {
          state: { name, scores: updatedAnswers, total, interpretation }
        });
      }
    }
  };

  if (!section) return null;

  return (
    <div className="section-container">
      <h2>{section.title}</h2>
      <div key={animateKey} className="question slide-up">
        <p>{section.questions[currentQuestion]}</p>
        <div className="options">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              className="option-box"
              onClick={() => handleAnswer(val)}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Qsection;
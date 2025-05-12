import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SatisfactionTest.css";

const questions = [
  "¿Qué tan satisfecho(a) está con el tiempo que su pareja le dedica a la relación?",
  "¿Qué tan satisfecho(a) está con el trato diario que recibe de su pareja?",
  "¿Qué tan satisfecho(a) está con el grado de integración de su pareja con su familia?",
  "¿Qué tan satisfecho(a) está con la forma en que su pareja administra el dinero?",
  "¿Qué tan satisfecho(a) está con la forma en que su pareja se comunica con usted?",
  "¿Qué tan satisfecho(a) está con la capacidad de su pareja para resolver conflictos?",
  "¿Qué tan satisfecho(a) está con la calidad del afecto que recibe de su pareja?",
  "¿Qué tan satisfecho(a) está con la calidad de la vida sexual con su pareja?",
  "¿Qué tan satisfecho(a) está con la frecuencia de la vida sexual con su pareja?",
  "¿Qué tan satisfecho(a) está con el nivel de admiración que siente por su pareja?",
  "¿Qué tan satisfecho(a) está con lo divertida y agradable que es la vida en pareja?",
  "¿Qué tan satisfecho(a) está con su sentido de pertenencia en la relación?",
  "¿Qué tan satisfecho(a) está con el desempeño de su pareja como padre/madre?"
];

const SatisfactionTest = () => {
  const [result, setResult] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (!name.trim()) {
      setError("Por favor, escribe tu nombre.");
      return;
    }
    
    const responses = [];
    for (let i = 1; i <= questions.length; i++) {
      const value = formData.get(`q${i}`);
      if (!value) {
        setError(`Por favor, responde la pregunta ${i}.`);
        return;
      }
      responses.push(parseInt(value));
    }
    
    setError("");  // limpiar mensaje si todo está bien

    const score = responses.reduce((a, b) => a + b, 0);

    let interpretation = "";
    if (score >= 55) {
      interpretation = "Relación muy satisfactoria (Excelente conexión, áreas sólidas)";
    } else if (score >= 40) {
      interpretation = "Relación satisfactoria (Algunas áreas pueden mejorar)";
    } else if (score >= 25) {
      interpretation = "Relación con dificultades (Necesita trabajo en varias áreas)";
    } else {
      interpretation = "Relación insatisfactoria (Revisión profunda o apoyo profesional recomendado)";
    }

    setResult(`${name},\nTu puntaje total es: ${score}\nNivel: ${interpretation}`);

    navigate("/results", {
      state: { name, scores: responses, total: score, interpretation }
    });
  };
  return (
    <div className="form-container">
      <h2>Test  Niveles de Satisfacción en la Relación de Pareja</h2>
      <p className="scale-description">
        Escala de respuesta: 
        <br />
        <strong>1</strong> = Nada satisfecho(a), 
        <strong> 2</strong> = Poco satisfecho(a), 
        <strong> 3</strong> = Neutral, 
        <strong> 4</strong> = Satisfecho(a), 
        <strong> 5</strong> = Muy satisfecho(a)
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-name">
          <label htmlFor="userName">Tu nombre:</label>
          <input
            type="text"
            id="userName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu nombre"
            required
          />
        </div>

        {questions.map((question, index) => (
          <div key={index} className="question-block">
            <p>{index + 1}. {question}</p>
            <div className="options">
              {[1, 2, 3, 4, 5].map((val) => (
                <label key={val}>
                  <input
                    type="radio"
                    name={`q${index + 1}`}
                    value={val}
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>
        ))}
        {error && <div className="error-message">{error}</div>}
        <button className="submit-button" type="submit">Enviar</button>
      </form>

      {result && (
        <div className="result">
          {result.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      )}



    </div>
  );
};

export default SatisfactionTest;

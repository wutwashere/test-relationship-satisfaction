import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { supabase } from '../supabaseClient';

export default function Qsection() {
  const { id, index } = useParams();
  const navigate = useNavigate();
  const sectionIndex = parseInt(index, 10);

  const [answers, setAnswers] = useState(() => {
    const stored = sessionStorage.getItem('answers');
    return stored ? JSON.parse(stored) : {};
  });

  const [showWarning, setShowWarning] = useState(false);

  const currentSection = questions[sectionIndex];

  useEffect(() => {
    sessionStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  const handleAnswer = (questionIndex, value) => {
    const updated = {
      ...answers,
      [`${sectionIndex}-${questionIndex}`]: value,
    };
    setAnswers(updated);
    setShowWarning(false); // Ocultar advertencia si respondió algo
  };

  const handleNext = async () => {
    // Verificar si todas las preguntas de la sección actual están respondidas
    const allAnswered = currentSection.questions.every((_, qIdx) => answers[`${sectionIndex}-${qIdx}`] !== undefined);

    if (!allAnswered) {
      setShowWarning(true);
      return;
    }

    if (sectionIndex < questions.length - 1) {
      navigate(`/section/${id}/${sectionIndex + 1}`);
    } else {
      const groupedAnswers = questions.map((section, sIdx) => {
        const sectionAnswers = section.questions.map((_, qIdx) =>
          answers[`${sIdx}-${qIdx}`] ?? null
        );
        return sectionAnswers.every((val) => val !== null) ? sectionAnswers : null;
      });

      const isFirst = sessionStorage.getItem('isFirst') === 'true';
      const userName = sessionStorage.getItem('userName');

      const updateData = isFirst
        ? { fpartner_scores: groupedAnswers, fpartner_name: userName }
        : { lpartner_scores: groupedAnswers, lpartner_name: userName };

      const { error } = await supabase
        .from('surveys')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error("Error al guardar en Supabase:", error.message);
        return;
      }

      navigate(`/results/${id}`);
    }
  };

  const blueScales = {
    1: 'bg-blue-100 text-blue-900',
    2: 'bg-blue-300 text-blue-900',
    3: 'bg-blue-500 text-white',
    4: 'bg-blue-700 text-white',
    5: 'bg-blue-900 text-white',
  };

  const tooltips = {
    1: 'Muy en desacuerdo',
    2: 'En desacuerdo',
    3: 'Neutral',
    4: 'De acuerdo',
    5: 'Muy de acuerdo',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
        {currentSection.title}
      </h2>

      <div className="space-y-8">
        {currentSection.questions.map((q, idx) => {
          const key = `${sectionIndex}-${idx}`;
          const selectedValue = answers[key];

          return (
            <div key={idx} className="bg-white rounded-2xl shadow-md p-6">
              <p className="text-lg font-medium text-center mb-4 text-gray-700">{q}</p>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((num) => {
                  const isSelected = selectedValue === num;
                  const baseStyle = blueScales[num];
                  return (
                    <button
                      key={num}
                      title={tooltips[num]}
                      className={`w-10 h-10 rounded-full font-semibold transition duration-200 shadow-sm
                        ${isSelected ? baseStyle : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                      onClick={() => handleAnswer(idx, num)}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-end mt-10">
        <button
          onClick={handleNext}
          className="bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-green-700 transition duration-200"
        >
          {sectionIndex === questions.length - 1 ? 'Terminar Encuesta' : 'Siguiente Sección'}
        </button>

        {showWarning && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            Por favor, responde todas las preguntas antes de continuar.
          </p>
        )}
      </div>
    </div>
  );
}
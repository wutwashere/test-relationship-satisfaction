import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Results() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAnswers, setOpenAnswers] = useState({
    dream: '',
    changeHabit: '',
    other: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setSurvey(data);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-lg text-blue-800">Cargando resultados...</p>;
  if (!survey) return <p className="text-center mt-10 text-lg text-red-500">No se encontraron resultados.</p>;

  const {
    fpartner_name,
    lpartner_name,
    fpartner_scores,
    lpartner_scores,
  } = survey;

  const flattenScores = (jsonArray) => {
    if (!jsonArray || !Array.isArray(jsonArray)) return [];
    return jsonArray.flat();
  };

  const fScores = flattenScores(fpartner_scores);
  const lScores = flattenScores(lpartner_scores);

  const sumScores = (scores, start, end) =>
    scores.slice(start, end + 1).reduce((acc, val) => acc + val, 0);

  const getSectionData = (scores) => ({
    section1: sumScores(scores, 0, 16),
    section2: sumScores(scores, 17, 22),
    section3: sumScores(scores, 23, 28),
  });

  const fSections = getSectionData(fScores);
  const lSections = getSectionData(lScores);

  const totalF = fSections.section1 + fSections.section2 + fSections.section3;
  const totalL = lScores.length ? lSections.section1 + lSections.section2 + lSections.section3 : null;

  const totalMsg = (score) =>
    score >= 120
      ? 'Relación sólida y proyectada a futuro.'
      : score >= 80
      ? 'Bien, pero requiere ajustes en áreas clave.'
      : 'Necesita reevaluación profunda.';

  const avg = (score, questions) => (score / questions).toFixed(2);
  const diffBalance = fScores.length
    ? Math.abs(fSections.section1 / 17 - fSections.section3 / 6)
    : null;

  const handleChange = (e) => {
    setOpenAnswers({ ...openAnswers, [e.target.name]: e.target.value });
  };

  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}/start/${id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert('Link para que tu pareja responda copiado al portapapeles'))
      .catch(() => alert('Error al copiar el link'));
  };

  const chartData =
    lScores.length === fScores.length
      ? fScores.map((score, index) => ({
          pregunta: `P${index + 1}`,
          [fpartner_name || 'Persona 1']: score,
          [lpartner_name || 'Persona 2']: lScores[index],
        }))
      : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-blue-50 text-blue-900">
      <h2 className="text-4xl font-bold text-center mb-10 text-blue-800">Resultados de la Encuesta</h2>

      {!lScores.length && (
        <div className="text-center mb-8">
          <p className="mb-3 text-lg">Tu pareja aún no ha respondido.</p>
          <button
            onClick={handleShareLink}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Compartir link para que responda
          </button>
        </div>
      )}

      {lScores.length > 0 && (
        <div className="mb-12 bg-blue-100 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4 text-center">Comparación de Respuestas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="pregunta" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={fpartner_name || 'Persona 1'} fill="#2563eb" />
              <Bar dataKey={lpartner_name || 'Persona 2'} fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="p-4 border rounded-lg shadow bg-white">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">{fpartner_name || 'Persona 1'}</h3>
          <p>Sección 1: {fSections.section1} pts</p>
          <p>Sección 2: {fSections.section2} pts</p>
          <p>Sección 3: {fSections.section3} pts</p>
          <p className="font-bold mt-1">Total: {totalF} pts</p>
          <p className="italic mt-2 text-gray-600">{totalMsg(totalF)}</p>
        </div>

        {lScores.length > 0 && (
          <div className="p-4 border rounded-lg shadow bg-white">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">{lpartner_name || 'Persona 2'}</h3>
            <p>Sección 1: {lSections.section1} pts</p>
            <p>Sección 2: {lSections.section2} pts</p>
            <p>Sección 3: {lSections.section3} pts</p>
            <p className="font-bold mt-1">Total: {totalL} pts</p>
            <p className="italic mt-2 text-gray-600">{totalMsg(totalL)}</p>
          </div>
        )}
      </div>

      <div className="mb-10 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-3 text-blue-800">Balance Pareja / Aporte Personal</h3>

        <p>{fpartner_name || 'Persona 1'} - Satisfacción: {avg(fSections.section1, 17)}</p>
        <p>{fpartner_name || 'Persona 1'} - Aporte: {avg(fSections.section3, 6)}</p>
        {diffBalance > 1 && (
          <p className="mt-2 text-red-600 font-semibold">
            Atención: Diferencia de {diffBalance.toFixed(2)} puntos entre satisfacción y aporte.
          </p>
        )}

        {lScores.length > 0 && (
          <>
            <p className="mt-4">{lpartner_name || 'Persona 2'} - Satisfacción: {avg(lSections.section1, 17)}</p>
            <p>{lpartner_name || 'Persona 2'} - Aporte: {avg(lSections.section3, 6)}</p>
            {Math.abs(lSections.section1 / 17 - lSections.section3 / 6) > 1 && (
              <p className="mt-2 text-red-600 font-semibold">
                Atención: Diferencia significativa entre satisfacción y aporte personal.
              </p>
            )}
          </>
        )}
      </div>

      <div className="mb-10 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-3 text-blue-800">Preguntas Abiertas</h3>

        {[
          {
            label: '¿Qué sueñas para esta relación en los próximos años?',
            name: 'dream',
          },
          {
            label: '¿Qué hábito o acción podrías cambiar para fortalecer la relación?',
            name: 'changeHabit',
          },
          {
            label: '¿Algún aspecto no mencionado que sea clave para tu satisfacción?',
            name: 'other',
          },
        ].map(({ label, name }) => (
          <div key={name} className="mb-4">
            <label htmlFor={name} className="block font-medium mb-1">{label}</label>
            <textarea
              name={name}
              id={name}
              rows={3}
              value={openAnswers[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 shadow-sm"
            />
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-100 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Ejemplo de Preguntas para Reflexión Post-Test</h3>
        <ul className="list-disc list-inside text-blue-900">
          <li>¿En qué proyecto futuro podemos trabajar juntos este año?</li>
          <li>¿Cómo puedo mejorar mi aporte en __?</li>
        </ul>
      </div>
    </div>
  );
}
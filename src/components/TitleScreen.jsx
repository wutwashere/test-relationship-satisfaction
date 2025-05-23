import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function TitleScreen() {
  const { id } = useParams(); // Si viene desde /start/:id
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingSurvey, setExistingSurvey] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error al cargar encuesta:', error.message);
            setError('No se encontró la encuesta.');
          } else {
            setExistingSurvey(data);
          }
          setLoading(false);
        });
    }
  }, [id]);

  const handleStart = async () => {
    if (!name.trim()) {
      setError('Por favor, ingresa tu nombre para comenzar.');
      return;
    }

    if (existingSurvey) {
      // Caso de pareja respondiendo
      const { error: updateError } = await supabase
        .from('surveys')
        .update({ lpartner_name: name, lpartner_scores: {} })
        .eq('id', id);

      if (updateError) {
        console.error('Error al actualizar encuesta para pareja:', updateError.message);
        setError('No se pudo registrar tu participación.');
        return;
      }

      sessionStorage.setItem('surveyId', id);
      sessionStorage.setItem('isFirst', 'false');
      sessionStorage.setItem('userName', name);
      navigate(`/section/${id}/0`);
    } else {
      // Caso de iniciar encuesta nueva
      const { data, error } = await supabase
        .from('surveys')
        .insert([{ fpartner_name: name, fpartner_scores: {} }])
        .select()
        .single();

      if (error) {
        console.error('Error al insertar en Supabase:', error.message);
        setError('Ocurrió un error al iniciar la encuesta.');
        return;
      }

      sessionStorage.setItem('surveyId', data.id);
      sessionStorage.setItem('isFirst', 'true');
      sessionStorage.setItem('userName', name);
      navigate(`/section/${data.id}/0`);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Cargando encuesta...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#9fdfff] to-[#e6f7ff] px-4">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Encuesta de Satisfacción de Pareja
        </h1>

        {existingSurvey && (
          <p className="mb-4 text-sm text-gray-600">
            Hola, estás a punto de responder la encuesta que inició{' '}
            <strong className="text-gray-800">{existingSurvey.fpartner_name}</strong>. Tus respuestas se compararán al final.
          </p>
        )}

        <input
          className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
        />

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <button
          className="w-full bg-[#9fdfff] hover:bg-[#83d3f7] text-white font-medium py-2 rounded-md transition"
          onClick={handleStart}
        >
          Iniciar Encuesta
        </button>
      </div>
    </div>
  );
}
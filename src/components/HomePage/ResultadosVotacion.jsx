'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getVotacionPorId } from '@/api/votaciones';

const medallas = ['🥇', '🥈', '🥉'];

const ResultadosVotacion = ({ votacionId }) => {
  const [participantes, setParticipantes] = useState([]);
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const res = await getVotacionPorId(votacionId);
        const ordenados = [...res.participantes].sort((a, b) => b.votos - a.votos);
        setParticipantes(ordenados);
        setEvento(res.evento);
      } catch (error) {
        console.error('Error al cargar resultados:', error);
      }
    };

    fetchResultados();
  }, [votacionId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        Resultados de la Votación {evento?.nombre && `– ${evento.nombre}`}
      </h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {participantes.map((p, index) => (
          <motion.div
            key={p._id}
            className={`rounded-2xl p-6 shadow-2xl text-center border-4 ${
              index === 0
                ? 'bg-yellow-100 border-yellow-400'
                : index === 1
                ? 'bg-gray-100 border-gray-400'
                : index === 2
                ? 'bg-orange-100 border-orange-400'
                : 'bg-white border-neutral-300'
            }`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6, type: 'spring' }}
          >
            <div className="text-6xl mb-2">{medallas[index] || '🎤'}</div>
            <h2 className="text-xl font-bold text-secondary">{p.nombreCompleto}</h2>
            <p className="text-neutral-600 mt-1">{p.descripcion}</p>
            <motion.p
              className="mt-4 text-lg font-bold text-success"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            >
              Votos: {p.votos}
            </motion.p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {participantes[0] && (
          <motion.h2
            className="text-3xl font-bold animate-pulse text-accent"
            initial={{ y: -10 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🏆 ¡El ganador oficial es {participantes[0].nombreCompleto}!
          </motion.h2>
        )}
      </motion.div>
    </div>
  );
};

export default ResultadosVotacion;
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { createScheduleRequest } from '../services/scheduleRequestService';
import { getEmployeeSchedule } from '../services/scheduleService';

const EmployeeSchedule = () => {
  const { user } = useContext(AuthContext);
  const [schedule, setSchedule] = useState(null);
  const [request, setRequest] = useState({
    fecha_solicitada: '',
    nueva_hora_inicio: '',
    nueva_hora_fin: ''
  });
  const [message, setMessage] = useState('');

  // Obtener el horario actual del empleado al cargar el componente
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const scheduleData = await getEmployeeSchedule(user.token, user.id);
        setSchedule(scheduleData);
      } catch (error) {
        console.error('Error al obtener el horario:', error);
        setMessage('No se pudo cargar el horario actual.');
      }
    };
    fetchSchedule();
  }, [user.token, user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createScheduleRequest(
        {
          id_empleado: user.id,
          ...request
        },
        user.token
      );
      setMessage("Solicitud de cambio de horario enviada correctamente.");
      setRequest({ fecha_solicitada: '', nueva_hora_inicio: '', nueva_hora_fin: '' });
    } catch (error) {
      setMessage("Error al enviar la solicitud.");
    }
  };

  // Formatear la hora para mostrar solo horas y minutos
  const formatTime = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
  };

  return (
    <div>
      <h1>Mi Horario</h1>
      {message && <p>{message}</p>}
      {schedule ? (
        <div>
          <p><strong>Fecha:</strong> {schedule.fecha}</p>
          <p><strong>Hora de Inicio:</strong> {formatTime(schedule.hora_inicio)}</p>
          <p><strong>Hora de Fin:</strong> {formatTime(schedule.hora_fin)}</p>
        </div>
      ) : (
        <p>No tienes un horario asignado.</p>
      )}

      <h2>Solicitar Cambio de Horario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="fecha_solicitada"
          value={request.fecha_solicitada}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="nueva_hora_inicio"
          value={request.nueva_hora_inicio}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="nueva_hora_fin"
          value={request.nueva_hora_fin}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Solicitar Cambio</button>
      </form>
    </div>
  );
};

export default EmployeeSchedule;

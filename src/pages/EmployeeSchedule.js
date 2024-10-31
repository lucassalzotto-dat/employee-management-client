// src/pages/EmployeeSchedule.js
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

  const formatTime = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Mi Horario</h1>
      {message && <p className="text-success">{message}</p>}
      {schedule ? (
        <div className="card p-3 mb-4">
          <p><strong>Fecha:</strong> {schedule.fecha}</p>
          <p><strong>Hora de Inicio:</strong> {formatTime(schedule.hora_inicio)}</p>
          <p><strong>Hora de Fin:</strong> {formatTime(schedule.hora_fin)}</p>
        </div>
      ) : (
        <p className="text-muted">No tienes un horario asignado.</p>
      )}

      <h2 className="mb-3">Solicitar Cambio de Horario</h2>
      <form onSubmit={handleSubmit} className="card p-3">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="date"
              name="fecha_solicitada"
              value={request.fecha_solicitada}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Fecha solicitada"
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="time"
              name="nueva_hora_inicio"
              value={request.nueva_hora_inicio}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Hora de Inicio"
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="time"
              name="nueva_hora_fin"
              value={request.nueva_hora_fin}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Hora de Fin"
              required
            />
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#2A5D78' }}>
            Solicitar Cambio
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeSchedule;

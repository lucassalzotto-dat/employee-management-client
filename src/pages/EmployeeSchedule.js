import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { createScheduleRequest } from '../services/scheduleRequestService';

const EmployeeSchedule = () => {
  const { user } = useContext(AuthContext);
  const [request, setRequest] = useState({
    fecha_solicitada: '',
    nueva_hora_inicio: '',
    nueva_hora_fin: ''
  });
  const [message, setMessage] = useState('');

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

  return (
    <div>
      <h1>Mis Horarios</h1>
      {/* Aquí se mostraría el horario actual */}
      <h2>Solicitar Cambio de Horario</h2>
      {message && <p>{message}</p>}
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

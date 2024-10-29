import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { fetchAllScheduleRequests, updateScheduleRequestStatus } from '../services/scheduleRequestService';

const ScheduleRequestList = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllScheduleRequests(user.token);
        setRequests(data);
      } catch (error) {
        setError('Error al obtener las solicitudes de cambio.');
      }
    };
    fetchData();
  }, [user.token]);

  const handleUpdateRequestStatus = async (id, status) => {
    try {
      await updateScheduleRequestStatus(id, status, user.token);
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, estado: status } : request
        )
      );
    } catch (error) {
      setError('Error al actualizar el estado de la solicitud.');
    }
  };

  return (
    <div>
      <h1>Solicitudes de Cambio de Horario</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            <p>
              <strong>Empleado:</strong> {request.employee.nombre} - {request.employee.posicion}
            </p>
            <p>
              <strong>Fecha Solicitada:</strong> {request.fecha_solicitada} <br />
              <strong>Nueva Hora:</strong> {request.nueva_hora_inicio} a {request.nueva_hora_fin} <br />
              <strong>Estado:</strong> {request.estado}
            </p>
            {request.estado === 'pendiente' && (
              <div>
                <button onClick={() => handleUpdateRequestStatus(request.id, 'aprobada')}>
                  Aprobar
                </button>
                <button onClick={() => handleUpdateRequestStatus(request.id, 'rechazada')}>
                  Rechazar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleRequestList;

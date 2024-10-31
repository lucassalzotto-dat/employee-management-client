// src/pages/ScheduleRequestList.js
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
    <div className="container mt-4">
      <h1 className="mb-4">Solicitudes de Cambio de Horario</h1>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {requests.map((request) => (
          <li key={request.id} className="list-group-item mb-3">
            <p className="mb-1">
              <strong>Empleado:</strong> {request.employee.nombre} - {request.employee.posicion}
            </p>
            <p className="mb-1">
              <strong>Fecha Solicitada:</strong> {request.fecha_solicitada} <br />
              <strong>Nueva Hora:</strong> {request.nueva_hora_inicio} a {request.nueva_hora_fin} <br />
              <strong>Estado:</strong> {request.estado}
            </p>
            {request.estado === 'pendiente' && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: '#2A5D78', color: 'white' }}
                  onClick={() => handleUpdateRequestStatus(request.id, 'aprobada')}
                >
                  Aprobar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleUpdateRequestStatus(request.id, 'rechazada')}
                >
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

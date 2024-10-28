// src/pages/ScheduleRequestList.js
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { fetchScheduleRequests } from '../services/scheduleRequestService';

const ScheduleRequestList = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchScheduleRequests(user.token);
      setRequests(data);
    };
    fetchData();
  }, [user]);

  const handleApprove = (id) => {
    // Lógica para aprobar una solicitud
  };

  const handleReject = (id) => {
    // Lógica para rechazar una solicitud
  };

  return (
    <div>
      <h1>Solicitudes de Cambio de Horario</h1>
      <ul>
        {requests.map(request => (
          <li key={request.id}>
            {request.fecha_solicitada} - Estado: {request.estado}
            {user.rol === 'admin' && (
              <>
                <button onClick={() => handleApprove(request.id)}>Aprobar</button>
                <button onClick={() => handleReject(request.id)}>Rechazar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleRequestList;

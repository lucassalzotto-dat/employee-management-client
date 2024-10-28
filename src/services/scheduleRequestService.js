// src/services/scheduleRequestService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Obtener todas las solicitudes de cambio de horario
export const fetchScheduleRequests = async (token) => {
  const response = await axios.get(`${API_URL}/schedule_requests`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Crear una nueva solicitud de cambio de horario
export const createScheduleRequest = async (requestData, token) => {
  const response = await axios.post(`${API_URL}/schedule_requests`, requestData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Actualizar el estado de una solicitud de cambio de horario
export const updateScheduleRequestStatus = async (id, statusData, token) => {
  const response = await axios.put(`${API_URL}/schedule_requests/${id}`, statusData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

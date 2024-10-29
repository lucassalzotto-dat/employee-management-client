// src/services/scheduleRequestService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Crear una nueva solicitud de cambio de horario
export const createScheduleRequest = async (requestData, token) => {
  try {
    const response = await axios.post(`${API_URL}/schedule_requests/create`, requestData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear solicitud de cambio de horario:', error.response?.data || error.message);
    throw error;
  }
};
// Obtener todas las solicitudes de cambio de horario
export const fetchAllScheduleRequests = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/schedule_requests/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las solicitudes de cambio:', error.response?.data || error.message);
    throw error;
  }
};

// Aprobar o rechazar una solicitud de cambio
export const updateScheduleRequestStatus = async (id, status, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/schedule_requests/${id}/status`,
      { estado: status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el estado de la solicitud (${status}):`, error.response?.data || error.message);
    throw error;
  }
};
// src/services/scheduleService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Función para obtener todos los empleados con sus horarios
export const fetchEmployeesWithSchedules = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/employees/employees-with-schedules`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener empleados con horarios:', error.response?.data || error.message);
    throw error;
  }
};

// Función para asignar un nuevo horario a un empleado
export const assignSchedule = async (scheduleData, token) => {
  try {
    const response = await axios.post(`${API_URL}/schedules`, scheduleData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al asignar horario:', error.response?.data || error.message);
    throw error;
  }
};

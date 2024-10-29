// src/services/scheduleService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

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

export const assignSchedule = async (scheduleData, token) => {
  try {
    const response = await axios.post(`${API_URL}/schedules/assign`, scheduleData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al asignar horario:', error.response?.data || error.message);
    throw error;
  }
};

// Nueva función para actualizar el horario de un empleado
export const updateSchedule = async (scheduleId, scheduleData, token) => {
  try {
    const response = await axios.put(`${API_URL}/schedules/${scheduleId}`, scheduleData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar horario:', error.response?.data || error.message);
    throw error;
  }
};

// Nueva función para obtener el horario del empleado
export const fetchEmployeeSchedule = async (employeeId, token) => {
  try {
    const response = await axios.get(`${API_URL}/schedules/employee/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el horario del empleado:', error.response?.data || error.message);
    throw error;
  }
};
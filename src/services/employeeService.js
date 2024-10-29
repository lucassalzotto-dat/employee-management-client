// src/services/employeeService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Función auxiliar para manejar el encabezado de autorización
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Obtener la lista de empleados usando la nueva ruta `/employees-with-schedules`
export const fetchEmployees = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/employees/all`, authHeader(token));
    return response.data;
  } catch (error) {
    console.error('Error al obtener empleados:', error.response?.data || error.message);
    throw error;
  }
};

// Crear un nuevo empleado (solo para admin) usando `/register-employee`
export const createEmployee = async (employeeData, token) => {
  try {
    const response = await axios.post(`${API_URL}/users/register-employee`, employeeData, authHeader(token));
    return response.data;
  } catch (error) {
    console.error('Error al crear empleado:', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar un empleado existente
export const updateEmployee = async (id, employeeData, token) => {
  try {
    const response = await axios.put(`${API_URL}/employees/${id}`, employeeData, authHeader(token));
    return response.data;
  } catch (error) {
    console.error('Error al actualizar empleado:', error.response?.data || error.message);
    throw error;
  }
};

// Eliminar un empleado
export const deleteEmployee = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/employees/${id}`, authHeader(token));
    return response.data;
  } catch (error) {
    console.error('Error al eliminar empleado:', error.response?.data || error.message);
    throw error;
  }
};

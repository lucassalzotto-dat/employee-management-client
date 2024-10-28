// src/pages/ScheduleList.js
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { fetchEmployeesWithSchedules, assignSchedule } from '../services/scheduleService';

const ScheduleList = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    id_empleado: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: ''
  });

  // Función para formatear el tiempo
  const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(`1970-01-01T${time}Z`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Obtener todos los empleados con sus horarios al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEmployeesWithSchedules(user.token);
        setEmployees(data);
      } catch (error) {
        console.error('Error al obtener empleados con horarios:', error);
        setError('No se pudo obtener la lista de horarios.');
      }
    };
    fetchData();
  }, [user.token]);

  // Maneja el cambio en los campos del formulario para asignar un nuevo horario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Asigna un nuevo horario al empleado seleccionado y actualiza la lista
  const handleAssignSchedule = async (e) => {
    e.preventDefault();
    try {
      const assignedSchedule = await assignSchedule(newSchedule, user.token);
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === newSchedule.id_empleado
            ? { ...emp, schedule: assignedSchedule }
            : emp
        )
      );
      setNewSchedule({ id_empleado: '', fecha: '', hora_inicio: '', hora_fin: '' });
    } catch (error) {
      console.error('Error al asignar horario:', error);
      setError('No se pudo asignar el horario.');
    }
  };

  return (
    <div>
      <h1>Lista de Empleados y sus Horarios</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>
            <strong>{emp.nombre}</strong> - {emp.posicion}
            {emp.schedule ? (
              <p>
                Horario: {emp.schedule.fecha} de {formatTime(emp.schedule.hora_inicio)} a {formatTime(emp.schedule.hora_fin)}
              </p>
            ) : (
              <p>Horario: No asignado</p>
            )}
          </li>
        ))}
      </ul>

      {/* Formulario para asignar un nuevo horario */}
      <h2>Asignar Horario a un Empleado</h2>
      <form onSubmit={handleAssignSchedule}>
        <select
          name="id_empleado"
          value={newSchedule.id_empleado}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccione un empleado</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.nombre} - {emp.posicion}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="fecha"
          placeholder="Fecha"
          value={newSchedule.fecha}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="hora_inicio"
          placeholder="Hora de Inicio"
          value={newSchedule.hora_inicio}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="hora_fin"
          placeholder="Hora de Fin"
          value={newSchedule.hora_fin}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Asignar Horario</button>
      </form>
    </div>
  );
};

export default ScheduleList;

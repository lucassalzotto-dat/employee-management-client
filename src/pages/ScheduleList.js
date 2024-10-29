// src/pages/ScheduleList.js
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { fetchEmployeesWithSchedules, assignSchedule, updateSchedule } from '../services/scheduleService';

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
  const [editingSchedule, setEditingSchedule] = useState(null);

  const formatTime = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingSchedule) {
      setEditingSchedule((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewSchedule((prev) => ({ ...prev, [name]: value }));
    }
  };

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

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    try {
      const updatedSchedule = await updateSchedule(editingSchedule.id, {
        fecha: editingSchedule.fecha,
        hora_inicio: editingSchedule.hora_inicio,
        hora_fin: editingSchedule.hora_fin
      }, user.token);
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.schedule && emp.schedule.id === editingSchedule.id
            ? { ...emp, schedule: updatedSchedule }
            : emp
        )
      );
      setEditingSchedule(null);
    } catch (error) {
      console.error('Error al actualizar horario:', error);
      setError('No se pudo actualizar el horario.');
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
              <>
                <p>
                  Horario: {emp.schedule.fecha} de {formatTime(emp.schedule.hora_inicio)} a {formatTime(emp.schedule.hora_fin)}
                </p>
                <button onClick={() => handleEditSchedule(emp.schedule)}>Editar Horario</button>
              </>
            ) : (
              <p>Horario: No asignado</p>
            )}
          </li>
        ))}
      </ul>

      {editingSchedule ? (
        <form onSubmit={handleUpdateSchedule}>
          <h2>Editar Horario</h2>
          <input
            type="date"
            name="fecha"
            placeholder="Fecha"
            value={editingSchedule.fecha}
            onChange={handleInputChange}
            required
          />
          <input
            type="time"
            name="hora_inicio"
            placeholder="Hora de Inicio"
            value={editingSchedule.hora_inicio}
            onChange={handleInputChange}
            required
          />
          <input
            type="time"
            name="hora_fin"
            placeholder="Hora de Fin"
            value={editingSchedule.hora_fin}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => setEditingSchedule(null)}>Cancelar</button>
        </form>
      ) : (
        <form onSubmit={handleAssignSchedule}>
          <h2>Asignar Horario a un Empleado</h2>
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
      )}
    </div>
  );
};

export default ScheduleList;

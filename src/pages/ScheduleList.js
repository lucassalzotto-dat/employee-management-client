import React, { useContext, useEffect, useState, useCallback } from 'react';
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

  // Definir fetchSchedules como una función de callback para que sea estable y se pueda usar en useEffect
  const fetchSchedules = useCallback(async () => {
    try {
      const data = await fetchEmployeesWithSchedules(user.token);
      setEmployees(data);
    } catch (error) {
      console.error('Error al obtener empleados con horarios:', error);
      setError('No se pudo obtener la lista de horarios.');
    }
  }, [user.token]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

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
      await assignSchedule(newSchedule, user.token);
      setNewSchedule({ id_empleado: '', fecha: '', hora_inicio: '', hora_fin: '' });
      await fetchSchedules(); // Actualiza la lista de horarios después de asignar uno
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
      await updateSchedule(editingSchedule.id, {
        fecha: editingSchedule.fecha,
        hora_inicio: editingSchedule.hora_inicio,
        hora_fin: editingSchedule.hora_fin
      }, user.token);
      setEditingSchedule(null);
      await fetchSchedules(); // Actualiza la lista después de editar el horario
    } catch (error) {
      console.error('Error al actualizar horario:', error);
      setError('No se pudo actualizar el horario.');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de Empleados y sus Horarios</h1>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group mb-4">
        {employees.map((emp) => (
          <li key={emp.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{emp.nombre}</strong> - {emp.posicion}
              {emp.schedule ? (
                <p className="mb-1">
                  Horario: {emp.schedule.fecha} de {formatTime(emp.schedule.hora_inicio)} a {formatTime(emp.schedule.hora_fin)}
                </p>
              ) : (
                <p className="mb-1">Horario: No asignado</p>
              )}
            </div>
            {emp.schedule && (
              <button className="btn btn-sm" style={{ backgroundColor: '#2A5D78', color: 'white' }} onClick={() => handleEditSchedule(emp.schedule)}>Editar Horario</button>
            )}
          </li>
        ))}
      </ul>

      <div className="card p-4">
        {editingSchedule ? (
          <form onSubmit={handleUpdateSchedule}>
            <h2 className="mb-3">Editar Horario</h2>
            <div className="row mb-3">
              <div className="col">
                <input
                  type="date"
                  name="fecha"
                  className="form-control"
                  value={editingSchedule.fecha}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="time"
                  name="hora_inicio"
                  className="form-control"
                  value={editingSchedule.hora_inicio}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="time"
                  name="hora_fin"
                  className="form-control"
                  value={editingSchedule.hora_fin}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn me-2" style={{ backgroundColor: '#2A5D78', color: 'white' }}>Guardar Cambios</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingSchedule(null)}>Cancelar</button>
          </form>
        ) : (
          <form onSubmit={handleAssignSchedule}>
            <h2 className="mb-3">Asignar Horario a un Empleado</h2>
            <div className="row mb-3">
              <div className="col">
                <select
                  name="id_empleado"
                  className="form-select"
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
              </div>
              <div className="col">
                <input
                  type="date"
                  name="fecha"
                  className="form-control"
                  value={newSchedule.fecha}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="time"
                  name="hora_inicio"
                  className="form-control"
                  value={newSchedule.hora_inicio}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="time"
                  name="hora_fin"
                  className="form-control"
                  value={newSchedule.hora_fin}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn" style={{ backgroundColor: '#2A5D78', color: 'white' }}>Asignar Horario</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ScheduleList;

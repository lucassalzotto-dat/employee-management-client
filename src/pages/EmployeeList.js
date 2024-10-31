// src/pages/EmployeeList.js
import React, { useContext, useEffect, useState, useCallback } from 'react';
import AuthContext from '../context/AuthContext';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    posicion: '',
    fecha_contratacion: '',
    estado: true,
  });
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Redirige si el usuario no es admin
  useEffect(() => {
    if (user.rol !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Obtener la lista de empleados al montar el componente
  const fetchData = useCallback(async () => {
    try {
      const data = await fetchEmployees(user.token);
      setEmployees(data.employees);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      setError('No se pudo obtener la lista de empleados.');
    }
  }, [user.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Maneja el cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar un nuevo empleado y actualizar la lista de empleados
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(newEmployee, user.token);
      await fetchData();
      setNewEmployee({
        nombre: '',
        correo: '',
        contraseña: '',
        posicion: '',
        fecha_contratacion: '',
        estado: true,
      });
    } catch (error) {
      console.error('Error al agregar empleado:', error);
      setError('No se pudo agregar el empleado.');
    }
  };

  // Editar la información de un empleado
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      nombre: employee.nombre,
      posicion: employee.posicion,
      fecha_contratacion: employee.fecha_contratacion,
      estado: employee.estado,
    });
  };

  // Actualizar un empleado y actualizar la lista
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee(editingEmployee.id, newEmployee, user.token);
      await fetchData();
      setEditingEmployee(null);
      setNewEmployee({
        nombre: '',
        correo: '',
        contraseña: '',
        posicion: '',
        fecha_contratacion: '',
        estado: true,
      });
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      setError('No se pudo actualizar el empleado.');
    }
  };

  // Eliminar un empleado de la lista
  const handleDeleteEmployee = async (id) => {
    try {
      await deleteEmployee(id, user.token);
      await fetchData();
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      setError('No se pudo eliminar el empleado.');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de Empleados</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <ul className="list-group mb-4">
        {employees.map((emp) => (
          <li key={emp.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{emp.nombre}</strong> - {emp.posicion} - {emp.correo}
            </div>
            <div className="btn-group" role="group">
              <button
                className="btn btn-sm"
                style={{ backgroundColor: '#2A5D78', color: 'white', marginRight: '0.5rem' }}
                onClick={() => handleEditEmployee(emp)}
              >
                Actualizar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteEmployee(emp.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      {/* Formulario para agregar o actualizar un empleado */}
      <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee} className="border p-4 rounded">
        <h2 className="mb-4">{editingEmployee ? "Actualizar Empleado" : "Agregar Nuevo Empleado"}</h2>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="nombre"
              placeholder="Nombre"
              value={newEmployee.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          {!editingEmployee && (
            <>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  name="correo"
                  placeholder="Correo"
                  value={newEmployee.correo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="password"
                  className="form-control"
                  name="contraseña"
                  placeholder="Contraseña"
                  value={newEmployee.contraseña}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}
          <div className="col">
            <input
              type="text"
              className="form-control"
              name="posicion"
              placeholder="Posición"
              value={newEmployee.posicion}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="date"
              className="form-control"
              name="fecha_contratacion"
              placeholder="Fecha de Contratación"
              value={newEmployee.fecha_contratacion}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col">
            <select
              name="estado"
              className="form-control"
              value={newEmployee.estado.toString()}
              onChange={(e) => setNewEmployee({ ...newEmployee, estado: e.target.value === 'true' })}
            >
              <option value="" disabled>
                Seleccionar Estado
              </option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#2A5D78', color: 'white', marginRight: '0.5rem' }}>
            {editingEmployee ? "Actualizar Empleado" : "Agregar Empleado"}
          </button>
          {editingEmployee && (
            <button type="button" className="btn btn-secondary" onClick={() => setEditingEmployee(null)}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeList;

// src/pages/EmployeeList.js
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService';
import { useNavigate } from 'react-router-dom';

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
    estado: true
  });
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Redirige si el usuario no es admin
  useEffect(() => {
    if (user.rol !== "admin") {
      navigate('/');
    }
  }, [user, navigate]);

  // Obtener la lista de empleados al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEmployees(user.token);
        setEmployees(data.employees);
      } catch (error) {
        console.error('Error al obtener empleados:', error);
        setError('No se pudo obtener la lista de empleados.');
      }
    };
    fetchData();
  }, [user.token]);

  // Maneja el cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar un nuevo empleado y actualizar la lista de empleados
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const addedEmployee = await createEmployee(newEmployee, user.token);
      setEmployees((prevEmployees) => [...prevEmployees, addedEmployee]);
      setNewEmployee({
        nombre: '',
        correo: '',
        contraseña: '',
        posicion: '',
        fecha_contratacion: '',
        estado: true
      });
    } catch (error) {
      console.error("Error al agregar empleado:", error);
      setError("No se pudo agregar el empleado.");
    }
  };

  // Editar la información de un empleado
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      nombre: employee.nombre,
      posicion: employee.posicion,
      fecha_contratacion: employee.fecha_contratacion,
      estado: employee.estado
    });
  };

  // Actualizar un empleado y actualizar la lista
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const updatedEmployee = await updateEmployee(editingEmployee.id, newEmployee, user.token);
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) => (emp.id === editingEmployee.id ? updatedEmployee : emp))
      );
      setEditingEmployee(null);
      setNewEmployee({
        nombre: '',
        correo: '',
        contraseña: '',
        posicion: '',
        fecha_contratacion: '',
        estado: true
      });
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      setError("No se pudo actualizar el empleado.");
    }
  };

  // Eliminar un empleado de la lista
  const handleDeleteEmployee = async (id) => {
    try {
      await deleteEmployee(id, user.token);
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      setError("No se pudo eliminar el empleado.");
    }
  };

  return (
    <div>
      <h1>Lista de Empleados</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>
            {emp.nombre || "-"} - {emp.posicion || "-"}
            {emp.user && (
              <>
                <br />
                <strong>Usuario Asociado:</strong> {emp.user.nombre || "-"} - {emp.user.correo || "-"}
              </>
            )}
            <button onClick={() => handleEditEmployee(emp)}>Actualizar</button>
            <button onClick={() => handleDeleteEmployee(emp.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      
      {/* Formulario para agregar o actualizar un empleado */}
      <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}>
        <h2>{editingEmployee ? "Actualizar Empleado" : "Agregar Nuevo Empleado"}</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={newEmployee.nombre}
          onChange={handleInputChange}
          required
        />
        {!editingEmployee && (
          <>
            <input
              type="text"
              name="correo"
              placeholder="Correo"
              value={newEmployee.correo}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="contraseña"
              placeholder="Contraseña"
              value={newEmployee.contraseña}
              onChange={handleInputChange}
              required
            />
          </>
        )}
        <input
          type="text"
          name="posicion"
          placeholder="Posición"
          value={newEmployee.posicion}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="fecha_contratacion"
          placeholder="Fecha de Contratación"
          value={newEmployee.fecha_contratacion}
          onChange={handleInputChange}
          required
        />
        <label>
          Estado:
          <select
            name="estado"
            value={newEmployee.estado.toString()}
            onChange={(e) => setNewEmployee({ ...newEmployee, estado: e.target.value === 'true' })}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </label>
        <button type="submit">{editingEmployee ? "Actualizar Empleado" : "Agregar Empleado"}</button>
        {editingEmployee && (
          <button type="button" onClick={() => setEditingEmployee(null)}>
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
};

export default EmployeeList;

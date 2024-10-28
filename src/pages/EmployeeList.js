// src/pages/EmployeeList.js
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { fetchEmployees, createEmployee } from '../services/employeeService';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null); // Estado para manejar errores
  const [newEmployee, setNewEmployee] = useState({
    nombre: '',
    posicion: '',
    fecha_contratacion: '',
    estado: true,
    id_usuario: user.id
  });

  // Redirige si el usuario no es admin
  useEffect(() => {
    if (user.rol !== "admin") {
      navigate('/'); // Redirige a la página principal o de login si el usuario no es admin
    }
  }, [user, navigate]);

  // Obtener la lista de empleados al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEmployees(user.token);
        setEmployees(data.employees); // Accede específicamente a `data.employees`
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
      // Agrega el nuevo empleado directamente a la lista sin recargar
      setEmployees((prevEmployees) => [...prevEmployees, addedEmployee]);
      setNewEmployee({
        nombre: '',
        posicion: '',
        fecha_contratacion: '',
        estado: true,
        id_usuario: user.id
      });
    } catch (error) {
      console.error("Error al agregar empleado:", error);
      setError("No se pudo agregar el empleado.");
    }
  };

  return (
    <div>
      <h1>Lista de Empleados</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar error en la interfaz */}
      <ul>
        {employees.map((emp) => (
          <li key={emp.id}> {/* Usamos `emp.id` como clave única */}
            {emp.nombre} - {emp.posicion}
            {emp.user && (
              <>
                <br />
                <strong>Usuario Asociado:</strong> {emp.user.nombre} - {emp.user.correo}
              </>
            )}
          </li>
        ))}
      </ul>
      
      {/* Formulario para agregar un nuevo empleado */}
      {user.rol === "admin" && (
        <form onSubmit={handleAddEmployee}>
          <h2>Agregar Nuevo Empleado</h2>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={newEmployee.nombre}
            onChange={handleInputChange}
            required
          />
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
          <button type="submit">Agregar Empleado</button>
        </form>
      )}
    </div>
  );
};

export default EmployeeList;

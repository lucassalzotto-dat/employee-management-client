// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Login from './pages/Login';
import EmployeeList from './pages/EmployeeList';
import ScheduleList from './pages/ScheduleList';
import ScheduleRequestList from './pages/ScheduleRequestList';
import EmployeeSchedule from './pages/EmployeeSchedule';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">Employee Management</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              {user && user.rol === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link to="/employees" className="nav-link">Empleados</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/schedules" className="nav-link">Horarios</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/schedule-requests" className="nav-link">Solicitudes de Cambio</Link>
                  </li>
                </>
              )}
              {user && user.rol === 'empleado' && (
                <li className="nav-item">
                  <Link to="/mi-horario" className="nav-link">Mi Horario</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Rutas protegidas solo para el rol admin */}
          {user?.rol === 'admin' && (
            <>
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/schedules" element={<ScheduleList />} />
              <Route path="/schedule-requests" element={<ScheduleRequestList />} /> {/* Corregido */}
            </>
          )}
          {/* Ruta protegida solo para el rol empleado */}
          {user?.rol === 'empleado' ? (
            <Route path="/mi-horario" element={<EmployeeSchedule />} />
          ) : (
            <Route path="/mi-horario" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

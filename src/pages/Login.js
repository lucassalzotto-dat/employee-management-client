import React, { useContext, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Solicitud de autenticación para obtener el token
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { correo: email, contraseña: password });
      const token = response.data.token;

      // 2. Llama a la función `login` para almacenar el token en el contexto
      login(token);

      // 3. Realiza una solicitud para obtener el perfil del usuario usando el token
      const profileResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Opcional: Puedes hacer algo con los datos de perfil obtenidos, como almacenarlos en el contexto si es necesario
      console.log("Perfil del usuario:", profileResponse.data);

      // 4. Redirige al usuario a la página de dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error de autenticación", error);
      alert("Error al iniciar sesión. Por favor, verifica tus credenciales.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="p-4 border rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input 
            type="email" 
            className="form-control" 
            placeholder="Correo" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input 
            type="password" 
            className="form-control" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn w-100" style={{ backgroundColor: '#2A5D78', color: 'white' }}>Ingresar</button>

      </form>
    </div>
  );
};

export default Login;

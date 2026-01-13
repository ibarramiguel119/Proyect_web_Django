import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkNodes, setNetworkNodes] = useState([]);
  const navigate = useNavigate();

  // Generar nodos de red animados
  useEffect(() => {
    const nodes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
    }));
    setNetworkNodes(nodes);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/token/`, form);
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) setError('Credenciales inválidas.');
        else setError(`Error: ${err.response.status}`);
      } else {
        setError('Error de red. Verifica que el backend esté disponible.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Red de fondo animada */}
      <div className="network-background">
        {networkNodes.map((node) => (
          <div
            key={node.id}
            className="network-node"
            style={{
              top: `${node.top}%`,
              left: `${node.left}%`,
              width: `${node.size}px`,
              height: `${node.size}px`,
              animation: `float ${node.duration}s linear ${node.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Contenedor del formulario */}
      <div className="login-box">
        <div className="login-header">
          <h1>TechHub</h1>
          <p>Acceso Seguro</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Ingresa tu usuario"
              value={form.username}
              onChange={handleChange}
              className="form-input"
            />
            <div className="input-underline" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={handleChange}
              className="form-input"
            />
            <div className="input-underline" />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loader" />
                Autenticando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;

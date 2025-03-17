import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/homepage/HomePage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

function App() {
  const jwt = localStorage.getItem('jwt');

  return (
    <Routes>
      <Route path="/" element={<HomePage /> } />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;

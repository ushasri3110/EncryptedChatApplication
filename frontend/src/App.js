import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/homepage/HomePage'
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </div>
  );
}

export default App;

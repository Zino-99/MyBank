import { Routes, Route } from 'react-router-dom'  // ← plus de BrowserRouter ici
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}
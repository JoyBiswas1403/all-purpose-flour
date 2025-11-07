import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Protected from './components/Protected';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewEvent from './pages/NewEvent';
import Marketplace from './pages/Marketplace';
import Requests from './pages/Requests';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container-page py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Protected><Dashboard /></Protected>} />
            <Route path="/new" element={<Protected><NewEvent /></Protected>} />
            <Route path="/marketplace" element={<Protected><Marketplace /></Protected>} />
            <Route path="/requests" element={<Protected><Requests /></Protected>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

// src/pages/Home.jsx
import { useAuth } from '../../context/auth.context';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">Welcome to Eventrix Home!</h1>
      <p className="mt-4">Logged in as: {user?.displayName || user?.phoneNumber}</p>
      
      <button 
        onClick={logout}
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

export default function Protected({ children }: Props) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-6">Loading…</p>;
  return user ? children : <Navigate to="/login" replace />;
}
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import AuthPage from './pages/AuthPage';
import TasksPage from './pages/TasksPage';

export default function App() {
  const { token } = useAppSelector((s) => s.auth);

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/app" replace /> : <Navigate to="/auth" replace />}
      />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/app"
        element={token ? <TasksPage /> : <Navigate to="/auth" replace />}
      />
      <Route path="*" element={<Navigate to={token ? '/app' : '/auth'} replace />} />
    </Routes>
  );
}


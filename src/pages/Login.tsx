import { Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { supabase } from '../lib/supabase';

const Login = () => {
  const { user, checking } = useAuth(); // ✅ always call hooks first

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('The problem is:', error.message);
    } else {
      console.log('User signed in:', data);
      setRedirectToDashboard(true);
    }
  };

  // ✅ Redirect logic AFTER hooks and state
  if (checking) return null;

  if (user || redirectToDashboard) {
    return <Navigate to="/Edashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          type="submit"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate(); // React Router v6: useNavigate instead of useHistory

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setChecking(false);
    };

    getUser();
 
   
  }, []);

 
  // Logout function
  const logout = async () => {
    await supabase.auth.signOut(); // Sign out from Supabase
    setUser(null); // Clear the user state
    navigate('/login'); // Redirect to login page after logout
  };

  return { user, checking, logout };
};

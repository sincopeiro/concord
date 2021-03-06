import { AxiosResponse } from 'axios';
import { createContext, useEffect, useState } from 'react';
import getUser from 'utils/services/getUser';
import api from '../api';
import { User } from '../types/User';

interface AuthContextType {
  user: any;
  signup: (user: User) => Promise<AxiosResponse<any, any>>;
  signout: () => void;
  retrieve: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();

  const signup = async (newUser: User): Promise<AxiosResponse<any, any>> => {
    try {
      return api.post('/register', newUser);
    } catch (err) {
      throw err;
    }
  };

  const signout = () => {
    setUser({} as User);
    localStorage.clear();
  };

  const retrieve = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      const fetchedUser = await getUser(token);
      setUser(fetchedUser);
    }
  };

  useEffect(() => {
    if (!!localStorage.getItem('token') && !user) {
      retrieve();
    }
  }, [user]);

  const value = { user, signup, signout, retrieve };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

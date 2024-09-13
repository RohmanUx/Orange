  'use client' ; 

import { UserContextType, UserType } from './type';
import * as React from 'react';
import apiCall from '@/helper/apiCall';
import { toast } from 'react-toastify';

export const UserContext = React.createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
});

interface IUserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FunctionComponent<IUserProviderProps> = ({
  children,
}) => {
  // Set user as a single object or null, not an array
  const [user, setUser] = React.useState<UserType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const keepLogin = async () => {
    try {
      const checkToken = localStorage.getItem('token');
      if (checkToken) {
        const { data } = await apiCall.get('/api/auth/keeplogin', {
          headers: {
            Authorization: `Bearer ${checkToken}`,
          },
        });

        // Set user data (single user, not an array)
        setUser({
          id: data.result.id, // Assuming id is part of the API response
          email: data.result.email,
          identificationId: data.result.identificationId,
          role: data.result.role,
          points: data.result.points,
          balance: data.result.balance, 
                              image: data.result.image,
          token: data.result.token, // Assuming token is part of the API response
        });

        // Update token in localStorage
        localStorage.setItem('token', data.result.token);
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      toast.error('Error during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const checkToken = localStorage.getItem('token');
    if (checkToken) {
      keepLogin();
    } else {
      setLoading(false); // No token, stop loading
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

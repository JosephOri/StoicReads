import { User } from '../interfaces/User';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN_KEY, USERS_URL } from '../utils/constants';

interface UseCurrentUserResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
}

export const useCurrentUser = (): UseCurrentUserResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const response = await axios.get(`${USERS_URL}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response) {
          throw new Error('Failed to fetch user');
        }
        const data: User = await response.data;
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, setUser, loading, error };
};

export default useCurrentUser;

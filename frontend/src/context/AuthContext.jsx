import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, applicationsAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jobmate_token') || null);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [appliedCompanyIds, setAppliedCompanyIds] = useState([]);

  const fetchAppliedIds = async () => {
    try {
      const res = await applicationsAPI.getMyAppliedIds();
      if (res.data?.data) {
        setAppliedJobIds(res.data.data.appliedJobIds || []);
        setAppliedCompanyIds(res.data.data.appliedCompanyIds || []);
      }
    } catch (err) {
      // Silent error for unauthenticated/expired sessions
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('jobmate_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data && res.data.data && res.data.data.user) {
            setUser(res.data.data.user);
            await fetchAppliedIds();
          }
        } catch (error) {
          console.warn('[Auth] Session expired or invalid token');
          localStorage.removeItem('jobmate_token');
          localStorage.removeItem('jobmate_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: receivedToken, user: receivedUser } = res.data.data;
    localStorage.setItem('jobmate_token', receivedToken);
    localStorage.setItem('jobmate_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    fetchAppliedIds();
    return receivedUser;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    const { token: receivedToken, user: receivedUser } = res.data.data;
    localStorage.setItem('jobmate_token', receivedToken);
    localStorage.setItem('jobmate_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    fetchAppliedIds();
    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('jobmate_token');
    localStorage.removeItem('jobmate_user');
    setToken(null);
    setUser(null);
    setAppliedJobIds([]);
    setAppliedCompanyIds([]);
  };

  const updateProfile = async (updates) => {
    const res = await authAPI.updateProfile(updates);
    const updatedUser = res.data.data.user;
    setUser(updatedUser);
    localStorage.setItem('jobmate_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.data?.data?.user) {
        setUser(res.data.data.user);
        await fetchAppliedIds();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markApplied = ({ jobId, companyId }) => {
    if (jobId) {
      const jStr = jobId.toString();
      setAppliedJobIds((prev) => (prev.includes(jStr) ? prev : [...prev, jStr]));
    }
    if (companyId) {
      const cStr = companyId.toString();
      setAppliedCompanyIds((prev) => (prev.includes(cStr) ? prev : [...prev, cStr]));
    }
  };

  const isAppliedToJobOrCompany = (jobId, companyId) => {
    const jStr = jobId ? jobId.toString() : '';
    const cStr = companyId ? companyId.toString() : '';
    return (jStr && appliedJobIds.includes(jStr)) || (cStr && appliedCompanyIds.includes(cStr));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    appliedJobIds,
    appliedCompanyIds,
    isAppliedToJobOrCompany,
    markApplied,
    refreshAppliedIds: fetchAppliedIds,
    login,
    register,
    logout,
    updateProfile,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

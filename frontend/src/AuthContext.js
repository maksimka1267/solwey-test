// src/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import { setCurrentUserId } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {id, email, first_name, last_name, role}

  const loginUser = (userData) => {
    setUser(userData);
    setCurrentUserId(userData.id);
  };

  const logoutUser = () => {
    setUser(null);
    setCurrentUserId(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

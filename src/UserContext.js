import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null);
  const [location, setLocation] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore auth state from localStorage on app load
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("role");
    const storedLocation = localStorage.getItem("location");
    const storedAuth = localStorage.getItem("isAuthenticated");

    if (storedUserName && storedAuth === "true") {
      setUserName(storedUserName);
      setRole(storedRole);
      setLocation(storedLocation);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Save auth state to localStorage whenever it changes
  const updateUserName = (name) => {
    setUserName(name);
    if (name) {
      localStorage.setItem("userName", name);
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("userName");
      setIsAuthenticated(false);
      localStorage.setItem("isAuthenticated", "false");
    }
  };

  const updateRole = (newRole) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem("role", newRole);
    }
  };

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    if (newLocation) {
      localStorage.setItem("location", newLocation);
    }
  };

  const logout = () => {
    setUserName(null);
    setRole(null);
    setLocation(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("location");
    localStorage.setItem("isAuthenticated", "false");
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        role,
        location,
        isAuthenticated,
        loading,
        setUserName: updateUserName,
        setRole: updateRole,
        setLocation: updateLocation,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

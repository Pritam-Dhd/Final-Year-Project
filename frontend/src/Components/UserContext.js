import React, { createContext, useState, useContext } from "react";

const UserRoleContext = createContext();

export const useUserRole = () => useContext(UserRoleContext);

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");

  const updateUserRole = (role) => {
    setUserRole(role);
    // localStorage.setItem("userRole", role);
  };

  return (
    <UserRoleContext.Provider value={{ userRole, updateUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

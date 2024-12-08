import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const isAuthenticated = () => {
  // Check if the user is authenticated
  const userData = localStorage.getItem("userRole");
  return userData !== null;
};

export const PrivateRoute = ({ element }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to the login page if the user is not authenticated
      navigate("/login");
    }
  });

  return isAuthenticated() ? element : null;
};

export const AuthRoute = ({ element }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated()) {
      // Redirect to the dashboard if the user is already authenticated
      navigate("/dashboard");
    }
  });

  return !isAuthenticated() ? element : null;
};

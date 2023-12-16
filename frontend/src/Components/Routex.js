import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import Dashboard from "../Pages/Dashboard";
import PageNotFound from "../Pages/PageNotFound";
import {
  PrivateRoute,
  AuthRoute,
} from "../Middleware/CheckAuth";

const Routex = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthRoute element={<Login />} />} />
          <Route path="/login" element={<AuthRoute element={<Login />} />} />
          <Route path="/signup" element={<AuthRoute element={<Signup />} />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routex;

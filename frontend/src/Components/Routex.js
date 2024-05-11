import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from '../Pages/Login';
import Signup from '../Pages/Signup';
import Dashboard from '../Pages/Dashboard';
import PageNotFound from '../Pages/PageNotFound';
import ForgetPassword from '../Pages/ForgetPassword';
import { PrivateRoute, AuthRoute } from '../Middleware/CheckAuth';

const Routex = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthRoute element={<Login />} />} />
        <Route path="/login" element={<AuthRoute element={<Login />} />} />
        <Route path="/signup" element={<AuthRoute element={<Signup />} />} />
        <Route path="/forget-password" element={<AuthRoute element={<ForgetPassword />} />} />
        <Route path="/dashboard/*" element={<PrivateRoute element={<Dashboard />} />} />
        {/* <Route path="/dashboard/book" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/dashboard/genre" element={<PrivateRoute element={<Dashboard />} />} /> */}
        <Route path="/page-not-found" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default Routex;

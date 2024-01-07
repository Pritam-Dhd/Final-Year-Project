import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Sidebar from "../Components/Sidebar.js";
import Content from "../Components/Content.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    console.log(role);
    setUserRole(role);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar userRole={userRole} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: 9 }}>
        <Box sx={{ display: "flex" }}>
          <Content userRole={userRole}/>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

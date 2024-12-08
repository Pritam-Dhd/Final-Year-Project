import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar.js";
import Content from "../Components/Content.js";
import axiosClient from "../Components/AxiosClient.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    console.log(role);
    setUserRole(role);
  }, []);

  useEffect(() => {
    axiosClient
      .get("/get-profile", { withCredentials: true })
      .then(function (response) {
        console.log(response);
        const data = response.data;
        console.log(data);
        if (
          response.data.message === "Please login" ||
          response.data.message === "Invalid token"
        ) {
          localStorage.removeItem("userRole");
          navigate("/login");
        }
        setUserData(data);
        console.log(data);
      })
      .catch(function (error) {
        alert(error);
      });
  }, [userRole]);

  const updateUserData = (newUserData) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      ...newUserData,
    }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar userRole={userRole} userData={userData} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: 9 }}>
        <Box sx={{ display: "flex" }}>
          <Content
            userRole={userRole}
            userData={userData}
            updateUserData={updateUserData}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

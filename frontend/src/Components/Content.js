// Content.js
import React from "react";
import { Typography } from "@mui/material";
import Book from "./Book";
import Genre from "./Genre";
import AddUser from "../Pages/User/AddUser";
import SeeAll from "../Pages/User/SeeAll";
import PageNotFound from "../Pages/PageNotFound";
import { useParams } from "react-router-dom";

const Content = ({userRole}) => {
  const { "*": section } = useParams("/dashboard/");
  console.log(section);

  const renderContent = () => {
    switch (section) {
      case "":
        return <Typography paragraph>Dashboard</Typography>;
      case "home":
        return <Typography paragraph>Dashboard</Typography>;
      case "book":
        return <Book />;
      case "genre":
        return <Genre />;
      case "add-user":
        return userRole === "Librarian" ? (
          <AddUser />
        ) : (
          "Only Librarian has access"
        );
      case "all-users":
        return userRole === "Librarian" ? (
          <SeeAll />
        ) : (
          "Only Librarian has access"
        );
      default:
        return <PageNotFound />;
    }
  };

  return <>{renderContent()}</>;
};

export default Content;

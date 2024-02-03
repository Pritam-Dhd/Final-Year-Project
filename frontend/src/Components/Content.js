// Content.js
import React from "react";
import { Typography } from "@mui/material";
import SeeAllUser from "../Pages/User/SeeAll";
import SeeAllBook from "../Pages/Book/SeeAll";
import SeeAllGenre from "../Pages/Genre/SeeAll";
import SeeAllAuthor from "../Pages/Author/SeeAll";
import SeeAllPublisher from "../Pages/Publisher/SeeAll";
import Profile from "../Pages/User/Profile";
import PageNotFound from "../Pages/PageNotFound";
import { useParams } from "react-router-dom";

const Content = ({ userRole, userData, updateUserData }) => {
  const { "*": section } = useParams("/dashboard/");
  console.log(section);

  const renderContent = () => {
    switch (section) {
      case "":
        return <Typography paragraph>Dashboard</Typography>;
      case "home":
        return <Typography paragraph>Dashboard</Typography>;
      case "book":
        return <SeeAllBook userRole={userRole} />;
      case "genre":
        return <SeeAllGenre userRole={userRole} />;
      case "author":
        return <SeeAllAuthor userRole={userRole} />;
        case "publisher":
        return <SeeAllPublisher userRole={userRole} />;
      case "user":
        return userRole === "Librarian" ? (
          <SeeAllUser userData={userData} />
        ) : (
          "Only Librarian has access"
        );
      case "profile":
        return <Profile userData={userData} updateUserData={updateUserData} />;
      default:
        return <PageNotFound />;
    }
  };

  return <>{renderContent()}</>;
};

export default Content;

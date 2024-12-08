import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  List,
  ListItemIcon,
  ListItemText,
  ListItem,
  ListItemButton,
} from "@mui/material";
import {
  Home as HomeIcon,
  Book as BookIcon,
  Person as PersonIcon,
  Sell as GenreIcon,
  People as AuthorIcon,
  Business as PublisherIcon,
  LibraryAdd as IssueIcon,
  AttachMoney as FineIcon,
  LocalLibrary as RequestIcon,
  Assessment as ReportIcon,
} from "@mui/icons-material";
import MailIcon from "@mui/icons-material/Mail";

const SidebarList = ({ text, open, dropdown }) => {
  const { "*": section } = useParams("/dashboard/");
  const active = section === text.toLowerCase();
  return (
    <List>
      <ListItem key={text} disablePadding sx={{ display: "block" }}>
        <Link
          to={`/dashboard/${text.toLowerCase().replace(/\s+/g, "-")}`}
          style={{ textDecoration: "none", color: "white" }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              backgroundColor: active ? "#333" : "transparent",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
                color: "white",
              }}
            >
              {text === "Home" ? (
                <HomeIcon />
              ) : text === "Book" ? (
                <BookIcon />
              ) : text === "User" ? (
                <PersonIcon />
              ) : text === "Genre" ? (
                <GenreIcon />
              ) : text === "Author" ? (
                <AuthorIcon />
              ) : text === "Publisher" ? (
                <PublisherIcon />
              ) : text === "Issue" ? (
                <IssueIcon />
              ) : text === "Fine" ? (
                <FineIcon />
              ) :text === "Report" ? (
                <ReportIcon />
              ) :  text === "Request" ? (
                <RequestIcon />
              ) : (
                <MailIcon />
              )}
            </ListItemIcon>
            <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </Link>
      </ListItem>
    </List>
  );
};

export default SidebarList;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItemIcon,
  ListItemText,
  ListItem,
  ListItemButton,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Home as HomeIcon,
  Book as BookIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  AddBox as AddBoxIcon,
  ListAlt as ListAltIcon,
  Sell as GenreIcon,
  People as AuthorIcon,
  Business as PublisherIcon
} from "@mui/icons-material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const SidebarList = ({ text, open, dropdown }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleTextClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dropdownItems =
    dropdown &&
    dropdown.map((item, index) => (
      <Collapse key={item} in={dropdownOpen} timeout="auto" unmountOnExit>
        <Link
          to={`/dashboard/${item.toLowerCase().replace(/\s+/g, "-")}`}
          style={{ textDecoration: "none", color: "white" }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
                color: "white",
                paddingLeft: 2,
              }}
            >
              {item === "Add User" || item === "Add Book" ? (
                <AddBoxIcon />
              ) : item === "All Users" ? (
                <PersonIcon />
              ) : (
                <MailIcon />
              )}
            </ListItemIcon>
            <ListItemText primary={item} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </Link>
      </Collapse>
    ));

  return (
    <List>
      <ListItem key={text} disablePadding sx={{ display: "block" }}>
        {dropdown ? (
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
            onClick={handleTextClick}
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
              ) :text === "Author" ? (
                <AuthorIcon />
              ) :text === "Publisher" ? (
                <PublisherIcon />
              ) : (
                <MailIcon />
              )}
            </ListItemIcon>
            <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            <IconButton sx={{ color: "white" }} onClick={handleTextClick}>
              {dropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </ListItemButton>
        ) : (
          <Link
            to={`/dashboard/${text.toLowerCase().replace(/\s+/g, "-")}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
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
                ) :text === "Author" ? (
                  <AuthorIcon />
                ) :text === "Publisher" ? (
                  <PublisherIcon />
                ) : (
                  <MailIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </Link>
        )}
      </ListItem>

      {dropdownItems}
    </List>
  );
};

export default SidebarList;

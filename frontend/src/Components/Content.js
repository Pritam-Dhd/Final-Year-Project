import React from "react";
import Dashboard from "../Pages/Dashboard/Dashboard";
import StudentDashboard from "../Pages/Dashboard/StudentDashboard";
import SeeAllUser from "../Pages/User/SeeAll";
import SeeAllIssueBook from "../Pages/IssueBook/SeeAll";
import SeeAllBook from "../Pages/Book/SeeAll";
import Book from "../Pages/Book/Book";
import FilterBook from "../Pages/Book/FilterBook";
import SeeAllGenre from "../Pages/Genre/SeeAll";
import SeeAllAuthor from "../Pages/Author/SeeAll";
import SeeAllPublisher from "../Pages/Publisher/SeeAll";
import SeeAllFine from "../Pages/Fine/SeeAll";
import Profile from "../Pages/User/Profile";
import StudentRequest from "../Pages/Request/StudentRequest";
import LibrarianRequest from "../Pages/Request/LibrarianRequest";
import Report from "../Pages/Report/Report";
import PageNotFound from "../Pages/PageNotFound";
import { useParams } from "react-router-dom";

const Content = ({ userRole, userData, updateUserData }) => {
  const { "*": section } = useParams("/dashboard/");
  console.log(section);

  const renderContent = () => {
    switch (section) {
      case "":
        return (
            <>
                {userRole === "Librarian" ? <Dashboard userRole={userRole} /> : <StudentDashboard />}
            </>
        );
    case "home":
        return (
            <>
                {userRole === "Librarian" ? <Dashboard userRole={userRole} /> : <StudentDashboard />}
            </>
        );
      case "book":
        return <SeeAllBook userRole={userRole} />;
      case "book/*":
        return <Book userRole={userRole} />;
      case "genre":
        return <SeeAllGenre userRole={userRole} />;
      case "author":
        return <SeeAllAuthor userRole={userRole} />;
      case "publisher":
        return <SeeAllPublisher userRole={userRole} />;
      case "fine":
        return <SeeAllFine userRole={userRole} />;
      case "user":
        return userRole === "Librarian" ? (
          <SeeAllUser userData={userData} />
        ) : (
          "Only Librarian has access"
        );
      case "issue":
        return userRole === "Librarian" ? (
          <SeeAllIssueBook userData={userData} />
        ) : (
          "Only Librarian has access"
        );
      case "request":
        return (
          <>
              {userRole === "Librarian" ? <LibrarianRequest userRole={userRole} /> : <StudentRequest />}
          </>
      );
      case "report":
        return <Report userRole={userRole} />;
      case "profile":
        return <Profile userData={userData} updateUserData={updateUserData} />;
      default:
        if (section.startsWith("book/filter")) {
          // Match any route starting with "book/"
          return <FilterBook userRole={userRole} />;
        }
        else if (section.startsWith("book/")) {
          // Match any route starting with "book/"
          return <Book userRole={userRole} />;
        } else {
          return <PageNotFound />;
        }
    }
  };

  return <>{renderContent()}</>;
};

export default Content;

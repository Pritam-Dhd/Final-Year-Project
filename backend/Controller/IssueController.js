import Issue from "../Schema/IssueSchema.js";
import Book from "../Schema/BookSchema.js";
import User from "../Schema/UserSchema.js";


export const addIssue = async ({ data, userRole }) => {
  try {
    // Check if the user has the "Librarian" role
    if (userRole !== "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }

    // Check if the data is empty or if name is missing
    if (!data || !data.book || !data.user || !data.issueDate || !data.dueDate) {
      return {
        message: "Issue data is incomplete",
      };
    }

    // Check if the book is available for issue
    const book = await Book.findById(data.book);
    if (!book || book.availableBooks <= 0) {
      return {
        message: "This book is not available for issue",
      };
    }

    const user = await User.findById(data.user);
    if (!user) {
      return {
        message: "User does not exist",
      };
    }

    // Check if the issue already exists in the database
    const existingIssue = await Issue.findOne({
      book: data.book,
      user: data.user,
      status: "Not Returned",
    });
    if (existingIssue) {
      return {
        message: "This book is already issued by the user and not returned yet",
      };
    }

    // Create the issue in the database
    const result = await Issue.create({
      book: data.book,
      user: data.user,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      returnedDate: null,
      status: "Not Returned",
    });

    await Book.findByIdAndUpdate(data.book, { $inc: { availableBooks: -1 } });

    return {
      message: "Issue added successfully",
      id: result._id,
    };
  } catch (error) {
    console.error(error.message);
    return {
      message: "Error adding issue",
    };
  }
};

export const editIssue = async ({ data, userRole }) => {
  try {
    // Check if the user has the "Librarian" role
    if (userRole !== "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }

    // Check if the data is empty or if name is missing
    if (!data || !data._id || !data.dueDate || !data.status) {
      return {
        message: "Issue data is incomplete",
      };
    }

    const issue = await Issue.findById(data._id);
    if (!issue) {
      return {
        message: "Issue Not found",
      };
    }

    // Create the issue in the database
    const result = await Issue.findByIdAndUpdate(data._id, {
      dueDate: data.dueDate,
      returnedDate: data.returnedDate,
      status: data.status,
    });

    if (data.status === "Returned" && issue.status === "Not Returned") {
      await Book.findByIdAndUpdate(issue.book, { $inc: { availableBooks: 1 } });
    }

    return {
      message: "Issue updated successfully",
    };
  } catch (error) {
    console.error(error.message);
    return {
      message: "Error adding issue",
    };
  }
};

export const deleteIssue = async ({ data, userRole }) => {
  try {
    // Check if the user has the "Librarian" role
    if (userRole !== "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }

    // Check if the data is empty or if name is missing
    if (!data || !data._id) {
      return {
        message: "Issue data is incomplete",
      };
    }

    const issue = await Issue.findById(data._id);
    if (!issue) {
      return {
        message: "Issue Not found",
      };
    }

    if (issue.status === "Not Returned") {
      await Book.findByIdAndUpdate(issue.book, { $inc: { availableBooks: 1 } });
    }

    const result = await Issue.findByIdAndDelete(data._id);
    if (result) {
      return { message: "Issue deleted successfully" };
    } else {
      return { message: "No issue found with the provided ID" };
    }
  } catch (error) {
    console.error(error.message);
    return {
      message: "Error adding issue",
    };
  }
};

export const getAllIssues = async ({ userRole }) => {
  try {
    const Issues = await Issue.find()
      .populate({
        path: "user",
        select: "_id name",
      })
      .populate({
        path: "book",
        select: "_id name",
      });
    return {
      Issues,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting users ",
    };
  }
};

export const getIssueByUser = async ({ userRole, userId }) => {
  try {
    const Issues = await Issue.find({ user: userId })
      .populate({
        path: "user",
        select: "_id name",
      })
      .populate({
        path: "book",
        select: "_id name",
      });
    return { Issues };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting users ",
    };
  }
};

export const getTotalIssue = async ({ userRole }) => {
  try {
    const totalIssues = await Issue.countDocuments();
    return {
      message: "Total issues retrieved successfully",
      totalIssues: totalIssues,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting the total issues",
    };
  }
};

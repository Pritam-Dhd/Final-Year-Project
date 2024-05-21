import Request from "../Schema/RequestSchema.js";
import Issue from "../Schema/IssueSchema.js";
import Book from "../Schema/BookSchema.js";
import User from "../Schema/UserSchema.js";

export const addRequest = async ({ data, userRole, userId }) => {
  try {
    if (!data.requestType) {
      return {
        message: "Request data is incomplete",
      };
    }
    console.log(data.requestType);
    let issue, book;
    if (data.issue) {
      issue = await Issue.findById(data.issue);
      if (!issue) {
        return {
          message: "Issue not found",
        };
      }
      if (data.requestType === "lost book" && issue.status === "Returned") {
        return {
          message: "Book already returned",
        };
      }
      const alreadyLost = await Request.findOne({
        issue: data.issue,
        requestType: "lost book",
      });
      if (alreadyLost) {
        return {
          message: "Book already reported lost",
        };
      }
    }
    if (data.book) {
      book = await Book.findById(data.book);
      if (!book) {
        return {
          message: "Book not found",
        };
      }
    }

    if (data.book) {
      // Check if the issue already exists in the database
      const existingIssue = await Issue.findOne({
        book: data.book,
        user: userId,
        status: "Not Returned",
      });
      if (existingIssue) {
        return {
          message:
            "This book is already issued by the user and not returned yet",
        };
      }
      const alreadyRequest = await Request.findOne({
        book: data.book,
        user: userId,
        requestType: "request issue",
        status: "pending",
      });
      if (alreadyRequest) {
        return {
          message:
            "This book is already requested by the user and not issued yet",
        };
      }
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const date = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${date}`;

    const request = await Request.create({
      ...data,
      requestDate: formattedDate,
      user: userId,
    });

    // Decrease available books count if the request is for issuing a book
    if (data.requestType === "request issue" && data.book) {
      await Book.findByIdAndUpdate(data.book, { $inc: { availableBooks: -1 } });
    }

    return {
      message: "Request added successfully",
      request,
    };
  } catch (error) {
    console.error(error.message);
    return {
      message: "Error adding request",
    };
  }
};

export const expiredRequest = async (req, res) => {
  try {
    const exiredRequests = await Request.find({
      // requestDate: { $gt: expirationDate },
      status: "pending",
      requestType: "request issue",
    });
    for (const request of exiredRequests) {
      const expirationDate = new Date(request.requestDate);
      expirationDate.setDate(expirationDate.getDate() + 2);
      expirationDate.setUTCHours(23, 59, 59, 0);
      if (Date.now() > expirationDate) {
        await Request.updateMany(
          { _id: request._id },
          { $set: { status: "expired" } }
        );
        // Increase available books count if the request was for issuing a book
        if (request.book) {
          await Book.findByIdAndUpdate(request.book, {
            $inc: { availableBooks: 1 },
          });
        }
      }
    }
  } catch (error) {
    console.error(error.message);
    return { message: "Error editing expired requests" };
  }
};

export const getRequest = async ({ userRole, userId }) => {
  try {
    if (userRole === "Librarian") {
      const requests = await Request.find()
        .sort({ requestDate: -1 })
        .populate({
          path: "user",
          select: "_id name email",
        })
        .populate({
          path: "book",
          select: "_id name",
        })
        .populate({
          path: "issue",
          populate: [
            {
              path: "book",
              select: "_id name",
            },
            {
              path: "user",
              select: "_id name email",
            },
          ],
        });
      return {
        requests,
      };
    } else {
      const requests = await Request.find({
        user: userId,
        // status: "pending",
      })
      .sort({ requestDate: -1 })
      .populate({
        path: "user",
        select: "_id name email",
      })
      .populate({
        path: "book",
        select: "_id name",
      })
      .populate({
        path: "issue",
        populate: [
          {
            path: "book",
            select: "_id name",
          },
          {
            path: "user",
            select: "_id name email",
          },
        ],
      });;
      return {
        requests,
      };
    }
  } catch (error) {
    console.error(error.message);
    return { message: "Error getting the requests" };
  }
};

export const getPendingReqeust = async ({ userRole, userId }) => {
  try {
    const requests = await Request.find({
      user: userId,
      status: "pending",
      requestType: "request issue",
    })
      .populate({
        path: "book",
        select: "_id name",
      })
      .sort({ requestDate: -1 });
    return {
      requests,
    };
  } catch (error) {
    console.error(error.message);
    return { message: "Error getting the requests" };
  }
};

export const cancelRequest = async ({data, userRole, userId }) => {
  try {
    if(userRole!=="Librarian"){
      return{
        message:"Only librarian has access"
      }
    }
    if(!data._id||!data.status){
      return{
        message:"The data is incomplete"
      }
    }
    const requests = await Request.findByIdAndUpdate(data._id, {status:data.status});
    await Book.findByIdAndUpdate(requests.book, { $inc: { availableBooks: 1 } });
    return {
      message:"Cancelled the request successfully"
    };
  } catch (error) {
    console.error(error.message);
    return { message: "Error getting the requests" };
  }
};

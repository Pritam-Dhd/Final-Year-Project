import Issue from "../Schema/IssueSchema.js";
import Book from "../Schema/BookSchema.js";
import Genre from "../Schema/GenreSchema.js";
import Author from "../Schema/AuthorSchema.js";
import Publisher from "../Schema/PublisherSchema.js";
import User from "../Schema/UserSchema.js";
import Fine from "../Schema/FineSchema.js";
import { startOfMonth, endOfMonth, addDays } from "date-fns";

export const dashboardData = async ({ userRole }) => {
  try {
    const currentMonth = new Date();
    const startOfMonthDate = startOfMonth(currentMonth);
    const endOfMonthDate = endOfMonth(currentMonth);

    const totalBooks = await Book.countDocuments();
    const totalGenres = await Genre.countDocuments();
    const totalAuthors = await Author.countDocuments();
    const totalPublishers = await Publisher.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalIssuedBooksNotReturned = await Issue.countDocuments({
      status: "Not Returned",
    });
    const topIssuedBooks = await Issue.aggregate([
      { $group: { _id: "$book", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      { $project: { _id: 0, book: "$bookDetails.name", count: 1 } },
    ]);
    const fines = await Fine.aggregate([
      { $match: { status: "unpaid" } },
      { $limit: 5 },
      {
        $lookup: {
          from: "issues",
          localField: "issue",
          foreignField: "_id",
          as: "issueDetails",
        },
      },
      { $unwind: "$issueDetails" },
      {
        $lookup: {
          from: "books",
          localField: "issueDetails.book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $lookup: {
          from: "users",
          localField: "issueDetails.user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          amount: 1,
          book: "$bookDetails.name",
          user: "$userDetails.name",
        },
      },
    ]);

    const totalFinesPaidThisMonth = await Fine.aggregate([
      {
        $match: {
          status: "paid",
          paid_date: { $gte: startOfMonthDate, $lte: endOfMonthDate },
        },
      },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: "$amount" },
        },
      },
    ]);

    const nowDate = new Date();
    nowDate.setDate(nowDate.getDate() + 1);
    nowDate.setHours(0, 0, 0, 0);
    const dayAfterTomorrow = new Date(nowDate);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    dayAfterTomorrow.setHours(0, 0, 0, 0);

    const oneDayOverdueIssues = await Issue.aggregate([
      {
        $match: {
          status: "Not Returned",
          dueDate: { $gt: nowDate, $lt: dayAfterTomorrow }, // Due date is one day overdue
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          user: "$userDetails.name",
          book: "$bookDetails.name",
          issueDate: 1,
          dueDate: 1,
        },
      },
    ]);

     // Calculate total issue count
     const totalIssues = await Issue.countDocuments();

    const topGenres = await Genre.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "genres",
          as: "books",
        },
      },
      {
        $lookup: {
          from: "issues",
          localField: "books._id",
          foreignField: "book",
          as: "issues",
        },
      },
      {
        $project: {
          name: 1,
          issueCount: { $size: "$issues" },
        },
      },
      { $sort: { issueCount: -1 } },
      { $limit: 5 },
    ]);

   

    // Calculate percentage for each top genre
    const genrePercentages = topGenres.map((genre) => ({
      name: genre.name,
      percentage: ((genre.issueCount / totalIssues) * 100).toFixed(2),
    }));

    const topAuthors = await Author.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "authors",
          as: "books",
        },
      },
      {
        $lookup: {
          from: "issues",
          localField: "books._id",
          foreignField: "book",
          as: "issues",
        },
      },
      {
        $project: {
          name: 1,
          issueCount: { $size: "$issues" },
        },
      },
      { $sort: { issueCount: -1 } },
      { $limit: 5 },
    ]);

   

    // Calculate percentage for each top author
    const authorPercentages = topAuthors.map((author) => ({
      name: author.name,
      percentage: ((author.issueCount / totalIssues) * 100).toFixed(2),
    }));

    const topPublishers = await Publisher.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "publishers",
          as: "books",
        },
      },
      {
        $lookup: {
          from: "issues",
          localField: "books._id",
          foreignField: "book",
          as: "issues",
        },
      },
      {
        $project: {
          name: 1,
          issueCount: { $size: "$issues" },
        },
      },
      { $sort: { issueCount: -1 } },
      { $limit: 5 },
    ]);

    // Calculate percentage for each top publisher
    const publisherPercentages = topPublishers.map((publisher) => ({
      name: publisher.name,
      percentage: ((publisher.issueCount / totalIssues) * 100).toFixed(2),
    }));

    const topStudents = await Issue.aggregate([
      {
        $group: {
          _id: "$user",
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          name: "$userDetails.name",
          total: 1
        }
      }
    ]);

    const dashboardInfo = {
      totalBooks,
      totalGenres,
      totalAuthors,
      totalPublishers,
      totalUsers,
      topIssuedBooks,
      totalIssuedBooksNotReturned,
      totalFinesPaidThisMonth:
        totalFinesPaidThisMonth.length > 0
          ? totalFinesPaidThisMonth[0].totalPaid
          : 0,
      fines,
      oneDayOverdueIssues,
      topGenres: genrePercentages,
      topAuthors: authorPercentages,
      topPublishers: publisherPercentages,
      topStudents
    };

    return dashboardInfo;
  } catch (error) {
    throw new Error(`Error fetching dashboard data: ${error.message}`);
  }
};

import Issue from "../Schema/IssueSchema.js";
import Book from "../Schema/BookSchema.js";
import Genre from "../Schema/GenreSchema.js";
import Author from "../Schema/AuthorSchema.js";
import Publisher from "../Schema/PublisherSchema.js";
import User from "../Schema/UserSchema.js";
import Fine from "../Schema/FineSchema.js";

export const getReport = async ({ userRole, reportName, from, to }) => {
  let matchCondition = {};
  if (reportName === "book") {
    // Check if 'from' is provided and not empty
    if (from !== null && from !== "null") {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      matchCondition.issueDate = { $gte: fromDate };
    }

    // Check if 'to' is provided and not empty
    if (to !== null && to !== "null") {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      if (!matchCondition.issueDate) {
        matchCondition.issueDate = {}; // Initialize if not already initialized
      }
      matchCondition.issueDate.$lte = toDate;
    }

    const topIssuedBooks = await Issue.aggregate([
      ...(Object.keys(matchCondition).length !== 0
        ? [{ $match: matchCondition }]
        : []),
      { $group: { _id: "$book", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
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
      { $project: { _id: 0, name: "$bookDetails.name", issues: "$total" } },
    ]);
    return { report: topIssuedBooks, title: "Top 5 books" };
  }
  if (reportName === "student") {
    // Check if 'from' is provided and not empty
    if (from !== null && from !== "null") {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      matchCondition.issueDate = { $gte: fromDate };
    }

    // Check if 'to' is provided and not empty
    if (to !== null && to !== "null") {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      if (!matchCondition.issueDate) {
        matchCondition.issueDate = {}; // Initialize if not already initialized
      }
      matchCondition.issueDate.$lte = toDate;
    }
    const topStudents = await Issue.aggregate([
      ...(Object.keys(matchCondition).length !== 0
        ? [{ $match: matchCondition }]
        : []),
      {
        $group: {
          _id: "$user",
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          name: "$userDetails.name",
          issues: "$total",
        },
      },
    ]);
    return { report: topStudents, title: "Top 5 students" };
  }
  if (reportName === "genre") {
    let matchCondition = {};

    // Check if 'from' is provided and not empty
    if (from !== null && from !== "null") {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      matchCondition.issueDate = { $gte: fromDate };
    }

    // Check if 'to' is provided and not empty
    if (to !== null && to !== "null") {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      if (!matchCondition.issueDate) {
        matchCondition.issueDate = {}; // Initialize if not already initialized
      }
      matchCondition.issueDate.$lte = toDate;
    }

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
          let: { bookIds: "$books._id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$book", "$$bookIds"] },
                ...matchCondition, // Include match condition for issueDate
              },
            },
          ],
          as: "issues",
        },
      },
      {
        $project: {
          name: 1,
          total: { $size: "$issues" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    const totalIssues = await Issue.countDocuments(matchCondition);

    const genrePercentages = topGenres.map((genre) => ({
      name: genre.name,
      total: ((genre.total / totalIssues) * 100).toFixed(2)+"%",
    }));

    return { report: genrePercentages, title: "Top 5 genres" };
  }

  if (reportName === "author") {
    let matchCondition = {};

    // Check if 'from' is provided and not empty
    if (from !== null && from !== "null") {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      matchCondition.issueDate = { $gte: fromDate };
    }

    // Check if 'to' is provided and not empty
    if (to !== null && to !== "null") {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      if (!matchCondition.issueDate) {
        matchCondition.issueDate = {}; // Initialize if not already initialized
      }
      matchCondition.issueDate.$lte = toDate;
    }

    const totalIssues = await Issue.countDocuments(matchCondition);

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
          let: { bookIds: "$books._id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$book", "$$bookIds"] },
                ...matchCondition, // Include match condition for issueDate
              },
            },
          ],
          as: "issues",
        },
      },
      {
        $project: {
          name: 1,
          total: { $size: "$issues" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    // Calculate percentage for each top author
    const authorPercentages = topAuthors.map((author) => ({
      name: author.name,
      total: ((author.total / totalIssues) * 100).toFixed(2)+"%",
    }));

    return { report: authorPercentages, title: "Top 5 authors" };
  }

  if (reportName === "publisher") {
    let matchCondition = {};

    // Check if 'from' is provided and not empty
    if (from !== null && from !== "null") {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      matchCondition.issueDate = { $gte: fromDate };
    }

    // Check if 'to' is provided and not empty
    if (to !== null && to !== "null") {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      if (!matchCondition.issueDate) {
        matchCondition.issueDate = {}; // Initialize if not already initialized
      }
      matchCondition.issueDate.$lte = toDate;
    }

    const totalIssues = await Issue.countDocuments(matchCondition);

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
          let: { bookIds: "$books._id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$book", "$$bookIds"] },
                ...matchCondition, // Include match condition for issueDate
              },
            },
          ],
          as: "issues",
        },
      },
      {
        $project: {
          name: 1,
          total: { $size: "$issues" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    // Calculate percentage for each top publisher
    const publisherPercentages = topPublishers.map((publisher) => ({
      name: publisher.name,
      total: ((publisher.total / totalIssues) * 100).toFixed(2)+"%",
    }));

    return { report: publisherPercentages, title: "Top 5 publishers" };
  }

  if (reportName === "fine") {
    // Check if 'from' is provided and not empty
    if (from !== null && from !== "null") {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      matchCondition.paid_date = { $gte: fromDate };
    }

    // Check if 'to' is provided and not empty
    if (to !== null && to !== "null") {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      if (!matchCondition.paid_date) {
        matchCondition.paid_date = {}; // Initialize if not already initialized
      }
      matchCondition.paid_date.$lte = toDate;
    }

    const totalFinesPaidSum = await Fine.aggregate([
      {
        $match: { status: "paid", ...matchCondition },
      },
      {
        $group: {
          _id: null,
          totalSum: { $sum: "$amount" },
        },
      },
    ]);
    const totalFinesPaid = await Fine.aggregate([
      {
        $match: {
          status: "paid",
          ...matchCondition,
        },
      },
      {
        $lookup: {
          from: "issues",
          localField: "issue",
          foreignField: "_id",
          as: "issueDetails",
        },
      },
      {
        $group: {
          _id: "$issueDetails.user",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          name: "$userDetails.name",
          total: 1,
        },
      },
    ]);
    const totalSum = totalFinesPaidSum.length > 0 ? totalFinesPaidSum[0].totalSum : 0;
    return { report: totalFinesPaid, title: `Total Fines Paid by Students is ${totalSum}`};
  }
};

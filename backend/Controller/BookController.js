import Book from "../Schema/BookSchema.js";
import Genre from "../Schema/GenreSchema.js";
import Author from "../Schema/AuthorSchema.js";
import Publisher from "../Schema/PublisherSchema.js";
import Issue from "../Schema/IssueSchema.js";

export const addBook = async ({ data, userRole }) => {
  try {
    if (userRole !== "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }
    // Check if genres, authors, or publishers are provided
    const { genres, authors, publishers, _id, ...bookData } = data;

    const availableBook = bookData.totalBooks;
    // If genres are provided, create them
    const createdGenres = await Promise.all(
      genres.map(async (genreName) => {
        let genre = await Genre.findOne({ name: genreName });
        if (!genre) {
          genre = await Genre.create({ name: genreName });
        }
        return genre._id;
      })
    );

    // If authors are provided, create them
    const createdAuthors = await Promise.all(
      authors.map(async (authorName) => {
        let author = await Author.findOne({ name: authorName });
        if (!author) {
          author = await Author.create({ name: authorName });
        }
        return author._id;
      })
    );

    // If publishers are provided, create them
    const createdPublishers = await Promise.all(
      publishers.map(async (publisherName) => {
        let publisher = await Publisher.findOne({ name: publisherName });
        if (!publisher) {
          publisher = await Publisher.create({ name: publisherName });
        }
        return publisher._id;
      })
    );

    // Merge created genres, authors, and publishers with bookData
    const book = new Book({
      ...bookData,
      genres: createdGenres,
      authors: createdAuthors,
      publishers: createdPublishers,
      availableBooks: availableBook,
    });

    const result = await book.save();

    return {
      message: "Book added successfully",
      id: result._id,
    };
  } catch (error) {
    console.error(error.message);
    return {
      message: error.message,
    };
  }
};

export const editBook = async ({ data, userRole }) => {
  try {
    if (userRole !== "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }

    if (!data || !data._id) {
      return {
        message: "Book ID is required for editing",
      };
    }

    const existingBook = await Book.findById(data._id);
    if (!existingBook) {
      return {
        message: "Book not found",
      };
    }

    // Check if the total books as it can't be less than the number of books with status "Not Returned"
    const issuedBooksCount = await Issue.countDocuments({
      bookId: existingBook._id,
      status: "Not Returned",
    });
    if (data.totalBooks < issuedBooksCount) {
      return {
        message:
          "Total books can't be less than the number of books currently issued",
      };
    }

    const prevTotalBooks = existingBook.totalBooks;

    let availableBooks =
      existingBook.availableBooks +
      (data.totalBooks - prevTotalBooks) -
      issuedBooksCount;
    availableBooks = availableBooks < 0 ? 0 : availableBooks;

    // Update genres if provided
    if (data.genres) {
      const createdGenres = await Promise.all(
        data.genres.map(async (genreName) => {
          let genre = await Genre.findOne({ name: genreName });
          if (!genre) {
            genre = await Genre.create({ name: genreName });
          }
          return genre._id;
        })
      );
      data.genres = createdGenres;
    }

    // Update authors if provided
    if (data.authors) {
      const createdAuthors = await Promise.all(
        data.authors.map(async (authorName) => {
          let author = await Author.findOne({ name: authorName });
          if (!author) {
            author = await Author.create({ name: authorName });
          }
          return author._id;
        })
      );
      data.authors = createdAuthors;
    }

    // Update publishers if provided
    if (data.publishers) {
      const createdPublishers = await Promise.all(
        data.publishers.map(async (publisherName) => {
          let publisher = await Publisher.findOne({ name: publisherName });
          if (!publisher) {
            publisher = await Publisher.create({ name: publisherName });
          }
          return publisher._id;
        })
      );
      data.publishers = createdPublishers;
    }
    const { _id, ...bookData } = data;
    const result = await Book.findByIdAndUpdate(
      data._id,
      { $set: { ...bookData, availableBooks: availableBooks } },
      { new: true }
    );

    if (result) {
      return { message: "Book data is updated successfully" };
    } else {
      return { message: "No data to update" };
    }
  } catch (error) {
    console.error(error.message);
    return {
      message: "Error updating book data",
    };
  }
};

export const deleteBook = async ({ data, userRole }) => {
  try {
    if (userRole != "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }
    const result = await Book.findByIdAndDelete(data._id);

    if (result) {
      return { message: "Book deleted successfully" };
    } else {
      return { message: "No user found with the provided ID" };
    }
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error deleting book",
    };
  }
};

export const getAllBooks = async ({ userRole }) => {
  try {
    let Books = await Book.find()
      .populate("authors", "name")
      .populate("genres", "name")
      .populate("publishers", "name");

    Books = Books.map((book) => {
      return {
        ...book.toObject(),
        authors: book.authors.map((author) => author.name),
        genres: book.genres.map((genre) => genre.name),
        publishers: book.publishers.map((publisher) => publisher.name),
      };
    });
    return {
      Books,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting books ",
    };
  }
};

export const getTotalBooks = async ({ userRole }) => {
  try {
    const totalBooks = await Book.countDocuments();
    return {
      message: "Total books retrieved successfully",
      totalBooks: totalBooks,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting the total books",
    };
  }
};

export const getBookById = async ({ userRole, bookId }) => {
  try {
    const book = await Book.findById(bookId)
      .populate("authors", "_id name")
      .populate("genres", "_id name")
      .populate("publishers", "_id name");

    if (!book) {
      return { message: "Book not found" };
    }

    const authors = book.authors.map((author) => author._id);
    const genres = book.genres.map((genre) => genre._id);
    const publishers = book.publishers.map((publisher) => publisher._id);

    // Find related books based on genre, author, or publisher
    const relatedBooks = await Book.find({
      $or: [
        { genres: { $in: genres } },
        { authors: { $in: authors } },
        { publishers: { $in: publishers } },
      ],
      _id: { $ne: bookId }, // Exclude the current book
    }).limit(10);

    if (book.availableBooks === 0) {
      const today = new Date();
      const issues = await Issue.find({
        book: book._id,
        status: "Not Returned",
        dueDate: { $gte: today },
      })
        .sort({ dueDate: 1 })
        .limit(1);
      console.log(issues)
      if (issues.length > 0) {
        const earliestReturn = issues[0].dueDate;
        // Create a new object with the updated earliestReturn field
        const updatedBook = { ...book.toObject(), earliestReturn };
        return {
          ...updatedBook,
          authors: updatedBook.authors.map((author) => author.name),
          genres: updatedBook.genres.map((genre) => genre.name),
          publishers: updatedBook.publishers.map((publisher) => publisher.name),
          relatedBooks: relatedBooks,
        };
      } else {
        // If no issues found, set earliestReturn to "Not Available"
        const updatedBook = { ...book.toObject(), earliestReturn: "Not Available" };
        return {
          ...updatedBook,
          authors: updatedBook.authors.map((author) => author.name),
          genres: updatedBook.genres.map((genre) => genre.name),
          publishers: updatedBook.publishers.map((publisher) => publisher.name),
          relatedBooks: relatedBooks,
        };
      }
    }

    // If the book is available, return as usual
    return {
      ...book.toObject(),
      authors: book.authors.map((author) => author.name),
      genres: book.genres.map((genre) => genre.name),
      publishers: book.publishers.map((publisher) => publisher.name),
      relatedBooks: relatedBooks,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting book",
    };
  }
};


export const filterBooks = async ({ userRole, filterType, filterValue }) => {
  try {
    let Books = await Book.find()
      .populate("authors", "name")
      .populate("genres", "name")
      .populate("publishers", "name");

    Books = Books.map((book) => {
      return {
        ...book.toObject(),
        authors: book.authors.map((author) => author.name),
        genres: book.genres.map((genre) => genre.name),
        publishers: book.publishers.map((publisher) => publisher.name),
      };
    });
    if (filterType && filterValue) {
      Books = Books.filter((book) => {
        switch (filterType) {
          case "author":
            return book.authors.includes(filterValue);
          case "genre":
            return book.genres.includes(filterValue);
          case "publisher":
            return book.publishers.includes(filterValue);
          default:
            return false;
        }
      });
    }
    return {
      Books,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting books ",
    };
  }
};

import Genre from "../Schema/GenreSchema.js";
import Book from "../Schema/BookSchema.js";

export const addGenre = async ({ data, userRole }) => {
  try {
    // Check if the user has the "Librarian" role
    if (userRole !== "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }

    // Check if the data is empty or if name is missing
    if (!data || !data.name) {
      return {
        message: "Genre data is incomplete",
      };
    }

    // Check if the Genre already exists in the database
    const existingGenre = await Genre.findOne({ name: data.name });
    if (existingGenre) {
      return {
        message: "Genre already exists in the database",
      };
    }

    // Create the genre in the database
    const result = await Genre.create({
      name: data.name,
    });

    return {
      message: "Genre added successfully",
      id: result._id,
    };
  } catch (error) {
    console.error(error.message);
    return {
      message: "Error adding genre",
    };
  }
};

export const editGenre = async ({ data, userRole }) => {
  try {
    // Check if the user has the "Librarian" role
    if (userRole !== "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }

    // Check if the data is empty or if the Genre ID is missing
    if (!data || !data._id) {
      return {
        message: "Genre ID is required for editing",
      };
    }

    // Check if the Genre with the provided ID exists
    const existingGenre = await Genre.findById(data._id);
    if (!existingGenre) {
      return {
        message: "Genre not found",
      };
    }

    const existingGenreName = await Genre.findOne({ name: data.name });

    if (existingGenreName) {
      return {
        message: "Genre name already exists",
      };
    }
    
    // Update the Genre's information
    const result = await Genre.findByIdAndUpdate(
      data._id,
      {
        $set: {
          name: data.name,
        },
      },
      // Return true if successful
      { new: true }
    );

    if (result) {
      return { message: "Genre data is updated successfully" };
    } else {
      return { message: "No data to update" };
    }
  } catch (error) {
    console.error(error.message);
    return {
      message: "Error updating genre data",
    };
  }
};

export const deleteGenre = async ({ data, userRole }) => {
  try {
    if (userRole != "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }
    const booksWithGenre = await Book.findOne({ genres: data._id });
    if (booksWithGenre) {
      return {
        message: "Cannot delete genre with associated books",
      };
    }
    const result = await Genre.findByIdAndDelete(data._id);

    if (result) {
      return { message: "Genre deleted successfully" };
    } else {
      return { message: "No genre found with the provided ID" };
    }
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error deleting genre",
    };
  }
};

export const getAllGenres = async ({ userRole }) => {
  try {
    const Genres = await Genre.find();
    return {
      Genres,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting users ",
    };
  }
};

export const getTotalGenre = async ({ userRole }) => {
  try {
    const totalGenres = await Genre.countDocuments();
    return {
      message: "Total genres retrieved successfully",
      totalGenres: totalGenres,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting the total genres",
    };
  }
};

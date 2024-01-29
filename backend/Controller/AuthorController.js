import Author from "../Schema/AuthorSchema.js";

export const addAuthor = async ({ data, userRole }) => {
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
        message: "Author data is incomplete",
      };
    }

    // Check if the author already exists in the database
    const existingAuthor = await Author.findOne({ name: data.name });
    if (existingAuthor) {
      return {
        message: "Author already exists in the database" 
      };
    }

    // Create the author in the database
    const result = await Author.create({
      name: data.name,
    });

    return {
      message: "Author added successfully", id: result._id
    };
  } catch (error) {
    console.error(error.message);
    return {
      message: "Error adding author",
    };
  }
};

export const editAuthor = async ({ data, userRole }) => {
  try {
    // Check if the user has the "Librarian" role
    if (userRole !== "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }

    // Check if the data is empty or if the author ID is missing
    if (!data || !data._id) {
      return {
        message: "Author ID is required for editing",
      };
    }

    // Check if the author with the provided ID exists
    const existingAuthor = await Author.findById(data._id);
    if (!existingAuthor) {
      return {
        message: "Author not found",
      };
    }

    const existingAuthorName = await Author.findOne({ name: data.name });

    if (existingAuthorName) {
      return {
        message: "Author name already exists",
      };
    }

    // Update the author's information
    const result = await Author.findByIdAndUpdate(
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
      return { message: "Author data is updated successfully" };
    } else {
      return { message: "No data to update" };
    }
  } catch (error) {
    console.error(error.message);
    return {
      message: "Error updating author data",
    };
  }
};

export const deleteAuthor = async ({ data, userRole }) => {
  try {
    if (userRole != "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }
    const result = await Author.findByIdAndDelete(data._id);

    if (result) {
      return { message: "Author deleted successfully" };
    } else {
      return { message: "No user found with the provided ID" };
    }
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error deleting author",
    };
  }
};

export const getAllAuthors = async ({ userRole }) => {
  try {
    const Authors = await Author.find();
    return {
      Authors,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting users ",
    };
  }
};

export const getTotalAuthor = async ({ userRole }) => {
  try {
    const totalAuthors = await Author.countDocuments();
    return {
      message: "Total authors retrieved successfully",
      totalAuthors: totalAuthors,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting the total authors",
    };
  }
};

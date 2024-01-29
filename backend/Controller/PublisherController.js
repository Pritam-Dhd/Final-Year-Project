import Publisher from "../Schema/PublisherSchema.js";

export const addPublisher = async ({ data, userRole }) => {
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
        message: "Publisher data is incomplete",
      };
    }

    // Check if the Publisher already exists in the database
    const existingPublisher = await Publisher.findOne({ name: data.name });
    if (existingPublisher) {
      return {
        message: "Publisher already exists in the database",
      };
    }

    // Create the publisher in the database
    const result = await Publisher.create({
      name: data.name,
    });

    return {
      message: "Publisher added successfully", id: result._id 
    };
  } catch (error) {
    console.error(error.message);
    return {
      message: "Error adding publisher",
    };
  }
};

export const editPublisher = async ({ data, userRole }) => {
  try {
    // Check if the user has the "Librarian" role
    if (userRole !== "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }

    // Check if the data is empty or if the publisher ID is missing
    if (!data || !data._id) {
      return {
        message: "Publisher ID is required for editing",
      };
    }

    // Check if the Publisher with the provided ID exists
    const existingPublisher = await Publisher.findById(data._id);
    if (!existingPublisher) {
      return {
        message: "Publisher not found",
      };
    }

    const existingPublisherName = await Publisher.findOne({ name: data.name });

    if (existingPublisherName) {
      return {
        message: "Publisher name already exists",
      };
    }

    // Update the Publisher's information
    const result = await Publisher.findByIdAndUpdate(
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
      return { message: "Publisher data is updated successfully" };
    } else {
      return { message: "No data to update" };
    }
  } catch (error) {
    console.error(error.message);
    return {
      message: "Error updating Publisher data",
    };
  }
};

export const deletePublisher = async ({ data, userRole }) => {
  try {
    if (userRole != "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }
    const result = await Publisher.findByIdAndDelete(data._id);

    if (result) {
      return { message: "Publisher deleted successfully" };
    } else {
      return { message: "No user found with the provided ID" };
    }
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error deleting publisher",
    };
  }
};

export const getAllPublishers = async ({ userRole }) => {
  try {
    const Publishers = await Publisher.find();
    return {
      Publishers,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting users ",
    };
  }
};

export const getTotalPublisher = async ({ userRole }) => {
  try {
    const totalPublishers = await Publisher.countDocuments();
    return {
      message: "Total publisher retrieved successfully",
      totalPublishers: totalPublishers,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting the total publisher",
    };
  }
};

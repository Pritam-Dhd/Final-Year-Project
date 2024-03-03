import User from "../Schema/UserSchema.js";
import Role from "../Schema/RoleSchema.js";
import { generate } from "generate-password";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const maxAge = 3 * 24 * 60 * 60;

export const Signup = async ({ data }) => {
  try {
    if (
      data.name != null &&
      data.email != null &&
      data.password != null &&
      data.phone_no != null
    ) {
      let role = await Role.findOne({ name: "Student" });
      const existingUser = await User.findOne({ email: data.email });
      const hashedPassword = await bcrypt.hash(data.password, 10);

      if (!existingUser) {
        const passwordRegex =
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!passwordRegex.test(data.password)) {
          return {
            message:
              "Password must contain uppercase, lowecase, number and special character",
          };
        }
        const result = await User.create({
          name: data.name,
          email: data.email,
          password: hashedPassword,
          phone_no: data.phone_no,
          role: role._id,
          image: "Windows_10_Default_Profile_Picture.png",
        });
        if (result) {
          const token = jwt.sign(
            {
              userId: result._id,
            },
            process.env.SecretKey,
            { expiresIn: maxAge }
          );
          return {
            message: "User registered successfully",
            token: token,
            userRole: role.name,
          };
        } else {
          return {
            message: "Failed to register user",
          };
        }
      } else {
        return {
          message: "User already exists",
        };
      }
    } else {
      return {
        message: "All the fields must be filled",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Error during signup",
    };
  }
};

export const Login = async ({ data }) => {
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      const isPasswordMatch = await bcrypt.compare(
        data.password,
        existingUser.password
      );
      const userRole = await Role.findOne({ _id: existingUser.role });
      if (isPasswordMatch) {
        const token = jwt.sign(
          {
            userId: existingUser._id,
          },
          process.env.SecretKey,
          { expiresIn: maxAge }
        );
        return {
          message: "User logged in successfully",
          token: token,
          userRole: userRole.name,
        };
      } else {
        return {
          message: "Incorrect password",
        };
      }
    } else {
      return {
        message: "No user exists with this email",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Error during login",
    };
  }
};

export const getProfile = async ({ token }) => {
  const decodedUser = jwt.verify(token, process.env.SecretKey);
  if (!decodedUser) {
    return { message: "Invalid token" };
  } else {
    const userId = decodedUser.userId;
    const existingUser = await User.findOne({ _id: userId });
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      process.env.SecretKey,
      { expiresIn: maxAge }
    );
    return {
      name: existingUser.name,
      email: existingUser.email,
      phone_no: existingUser.phone_no,
      image: existingUser.image,
      token: token,
    };
  }
};

export const editProfile = async ({ token, data, file }) => {
  try {
    const decodedUser = jwt.verify(token, process.env.SecretKey);
    if (!decodedUser) {
      return { message: "Invalid token" };
    } else {
      const userId = decodedUser.userId;
      const updateData = {
        name: data.name,
        email: data.email,
        phone_no: data.phone_no,
      };
      // Check if an image was uploaded
      if (file) {
        updateData.image = file.filename; // Save the image path in the database
      }

      const result = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      );
      if (result) {
        if (file) {
          return {
            message: "Profile edited successfully!",
            imageUrl: file.filename,
          };
        } else {
          return {
            message: "Profile edited successfully!",
            imageUrl: result.image,
          };
        }
      } else {
        return { message: "No data to update" };
      }
    }
  } catch (error) {
    console.error("Error during profile edit:", error);
    return { message: "Error during profile edit" };
  }
};

export const changePassword = async ({ token, data }) => {
  const decodedUser = jwt.verify(token, process.env.SecretKey);
  if (!decodedUser) {
    return { message: "Invalid token" };
  } else {
    const userId = decodedUser.userId;
    const existingUser = await User.findOne({ _id: userId });
    const passwordMatch = await bcrypt.compare(
      data.password,
      existingUser.password
    );
    if (!passwordMatch) {
      return { message: "Incorrect current Password" };
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(data.newPassword)) {
      return {
        message:
          "Password must contain uppercase, lowecase, number and special character",
      };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    const result = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    if (result) {
      return { message: "Changed password successfully" };
    } else {
      return { message: "Error changing password" };
    }
  }
};

export const addUser = async ({ data, userRole }) => {
  try {
    if (userRole !== "Librarian") {
      return { message: "Only admin can access this" };
    }

    const requiredFields = ["name", "email", "phone_no", "userRole"];
    if (!requiredFields.every((field) => data[field])) {
      return { message: "All fields must be filled" };
    }

    const password = generate({
      length: 8,
      numbers: true,
      uppercase: true,
      symbols: true,
      lowercase: true,
      strict: true,
    });
    const role = await Role.findOne({ name: data.userRole });

    if (!role) {
      return { message: "Role not found" };
    }

    const existingUser = await User.findOne({ email: data.email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      return { message: "User already exists" };
    }

    const result = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone_no: data.phone_no,
      role: role._id,
      image: "Windows_10_Default_Profile_Picture.png",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.User,
        pass: process.env.Pass,
      },
    });

    const mailOptions = {
      from: process.env.User,
      to: data.email,
      subject: "Your Account Information",
      text: `Hello ${data.name},\n\nYour account has been created successfully.\n\nPassword: ${password}\n\nPlease change your password after logging in.\n\nBest regards,\nYour Library Team`,
    };

    await transporter.sendMail(mailOptions);

    return { message: "User added successfully", id: result._id };
  } catch (error) {
    console.error(error);
    return { message: "Error during adding user" };
  }
};

export const getAllUsers = async ({ userRole }) => {
  try {
    if (userRole != "Librarian") {
      return {
        message: "Only admin access this",
      };
    }
    const users = await User.find()
      .populate("role", "name") // Populate roleId with the name field from the Role model
      .select("-password"); // Exclude the password field
    return {
      users,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting users ",
    };
  }
};

export const editUser = async ({ data, userRole }) => {
  try {
    if (userRole != "Librarian") {
      return {
        message: "Only admin access this",
      };
    }
    let role = await Role.findOne({ name: data.userRole });

    if (!role) {
      return {
        message: "Role not found",
      };
    }
    const result = await User.findByIdAndUpdate(
      data._id,
      {
        $set: {
          name: data.name,
          email: data.email,
          phone_no: data.phone_no,
          role: role._id,
        },
      },
      // Return true if successful
      { new: true }
    );
    if (result) {
      return { message: "Data is updated" };
    } else {
      return { message: "No data to update" };
    }
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting users ",
    };
  }
};

export const deleteUser = async ({ userId, userRole }) => {
  try {
    if (userRole != "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }
    const result = await User.findByIdAndDelete(userId);

    if (result) {
      return { message: "User deleted successfully" };
    } else {
      return { message: "No user found with the provided ID" };
    }
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error deleting user",
    };
  }
};

export const getTotalUser = async ({ userRole }) => {
  try {
    if (userRole != "Librarian") {
      return {
        message: "Only admin can access this",
      };
    }
    const totalUsers = await User.countDocuments();
    return {
      message: "Total users retrieved successfully",
      totalUsers: totalUsers,
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error getting the total users",
    };
  }
};

export const invalidToken = ({res,req}) => {
  res.clearCookie("jwt");
  res.send({ message: "Invalid token" });
};

import User from "../Schema/UserSchema.js";
import Role from "../Schema/RoleSchema.js";
import Token from "../Schema/TokenSchema.js";
import { generate } from "generate-password";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const maxAge = 3 * 24 * 60 * 60;

export const Signup = async ({ data }) => {
  try {
    const whitespaceRegex = /^\s*$/;
    if (
      !whitespaceRegex.test(data.name) &&
      !whitespaceRegex.test(data.email) &&
      !whitespaceRegex.test(data.password) &&
      !whitespaceRegex.test(data.phone_no)
    ) {
      const emailRegex = /^[^\s@]+@heraldcollege\.edu\.np$/;
      if (!emailRegex.test(data.email)) {
        return {
          message: "Email must be of heraldcollege.edu.np domain",
        };
      }
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
        // email: data.email,
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
    const whitespaceRegex = /^\s*$/;
    if (
      whitespaceRegex.test(data.name) ||
      whitespaceRegex.test(data.email) ||
      whitespaceRegex.test(data.phone_no)
    ) {
      return { message: "All fields must be filled" };
    }
    const emailRegex = /^[^\s@]+@heraldcollege\.edu\.np$/;
    if (!emailRegex.test(data.email)) {
      return {
        message: "Email must be of heraldcollege.edu.np domain",
      };
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

export const invalidToken = ({ res, req }) => {
  res.clearCookie("jwt");
  res.send({ message: "Invalid token" });
};

export const passwordToken = async ({ data }) => {
  try {
    console.log(data)
    const emailRegex = /^[^\s@]+@heraldcollege\.edu\.np$/;
    if (!emailRegex.test(data.email)) {
      return {
        message: "Email must be of heraldcollege.edu.np domain",
      };
    }
    const existingUser = await User.findOne({ email: data.email });
    if (!existingUser) {
      return { message: "User does not exist" };
    }
    const code = generate({
      length: 8,
      numbers: true,
      lowercase: true,
      strict: true,
    });
    const expirationTime = Date.now() + 5 * 60 * 1000;

    await Token.create({
      token: code,
      expiryDate: expirationTime,
      email: existingUser.email,
      status: "active",
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
      to: existingUser.email,
      subject: "Your Reset Passoword Code",
      text: `Hello ${existingUser.name},\n\nYour account reset code is: ${code}\n\nPlease use the code within 5 mins or it will expire.\n\nBest regards,\nYour Library Team`,
    };

    await transporter.sendMail(mailOptions);
    return {
      message: "Code sent successfully in the mail",
    };
  } catch (err) {
    console.log(err);
  }
};

export const verifyToken = async ({ data }) => {
  try {
    const token = data.code;
    console.log(data)
    const currentTime = Date.now();
    const existingToken = await Token.findOne({ token: token, email:data.email });
    if (!existingToken || existingToken.status === "used"|| !token) {
      return { message: "Invalid token" };
    }
    if (
      existingToken.status === "expired" ||
      currentTime > existingToken.expiryDate
    ) {
      return { message: "Token expired" };
    }
    const updatedToken=await Token.updateOne({token:token, status:"used"})
    return { message: "Token verified successfully" };
  } catch (err) {
    console.log(error);
  }
};

export const resetPassword = async ({ data }) => {
  try {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(data.password)) {
      return {
        message:
          "Password must contain uppercase, lowecase, number and special character",
      };
    }
    if(data.password!==data.confirmPassword){
      return{
        message:"The password dont match"
      }
    }
    const existingUser = await User.findOne({ email: data.email });
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await User.findByIdAndUpdate(
      existingUser._id,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    await Token.findByIdAndUpdate(
      data.token_id,
      {
        $set: {
          status: "used",
        },
      },
      { new: true }
    );
    return { message: "Password updated successfully" };
  } catch (err) {
    console.log(err);
  }
};

export const expireToken = async () => {
  try {
    const currentTime = Date.now();
    const tokens = await Token.find({ status: "active" });
    for (let token of tokens) {
      if (currentTime > token.expiryDate) {
        await Token.updateMany(
          { _id: token._id },
          { $set: { status: "expired" } }
        );
      }
    }
  } catch (err) {}
};

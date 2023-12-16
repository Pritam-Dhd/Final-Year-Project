import User from "../Schema/UserSchema.js";
import Role from "../Schema/RoleSchema.js";
import bcrypt from "bcrypt";

export const Signup = async ({ data }) => {
  try {
    let role = await Role.findOne({ name: "Student" });
    const existingUser = await User.findOne({ email: data.email });
    const hashedPassword = await bcrypt.hash(data.password, 10);

    if (!existingUser) {
      const result = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone_no: data.phone_no,
        role: role._id,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png",
      });
      if (result) {
        return {
          message: "User registered successfully",
          userData: {
            name: result.name,
            email: result.email,
            phone_no: result.phone_no,
            image: result.image,
          },
          userRole: role.name,
        };
      } else {
        return {
          message: "Failed to register user",
          userData: null,
          userRole: null,
        };
      }
    } else {
      return {
        message: "User already exists",
        userData: null,
        userRole: null,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Error during signup",
      userData: null,
      userRole: null,
    };
  }
};

export const Login = async ({ data }) => {
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      const isPasswordMatch = await bcrypt.compare(data.password, existingUser.password);
      const userRole = await Role.findOne({ _id: existingUser.role });
      if (isPasswordMatch) {
        return {
          message: "User logged in successfully",
          userData: {
            name: existingUser.name,
            email: existingUser.email,
            phone_no: existingUser.phone_no,
            image: existingUser.image,
          },
          userRole: userRole.name,
        };
      } else {
        return {
          message: "Incorrect password",
          userData: null,
          userRole: null,
        };
      }
    } else {
      return {
        message: "No user exists with this email",
        userData: null,
        userRole: null,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Error during login",
      userData: null,
      userRole: null,
    };
  }
};

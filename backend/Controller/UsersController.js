import User from "../Schema/UserSchema.js";
import Role from "../Schema/RoleSchema.js";
import { generate } from "generate-password";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SecretKey = "JWT_Secret_Key";
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
          const token = jwt.sign(
            {
              userId: result._id,
            },
            SecretKey,
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
          SecretKey,
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

export const getProfile = async ({ data }) => {};

export const addUser = async ({ data ,token}) => {
  try {
    const decodedToken = jwt.verify(token, SecretKey);
    const userId = decodedToken.userId;
    const user = await User.findOne({ _id: userId });
    const role = await Role.findOne({ name: "Librarian" });
    console.log("Decoded Token= "+userId+'User= '+user+'Role= '+role);
    if (user.role.equals(role._id)) {
      if (
        data.name != null &&
        data.email != null &&
        data.phone_no != null &&
        data.userRole != null
      ) {
        var password = generate({
          length: 8,
          numbers: true,
          uppercase: true,
          symbols: true,
          lowercase: true,
          strict: true,
        });
        let role = await Role.findOne({ name: data.userRole });
        const existingUser = await User.findOne({ email: data.email });
        const hashedPassword = await bcrypt.hash(password, 10);

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
              message: "User added successfully",
            };
          } else {
            return {
              message: "Failed to add user",
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
    } else {
      return {
        message: "Only admin can add user",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Error during adding user ",
    };
  }
};

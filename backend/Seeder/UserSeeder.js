import User from "../Schema/UserSchema.js";
import Role from "../Schema/RoleSchema.js";
import bcrypt from "bcrypt";

export const UserSeeder = async () => {
  const user = await User.findOne({ name: "Admin" });
  if (!user) {
    let role = await Role.findOne({ name: "Librarian" });
    const hashedPassword = await bcrypt.hash("Password@123", 10);
    const result = await User.create({
      name: "Admin",
      email: "admin@admin.com",
      password: hashedPassword,
      phone_no: "",
      role: role._id,
      image:
        "Windows_10_Default_Profile_Picture.svg",
    });
    if(!result){
        console.log("Failed to add admin seeder")
    }
  }
};

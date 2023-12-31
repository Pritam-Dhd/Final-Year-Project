import Role from "../Schema/RoleSchema.js";

export const RoleSeeder = async () => {
  let role = await Role.findOne({ name: "Librarian" });
  let role2 = await Role.findOne({ name: "Student" });
  if (!role) {
    const result = await Role.create({
      name:"Librarian",
    });
    if (!result) {
      console.log("Failed to add Librarian role seeder");
    }
  }
  if (!role2) {
    const result = await Role.create({
      name:"Student",
    });
    if (!result) {
      console.log("Failed to add Student role seeder");
    }
  }
};

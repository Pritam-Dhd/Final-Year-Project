import AdminJS from "adminjs";
import * as AdminJSMongoose from '@adminjs/mongoose';
import Role from "./Schema/RoleSchema.js";
import User from "./Schema/UserSchema.js";

// Register the AdminJS Mongoose adapter to work with Mongoose models
AdminJS.registerAdapter(AdminJSMongoose);

// Configure AdminJS with basic settings
const adminJs = new AdminJS({
  resources: [
    {
      resource: Role,
    },
    {
      resource: User,
    }
  ],
  rootPath: "/admin",
});

export default adminJs;

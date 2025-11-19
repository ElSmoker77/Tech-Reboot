// backend/models/user.model.js
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    nombre: { type: String },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const User = models.User || model("User", userSchema);

export default User;

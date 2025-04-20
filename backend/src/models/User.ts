import mongoose, { Document, Schema } from "mongoose";

// User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  folders: mongoose.Types.ObjectId[]; // Reference folders instead of embedding
}

// User Schema
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  folders: [{ type: Schema.Types.ObjectId, ref: "Folder" }], // Reference to Folder model
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;

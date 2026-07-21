import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

userSchema.pre("save", async function () {
  if(!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
}

const userModel = mongoose.model("User", userSchema);

export default userModel;
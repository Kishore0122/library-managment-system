import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    roll: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },

    accountverified: { type: Boolean, default: false },
   borrowedbooks: [
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },
        booktitle: String,
        borrowdate: Date,
        duedate: Date,
        returned: {
            type: Boolean,
            default: false,
        },
    },
],


    avatar: {
      public_id: String,
      url: String,
    },
    verificatiocode: Number,
    verificationexpire: Date,
    resetpasswordtoken: String,
    resetpasswordexpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateverificationcode = function () {
  function generaterandomfivedigitnumber() {
    const firstdigit = Math.floor(Math.random() * 9) + 1;
    const remainingdigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return parseInt(firstdigit.toString() + remainingdigits);
  }
  const verificationcode = generaterandomfivedigitnumber();
  this.verificatiocode = verificationcode;
  this.verificationexpire = Date.now() + 15 * 60 * 1000;
};

userSchema.methods.generatetoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getresetpasswordtoken = function () {
  const resettoken = crypto.randomBytes(20).toString("hex");
  this.resetpasswordtoken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.resetpasswordexpire = Date.now() + 15 * 60 * 1000;
  return resettoken;
};
const User = mongoose.model("User", userSchema);

export default User;

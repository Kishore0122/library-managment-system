import mongoose from "mongoose";
const borrowSchema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    charge: {
      type: Number,
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
    borrowdate: {
      type: Date,
      default: Date.now,
    },
    returndate: {
      type: Date,
      default: null,
    },
    duedate: {
      type: Date,
      required: true,
    },
    fine: {
      type: Number,
      default: 0,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export const Borrow = mongoose.model("borrow", borrowSchema);

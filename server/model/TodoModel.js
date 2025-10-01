import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,   // typo fixed
    },
    status: {
      type: Boolean,    // should be type Boolean
      default: false,   // default value
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // reference to User model
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);
export default Todo;

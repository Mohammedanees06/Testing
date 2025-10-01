import Todo from "../model/TodoModel.js";
import User from "../model/userModel.js";

// Create a new todo
export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title required!" });

    const todo = await Todo.create({ title, description, user: req.user._id }); 
    //By setting user: req.user._id when creating a todo, you link the todo to the logged-in user.
    //  req.user → full user document (all fields like name, email, password).  req.user._id → just the MongoDB ID.
   //  user: req.user._id → store this ID in the todo to associate it with the logged-in user.
    res.status(201).json(todo); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all todos for logged-in user
// export const getTodos = async (req, res) => {
//   try {
//     const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
//     res.json({ todos });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Get all todos (with optional search)
export const getTodos = async (req, res) => {
  try {
    const { search } = req.query; // ?search=groceries

    let query = { user: req.user._id };

    // If search query exists, add regex filter
    if (search) {
      query.title = { $regex: search, $options: "i" }; 
      // "i" = case-insensitive
    }

    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Search users by email (for example: auto-complete search)
export const searchTodos = async (req, res) => {
  try {
    const { q } = req.query; // query param: /api/users?q=something
    if (!q) return res.json([]);

    const users = await User.find({ email: { $regex: q, $options: "i" } }) //q = start of query i for case sensitive
      .select("email"); // only return email, hide password

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a todo (toggle complete or update title/description)
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user._id },  // ensure user owns this todo
      req.body,                        // updates from request body
      { new: true }                    // return the updated document
    );

    if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

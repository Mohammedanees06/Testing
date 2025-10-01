// controllers/userController.js
import User from "../model/userModel.js";
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");     // get full user without password
    if (!user) return res.status(404).json({ message: "User not found" }); // req.user._id exists because middleware set it.
   
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// userController = “give me my own info” → works for normal user or admin

// adminController = “admin can see or manage all users” → only admin
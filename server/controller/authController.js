import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await User.findOne({ email });

    if (!existing)
      return res.status(404).json({ message: "User doesn't exist" });

    const isMatch = await existing.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // ✅ FIXED: Include role in JWT token
    const token = jwt.sign(
      { 
        id: existing._id,
        role: existing.role  // 👈 Added role to JWT payload
      }, 
      process.env.JWT_SECRET, 
      {
        expiresIn: "30d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: existing._id,
        name: existing.name,
        email: existing.email,
        role: existing.role, // 👈 Added role to response data
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    // ✅ FIXED: Include role in JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role  // 👈 Added role to JWT payload
      }, 
      process.env.JWT_SECRET, 
      {
        expiresIn: "30d",
      }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // 👈 Added role to response data
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};







// import jwt from "jsonwebtoken";
// import User from "../model/userModel.js";

// export const login = async (req, res) => {
//   // const { email } = req.body → gives us the value from the request.
//   const { email, password } = req.body;

//   try {
//     const existing = await User.findOne({ email });
//     // User.findOne({ email }) → tells MongoDB: find a document where the email field matches the value.

//     if (!existing)
//       return res.status(404).json({ message: "User doesn't exist" });

//     const isMatch = await existing.comparePassword(password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid credentials" });

//     //  Create a JSON Web Token (JWT) for authentication
//     const token = jwt.sign({ id: existing._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });
//     res.json({
//       message: "Login successful", // ✅ A message sent back to the client to indicate login worked
//       token, // ✅ The JWT token we just created, used for authenticating future requests
//       user: {
//         id: existing._id, // ✅ The user's unique MongoDB ID (_id). Frontend can use this to identify the user
//         name: existing.name, // ✅ User's name, sent so frontend can display it
//         email: existing.email, // ✅ User's email, sent for reference or display
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const signup = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existing = await User.findOne({ email });
//     if (existing)
//       return res.status(409).json({ message: "User already exists" });

//     const user = await User.create({ name, email, password });

//     // Generate token right after signup
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     res.status(201).json({
//       message: "Signup successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


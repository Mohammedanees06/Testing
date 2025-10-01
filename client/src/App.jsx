import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Todo from "./components/Todos";
import Profile from "./Profile";
import API from "./api";
import "./App.css";

function App() {

  const [user, setUser] = useState(null);
  
  // authChecked: tracks whether we've finished checking if user is authenticated
  // false = still checking, true = finished checking (either logged in or not)
  const [authChecked, setAuthChecked] = useState(false);
  
  // AUTHENTICATION LOGIC
  // isAuthenticated: determines if someone is logged in
  // !!user converts user to boolean: null becomes false, any object becomes true
  const isAuthenticated = !!user;

  // SIDE EFFECT: Check user authentication when app loads
  useEffect(() => {
    // This function runs when the component first mounts (app starts)
    const fetchUser = async () => {
      // Check if there's a token in browser storage
      const token = localStorage.getItem("token");
      
      // If no token exists, user is not logged in
      if (!token) {
        setAuthChecked(true); // Mark that we've finished checking
        return; // Exit function early
      }

      // If token exists, verify it with the backend
      try {
        // Make API request to get user info using the token
        const { data } = await API.get("/api/users/me", { 
          headers: { Authorization: `Bearer ${token}` },
           // GET = “I’m asking, give me my info” → token in header proves who I am.  Send token in header
        });
        // If successful, store user data in state
        setUser(data); // This makes isAuthenticated become true
      } catch (err) {
        // If token is invalid/expired, clean up
        console.error(err);
        localStorage.removeItem("token"); // Remove bad token
        setUser(null); // Make sure user state is null
      } finally {
        // Whether success or error, we're done checking
        setAuthChecked(true);
      }
    };
    
    // Call the function when component mounts
    fetchUser();
  }, []); // Empty array means this only runs once when app starts

  // LOADING STATE
  // Don't render anything until we've checked authentication
  // This prevents flashing between login/dashboard pages
  if (!authChecked) return null;

  // ROUTING CONFIGURATION
  return (
    <Routes>
      {/* ROOT ROUTE (/) */}
      <Route
        path="/"
        element={
          // If authenticated, go to todos page
          // If not authenticated, go to login page
          isAuthenticated ? <Navigate to="/todos" /> : <Navigate to="/login" />
        }
      />

      {/* LOGIN PAGE ROUTE */}
      <Route
        path="/login"
        element={
          // If already logged in, redirect to todos
          // If not logged in, show login page
          isAuthenticated ? <Navigate to="/todos" /> : <Login />
        }
      />

      {/* SIGNUP PAGE ROUTE */}
      <Route
        path="/signup"
        element={
          // If already logged in, redirect to todos
          // If not logged in, show signup page
          isAuthenticated ? <Navigate to="/todos" /> : <Signup />
        }
      />

      {/* TODOS PAGE ROUTE (Protected) */}
      <Route
        path="/todos"
        element={
          // Only show todos if authenticated, otherwise redirect to login
          // Pass user data as props so Todo component can access it
          isAuthenticated ? <Todo user={user} /> : <Navigate to="/login" />
        }
      />

      {/* PROFILE PAGE ROUTE (Protected) */}
      <Route
        path="/profile"
        element={
          // Only show profile if authenticated, otherwise redirect to login
          // Pass user data as props so Profile component can access it
          isAuthenticated ? <Profile user={user} /> : <Navigate to="/login" />
        }
      />

      {/* ADMIN PAGE ROUTE (Protected + Role-based) */}
      <Route
        path="/admin"
        element={
          // Double check: user must be authenticated AND have admin role
          // user?.role uses optional chaining - won't error if user is null
          isAuthenticated && user?.role === "admin" ? (
            <AdminDashboard user={user} />
          ) : (
            // If not admin or not logged in, redirect to todos page
            <Navigate to="/todos" />
          )
        }
      />
    </Routes>
  );
}

export default App;
















// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import Login from './components/Login';
// import Signup from './components/SignUp';
// import Todo from './components/Todos';
// import axios from 'axios';
// import './App.css';
// function App() {
//   const [user, setUser] = useState(null); // store user info
//   const isAuthenticated = !!localStorage.getItem('token');

//  useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       try {
//         const { data } = await axios.get("/api/users/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchUser();
//   }, []);
//   return (
//     <Routes>

//   <Route
//     path="/"
//     element={
//       // If logged in, redirect to /todos, else redirect to /login
//       isAuthenticated ? <Navigate to="/todos" /> : <Navigate to="/login" />
//     }
//   />

//   {/* Login route */}
//   <Route
//     path="/login"
//     element={
//       // If logged in, no need to see login → redirect to /todos
//       // Else, show the Login component
//       isAuthenticated ? <Navigate to="/todos" /> : <Login />
//     }
//   />

//   {/* Signup route */}
//   <Route
//     path="/signup"
//     element={
//       // If logged in, redirect to /todos
//       // Else, show Signup component
//       isAuthenticated ? <Navigate to="/todos" /> : <Signup />
//     }
//   />

//   {/* Todos route */}
//   <Route
//     path="/todos"
//     element={
//       // Protected route: only logged in users can see Todos
//       // If not logged in → redirect to /login
//       // <Component /> → stays on that route and renders the page/component there.
//       // <Navigate /> → immediately changes the route to another URL, like a redirect.
//       isAuthenticated ? <Todo /> : <Navigate to="/login" />
      
//     }
//   />

//   <Route
//         path="/admin"
//         element={
//           isAuthenticated && user?.role === "admin" ? (
//             <AdminDashboard />
//           ) : (
//             <Navigate to="/todos" />
//           )
//         }
//       />
//     </Routes>

// </Routes>

//   );
// }

// export default App;

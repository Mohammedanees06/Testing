import { useState, useEffect } from "react";
import API from "../api";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  // 1️⃣ Fetch all todos
  const fetchAllTodos = async () => {
    try {
      console.log("Fetching all todos...");
      const res = await API.get("/api/todos");
      console.log("API response:", res.data);
      
      // Handle both response formats: { todos: [...] } or directly [...]
      const todosData = res.data.todos || res.data;
      console.log("Todos data:", todosData);
      
      setTodos(Array.isArray(todosData) ? todosData : []);
    } catch (err) {
      console.error("Error fetching todos:", err);
      console.error("Error details:", err.response?.data);
      setTodos([]);
    }
  };

  // 2️⃣ Search todos
  const searchTodos = async (query) => {
    try {
      console.log("Searching todos with query:", query);
      const res = await API.get(`/api/todos?search=${query}`);
      console.log("Search API response:", res.data);
      
      // Handle both response formats: { todos: [...] } or directly [...]
      const todosData = res.data.todos || res.data;
      console.log("Search todos data:", todosData);
      
      setTodos(Array.isArray(todosData) ? todosData : []);
    } catch (err) {
      console.error("Error searching todos:", err);
      console.error("Error details:", err.response?.data);
      setTodos([]);
    }
  };

  // Fetch all todos initially
  useEffect(() => {
    fetchAllTodos();
  }, []);

  // Call search when input changes
  useEffect(() => {
    if (search) searchTodos(search);
    else fetchAllTodos();
  }, [search]);

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      console.log("Adding todo with title:", title);
      const response = await API.post("/api/todos", { title, description: "" });
      console.log("Add todo response:", response.data);
      
      setTitle("");
      
      // Refresh the todos list
      if (search) {
        console.log("Refreshing with search:", search);
        await searchTodos(search);
      } else {
        console.log("Refreshing all todos");
        await fetchAllTodos();
      }
    } catch (err) {
      console.error("Error adding todo:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  // Toggle complete
  const toggleComplete = async (todo) => {
    try {
      await API.put(`/api/todos/${todo._id}`, { completed: !todo.completed });
      search ? searchTodos(search) : fetchAllTodos();
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await API.delete(`/api/todos/${id}`);
      search ? searchTodos(search) : fetchAllTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Todos</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search todos"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Add Todo */}
      <form onSubmit={addTodo} className="flex mb-5">
        <input
          type="text"
          placeholder="Add todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 hover-bg-blue-200 rounded my-2"
      >
        Logout
      </button> 

      {/* Todo List */}
      {Array.isArray(todos) && todos.length > 0 ? (
        todos.map((todo) => (
          <div
            key={todo._id}
            className="flex items-center mb-2 p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            <span
              className={`flex-1 mr-3 ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.title}
            </span>

            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo)}
              className="w-5 h-5"
            />
            <button
              onClick={() => deleteTodo(todo._id)}
              className="ml-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">
          {Array.isArray(todos) ? "No todos found" : "Loading todos..."}
        </p>
      )}
    </div>
  );
};

export default Todos;

// import { useState, useEffect } from "react";
// import API from "../api";


// const Todos = () => {
//   const [todos, setTodos] = useState([]);
//   const [title, setTitle] = useState("");
//   const [search, setSearch] = useState("");
 

//   // 1️⃣ Fetch all todos
//   const fetchAllTodos = async () => {
//     try {
//       const res = await API.get("/todos");
//       setTodos(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 2️⃣ Search todos
//   const searchTodos = async (query) => {
//     try {
//       const res = await API.get(`/api/todos?search=${query}`);
//       //  ? → starts query params. search=... → key/value data. ${query} → a variable value inserted.
//       setTodos(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Fetch all todos initially
//   useEffect(() => {
//     fetchAllTodos();
//   }, []);

//   // Call search when input changes
//   useEffect(() => {
//     if (search) searchTodos(search);
//     else fetchAllTodos();
//   }, [search]);

//   // Add todo
//   const addTodo = async (e) => {
//     e.preventDefault();
//     if (!title) return;
//     try {
//       await API.post("/api/todos", { title });
//       setTitle("");
//       search ? searchTodos(search) : fetchAllTodos();
//       //   If a user is searching while adding a todo, the filtered view updates automatically.
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Toggle complete
//   const toggleComplete = async (todo) => {
//     try {
//       await API.put(`/api/todos/${todo._id}`, { completed: !todo.completed }); //Sending this to the backend marks the todo as done.
//       search ? searchTodos(search) : fetchAllTodos();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Delete todo
//   const deleteTodo = async (id) => {
//     try {
//       await API.delete(`/api/todos/${id}`);
//       search ? searchTodos(search) : fetchAllTodos();
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   const handleLogout = () => {
//     localStorage.removeItem("token");  // clear token
//    window.location.href = "/login";             // redirect back to login
//   };

//   return (
//     <div className="max-w-md mx-auto p-4">
//       <h2 className="text-2xl font-semibold mb-4">My Todos</h2>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search todos"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       {/* Add Todo */}
//       <form onSubmit={addTodo} className="flex mb-5">
//         <input
//           type="text"
//           placeholder="Add todo"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           type="submit"
//           className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors"
//         >
//           Add
//         </button>
//       </form>

//        <button
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-4 py-2 rounded"
//         >
//           Logout
//         </button>

//       {/* Todo List */}
//       {todos.map((todo) => (
//         <div
//           key={todo._id}
//           className="flex items-center mb-2 p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
//         >
//           {/* Title first */}
//           <span
//             className={`flex-1 mr-3 ${
//               todo.completed ? "line-through text-gray-400" : ""
//             }`}
//           >
//             {todo.title}
//         {/* todo.completed → true or false If true → apply line-through and gray color to the title text If false → no styling, text looks normal */}
//           </span>

//           {/* Checkbox after title */}
//           <input
//             type="checkbox"
//             checked={todo.completed}
//             onChange={() => toggleComplete(todo)}
//             className="w-5 h-5"
//           />
//           <button
//             onClick={() => deleteTodo(todo._id)}
//             className="ml-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Todos;

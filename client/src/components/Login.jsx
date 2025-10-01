import { useState , useEffect} from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");  // redirect if not logged in
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("api/auth/login", { email, password });
      console.log("Login success:", res.data);

      localStorage.setItem("token", res.data.token);

      // ✅ redirect after success
     window.location.href = "/todos";
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);

      const msg = err?.response?.data?.message;
      if (msg && msg.includes("already login")) {
        window.location.href = "/todos";
      }
    }
  };
 

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center m-10 w-100 h-80 mx-auto my-40 rounded">
      <form onSubmit={submit}>
        <input
          className="m-4 gap-2 flex flex-col bg-amber-200 p-2 rounded"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="m-4 gap-2 flex flex-col bg-amber-200 p-2 rounded"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="m-4 gap-2 flex flex-col bg-blue-600 items-center justify-center mx-auto p-2 rounded"
          type="submit"
        >
          Login
        </button>

        <Link to="/signup">
          <p className="m-4 gap-2 flex flex-col bg-blue-400 items-center justify-center mx-auto p-2 w-fit rounded">
            Don't have an account? Signup
          </p>
        </Link>
      </form>

       

    </div>
  );
};

export default Login;

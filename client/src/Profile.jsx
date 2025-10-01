// Profile.jsx
import { useEffect, useState } from "react";
import API from "./api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { data } = await API.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(data); 
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  if (!user) 
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold text-gray-700">Loading...</h1>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome, {user.name}!
        </h1>
        <div className="space-y-2">
          <p className="text-gray-600"><span className="font-semibold">Email:</span> {user.email}</p>
          <p className="text-gray-600"><span className="font-semibold">Role:</span> {user.role}</p>
        </div>
        {user.role === "admin" && (
          <p className="mt-4 text-green-600 font-medium">
            You have admin access!
          </p>
        )}
      </div>
    </div>
  );
}

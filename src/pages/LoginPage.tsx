import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";

// Tambahkan tipe data response login
interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    user: {
      id: number | string;
      username: string;
      email: string;
      role: "farmer" | "laborer";
    };
    access_token: string;
  };
}

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>(
        "https://web-pemesanan-buruh-be.vercel.app/api/auth/login",
        {
          username,
          password,
        }
      );

      const { user, access_token } = response.data.data;

      // Panggil login dari AuthContext
      login(
        {
          id: Number(user.id), // pastikan id number
          username: user.username,
          role: user.role,
        },
        access_token
      );

      // Redirect berdasarkan role
      if (user.role === "farmer") {
        navigate("/dashboard/farmer");
      } else {
        navigate("/dashboard/laborer");
      }
    } catch (err: any) {
      console.error(err);
      setError("Username atau password salah");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

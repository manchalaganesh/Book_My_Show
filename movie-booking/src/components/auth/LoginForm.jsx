import { Eye, EyeOff, Mail, Lock, Apple } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store JWT token and user info locally
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");
      setTimeout(() => navigate("/"), 1000); // Redirect to main page
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-xl border border-slate-600/50 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="mt-2 text-sm leading-5 text-slate-400">
          Step into the lobby. Sign in to access your bookings, tickets, and
          personalized recommendations.
        </p>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-white">
          Email Address
        </label>
        <div className="flex items-center rounded-md border border-slate-600 bg-slate-900 px-3">
          <Mail size={18} className="text-slate-500" />
          <input
            type="email"
            placeholder="cinemalover@myshow.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-white">
          Password
        </label>
        <div className="flex items-center rounded-md border border-slate-600 bg-slate-900 px-3">
          <Lock size={18} className="text-slate-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-500 transition hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between text-xs">
        <label className="flex cursor-pointer items-center gap-2 text-slate-400">
          <input type="checkbox" className="h-4 w-4 accent-red-500" />
          Remember me
        </label>
        <button className="text-red-500 transition hover:text-red-400">
          Forgot Password?
        </button>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleLogin}
        className="w-full rounded-md bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      {message && (
        <p className="mt-3 text-center text-sm text-red-400">{message}</p>
      )}

      <p className="mt-4 text-center text-sm text-slate-400">
        New to myshow?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="font-medium text-red-500 transition hover:text-red-400"
        >
          Sign up now
        </button>
      </p>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-700" />
        <span className="text-xs text-slate-500">OR SIGN IN WITH</span>
        <div className="h-px flex-1 bg-slate-700" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 rounded-md border border-slate-600 py-3 text-sm text-white transition hover:bg-slate-700">
          <span className="font-bold">G</span> Google
        </button>
        <button className="flex items-center justify-center gap-2 rounded-md border border-slate-600 py-3 text-sm text-white transition hover:bg-slate-700">
          <Apple size={18} /> Apple
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
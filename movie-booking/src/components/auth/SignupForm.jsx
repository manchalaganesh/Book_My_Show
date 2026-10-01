import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Store JWT token locally
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-xl border border-slate-600/50 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="mt-2 text-sm leading-5 text-slate-400">
          Join myshow and make your next movie experience unforgettable.
        </p>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-white">
          Full Name
        </label>
        <div className="flex items-center rounded-md border border-slate-600 bg-slate-900 px-3">
          <User size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="mb-4">
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
            placeholder="Create a password"
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

      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-white">
          Confirm Password
        </label>
        <div className="flex items-center rounded-md border border-slate-600 bg-slate-900 px-3">
          <Lock size={18} className="text-slate-500" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-slate-500 transition hover:text-white"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleSignup}
        className="w-full rounded-md bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      {message && (
        <p className="mt-3 text-center text-sm text-red-400">{message}</p>
      )}

      <p className="mt-4 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-medium text-red-500 transition hover:text-red-400"
        >
          Sign in
        </button>
      </p>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-700" />
        <span className="text-xs text-slate-500">OR SIGN UP WITH</span>
        <div className="h-px flex-1 bg-slate-700" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 rounded-md border border-slate-600 py-3 text-sm text-white transition hover:bg-slate-700">
          <span className="font-bold">G</span> Google
        </button>
        <button className="flex items-center justify-center gap-2 rounded-md border border-slate-600 py-3 text-sm text-white transition hover:bg-slate-700">
          Apple
        </button>
      </div>
    </div>
  );
}

export default SignupForm;
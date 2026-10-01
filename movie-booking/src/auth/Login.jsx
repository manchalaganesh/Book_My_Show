import { HelpCircle } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
import cinemaBg from "../assets/cinema-bg.jpg";

function Login() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${cinemaBg})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-8 sm:py-6">
        <div className="text-2xl font-bold text-white">
          my<span className="text-red-500">show</span>
        </div>

        <button
            type="button"
            onClick={() =>
              alert("Need help? Please contact our support team.")
            }
            className="flex items-center gap-2 text-sm text-white transition hover:text-red-400"
          >
            <HelpCircle size={18} />
            Need Help?
        </button>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-8 sm:px-6">
        <LoginForm />
      </main>

      <footer className="relative z-10 flex items-center justify-center gap-6 pb-6 text-xs text-slate-400">
        <button className="transition hover:text-white">
          Privacy Policy
        </button>

        <span>•</span>

        <button className="transition hover:text-white">
          Terms of Service
        </button>

        <span>•</span>

        <span>© 2025 myshow</span>
      </footer>
    </div>
  );
}

export default Login;
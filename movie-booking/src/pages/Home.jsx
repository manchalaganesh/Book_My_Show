import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Film,
  Search,
  Ticket,
  LogOut,
  Star,
  Play,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  Globe,
} from "lucide-react";

const API_KEY = "573acc40154ad0b3f94b561b43bcf372";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

const GENRE_MAP = {
  Action: 28,
  "Sci-Fi": 878,
  Drama: 18,
};

export default function Home() {
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Genres");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    let ignore = false;

    const fetchMovieData = async () => {
      try {
        const [nowPlayingRes, upcomingRes] = await Promise.all([
          fetch(
            `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
          ),
          fetch(
            `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
          ),
        ]);

        const nowPlayingData = await nowPlayingRes.json();
        const upcomingData = await upcomingRes.json();

        if (!ignore) {
          if (nowPlayingData.results && nowPlayingData.results.length > 0) {
            setFeaturedMovie(nowPlayingData.results[0]);
            setNowShowing(nowPlayingData.results.slice(1, 9));
          }

          if (upcomingData.results) {
            setComingSoon(upcomingData.results.slice(0, 8));
          }
        }
      } catch (error) {
        console.error("Error fetching movies from TMDB:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchMovieData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredNowShowing = nowShowing.filter((movie) => {
    const matchesSearch = movie.title
      ? movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesGenre =
      activeFilter === "All Genres" ||
      (movie.genre_ids && movie.genre_ids.includes(GENRE_MAP[activeFilter]));
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E17] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E17] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#E50914] selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#0B0E17]/90 backdrop-blur-md border-b border-slate-800/80 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div
            onClick={() => navigate("/")}
            className="text-2xl font-bold cursor-pointer tracking-tight flex items-center gap-2"
          >
            <div className="w-7 h-7 bg-[#E50914] rounded flex items-center justify-center">
              <Film size={16} className="text-white fill-white" />
            </div>
            <span>
              my<span className="text-[#E50914]">show</span>
            </span>
          </div>

          <div className="relative hidden md:block w-96">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search for movies, cinemas, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131927] border border-slate-700/60 rounded-full pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-[#E50914] transition placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user.role === "admin" && (
            <button
              onClick={() => navigate("/admin/users")}
              className="bg-amber-950/40 hover:bg-amber-900/60 text-[#FF9F1C] border border-amber-800/50 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
            >
              <User size={14} /> Admin
            </button>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/movies")}
              className="text-xs font-medium text-slate-300 hover:text-white transition hidden sm:block"
            >
              Explore
            </button>
            <button
              onClick={() => navigate("/movies")}
              className="bg-[#E50914] hover:bg-red-700 text-white font-semibold text-xs px-4 py-2 rounded-md transition shadow-md shadow-red-950/50"
            >
              Book Tickets
            </button>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 bg-[#131927] hover:bg-red-950/40 text-slate-400 hover:text-[#EF4444] border border-slate-700/60 rounded-md transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      {featuredMovie && (
        <section className="relative h-[520px] w-full flex items-center justify-start px-6 md:px-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${IMAGE_BASE_URL}${featuredMovie.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E17] via-[#0B0E17]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-xl space-y-4 pt-10">
            <div className="flex items-center gap-2">
              <span className="bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                PG-13
              </span>
              <span className="bg-[#FF9F1C] text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                IMAX 3D
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {featuredMovie.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span>Action / Sci-Fi / Adventure</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#FF9F1C] font-bold">
                <Star size={13} fill="#FF9F1C" /> {featuredMovie.vote_average?.toFixed(1)}
              </span>
              <span>•</span>
              <span>2h 46m</span>
              <span>•</span>
              <span>{featuredMovie.release_date?.split("-")[0]}</span>
            </div>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed line-clamp-3">
              {featuredMovie.overview}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => navigate("/movies")}
                className="flex items-center gap-2 bg-[#E50914] hover:bg-red-700 text-white font-semibold text-xs px-6 py-3 rounded-md shadow-lg shadow-red-950/50 transition"
              >
                <Ticket size={16} /> Book Now
              </button>
              <button className="flex items-center gap-2 bg-[#131927]/90 hover:bg-slate-800 text-white font-medium text-xs px-5 py-3 rounded-md border border-slate-700/80 backdrop-blur-sm transition">
                <Play size={16} /> Watch Trailer
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Booking Search Box */}
      <div className="relative z-20 px-6 md:px-12 -mt-10 mb-12">
        <div className="bg-[#131927] border border-slate-700/70 rounded-xl p-4 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Select Movie
            </label>
            <select className="w-full bg-[#0B0E17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer">
              <option>{featuredMovie?.title || "Choose a movie..."}</option>
              {nowShowing.map((m) => (
                <option key={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Select Date
            </label>
            <select className="w-full bg-[#0B0E17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer">
              <option>Today, 31 Aug</option>
              <option>Tomorrow, 01 Sep</option>
              <option>Wed, 02 Sep</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Select Cinema
            </label>
            <select className="w-full bg-[#0B0E17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer">
              <option>Nearby Theaters</option>
              <option>IMAX Downtown</option>
              <option>PVR Multiplex</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Select Showtime
            </label>
            <select className="w-full bg-[#0B0E17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none cursor-pointer">
              <option>Available Times</option>
              <option>02:30 PM</option>
              <option>06:00 PM</option>
              <option>09:15 PM</option>
            </select>
          </div>

          <div className="flex items-end h-full pt-4 sm:pt-0">
            <button
              onClick={() => navigate("/movies")}
              className="w-full bg-[#E50914] hover:bg-red-700 text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-md shadow-red-950/40"
            >
              Find Seats
            </button>
          </div>
        </div>
      </div>

      {/* Main Section: Now Showing */}
      <main className="flex-1 px-6 md:px-12 space-y-12 pb-16">
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Now Showing
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Catch your favorite blockbuster in theaters today.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {["All Genres", "Action", "Sci-Fi", "Drama"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition whitespace-nowrap ${
                    activeFilter === filter
                      ? "bg-[#E50914] text-white"
                      : "bg-[#131927] text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredNowShowing.length === 0 ? (
            <div className="py-12 text-center bg-[#131927]/50 rounded-xl border border-dashed border-slate-800">
              <p className="text-slate-400 text-sm">No movies found matching your filter or search.</p>
              <button
                onClick={() => {
                  setActiveFilter("All Genres");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs text-[#E50914] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredNowShowing.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-[#131927] border border-slate-800/80 rounded-xl overflow-hidden group hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden aspect-[2/3]">
                    <img
                      src={
                        movie.poster_path
                          ? `${POSTER_BASE_URL}${movie.poster_path}`
                          : "https://via.placeholder.com/500x750?text=No+Poster"
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-[#0B0E17]/80 backdrop-blur-md text-[#FF9F1C] border border-slate-700/60 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Star size={11} fill="#FF9F1C" /> {movie.vote_average?.toFixed(1) || "N/A"}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-sm text-white truncate group-hover:text-[#E50914] transition">
                        {movie.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {movie.release_date?.split("-")[0] || "2025"} • 2h 15m
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/movies")}
                      className="w-full bg-[#E50914] hover:bg-red-700 text-white font-semibold text-xs py-2 rounded-lg transition"
                    >
                      Book Tickets
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section: Coming Soon */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Coming Soon
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Explore highly anticipated movies arriving soon.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 bg-[#131927] border border-slate-800 rounded-lg text-slate-400 hover:text-white transition">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 bg-[#131927] border border-slate-800 rounded-lg text-slate-400 hover:text-white transition">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoon.map((movie) => (
              <div
                key={movie.id}
                className="bg-[#131927] border border-slate-800/80 rounded-xl overflow-hidden group hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div className="relative overflow-hidden aspect-[2/3]">
                  <img
                    src={`${POSTER_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#FF9F1C] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    {movie.release_date || "Coming Soon"}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-white truncate group-hover:text-[#FF9F1C] transition">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Sci-Fi / Action
                    </p>
                  </div>

                  <button className="w-full bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-xs py-2 rounded-lg transition flex items-center justify-center gap-1.5">
                    <Calendar size={13} /> Set Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070910] px-6 md:px-12 py-12 text-xs text-slate-400 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-6 h-6 bg-[#E50914] rounded flex items-center justify-center">
                <Film size={14} className="text-white fill-white" />
              </div>
              <span>
                my<span className="text-[#E50914]">show</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Premium cinematic booking experience. Reserve your seats, enjoy IMAX, and watch the latest movies in comfort.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-3">
              Movies
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li className="hover:text-white cursor-pointer transition">Now Showing</li>
              <li className="hover:text-white cursor-pointer transition">Coming Soon</li>
              <li className="hover:text-white cursor-pointer transition">IMAX Experience</li>
              <li className="hover:text-white cursor-pointer transition">Offers & Discounts</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-3">
              Help & Support
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li className="hover:text-white cursor-pointer transition">Need Help?</li>
              <li className="hover:text-white cursor-pointer transition">FAQs</li>
              <li className="hover:text-white cursor-pointer transition">Refunds & Cancellations</li>
              <li className="hover:text-white cursor-pointer transition">Contact Us</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-3">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <button className="p-2 bg-[#131927] border border-slate-800 rounded-lg text-slate-400 hover:text-white transition">
                <Globe size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 myshow. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Terms of Use</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
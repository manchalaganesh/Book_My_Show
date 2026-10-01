import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Film,
  Search,
  Star,
  Ticket,
  ArrowLeft,
  Check,
  X,
  LogOut,
  User,
} from "lucide-react";

const API_KEY = "573acc40154ad0b3f94b561b43bcf372";
const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

const GENRES = [
  { id: "all", name: "All Genres" },
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 878, name: "Sci-Fi" },
  { id: 16, name: "Animation" },
  { id: 27, name: "Horror" },
];

const SHOWTIMES = ["10:30 AM", "01:45 PM", "05:15 PM", "08:30 PM", "11:00 PM"];
const THEATERS = [
  "IMAX Downtown - Screen 1",
  "PVR Dolby Cinema - Screen 4",
  "Cinepolis VIP Lounge - Hall 2",
];

// Seat layout generator
const ROWS = ["A", "B", "C", "D", "E", "F"];
const SEATS_PER_ROW = 8;
const INITIAL_OCCUPIED = ["A3", "B5", "C2", "C3", "E7", "F4"];

function Movies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [activeTab, setActiveTab] = useState("now_playing"); // now_playing, upcoming, top_rated

  // Booking Modal State
  const [bookingMovie, setBookingMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTime, setSelectedTime] = useState(SHOWTIMES[1]);
  const [selectedTheater, setSelectedTheater] = useState(THEATERS[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    let ignore = false;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const endpoint =
          activeTab === "upcoming"
            ? "upcoming"
            : activeTab === "top_rated"
            ? "top_rated"
            : "now_playing";

        const res = await fetch(
          `${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();

        if (!ignore && data.results) {
          setMovies(data.results);
        }
      } catch (err) {
        console.error("Error fetching movies in Movies page:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      ignore = true;
    };
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      ? movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesGenre =
      selectedGenre === "all" ||
      (movie.genre_ids && movie.genre_ids.includes(selectedGenre));
    return matchesSearch && matchesGenre;
  });

  const toggleSeat = (seatId) => {
    if (INITIAL_OCCUPIED.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleOpenBooking = (movie) => {
    setBookingMovie(movie);
    setSelectedSeats([]);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) return;
    setBookingSuccess(true);
  };

  const pricePerTicket = 15;
  const totalPrice = selectedSeats.length * pricePerTicket;

  return (
    <div className="min-h-screen bg-[#0B0E17] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#E50914] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0B0E17]/95 backdrop-blur-md border-b border-slate-800/80 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
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

          <button
            onClick={() => navigate("/")}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
        </div>

        <div className="flex items-center gap-3">
          {user.role === "admin" && (
            <button
              onClick={() => navigate("/admin/users")}
              className="bg-amber-950/40 hover:bg-amber-900/60 text-[#FF9F1C] border border-amber-800/50 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
            >
              <User size={14} /> Admin
            </button>
          )}

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 bg-[#131927] hover:bg-red-950/40 text-slate-400 hover:text-[#EF4444] border border-slate-700/60 rounded-md transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-12 py-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Title & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Explore All Movies
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select any movie to choose your cinema, showtime, and reserve your seats.
            </p>
          </div>

          {/* Catalog Type Tabs */}
          <div className="flex items-center gap-1 bg-[#131927] p-1 rounded-xl border border-slate-800">
            {[
              { id: "now_playing", label: "Now Showing" },
              { id: "upcoming", label: "Coming Soon" },
              { id: "top_rated", label: "Top Rated" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id
                    ? "bg-[#E50914] text-white shadow-md shadow-red-950/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-[#131927] border border-slate-800 p-4 rounded-xl">
          <div className="relative w-full lg:w-96">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by movie title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0E17] border border-slate-700/60 rounded-lg pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-[#E50914] transition placeholder:text-slate-500"
            />
          </div>

          {/* Genre pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            {GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition whitespace-nowrap ${
                  selectedGenre === g.id
                    ? "bg-[#E50914] text-white"
                    : "bg-[#0B0E17] text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400">Loading movies...</p>
            </div>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 p-8 text-center bg-[#131927]/30">
            <Film size={40} className="text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-white">No movies found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              We couldn&apos;t find any movies matching &quot;{searchQuery}&quot;. Try adjusting your search or genre filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("all");
              }}
              className="mt-4 bg-[#E50914] hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-[#131927] border border-slate-800 rounded-xl overflow-hidden group hover:border-slate-700 transition flex flex-col justify-between"
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
                    <Star size={11} fill="#FF9F1C" />{" "}
                    {movie.vote_average?.toFixed(1) || "N/A"}
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white truncate group-hover:text-[#E50914] transition">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {movie.release_date?.split("-")[0] || "2025"} • Popularity:{" "}
                      {Math.round(movie.popularity || 0)}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {movie.overview || "No overview available for this title."}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(movie)}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#E50914] hover:bg-red-700 text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-md shadow-red-950/40"
                  >
                    <Ticket size={14} /> Book Seats
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Interactive Seat Booking Modal */}
      {bookingMovie && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131927] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#E50914] uppercase tracking-wider">
                  Movie Ticket Booking
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {bookingMovie.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1 text-[#FF9F1C]">
                    <Star size={12} fill="#FF9F1C" />{" "}
                    {bookingMovie.vote_average?.toFixed(1) || "7.5"}
                  </span>
                  <span>•</span>
                  <span>{bookingMovie.release_date?.split("-")[0]}</span>
                </div>
              </div>

              <button
                onClick={() => setBookingMovie(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {bookingSuccess ? (
              /* Success Screen */
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-green-500/20 text-green-400 border border-green-500/40 rounded-full flex items-center justify-center mx-auto">
                  <Check size={28} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Booking Confirmed!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your tickets for <strong className="text-white">{bookingMovie.title}</strong> at{" "}
                  <strong className="text-white">{selectedTheater}</strong> have been booked successfully.
                </p>
                <div className="bg-[#0B0E17] border border-slate-800 rounded-xl p-4 max-w-sm mx-auto text-xs space-y-2 text-left">
                  <div className="flex justify-between text-slate-400">
                    <span>Showtime:</span>
                    <span className="text-white font-medium">{selectedDate}, {selectedTime}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Selected Seats:</span>
                    <span className="text-[#FF9F1C] font-bold">{selectedSeats.join(", ")}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Total Paid:</span>
                    <span className="text-green-400 font-bold">${totalPrice}.00</span>
                  </div>
                </div>

                <button
                  onClick={() => setBookingMovie(null)}
                  className="bg-[#E50914] hover:bg-red-700 text-white font-semibold text-xs px-6 py-2.5 rounded-lg transition shadow-md shadow-red-950/40"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Booking Configuration & Seat Map */
              <div className="space-y-6">
                {/* Cinema & Showtime Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Cinema
                    </label>
                    <select
                      value={selectedTheater}
                      onChange={(e) => setSelectedTheater(e.target.value)}
                      className="w-full bg-[#0B0E17] border border-slate-700 rounded-lg p-2 text-white outline-none cursor-pointer"
                    >
                      {THEATERS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Date
                    </label>
                    <div className="flex items-center gap-1 bg-[#0B0E17] border border-slate-700 rounded-lg p-1">
                      {["Today", "Tomorrow", "Day After"].map((d) => (
                        <button
                          key={d}
                          onClick={() => setSelectedDate(d)}
                          className={`flex-1 py-1 rounded text-[11px] font-medium transition ${
                            selectedDate === d
                              ? "bg-[#E50914] text-white"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Showtime
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-[#0B0E17] border border-slate-700 rounded-lg p-2 text-white outline-none cursor-pointer"
                    >
                      {SHOWTIMES.map((time) => (
                        <option key={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cinema Screen Representation */}
                <div className="space-y-2">
                  <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-[#E50914] to-transparent rounded-full shadow-[0_0_12px_rgba(229,9,20,0.8)]" />
                  <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest">
                    Cinema Screen
                  </p>
                </div>

                {/* Seat Grid */}
                <div className="bg-[#0B0E17] border border-slate-800 rounded-xl p-4 space-y-2">
                  {ROWS.map((row) => (
                    <div
                      key={row}
                      className="flex items-center justify-center gap-2"
                    >
                      <span className="text-[10px] text-slate-500 w-3">{row}</span>
                      <div className="flex gap-1.5 sm:gap-2">
                        {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                          const seatId = `${row}${i + 1}`;
                          const isOccupied = INITIAL_OCCUPIED.includes(seatId);
                          const isSelected = selectedSeats.includes(seatId);

                          return (
                            <button
                              key={seatId}
                              disabled={isOccupied}
                              onClick={() => toggleSeat(seatId)}
                              title={
                                isOccupied
                                  ? `${seatId} (Occupied)`
                                  : isSelected
                                  ? `${seatId} (Selected)`
                                  : `${seatId} ($15)`
                              }
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[10px] font-semibold flex items-center justify-center transition ${
                                isOccupied
                                  ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-[#E50914] text-white shadow-md shadow-red-950/60 scale-105"
                                  : "bg-slate-900 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                              }`}
                            >
                              {i + 1}
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-slate-500 w-3">{row}</span>
                    </div>
                  ))}
                </div>

                {/* Seat Legend */}
                <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-700" />
                    <span>Available ($15)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded bg-[#E50914]" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded bg-slate-800" />
                    <span>Occupied</span>
                  </div>
                </div>

                {/* Modal Footer / Checkout summary */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Seats:{" "}
                      <span className="text-white font-semibold">
                        {selectedSeats.length > 0
                          ? selectedSeats.join(", ")
                          : "None selected"}
                      </span>
                    </p>
                    <p className="text-sm font-bold text-white mt-0.5">
                      Total:{" "}
                      <span className="text-[#FF9F1C]">${totalPrice}.00</span>
                    </p>
                  </div>

                  <button
                    disabled={selectedSeats.length === 0}
                    onClick={handleConfirmBooking}
                    className="w-full sm:w-auto bg-[#E50914] hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs px-8 py-3 rounded-lg transition shadow-lg shadow-red-950/40 flex items-center justify-center gap-2"
                  >
                    <Ticket size={16} /> Confirm & Pay (${totalPrice})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Movies;
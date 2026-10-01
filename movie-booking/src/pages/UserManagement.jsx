import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Crown,
  Ticket,
  AlertTriangle,
  Search,
  Filter,
  Download,
  UserPlus,
  MoreVertical,
  Mail,
  Gift,
  KeyRound,
  ShieldAlert,
  Trash2,
  CreditCard,
  Film,
} from "lucide-react";

// Mock User Data
const mockUsers = [
  {
    id: "#USR-8821",
    name: "Alex Morgan",
    email: "alex.m@example.com",
    phone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Customer",
    tier: "VIP",
    status: "Active",
    totalSpent: "$340.00",
    bookingsCount: 12,
    joinedDate: "Jan 2025",
    bookings: [
      { id: "BK-9941", movie: "Avatar: Fire & Ash", cinema: "IMAX Downtown - Hall 4", date: "Feb 14, 2026", seats: "F12, F13", price: "$42.00" },
      { id: "BK-8820", movie: "Dune: Part Two", cinema: "PVR Dolby Cinema - Screen 1", date: "Dec 20, 2025", seats: "D8", price: "$22.00" },
    ],
    cards: [
      { type: "Visa", last4: "4242", expiry: "12/28", isDefault: true },
      { type: "Mastercard", last4: "8891", expiry: "09/27", isDefault: false },
    ],
    auditLogs: [
      { event: "Account Login", ip: "192.168.1.45", device: "Chrome / macOS", time: "Today, 10:42 AM" },
      { event: "Ticket Booked (BK-9941)", ip: "192.168.1.45", device: "Chrome / macOS", time: "Feb 14, 2026" },
      { event: "Password Reset Requested", ip: "172.56.21.9", device: "iOS App", time: "Jan 15, 2026" },
    ],
  },
  {
    id: "#USR-4412",
    name: "Marcus Chen",
    email: "m.chen@example.com",
    phone: "+1 (555) 876-5432",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Customer",
    tier: "Silver",
    status: "Active",
    totalSpent: "$185.50",
    bookingsCount: 7,
    joinedDate: "Nov 2025",
    bookings: [
      { id: "BK-7712", movie: "Gladiator II", cinema: "Cinepolis - Screen 3", date: "Jan 05, 2026", seats: "H10, H11", price: "$30.00" },
    ],
    cards: [{ type: "Visa", last4: "1102", expiry: "04/26", isDefault: true }],
    auditLogs: [
      { event: "Account Login", ip: "182.74.12.1", device: "Safari / iOS", time: "Yesterday, 04:15 PM" },
    ],
  },
  {
    id: "#USR-1092",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+1 (555) 432-1098",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "Theater Staff",
    tier: "Standard",
    status: "Suspended",
    totalSpent: "$45.00",
    bookingsCount: 2,
    joinedDate: "Mar 2025",
    bookings: [],
    cards: [],
    auditLogs: [
      { event: "Account Suspended by Admin", ip: "Internal", device: "Admin Console", time: "Feb 01, 2026" },
    ],
  },
];

export default function UserManagement() {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [activeTab, setActiveTab] = useState("bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchBackendUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const mappedUsers = data.map((u) => ({
              id: `#USR-${u._id ? u._id.slice(-4).toUpperCase() : Math.floor(Math.random() * 9000 + 1000)}`,
              name: u.name || "Customer",
              email: u.email || "user@example.com",
              phone: u.phone || "+1 (555) 000-0000",
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name || "user")}`,
              role: u.role === "admin" ? "Admin" : "Customer",
              tier: u.role === "admin" ? "VIP" : "Standard",
              status: u.isActive !== false ? "Active" : "Suspended",
              totalSpent: "$0.00",
              bookingsCount: 0,
              joinedDate: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                : "Recent",
              bookings: [],
              cards: [],
              auditLogs: [
                {
                  event: "Account Registered",
                  ip: "127.0.0.1",
                  device: "Web Browser",
                  time: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent",
                },
              ],
            }));
            // Combine with mockUsers for complete admin demo experience
            setUsersList([...mappedUsers, ...mockUsers]);
            setSelectedUser(mappedUsers[0] || mockUsers[0]);
          }
        }
      } catch (err) {
        console.log("Backend not reachable or using offline mock users:", err.message);
      }
    };

    fetchBackendUsers();
  }, []);

  const filteredUsers = usersList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] p-6 space-y-6 font-sans">
      {/* 1. Header Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#E50914]">User Management</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Customer Accounts
            </h1>
            <span className="bg-slate-800 text-[#94A3B8] border border-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Total Accounts: {usersList.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-[#F8FAFC] border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Film size={16} className="text-[#E50914]" />
            Back to App
          </button>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-[#F8FAFC] border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition">
            <Download size={16} className="text-[#94A3B8]" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 bg-[#E50914] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-red-900/20 transition">
            <UserPlus size={16} />
            Add User
          </button>
        </div>
      </header>

      {/* 2. Metrics Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase">Active Users Today</p>
            <h3 className="text-2xl font-bold text-white mt-1">3,420</h3>
            <span className="text-xs text-[#10B981] font-medium flex items-center gap-1 mt-1">
              +12% from yesterday
            </span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg text-[#10B981]">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase">VIP / Loyalty Members</p>
            <h3 className="text-2xl font-bold text-white mt-1">8,150</h3>
            <span className="text-xs text-[#FF9F1C] font-medium flex items-center gap-1 mt-1">
              19.1% total userbase
            </span>
          </div>
          <div className="p-3 bg-amber-950/30 border border-amber-900/30 rounded-lg text-[#FF9F1C]">
            <Crown size={22} />
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase">Avg. Bookings / User</p>
            <h3 className="text-2xl font-bold text-white mt-1">4.2</h3>
            <span className="text-xs text-[#94A3B8] font-medium mt-1 block">tickets per month</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg text-[#E50914]">
            <Ticket size={22} />
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase">Suspended Accounts</p>
            <h3 className="text-2xl font-bold text-[#EF4444] mt-1">14</h3>
            <span className="text-xs text-[#EF4444]/80 font-medium mt-1 block">Requires review</span>
          </div>
          <div className="p-3 bg-red-950/30 border border-red-900/30 rounded-lg text-[#EF4444]">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* 3. Main Content - Split Screen View */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel: User Directory Table (65%) */}
        <div className="w-full lg:w-[65%] bg-[#1E293B] border border-slate-800 rounded-xl p-5 flex flex-col space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
              <input
                type="text"
                placeholder="Search by Name, Email, Mobile, or User ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-[#E50914] transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2">
                <Filter size={16} className="text-[#94A3B8]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-sm text-[#F8FAFC] outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#0F172A]">All Status</option>
                  <option value="Active" className="bg-[#0F172A]">Active</option>
                  <option value="Suspended" className="bg-[#0F172A]">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  <th className="py-3 px-3">User Info</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Membership</th>
                  <th className="py-3 px-3">Spent / Bookings</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUser.id === user.id;
                  return (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`cursor-pointer transition hover:bg-slate-800/50 ${isSelected ? "bg-slate-800/80 border-l-4 border-l-[#E50914]" : ""
                        }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <p className="font-semibold text-white leading-snug">{user.name}</p>
                            <span className="text-xs text-[#94A3B8] font-mono">{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-[#94A3B8] text-xs">{user.email}</p>
                        <p className="text-[#94A3B8] text-xs mt-0.5">{user.phone}</p>
                      </td>
                      <td className="py-3 px-3">
                        {user.tier === "VIP" ? (
                          <span className="inline-flex items-center gap-1 border border-[#FF9F1C] text-[#FF9F1C] bg-amber-950/20 text-xs font-semibold px-2 py-0.5 rounded-md">
                            <Crown size={12} /> VIP
                          </span>
                        ) : (
                          <span className="inline-flex items-center border border-slate-600 text-slate-300 bg-slate-800 text-xs font-medium px-2 py-0.5 rounded-md">
                            {user.tier}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <p className="text-white font-medium">{user.totalSpent}</p>
                        <p className="text-xs text-[#94A3B8]">{user.bookingsCount} Bookings</p>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${user.status === "Active" ? "bg-[#10B981]" : "bg-[#EF4444]"
                              }`}
                          />
                          <span
                            className={`text-xs font-medium ${user.status === "Active" ? "text-[#10B981]" : "text-[#EF4444]"
                              }`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="text-[#94A3B8] hover:text-white p-1 rounded-md transition">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Detailed Customer Profile Drawer (35%) */}
        <div className="w-full lg:w-[35%] bg-[#1E293B] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Top Section */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-5">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#E50914]"
                />
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Member since {selectedUser.joinedDate}
                  </p>
                  <span className="inline-block mt-2 font-mono text-xs text-[#FF9F1C] bg-amber-950/30 border border-amber-900/40 px-2 py-0.5 rounded">
                    {selectedUser.id}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full border ${selectedUser.status === "Active"
                    ? "bg-emerald-950/40 text-[#10B981] border-emerald-800/40"
                    : "bg-red-950/40 text-[#EF4444] border-red-800/40"
                  }`}
              >
                {selectedUser.status}
              </span>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center justify-center p-2.5 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 transition">
                <Mail size={16} className="text-[#94A3B8] mb-1" />
                Email User
              </button>
              <button className="flex flex-col items-center justify-center p-2.5 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 transition">
                <Gift size={16} className="text-[#FF9F1C] mb-1" />
                Coupon
              </button>
              <button className="flex flex-col items-center justify-center p-2.5 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 transition">
                <KeyRound size={16} className="text-[#94A3B8] mb-1" />
                Reset Pass
              </button>
            </div>

            {/* User Overview Tabs */}
            <div className="space-y-4">
              <div className="flex border-b border-slate-800 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`pb-2.5 px-3 border-b-2 transition ${activeTab === "bookings"
                      ? "border-[#E50914] text-[#E50914]"
                      : "border-transparent text-[#94A3B8] hover:text-white"
                    }`}
                >
                  Bookings ({selectedUser.bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className={`pb-2.5 px-3 border-b-2 transition ${activeTab === "payments"
                      ? "border-[#E50914] text-[#E50914]"
                      : "border-transparent text-[#94A3B8] hover:text-white"
                    }`}
                >
                  Saved Cards
                </button>
                <button
                  onClick={() => setActiveTab("audit")}
                  className={`pb-2.5 px-3 border-b-2 transition ${activeTab === "audit"
                      ? "border-[#E50914] text-[#E50914]"
                      : "border-transparent text-[#94A3B8] hover:text-white"
                    }`}
                >
                  Audit Log
                </button>
              </div>

              {/* Tab 1: Bookings */}
              {activeTab === "bookings" && (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {selectedUser.bookings.length > 0 ? (
                    selectedUser.bookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 bg-[#0F172A] border border-slate-800 rounded-lg space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-white">
                          <span className="flex items-center gap-1.5">
                            <Film size={14} className="text-[#E50914]" /> {b.movie}
                          </span>
                          <span className="text-[#10B981]">{b.price}</span>
                        </div>
                        <p className="text-xs text-[#94A3B8]">{b.cinema}</p>
                        <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                          <span>{b.date}</span>
                          <span className="text-slate-400">Seats: {b.seats}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#94A3B8] py-4 text-center">No recent bookings recorded.</p>
                  )}
                </div>
              )}

              {/* Tab 2: Payments */}
              {activeTab === "payments" && (
                <div className="space-y-2">
                  {selectedUser.cards.length > 0 ? (
                    selectedUser.cards.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-[#0F172A] border border-slate-800 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard size={18} className="text-[#94A3B8]" />
                          <div>
                            <p className="text-white font-medium">
                              {c.type} •••• {c.last4}
                            </p>
                            <p className="text-[#94A3B8] text-[11px]">Expires {c.expiry}</p>
                          </div>
                        </div>
                        {c.isDefault && (
                          <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#94A3B8] py-4 text-center">No saved payment methods.</p>
                  )}
                </div>
              )}

              {/* Tab 3: Audit Log */}
              {activeTab === "audit" && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedUser.auditLogs.map((log, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-[#0F172A] border border-slate-800/80 rounded-lg text-xs space-y-1"
                    >
                      <div className="flex justify-between font-medium text-slate-200">
                        <span>{log.event}</span>
                        <span className="text-[10px] text-[#94A3B8]">{log.time}</span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8]">
                        IP: {log.ip} | Device: {log.device}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Danger Zone Box */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 bg-[#E50914] hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-md shadow-red-950/40">
              <ShieldAlert size={16} />
              Ban User Account
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-red-950/20 text-[#EF4444] border border-red-900/40 font-medium py-2.5 rounded-lg text-xs transition">
              <Trash2 size={16} />
              Delete User Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
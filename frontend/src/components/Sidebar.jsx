import { useAuthStore } from "../store/authStore"
import api from "../api/axios"
import { useNavigate, useLocation } from "react-router-dom"
import { Upload, BarChart3, History, Crown } from "lucide-react" // 👈 Imported History icon
import { CreditCard } from "lucide-react" // 👈 Imported CreditCard ico

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
      logout()
      navigate("/")
    } catch (err) {
      console.log(err)
    }
  }

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email || 'demo'}`

  const menu = [
    { name: "Upload", icon: Upload, path: "/dashboard" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "History", icon: History, path: "/history" },
    { name: "Billing", icon: CreditCard, path: "/billing" }
  ]

  return (
    <div className="w-[350px] bg-yellow-100 border-r border-yellow-950/20 h-screen flex flex-col justify-between p-4 shrink-0">
      
      {/* TOP SECTION */}
      <div>
        {/* LOGO */}
        <div className="mb-10 pt-4 ml-6">
          <h1 className="text-2xl font-serif text-yellow-950">
            <span className="text-yellow-500">&lt;</span>
            Audit.Ai
            <span className="text-yellow-500">/&gt;</span>
          </h1>
        </div>

        {/* MAIN MENU */}
        <div className="flex flex-col gap-2">
          {menu.map((item, index) => {
            const Icon = item.icon
            const active = location.pathname === item.path
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 p-3 rounded-xl w-full text-left transition font-medium
                ${
                  active
                    ? "bg-yellow-950 text-white shadow-md"
                    : "text-yellow-950 hover:bg-yellow-200"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* BOTTOM USER PROFILE */}
      <div>
        {/* PLAN DISPLAY */}
        <div 
          onClick={() => navigate("/billing")}
          className="flex items-center justify-between bg-yellow-200/50 border border-yellow-950/10 px-4 py-3 rounded-xl mb-3 cursor-pointer hover:bg-yellow-200 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Crown size={16} className="text-yellow-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-yellow-950/50 uppercase tracking-wider">Current Plan</span>
              <span className="text-sm font-bold text-yellow-950">{user?.plan || "Starter"}</span>
            </div>
          </div>
          <span className="text-xs text-yellow-950/60 font-medium">Upgrade</span>
        </div>

        {/* USER INFO */}
        <div className="flex items-center justify-between border-t border-yellow-950/10 pt-4">
          <div className="flex items-center gap-3">
            <img src={avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-yellow-950 bg-white" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-yellow-950 max-w-[120px] truncate">
                {user?.name || "Demo User"}
              </span>
              <span className="text-xs text-yellow-950/70 max-w-[120px] truncate">
                {user?.email || "demo@audit.ai"}
              </span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-yellow-950/50 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Logout"
          >
            <span className="text-xl font-bold">⎋</span>
          </button>
        </div>
      </div>

    </div>
  )
}
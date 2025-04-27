import { NavLink } from "react-router-dom"
import { Home, Users, FileText, Globe, DollarSign, MessageCircle, Settings, BarChart2, HelpCircle } from "lucide-react"

const AdminSidebar = () => {
  const navItems = [
    { to: "/admin/dashboard", icon: <Home size={18} />, label: "Dashboard" },
    { to: "/admin/users", icon: <Users size={18} />, label: "Users" },
    { to: "/admin/translations", icon: <FileText size={18} />, label: "Translations" },
    { to: "/admin/content", icon: <FileText size={18} />, label: "Content" },
    { to: "/admin/languages", icon: <Globe size={18} />, label: "Languages" },
    { to: "/admin/pricing", icon: <DollarSign size={18} />, label: "Pricing Plans" },
    { to: "/admin/analytics", icon: <BarChart2 size={18} />, label: "Analytics" },
    { to: "/admin/feedback", icon: <MessageCircle size={18} />, label: "Feedback" },
    { to: "/admin/settings", icon: <Settings size={18} />, label: "Settings" },
    { to: "/admin/help", icon: <HelpCircle size={18} />, label: "Help & Support" },
  ]

  return (
    <div className="py-4">
      <div className="px-4 mb-6">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Admin Panel</h2>
      </div>

      <nav className="space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive ? "bg-primary-light text-primary-color" : "text-text-color hover:bg-primary-light/50"
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-8 pt-6 border-t border-border-color">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary-gradient flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-text-secondary">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar

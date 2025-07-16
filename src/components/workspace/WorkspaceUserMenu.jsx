"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/workspace/WorkspaceUserMenu.css";

const WorkspaceUserMenu = ({
  closeUserMenu,
  theme,
  toggleTheme,
  toggleNotifications,
}) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeUserMenu();
    }
  };

  const navigateToDashboard = () => {
    navigate("/workspace/dashboard");
    closeUserMenu();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
      closeUserMenu();
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback - still navigate away even if signOut fails
      navigate("/");
      closeUserMenu();
    }
  };

  const handleNotifications = () => {
    toggleNotifications();
    closeUserMenu();
  };

  // Get user email from auth context or fallback to localStorage
  const userEmail =
    user?.email || localStorage.getItem("userEmail") || "lithins147@gmail.com";

  return (
    <motion.div className="user-menu-backdrop" onClick={handleBackdropClick}>
      <motion.div
        className="user-menu"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="user-menu-header">
          <div className="user-menu-profile">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
              alt="User profile"
              className="user-menu-avatar"
            />
            <div className="user-menu-info">
              <span className="user-menu-name">Lithin</span>
              <span className="user-menu-email">{userEmail}</span>
            </div>
          </div>
        </div>

        <div className="user-menu-items">
          <button className="user-menu-item" onClick={navigateToDashboard}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </button>
          <button className="user-menu-item" onClick={handleNotifications}>
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
          </button>
          <button className="user-menu-item logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Log out</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkspaceUserMenu;

"use client";

import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "./components/Loader";
import router from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

function App() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize component
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      setMounted(true);

      // Simulate loading for initial animation
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Prevent flash of incorrect theme
  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <Loader key="loader" />
      ) : (
        <motion.div
          className="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
